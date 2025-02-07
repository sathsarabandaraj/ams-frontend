"use client";

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
    getSortedRowModel,
    SortingState,
} from "@tanstack/react-table";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { useRouter } from "next/navigation";
import React from "react";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    idColumn?: keyof TData;  // Make idColumn optional
    extraPath?: string;
}

export function DataTable<TData, TValue>({
    columns,
    data,
    idColumn,
    extraPath = "",
}: DataTableProps<TData, TValue>) {
    const router = useRouter();

    const [sorting, setSorting] = React.useState<SortingState>([]); // Sorting state

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        state: {
            sorting,
        },
        onSortingChange: setSorting,
    });

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                return (
                                    <TableHead key={header.id} className="cursor-pointer">
                                        <div
                                            onClick={() => {
                                                table.getColumn(header.id)?.toggleSorting();
                                            }}
                                            className="flex items-center"
                                        >
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                            {header.column.getIsSorted() ? (
                                                header.column.getIsSorted() === "desc" ? (
                                                    <span className="ml-1">↓</span>
                                                ) : (
                                                    <span className="ml-1">↑</span>
                                                )
                                            ) : null}
                                        </div>
                                    </TableHead>
                                );
                            })}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow
                                key={row.id}
                                data-state={row.getIsSelected() && "selected"}
                                // Conditionally add the onClick handler if idColumn exists
                                onClick={() =>
                                    idColumn ? router.push(`${extraPath}/${row.original[idColumn]}`) : null
                                }
                                className="cursor-pointer"
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={columns.length} className="h-24 text-center">
                                No results.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
