'use client';

import { CustomPagination } from "@/components/custom-pagination";
import { DataTable } from "@/components/data-table";
import { getRfid } from "@/service/rfid.service";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { columns } from "./columns";
import { LoadingAnimation } from "@/components/loading-animation";

export default function RfidPage() {
    const [rfidData, setRfidData] = useState<never[]>([]);
    const [totalItemCount, setTotalItemCount] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [pageSize, setPageSize] = useState<number>(10);
    const [cookies, setCookie] = useCookies(["pageSize"]);

    useEffect(() => {
        if (cookies.pageSize) {
            setPageSize(Number(cookies.pageSize));
        }
    }, [cookies.pageSize]);

    const fetchRfidData = async () => {
        try {
            setLoading(true);
            const response = await getRfid(currentPage, pageSize, false, true);
            setRfidData(response.items);
            setTotalItemCount(response.totalItemCount);
            setCurrentPage(response.pageNumber);
        } catch (err) {
            console.error(err);
            setError("Failed to load rfid data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRfidData();
    }, [currentPage, pageSize]); // Trigger fetch when pageSize or currentPage changes

    // Handle page size change
    const handlePageSizeChange = (newPageSize: number) => {
        setPageSize(newPageSize);
        setCookie("pageSize", newPageSize, { maxAge: 60 * 60 * 24 * 365 }); // Store in cookies for 1 year
    };

    if (loading) {
        return <LoadingAnimation />;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="container mx-auto py-10">
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
        </div>
    );
}