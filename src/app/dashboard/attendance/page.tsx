'use client';

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAttendance } from "@/service/attendance.service";
import { LoadingAnimation } from "@/components/loading-animation";
import { format, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, differenceInDays } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Users, UserCheck, Clock } from "lucide-react";

type AttendanceStats = {
    totalCheckins: number;
    totalCheckouts: number;
    uniqueUsers: number;
    averageTimeIn?: string;
    averageTimeOut?: string;
    attendanceByHour: { hour: string; count: number; }[];
    attendanceByDay: { date: string; checkins: number; checkouts: number; }[];
};

export default function AttendancePage() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [dailyStats, setDailyStats] = useState<AttendanceStats | null>(null);
    const [weeklyStats, setWeeklyStats] = useState<AttendanceStats | null>(null);
    const [monthlyStats, setMonthlyStats] = useState<AttendanceStats | null>(null);

    const calculateStats = (data: any[]): AttendanceStats => {
        const checkins = data.filter(record => record.type === 'IN');
        const checkouts = data.filter(record => record.type === 'OUT');

        // Calculate unique users
        const uniqueUsers = new Set(data.map(record => record.user.uuid)).size;

        // Calculate average times
        const inTimes = checkins.map(record => new Date(record.created_at));
        const outTimes = checkouts.map(record => new Date(record.created_at));

        const averageInTime = inTimes.length > 0
            ? new Date(inTimes.reduce((acc, time) => acc + time.getTime(), 0) / inTimes.length)
            : undefined;

        const averageOutTime = outTimes.length > 0
            ? new Date(outTimes.reduce((acc, time) => acc + time.getTime(), 0) / outTimes.length)
            : undefined;

        // Calculate attendance by hour
        const hourCounts = new Array(24).fill(0);
        data.forEach(record => {
            const hour = new Date(record.created_at).getHours();
            hourCounts[hour]++;
        });

        const attendanceByHour = hourCounts.map((count, hour) => ({
            hour: `${hour.toString().padStart(2, '0')}:00`,
            count
        }));

        // Calculate attendance by day
        const dayMap = new Map();
        data.forEach(record => {
            const day = format(new Date(record.created_at), 'yyyy-MM-dd');
            if (!dayMap.has(day)) {
                dayMap.set(day, { checkins: 0, checkouts: 0 });
            }
            const stats = dayMap.get(day);
            if (record.type === 'IN') stats.checkins++;
            else stats.checkouts++;
        });

        const attendanceByDay = Array.from(dayMap.entries()).map(([date, stats]) => ({
            date: format(new Date(date), 'MMM dd'),
            ...stats
        }));

        return {
            totalCheckins: checkins.length,
            totalCheckouts: checkouts.length,
            uniqueUsers,
            averageTimeIn: averageInTime ? format(averageInTime, 'hh:mm a') : undefined,
            averageTimeOut: averageOutTime ? format(averageOutTime, 'hh:mm a') : undefined,
            attendanceByHour,
            attendanceByDay
        };
    };

    const fetchStats = async () => {
        try {
            setLoading(true);
            const now = new Date();

            // Fetch daily stats
            const dailyResponse = await getAttendance(
                0, 1000,
                startOfDay(now),
                endOfDay(now)
            );
            setDailyStats(calculateStats(dailyResponse.items));

            // Fetch weekly stats
            const weeklyResponse = await getAttendance(
                0, 1000,
                startOfWeek(now),
                endOfWeek(now)
            );
            setWeeklyStats(calculateStats(weeklyResponse.items));

            // Fetch monthly stats
            const monthlyResponse = await getAttendance(
                0, 1000,
                startOfMonth(now),
                endOfMonth(now)
            );
            setMonthlyStats(calculateStats(monthlyResponse.items));

        } catch (err) {
            console.error(err);
            setError("Failed to load attendance statistics");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    if (loading) return <LoadingAnimation />;
    if (error) return <div className="text-center py-8 text-muted-foreground">{error}</div>;

    const StatCard = ({ title, value, icon }: { title: string; value: string | number; icon: React.ReactNode }) => (
        <Card>
            <CardContent className="flex items-center p-6">
                <div className="p-2 bg-primary/10 rounded-full mr-4">
                    {icon}
                </div>
                <div>
                    <p className="text-sm text-muted-foreground">{title}</p>
                    <p className="text-2xl font-bold">{value}</p>
                </div>
            </CardContent>
        </Card>
    );

    return (
        <div className="container mx-auto py-10 space-y-6">
            <Tabs defaultValue="daily" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="daily">Daily</TabsTrigger>
                    <TabsTrigger value="weekly">Weekly</TabsTrigger>
                    <TabsTrigger value="monthly">Monthly</TabsTrigger>
                </TabsList>

                <TabsContent value="daily" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <StatCard
                            title="Total Check-ins"
                            value={dailyStats?.totalCheckins || 0}
                            icon={<Users className="h-4 w-4" />}
                        />
                        <StatCard
                            title="Unique Users"
                            value={dailyStats?.uniqueUsers || 0}
                            icon={<UserCheck className="h-4 w-4" />}
                        />
                        <StatCard
                            title="Average Check-in"
                            value={dailyStats?.averageTimeIn || 'N/A'}
                            icon={<Clock className="h-4 w-4" />}
                        />
                    </div>
                    <Card>
                        <CardHeader>
                            <CardTitle>Hourly Activity</CardTitle>
                        </CardHeader>
                        <CardContent className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={dailyStats?.attendanceByHour}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="hour" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="count" fill="#8884d8" />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="weekly" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <StatCard
                            title="Weekly Check-ins"
                            value={weeklyStats?.totalCheckins || 0}
                            icon={<Users className="h-4 w-4" />}
                        />
                        <StatCard
                            title="Unique Users"
                            value={weeklyStats?.uniqueUsers || 0}
                            icon={<UserCheck className="h-4 w-4" />}
                        />
                        <StatCard
                            title="Daily Average"
                            value={Math.round((weeklyStats?.totalCheckins || 0) / 7)}
                            icon={<Clock className="h-4 w-4" />}
                        />
                    </div>
                    <Card>
                        <CardHeader>
                            <CardTitle>Daily Activity</CardTitle>
                        </CardHeader>
                        <CardContent className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={weeklyStats?.attendanceByDay}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="checkins" stroke="#8884d8" />
                                    <Line type="monotone" dataKey="checkouts" stroke="#82ca9d" />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="monthly" className="space-y-6">
                    {/* Similar structure to weekly stats */}
                </TabsContent>
            </Tabs>
        </div>
    );
}
