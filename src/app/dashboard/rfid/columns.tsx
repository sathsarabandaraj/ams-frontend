"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CheckCircle, MoreHorizontal, XCircle, ArrowUpDown, User, UserX } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel, DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Rfid } from "@/types/rfid";

export const columns: ColumnDef<Rfid>[] = [
    {
        accessorKey: "rfidTag",
        header: ({ column }) => {
            return (
                <Button
                    variant="link"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    RFID Tag
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        enableSorting: true
    },
    {
        accessorKey: "isSystem",
        header: "System Tag",
        enableSorting: false,
        cell: ({ row }) => {
            const isSystem: boolean = row.getValue("isSystem");
            return (
                <div className="flex items-center">
                    {isSystem ? (
                        <CheckCircle className="text-green-500" />
                    ) : (
                        <XCircle className="text-gray-500" />
                    )}
                </div>
            );
        },
    },
    {
        accessorKey: "user",
        header: "Assignment",
        cell: ({ row }) => {
            console.log(row.original);
            const user = row.original.user;
            return (
                <div className="flex items-center gap-2">
                    {user ? (
                        <>
                            <User className="text-green-500 h-4 w-4" />
                            <span className="text-sm">
                                {user.firstName}
                            </span>
                        </>
                    ) : (
                        <>
                            <UserX className="text-gray-500 h-4 w-4" />
                            <span className="text-sm text-gray-500">Unassigned</span>
                        </>
                    )}
                </div>
            );
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const router = useRouter();
            const rfid = row.original;

            return (
                <div className="justify-item-end">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                                onClick={() => router.push(`rfid/${rfid.uuid}`)}
                            >
                                View Rfid
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => navigator.clipboard.writeText(rfid.rfidTag)}
                            >
                                Copy Rfid Tag
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            );
        },
    },
];
