'use client';

import { CustomPagination } from "@/components/custom-pagination";
import { getStudents } from "@/service/users.service";
import { DataTable } from "@/components/data-table";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import {columns} from "@/app/dashboard/students/columns"; // Import useCookies

export default function StudentsPage() {
    const [studentData, setStudentData] = useState<never[]>([]);
    const [totalItemCount, setTotalItemCount] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(0); // 0-based index
    const [pageSize, setPageSize] = useState<number>(10); // Default page size
    const [cookies, setCookie] = useCookies(["pageSize"]);

    useEffect(() => {
        if (cookies.pageSize) {
            setPageSize(Number(cookies.pageSize)); // Set page size from cookie
        }
    }, [cookies.pageSize]);

    const fetchStudentData = async () => {
        try {
            setLoading(true);
            const response = await getStudents(currentPage, pageSize);
            setStudentData(response.items);
            setTotalItemCount(response.totalItemCount);
            setCurrentPage(response.pageNumber);
        } catch (err) {
            console.error(err);
            setError("Failed to load student data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudentData();
    }, [currentPage, pageSize]); // Trigger fetch when pageSize or currentPage changes

    // Handle page size change
    const handlePageSizeChange = (newPageSize: number) => {
        setPageSize(newPageSize);
        setCookie("pageSize", newPageSize, { maxAge: 60 * 60 * 24 * 365 }); // Store in cookies for 1 year
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="container mx-auto py-10">
            <DataTable
                columns={columns}
                data={studentData}
                idColumn={"uuid"}
                extraPath="/dashboard/students"
            />
            <div className="h-5" />
            <CustomPagination
                currentPage={currentPage}
                totalCount={totalItemCount}
                pageSize={pageSize}
                onPageChange={(page) => setCurrentPage(page)}
                onPageSizeChange={handlePageSizeChange} // Pass handlePageSizeChange to CustomPagination
            />
        </div>
    );
}
