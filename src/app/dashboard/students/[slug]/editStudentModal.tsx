"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { DeepPartial, useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Student } from "@/types/student"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Gender } from "@/enum"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent } from "@/components/ui/card"
import { updateStudent } from "@/service/users.service"

const genderEnum = Object.values(Gender);

const formSchema = z.object({
    email: z.string().email(),
    nameInFull: z.string().min(2).max(100),
    firstName: z.string().min(2).max(50),
    lastName: z.string().min(2).max(50),
    address: z.string().min(5).max(200),
    contactNo: z.string().min(10).max(15),
    gender: z.enum(genderEnum as [string, ...string[]]),
    dob: z.string(),
    grade: z.string(),
    emergencyContactName: z.string().min(2).max(100),
    emergencyContactRelationship: z.string().min(2).max(50),
    emergencyContactNo: z.string().min(10).max(15),
    emergencyContactEmail: z.string().email(),
    guardianName: z.string().min(2).max(100),
    guardianContactNo: z.string().min(10).max(15),
    guardianEmail: z.string().email(),
    guardianRelationship: z.string().min(2).max(50),
})

interface EditModalProps {
    student: Student;
    isOpen: boolean;
    onClose: () => void;
}

export function StudentEditModal({ student, isOpen, onClose }: EditModalProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: student.email,
            nameInFull: student.nameInFull,
            firstName: student.firstName,
            lastName: student.lastName,
            address: student.address,
            contactNo: student.contactNo,
            gender: student.gender,
            dob: student.dob,
            grade: student.student.grade,
            emergencyContactName: student.student.emergencyContact.name,
            emergencyContactRelationship: student.student.emergencyContact.relationship,
            emergencyContactNo: student.student.emergencyContact.contactNo,
            emergencyContactEmail: student.student.emergencyContact.email,
            guardianName: student.student.guardian.name,
            guardianContactNo: student.student.guardian.contactNo,
            guardianEmail: student.student.guardian.email,
            guardianRelationship: student.student.guardian.relationship,
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
        setError(null);

        const updatedStudent: DeepPartial<Student> = {
            email: values.email,
            nameInFull: values.nameInFull,
            firstName: values.firstName,
            lastName: values.lastName,
            address: values.address,
            contactNo: values.contactNo,
            gender: values.gender,
            dob: values.dob,
            student: {
                grade: values.grade,
                emergencyContact: {
                    name: values.emergencyContactName,
                    relationship: values.emergencyContactRelationship,
                    contactNo: values.emergencyContactNo,
                    email: values.emergencyContactEmail,
                },
                guardian: {
                    name: values.guardianName,
                    relationship: values.guardianRelationship,
                    contactNo: values.guardianContactNo,
                    email: values.guardianEmail,
                },
            },
        };

        updateStudent(student.uuid, updatedStudent)
            .then((response) => {
                console.log("Student updated successfully:", response);
                setIsLoading(false);
                onClose(); // Close the modal after successful update
            })
            .catch((error) => {
                console.error("Error updating student:", error);
                setIsLoading(false);
                setError("Failed to update student. Please try again.");
            });
        console.log(error);
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[725px]">
                <DialogHeader>
                    <DialogTitle>Edit Student Information</DialogTitle>
                    <DialogDescription>
                        Make changes to the student's profile here. Click save when you're done.
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
                                    <div className="grid grid-cols-2 gap-4">
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
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
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
                                        <FormField
                                            control={form.control}
                                            name="grade"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Grade</FormLabel>
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
                                            name="emergencyContactName"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Emergency Contact Name</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="emergencyContactRelationship"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Emergency Contact Relationship</FormLabel>
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
                                            name="emergencyContactNo"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Emergency Contact Number</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="emergencyContactEmail"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Emergency Contact Email</FormLabel>
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
                                        name="guardianName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Guardian Name</FormLabel>
                                                <FormControl>
                                                    <Input {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="guardianRelationship"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Guardian Relationship</FormLabel>
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
                                        name="guardianContactNo"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Guardian Contact Number</FormLabel>
                                                <FormControl>
                                                    <Input {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="guardianEmail"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Guardian Email</FormLabel>
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
    )
}

