"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

type Attendance = {
    uuid: string;
    created_at: string;
    updated_at: string;
    user: {
        uuid: string;
        nameInFull: string;
        userType: string;
    };
    type: "IN" | "OUT";
    timestamp: string;
};

export const columns: ColumnDef<Attendance>[] = [
    {
        accessorKey: "user.nameInFull",
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
        accessorKey: "user.userType",
        header: "User Type",
        cell: ({ row }) => {
            return (
                <div className="capitalize">
                    {row.getValue("user_userType")}
                </div>
            )
        },
    },
    {
        accessorKey: "inOutStatus",
        header: "Type",
        cell: ({ row }) => {
            const type = row.getValue("inOutStatus") as string;
            return (
                <div className={`font-medium capitalize ${type === 'in' ? 'text-green-300' : 'text-red-300'}`}>
                    {type}
                </div>
            )
        },
    },
    {
        accessorKey: "created_at",
        header: ({ column }) => {
            return (
                <Button
                    variant="link"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Time
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            return format(new Date(row.getValue("created_at")), "PPpp");
        },
    },
]; 