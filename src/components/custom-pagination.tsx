import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu } from "@radix-ui/react-dropdown-menu";
import {
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CustomPaginationProps {
    currentPage: number;
    pageSize: number;
    totalCount: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (pageSize: number) => void; // Add onPageSizeChange prop
}

export function CustomPagination({
                                     currentPage,
                                     pageSize,
                                     totalCount,
                                     onPageChange,
                                     onPageSizeChange,
                                 }: CustomPaginationProps) {
    const totalPages = Math.ceil(totalCount / pageSize);

    // Adjust currentPage to account for API starting at 0
    const adjustedCurrentPage = currentPage + 1;

    // Generate the pagination numbers to display
    const getPaginationItems = () => {
        const pages: (number | "ellipsis")[] = [];

        if (totalPages <= 5) {
            // Show all pages if total pages are 5 or less
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Always show the first page
            pages.push(1);

            // Calculate range around the current page
            const start = Math.max(2, adjustedCurrentPage - 1); // Start one page before the current one (minimum 2)
            const end = Math.min(totalPages - 1, adjustedCurrentPage + 1); // End one page after the current one (maximum totalPages - 1)

            // Add ellipsis if necessary
            if (start > 2) pages.push("ellipsis");

            // Add the range pages (currentPage - 1, currentPage, currentPage + 1)
            for (let i = start; i <= end; i++) {
                pages.push(i);
            }

            // Add ellipsis if necessary
            if (end < totalPages - 1) pages.push("ellipsis");

            // Always show the last page
            pages.push(totalPages);
        }

        return pages;
    };

    const paginationItems = getPaginationItems();

    return (
        <Pagination>
            <PaginationContent>
                {/* Previous button */}
                <PaginationItem>
                    <CustomPaginationPrevious
                        onClick={() => adjustedCurrentPage > 1 && onPageChange(adjustedCurrentPage - 2)}
                        isDisabled={adjustedCurrentPage === 1} // Correctly handle the disabled state
                    />
                </PaginationItem>

                {/* Dynamic page links */}
                {paginationItems.map((item, index) => (
                    <PaginationItem key={index}>
                        {item === "ellipsis" ? (
                            <PaginationEllipsis />
                        ) : (
                            <PaginationLink
                                onClick={() => onPageChange(item - 1)}
                                isActive={item === adjustedCurrentPage}
                            >
                                {item}
                            </PaginationLink>
                        )}
                    </PaginationItem>
                ))}

                {/* Next button */}
                <PaginationItem>
                    <CustomPaginationNext
                        onClick={() => adjustedCurrentPage < totalPages && onPageChange(adjustedCurrentPage)}
                        isDisabled={adjustedCurrentPage === totalPages} // Correctly handle the disabled state
                    />
                </PaginationItem>
            </PaginationContent>

            {/* Page Size Dropdown using Radio Buttons */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline">Page Size: {pageSize}</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                    <DropdownMenuRadioGroup
                        value={String(pageSize)} // Convert number to string for compatibility
                        onValueChange={(value) => onPageSizeChange(Number(value))} // Trigger onPageSizeChange on value change
                    >
                        <DropdownMenuRadioItem value="10">10</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="20">20</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="50">50</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="100">100</DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        </Pagination>
    );
}

const CustomPaginationPrevious = ({
                                      onClick,
                                      isDisabled,
                                      ...props
                                  }: {
    onClick: () => void;
    isDisabled: boolean;
}) => (
    <Button
        variant="ghost"
        onClick={!isDisabled ? onClick : undefined}
        disabled={isDisabled}
        className={cn(
            "pagination-previous",
            isDisabled ? "opacity-50 cursor-not-allowed" : ""
        )}
        {...props}
    >
        <ChevronLeft className="h-4 w-4" />
        Previous
    </Button>
);

const CustomPaginationNext = ({
                                  onClick,
                                  isDisabled,
                                  ...props
                              }: {
    onClick: () => void;
    isDisabled: boolean;
}) => (
    <Button
        variant={"ghost"}
        onClick={!isDisabled ? onClick : undefined}
        disabled={isDisabled}
        className={cn(
            "pagination-next",
            isDisabled ? "opacity-50 cursor-not-allowed" : ""
        )}
        {...props}
    >
        Next
        <ChevronRight className="h-4 w-4" />
    </Button>
);
