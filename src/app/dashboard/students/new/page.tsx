'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { createStudent } from "@/service/users.service";
import { LoadingAnimation } from "@/components/loading-animation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AccoutStatus, Gender, UserType } from "@/enum";

export default function NewStudentPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);

        const formData = new FormData(event.currentTarget);
        const studentData = {
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
            userType: UserType.STUDENT,
            mainCenter: formData.get('mainCenter'),
            student: {
                school: formData.get('school'),
                grade: formData.get('grade'),
                preferredMode: formData.get('preferredMode'),
                guardian: {
                    name: formData.get('guardianName'),
                    relationship: formData.get('guardianRelationship'),
                    contactNo: formData.get('guardianContactNo'),
                    email: formData.get('guardianEmail'),
                },
                emergencyContact: {
                    name: formData.get('emergencyContactName'),
                    relationship: formData.get('emergencyContactRelationship'),
                    contactNo: formData.get('emergencyContactNo'),
                    email: formData.get('emergencyContactEmail'),
                }
            }
        };

        try {
            const response = await createStudent(studentData);
            toast({
                title: "Success",
                description: "Student created successfully",
            });
            router.push(`/dashboard/students/${response.uuid}`);
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to create student",
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
                    <CardTitle>Add New Student</CardTitle>
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
                                <div className="space-y-2">
                                    <Label htmlFor="grade">Grade</Label>
                                    <Input id="grade" name="grade" type="number" min="1" max="13" required />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="mainCenter">Main Center</Label>
                                <Input id="mainCenter" name="mainCenter" required />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-lg font-medium">Academic Information</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="school">School</Label>
                                    <Input id="school" name="school" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="preferredMode">Preferred Mode</Label>
                                    <Select name="preferredMode" required>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select mode" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="onsite">Onsite</SelectItem>
                                            <SelectItem value="online">Online</SelectItem>
                                            <SelectItem value="hybrid">Hybrid</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-lg font-medium">Emergency Contact</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="emergencyContactName">Name</Label>
                                    <Input id="emergencyContactName" name="emergencyContactName" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="emergencyContactRelationship">Relationship</Label>
                                    <Input id="emergencyContactRelationship" name="emergencyContactRelationship" required />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="emergencyContactNo">Contact Number</Label>
                                    <Input id="emergencyContactNo" name="emergencyContactNo" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="emergencyContactEmail">Email</Label>
                                    <Input id="emergencyContactEmail" name="emergencyContactEmail" type="email" required />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-lg font-medium">Guardian Details</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="guardianName">Name</Label>
                                    <Input id="guardianName" name="guardianName" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="guardianRelationship">Relationship</Label>
                                    <Input id="guardianRelationship" name="guardianRelationship" required />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="guardianContactNo">Contact Number</Label>
                                    <Input id="guardianContactNo" name="guardianContactNo" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="guardianEmail">Email</Label>
                                    <Input id="guardianEmail" name="guardianEmail" type="email" required />
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
                            <Button type="submit">Create Student</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}