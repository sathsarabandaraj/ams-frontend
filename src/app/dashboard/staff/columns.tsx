"use client";

import {ColumnDef} from "@tanstack/react-table";
import {Staff} from "@/types/staff";
import {CheckCircle, MoreHorizontal, XCircle, ArrowUpDown} from "lucide-react";
import {DropdownMenu} from "@radix-ui/react-dropdown-menu";
import {
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel, DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {useRouter} from "next/navigation";
import {Button} from "@/components/ui/button";

export const columns: ColumnDef<Staff>[] = [
    {
        accessorKey: "firstName",
        header: ({column}) => {
            return (
                <Button
                    variant="link"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    First Name
                    <ArrowUpDown className="ml-2 h-4 w-4"/>
                </Button>
            )
        },
        enableSorting: true
    },
    {
        accessorKey: "lastName",
        header: ({column}) => {
            return (
                <Button
                    variant="link"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Last Name
                    <ArrowUpDown className="ml-2 h-4 w-4"/>
                </Button>
            )
        },
        enableSorting: true
    },
    {
        accessorKey: "systemId",
        header: ({column}) => {
            return (
                <Button
                    variant="link"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    System ID
                    <ArrowUpDown className="ml-2 h-4 w-4"/>
                </Button>
            )
        },
        enableSorting: true
    },
    {
        accessorKey: "email",
        header: ({column}) => {
            return (
                <Button
                    variant="link"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Email
                    <ArrowUpDown className="ml-2 h-4 w-4"/>
                </Button>
            )
        },
        enableSorting: true
    },
    {
        accessorKey: "contactNo",
        header: "Contact No",
        enableSorting: false,
    },
    {
        accessorKey: "accountStatus",
        header: ({column}) => {
            return (
                <Button
                    variant="link"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Account Status
                    <ArrowUpDown className="ml-2 h-4 w-4"/>
                </Button>
            )
        },
        enableSorting: true
    },
    {
        accessorKey: "staff.isAdmin",
        header: "Admin",
        enableSorting: true,
        cell: ({row}) => {
            const isTeacher: boolean = row.getValue("staff_isAdmin");
            return (
                <div className="flex items-center">
                    {isTeacher ? (
                        <CheckCircle/>
                    ) : (
                        <XCircle className="text-gray-500"/>
                    )}
                </div>
            );
        },
    },
    {
        accessorKey: "staff.isTeacher",
        header: "Teacher",
        enableSorting: true,
        cell: ({row}) => {
            const isTeacher: boolean = row.getValue("staff_isTeacher");
            return (
                <div className="flex items-center">
                    {isTeacher ? (
                        <CheckCircle/>
                    ) : (
                        <XCircle className="text-gray-500"/>
                    )}
                </div>
            );
        },
    },
    {
        id: "actions",
        cell: ({row}) => {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const router = useRouter();
            const staff = row.original;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4"/>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() => router.push(`staff/${staff.systemId}`)}
                        >
                            View Profile
                        </DropdownMenuItem>
                        <DropdownMenuSeparator/>
                        <DropdownMenuItem
                            onClick={() => navigator.clipboard.writeText(staff.systemId)}
                        >
                            Copy System ID
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => navigator.clipboard.writeText(staff.email)}
                        >
                            Copy Email
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => navigator.clipboard.writeText(staff.contactNo)}
                        >
                            Copy Contact No
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
