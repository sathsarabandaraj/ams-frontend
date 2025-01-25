"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Breadcrumb,
    BreadcrumbEllipsis,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DESKTOP_BREADCRUMBS_LIMIT, MOBILE_BREADCRUMBS_LIMIT } from "@/config/env.config";
import { useIsMobile } from "@/hooks/use-mobile";

export function BreadcrumbResponsive() {
    const [open, setOpen] = React.useState(false);
    const isDesktop = !useIsMobile(); // Check if the screen is desktop
    const pathname = usePathname();

    // Split the pathname into an array of breadcrumb parts
    const breadcrumbsArray = pathname.split("/").filter(Boolean);

    // Create breadcrumb items from the pathname parts
    const items = breadcrumbsArray.map((item, index) => {
        const href = "/" + breadcrumbsArray.slice(0, index + 1).join("/");
        return { href, label: item }; // Capitalize the label
    });

    const ITEMS_TO_DISPLAY = isDesktop ? DESKTOP_BREADCRUMBS_LIMIT : MOBILE_BREADCRUMBS_LIMIT;

    return (
        <Breadcrumb>
            <BreadcrumbList>
                {/* Always render the first breadcrumb */}
                {items.length > 0 && (
                    <BreadcrumbItem key={items[0].href}>
                        <BreadcrumbLink className="capitalize" href={items[0].href}>{items[0].label}</BreadcrumbLink>
                    </BreadcrumbItem>
                )}

                {/* If there are more items than the limit, handle selection */}
                {items.length > ITEMS_TO_DISPLAY && (
                    <>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem key="ellipsis-item">
                            {isDesktop ? (
                                <DropdownMenu open={open} onOpenChange={setOpen}>
                                    <DropdownMenuTrigger
                                        className="flex items-center gap-1"
                                        aria-label="Toggle menu"
                                    >
                                        <BreadcrumbEllipsis className="h-4 w-4" />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="start">
                                        {items.slice(1, -3).map((item) => (
                                            <DropdownMenuItem key={item.href}>
                                                <Link className="capitalize" href={item.href}>{item.label}</Link>
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            ) : (
                                <Drawer open={open} onOpenChange={setOpen}>
                                    <DrawerTrigger aria-label="Toggle Menu">
                                        <BreadcrumbEllipsis className="h-4 w-4" />
                                    </DrawerTrigger>
                                    <DrawerContent>
                                        <DrawerHeader className="text-left">
                                            <DrawerTitle>Navigate to</DrawerTitle>
                                            <DrawerDescription>
                                                Select a page to navigate to.
                                            </DrawerDescription>
                                        </DrawerHeader>
                                        <div className="grid gap-1 px-4">
                                            {items.slice(1, -1).map((item) => (
                                                <Link
                                                    key={item.href}
                                                    href={item.href}
                                                    className="py-1 text-sm capitalize"
                                                >
                                                    {item.label}
                                                </Link>
                                            ))}
                                        </div>
                                        <DrawerFooter className="pt-4">
                                            <DrawerClose asChild>
                                                <Button variant="outline">Close</Button>
                                            </DrawerClose>
                                        </DrawerFooter>
                                    </DrawerContent>
                                </Drawer>
                            )}
                        </BreadcrumbItem>
                    </>
                )}

                {/* Render the last visible breadcrumbs */}
                {items
                    .slice(items.length > ITEMS_TO_DISPLAY ? -(ITEMS_TO_DISPLAY - 2) : 1)
                    .map((item) => (
                        <React.Fragment key={item.href}>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                {item.href ? (
                                    <BreadcrumbLink
                                        asChild
                                        className="max-w-20 truncate md:max-w-none capitalize"
                                    >
                                        <Link href={item.href}>{item.label}</Link>
                                    </BreadcrumbLink>
                                ) : (
                                    <BreadcrumbPage className="max-w-20 truncate md:max-w-none capitalize">
                                        {item.label}
                                    </BreadcrumbPage>
                                )}
                            </BreadcrumbItem>
                        </React.Fragment>
                    ))}
            </BreadcrumbList>
        </Breadcrumb>
    );
}
