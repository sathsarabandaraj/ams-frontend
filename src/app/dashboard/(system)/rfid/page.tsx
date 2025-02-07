'use client';

import { CustomPagination } from "@/components/custom-pagination";
import { DataTable } from "@/components/data-table";
import { getRfid } from "@/service/rfid.service";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { columns } from "./columns";
import { LoadingAnimation } from "@/components/loading-animation";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function RfidPage() {
    const [rfidData, setRfidData] = useState<never[]>([]);
    const [totalItemCount, setTotalItemCount] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [pageSize, setPageSize] = useState<number>(10);
    const [showOnlyFloating, setShowOnlyFloating] = useState(false);
    const [cookies, setCookie] = useCookies(["pageSize"]);

    useEffect(() => {
        if (cookies.pageSize) {
            setPageSize(Number(cookies.pageSize));
        }
    }, [cookies.pageSize]);

    const fetchRfidData = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await getRfid(currentPage, pageSize, showOnlyFloating);

            if (!response || !response.items) {
                setRfidData([]);
                setTotalItemCount(0);
                return;
            }

            setRfidData(response.items);
            setTotalItemCount(response.totalItemCount);
            setCurrentPage(response.pageNumber);
        } catch (err) {
            console.error(err);
            setError("Failed to load RFID data");
            setRfidData([]);
            setTotalItemCount(0);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRfidData();
    }, [currentPage, pageSize, showOnlyFloating]);

    const handlePageSizeChange = (newPageSize: number) => {
        setPageSize(newPageSize);
        setCookie("pageSize", newPageSize, { maxAge: 60 * 60 * 24 * 365 });
    };

    if (loading) {
        return <LoadingAnimation />;
    }

    return (
        <div className="container mx-auto py-10">
            <div className="flex items-center space-x-2 mb-4">
                <Switch
                    id="floating-mode"
                    checked={showOnlyFloating}
                    onCheckedChange={setShowOnlyFloating}
                />
                <Label htmlFor="floating-mode">Show only unassigned RFIDs</Label>
            </div>

            {error ? (
                <div className="text-center py-8 text-muted-foreground">
                    {error}
                </div>
            ) : rfidData.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                    {showOnlyFloating
                        ? "No unassigned RFIDs found"
                        : "No RFIDs found"}
                </div>
            ) : (
                <>
                    <DataTable
                        columns={columns}
                        data={rfidData}
                        idColumn={"rfidTag"}
                        extraPath="/dashboard/rfid"
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
        </div>
    );
}