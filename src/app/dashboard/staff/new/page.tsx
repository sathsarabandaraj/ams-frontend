'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { createStaff } from "@/service/users.service";
import { LoadingAnimation } from "@/components/loading-animation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AccoutStatus, CivilStatus, Gender, UserType } from "@/enum";

export default function NewStaffPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);

        const formData = new FormData(event.currentTarget);
        const staffData = {
            email: formData.get('email'),
            nameInFull: `${formData.get('firstName')} ${formData.get('lastName')}`,
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            address: formData.get('address'),
            contactNo: formData.get('contactNo'),
            gender: formData.get('gender'),
            dob: formData.get('dob'),
            password: "Anka@12345", // Default password
            accountStatus: AccoutStatus.ACTIVE,
            userType: UserType.STAFF,
            mainCenter: formData.get('mainCenter'),
            staff: {
                postalCode: formData.get('postalCode'),
                nicNo: formData.get('nicNo'),
                nicFrontUrl: "https://placehold.co/600x400", // Default placeholder
                nicBackUrl: "https://placehold.co/600x400", // Default placeholder
                civilStatus: formData.get('civilStatus'),
                secondaryContact: {
                    name: formData.get('secondaryContactName'),
                    relationship: formData.get('secondaryContactRelationship'),
                    contactNo: formData.get('secondaryContactNo'),
                    email: formData.get('secondaryContactEmail'),
                },
                bankDetails: {
                    accountHolderName: formData.get('accountHolderName'),
                    accountNo: formData.get('accountNo'),
                    bankName: formData.get('bankName'),
                    branchName: formData.get('branchName'),
                },
                isAdmin: formData.get('isAdmin') === 'true',
                isTeacher: formData.get('isTeacher') === 'true',
                hasApprovedInformation: false
            }
        };

        try {
            const response = await createStaff(staffData);
            toast({
                title: "Success",
                description: "Staff member created successfully",
            });
            router.push(`/dashboard/staff/${response.uuid}`);
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to create staff member",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <LoadingAnimation />;

    return (
        <div className="container mx-auto py-10">
            <Card>
                <CardHeader>
                    <CardTitle>Add New Staff Member</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium">Personal Information</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName">First Name</Label>
                                    <Input id="firstName" name="firstName" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastName">Last Name</Label>
                                    <Input id="lastName" name="lastName" required />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" name="email" type="email" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="contactNo">Contact Number</Label>
                                    <Input id="contactNo" name="contactNo" required />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="address">Address</Label>
                                <Input id="address" name="address" required />
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="postalCode">Postal Code</Label>
                                    <Input id="postalCode" name="postalCode" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="gender">Gender</Label>
                                    <Select name="gender" required>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select gender" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Object.values(Gender).map((gender) => (
                                                <SelectItem key={gender} value={gender}>
                                                    {gender}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="dob">Date of Birth</Label>
                                    <Input id="dob" name="dob" type="date" required />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-lg font-medium">Staff Information</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="nicNo">NIC Number</Label>
                                    <Input id="nicNo" name="nicNo" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="civilStatus">Civil Status</Label>
                                    <Select name="civilStatus" required>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Object.values(CivilStatus).map((status) => (
                                                <SelectItem key={status} value={status}>
                                                    {status}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Staff Role</Label>
                                    <Select name="isTeacher" required>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="true">Teacher</SelectItem>
                                            <SelectItem value="false">Staff</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Admin Status</Label>
                                    <Select name="isAdmin" required>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select admin status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="true">Admin</SelectItem>
                                            <SelectItem value="false">Not Admin</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="mainCenter">Main Center</Label>
                                <Input id="mainCenter" name="mainCenter" required />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-lg font-medium">Secondary Contact</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="secondaryContactName">Name</Label>
                                    <Input id="secondaryContactName" name="secondaryContactName" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="secondaryContactRelationship">Relationship</Label>
                                    <Input id="secondaryContactRelationship" name="secondaryContactRelationship" required />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="secondaryContactNo">Contact Number</Label>
                                    <Input id="secondaryContactNo" name="secondaryContactNo" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="secondaryContactEmail">Email</Label>
                                    <Input id="secondaryContactEmail" name="secondaryContactEmail" type="email" required />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-lg font-medium">Bank Details</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="accountHolderName">Account Holder Name</Label>
                                    <Input id="accountHolderName" name="accountHolderName" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="accountNo">Account Number</Label>
                                    <Input id="accountNo" name="accountNo" required />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="bankName">Bank Name</Label>
                                    <Input id="bankName" name="bankName" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="branchName">Branch Name</Label>
                                    <Input id="branchName" name="branchName" required />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.back()}
                            >
                                Cancel
                            </Button>
                            <Button type="submit">Create Staff</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}