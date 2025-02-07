"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type AccessModule = {
    uuid: string;
    created_at: string;
    updated_at: string;
    name: string;
    location: string;
    status: boolean;
    ipAddress: string;
};

export const columns: ColumnDef<AccessModule>[] = [
    {
        accessorKey: "deviceName",
        header: ({ column }) => {
            return (
                <Button
                    variant="link"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "macAddress",
        header: "MAC Address",
    },
    {
        accessorKey: "isActive",
        header: "Status",
        cell: ({ row }) => {
            const status = row.getValue("isActive") as boolean;
            return (
                <Badge variant={
                    status === true ? "default" : "destructive"
                }>
                    {status ? "Active" : "Inactive"}
                </Badge>
            );
        },
    },
    {
        accessorKey: "updated_at",
        header: ({ column }) => {
            return (
                <Button
                    variant="link"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Last Seen
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            return new Date(row.getValue("updated_at")).toLocaleString();
        },
    },
]; 