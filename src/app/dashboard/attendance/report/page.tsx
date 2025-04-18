'use client';

import { CustomPagination } from "@/components/custom-pagination";
import { DataTable } from "@/components/data-table";
import { getAttendance } from "@/service/attendance.service";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { LoadingAnimation } from "@/components/loading-animation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { columns } from "./columns";
import { format, startOfMonth, endOfMonth } from "date-fns";

type MonthlyStats = {
    totalIns: number;
    totalOuts: number;
    averageInTime?: string;
    averageOutTime?: string;
    daysPresent: number;
};

export default function AttendancePage() {
    const [attendanceData, setAttendanceData] = useState<never[]>([]);
    const [totalItemCount, setTotalItemCount] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [pageSize, setPageSize] = useState<number>(10);
    const [cookies, setCookie] = useCookies(["pageSize"]);
    const [monthlyStats, setMonthlyStats] = useState<MonthlyStats>({
        totalIns: 0,
        totalOuts: 0,
        daysPresent: 0
    });

    useEffect(() => {
        if (cookies.pageSize) {
            setPageSize(Number(cookies.pageSize));
        }
    }, [cookies.pageSize]);

    const calculateMonthlyStats = (data: any[]) => {
        const currentDate = new Date();
        const monthStart = startOfMonth(currentDate);
        const monthEnd = endOfMonth(currentDate);

        const monthlyData = data.filter(record => {
            const recordDate = new Date(record.created_at);
            return recordDate >= monthStart && recordDate <= monthEnd;
        });

        const inRecords = monthlyData.filter(record => record.inOutStatus.toLowerCase() === 'in');
        const outRecords = monthlyData.filter(record => record.inOutStatus.toLowerCase() === 'out');

        // Calculate average times
        const inTimes = inRecords.map(record => new Date(record.created_at));
        const outTimes = outRecords.map(record => new Date(record.created_at));

        const averageInTime = inTimes.length > 0
            ? new Date(inTimes.reduce((acc, time) => acc + time.getTime(), 0) / inTimes.length)
            : undefined;

        const averageOutTime = outTimes.length > 0
            ? new Date(outTimes.reduce((acc, time) => acc + time.getTime(), 0) / outTimes.length)
            : undefined;

        // Calculate unique days present
        const uniqueDays = new Set(
            monthlyData.map(record => format(new Date(record.created_at), 'yyyy-MM-dd'))
        );

        setMonthlyStats({
            totalIns: inRecords.length,
            totalOuts: outRecords.length,
            averageInTime: averageInTime ? format(averageInTime, 'hh:mm a') : undefined,
            averageOutTime: averageOutTime ? format(averageOutTime, 'hh:mm a') : undefined,
            daysPresent: uniqueDays.size
        });
    };

    const fetchAttendanceData = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await getAttendance(currentPage, pageSize);

            if (!response || !response.items) {
                setAttendanceData([]);
                setTotalItemCount(0);
                return;
            }

            setAttendanceData(response.items);
            setTotalItemCount(response.totalItemCount);
            setCurrentPage(response.pageNumber);
            calculateMonthlyStats(response.items);
        } catch (err) {
            console.error(err);
            setError("Failed to load attendance data");
            setAttendanceData([]);
            setTotalItemCount(0);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAttendanceData();
    }, [currentPage, pageSize]);

    const handlePageSizeChange = (newPageSize: number) => {
        setPageSize(newPageSize);
        setCookie("pageSize", newPageSize, { maxAge: 60 * 60 * 24 * 365 });
    };

    if (loading) {
        return <LoadingAnimation />;
    }

    return (
        <div className="container mx-auto py-10 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Monthly Statistics ({format(new Date(), 'MMMM yyyy')})</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="p-4 bg-secondary rounded-lg">
                            <div className="text-sm text-muted-foreground">Total Check-ins</div>
                            <div className="text-2xl font-bold">{monthlyStats.totalIns}</div>
                        </div>
                        <div className="p-4 bg-secondary rounded-lg">
                            <div className="text-sm text-muted-foreground">Total Check-outs</div>
                            <div className="text-2xl font-bold">{monthlyStats.totalOuts}</div>
                        </div>
                        <div className="p-4 bg-secondary rounded-lg">
                            <div className="text-sm text-muted-foreground">Average Check-in Time</div>
                            <div className="text-2xl font-bold">{monthlyStats.averageInTime || 'N/A'}</div>
                        </div>
                        <div className="p-4 bg-secondary rounded-lg">
                            <div className="text-sm text-muted-foreground">Days Present</div>
                            <div className="text-2xl font-bold">{monthlyStats.daysPresent}</div>
                        </div> <div className="p-4 bg-secondary rounded-lg">
                            <div className="text-sm text-muted-foreground">new  Present</div>
                            <div className="text-2xl font-bold">{monthlyStats.daysPresent}</div>
                        </div>

                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Attendance Report</CardTitle>
                </CardHeader>
                <CardContent>
                    {error ? (
                        <div className="text-center py-8 text-muted-foreground">
                            {error}
                        </div>
                    ) : attendanceData.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            No attendance records found
                        </div>
                    ) : (
                        <>
                            <DataTable
                                columns={columns}
                                data={attendanceData}
                            />
                            <div className="h-5" />
                            <CustomPagination
                                currentPage={currentPage}
                                totalCount={totalItemCount}
                                pageSize={pageSize}
                                onPageChange={(page) => setCurrentPage(page)}
                                onPageSizeChange={handlePageSizeChange}
                            />
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
} 