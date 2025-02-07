'use client';

import { CustomPagination } from "@/components/custom-pagination";
import { DataTable } from "@/components/data-table";
import { getAccessModules } from "@/service/hardware.service";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { columns } from "./columns";
import { LoadingAnimation } from "@/components/loading-animation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function AccessModulesPage() {
    const [moduleData, setModuleData] = useState<never[]>([]);
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

    const fetchModuleData = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await getAccessModules(currentPage, pageSize);

            if (!response || !response.items) {
                setModuleData([]);
                setTotalItemCount(0);
                return;
            }

            setModuleData(response.items);
            setTotalItemCount(response.totalItemCount);
            setCurrentPage(response.pageNumber);
        } catch (err) {
            console.error(err);
            setError("Failed to load access module data");
            setModuleData([]);
            setTotalItemCount(0);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchModuleData();
    }, [currentPage, pageSize]);

    const handlePageSizeChange = (newPageSize: number) => {
        setPageSize(newPageSize);
        setCookie("pageSize", newPageSize, { maxAge: 60 * 60 * 24 * 365 });
    };

    if (loading) return <LoadingAnimation />;

    return (
        <div className="container mx-auto py-10">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Access Modules</CardTitle>
                </CardHeader>
                <CardContent>
                    {error ? (
                        <div className="text-center py-8 text-muted-foreground">
                            {error}
                        </div>
                    ) : moduleData.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            No access modules found
                        </div>
                    ) : (
                        <>
                            <DataTable
                                columns={columns}
                                data={moduleData}
                                idColumn={"uuid"}
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