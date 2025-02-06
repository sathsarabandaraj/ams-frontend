'use client';

import { CustomPagination } from "@/components/custom-pagination";
import { getStaff } from "@/service/users.service";
import { DataTable } from "@/components/data-table";
import { columns } from "@/app/dashboard/staff/columns";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { LoadingAnimation } from "@/components/loading-animation";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export default function StaffPage() {
    const router = useRouter();
    const [staffData, setStaffData] = useState<never[]>([]);
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

    const fetchStaffData = async () => {
        try {
            setLoading(true);
            const response = await getStaff(currentPage, pageSize);
            setStaffData(response.items);
            setTotalItemCount(response.totalItemCount);
            setCurrentPage(response.pageNumber);
        } catch (err) {
            console.error(err);
            setError("Failed to load staff data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStaffData();
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
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Staff</h1>
                <Button onClick={() => router.push('/dashboard/staff/new')}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Staff
                </Button>
            </div>

            <DataTable
                columns={columns}
                data={staffData}
                idColumn={"uuid"}
                extraPath="/dashboard/staff"
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