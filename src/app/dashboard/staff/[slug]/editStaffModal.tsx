"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { DeepPartial, useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Staff } from "@/types/staff";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { updateStaff } from "@/service/users.service"; // Replace with your staff service function
import { Gender } from "@/enum";

const genderEnum = Object.values(Gender);

const staffFormSchema = z.object({
    email: z.string().email(),
    nameInFull: z.string().min(2).max(100),
    firstName: z.string().min(2).max(50),
    lastName: z.string().min(2).max(50),
    address: z.string().min(5).max(200),
    contactNo: z.string().min(10).max(15),
    gender: z.string(),
    dob: z.string(),
    postalCode: z.string().min(2).max(20),
    nicNo: z.string().min(10).max(12),
    civilStatus: z.string(),
    isAdmin: z.boolean(),
    isTeacher: z.boolean(),
    secondaryContactName: z.string().min(2).max(100),
    secondaryContactRelationship: z.string().min(2).max(50),
    secondaryContactNo: z.string().min(10).max(15),
    secondaryContactEmail: z.string().email(),
    accountHolderName: z.string().min(2).max(100),
    accountNo: z.string().min(5).max(20),
    bankName: z.string().min(2).max(100),
    branchName: z.string().min(2).max(100),
});

interface StaffEditModalProps {
    staff: Staff;
    isOpen: boolean;
    onClose: () => void;
}

export function StaffEditModal({ staff, isOpen, onClose }: StaffEditModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const form = useForm<z.infer<typeof staffFormSchema>>({
        resolver: zodResolver(staffFormSchema),
        defaultValues: {
            email: staff.email,
            nameInFull: staff.nameInFull,
            firstName: staff.firstName,
            lastName: staff.lastName,
            address: staff.address,
            contactNo: staff.contactNo,
            gender: staff.gender,
            dob: staff.dob,
            postalCode: staff.staff.postalCode,
            nicNo: staff.staff.nicNo,
            civilStatus: staff.staff.civilStatus,
            isAdmin: staff.staff.isAdmin,
            isTeacher: staff.staff.isTeacher,
            secondaryContactName: staff.staff.secondaryContact.name,
            secondaryContactRelationship: staff.staff.secondaryContact.relationship,
            secondaryContactNo: staff.staff.secondaryContact.contactNo,
            secondaryContactEmail: staff.staff.secondaryContact.email,
            accountHolderName: staff.staff.bankDetails.accountHolderName,
            accountNo: staff.staff.bankDetails.accountNo,
            bankName: staff.staff.bankDetails.bankName,
            branchName: staff.staff.bankDetails.branchName,
        },
    });

    function onSubmit(values: z.infer<typeof staffFormSchema>) {
        setIsLoading(true);
        setError(null);

        const updatedStaff: DeepPartial<Staff> = {
            email: values.email,
            nameInFull: values.nameInFull,
            firstName: values.firstName,
            lastName: values.lastName,
            address: values.address,
            contactNo: values.contactNo,
            gender: values.gender,
            dob: values.dob,
            staff: {
                postalCode: values.postalCode,
                nicNo: values.nicNo,
                civilStatus: values.civilStatus,
                isAdmin: values.isAdmin,
                isTeacher: values.isTeacher,
                secondaryContact: {
                    name: values.secondaryContactName,
                    relationship: values.secondaryContactRelationship,
                    contactNo: values.secondaryContactNo,
                    email: values.secondaryContactEmail,
                },
                bankDetails: {
                    accountHolderName: values.accountHolderName,
                    accountNo: values.accountNo,
                    bankName: values.bankName,
                    branchName: values.branchName,
                },
            },
        };

        updateStaff(staff.uuid, updatedStaff)
            .then((response) => {
                console.log("Staff updated successfully:", response);
                setIsLoading(false);
                onClose(); // Close the modal after successful update
            })
            .catch((error) => {
                console.error("Error updating staff:", error);
                setIsLoading(false);
                setError("Failed to update staff. Please try again.");
            });
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[725px]">
                <DialogHeader>
                    <DialogTitle>Edit Staff Information</DialogTitle>
                    <DialogDescription>
                        Make changes to the staff's profile here. Click save when you're done.
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className="max-h-[80vh] overflow-y-auto pr-4">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <Card>
                                <CardContent className="space-y-4 pt-3">
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="nameInFull"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Full Name</FormLabel>
                                                <FormControl>
                                                    <Input {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <div className="grid grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="firstName"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>First Name</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="lastName"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Last Name</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <FormField
                                        control={form.control}
                                        name="address"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Address</FormLabel>
                                                <FormControl>
                                                    <Input {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <div className="grid grid-cols-3  gap-4">

                                        <FormField
                                            control={form.control}
                                            name="contactNo"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Contact Number</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="gender"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Gender</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select gender" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="male">Male</SelectItem>
                                                            <SelectItem value="female">Female</SelectItem>
                                                            <SelectItem value="other">Other</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="dob"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Date of Birth</FormLabel>
                                                    <FormControl>
                                                        <Input type="date" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="space-y-4 pt-3">
                                    <FormField
                                        control={form.control}
                                        name="nicNo"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>NIC Number</FormLabel>
                                                <FormControl>
                                                    <Input {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <div className="grid grid-cols-2 gap-4">

                                        <FormField
                                            control={form.control}
                                            name="postalCode"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Postal Code</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="civilStatus"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Civil Status</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select civil status" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="single">Single</SelectItem>
                                                            <SelectItem value="married">Married</SelectItem>
                                                            <SelectItem value="divorced">Divorced</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="isAdmin"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Is Admin</FormLabel>
                                                    <Select onValueChange={(value) => field.onChange(value === "true")} defaultValue={field.value ? "true" : "false"}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select admin status" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="true">Yes</SelectItem>
                                                            <SelectItem value="false">No</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="isTeacher"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Is Teacher</FormLabel>
                                                    <Select onValueChange={(value) => field.onChange(value === "true")} defaultValue={field.value ? "true" : "false"}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select teacher status" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="true">Yes</SelectItem>
                                                            <SelectItem value="false">No</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="space-y-4 pt-3">
                                    <div className="grid grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="secondaryContactName"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Secondary Contact Name</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="secondaryContactRelationship"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Secondary Contact Relationship</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="secondaryContactNo"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Secondary Contact Number</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="secondaryContactEmail"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Secondary Contact Email</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="space-y-4 pt-3">
                                    <div className="grid grid-cols-2 gap-4">

                                        <FormField
                                            control={form.control}
                                            name="accountHolderName"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Account Holder Name</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="accountNo"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Account Number</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">

                                        <FormField
                                            control={form.control}
                                            name="bankName"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Bank Name</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="branchName"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Branch Name</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? "Saving..." : "Save Changes"}
                            </Button>
                        </form>
                    </Form>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}
