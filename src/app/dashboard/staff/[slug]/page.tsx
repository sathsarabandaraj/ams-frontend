'use client'

import React, { useState, useEffect } from "react";
import { getStaffByUuid, deleteStaff } from "@/service/users.service";
import { Staff } from "@/types/staff";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
    User,
    Phone,
    Mail,
    MapPin,
    Calendar,
    Briefcase,
    CreditCard,
    UserCheck,
    Building,
    Users,
    Edit, Trash2
} from "lucide-react"
import { Button } from "@/components/ui/button";
import { StaffEditModal } from "./editStaffModal";
import { useRouter } from "next/navigation";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function StaffProfilePage({ params }: { params: Promise<{ slug: string }> }) {
    const [staffData, setStaffData] = useState<Staff>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const router = useRouter();
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const [slug, setSlug] = useState<string>("");
    useEffect(() => {
        // Resolve the slug from params
        params.then((resolvedParams) => {
            setSlug(resolvedParams.slug);
            console.log(slug);
        });
    }, [params]);

    const fetchStaffData = async () => {
        if (!slug) return; // Guard clause if slug isn't available yet
        try {
            setLoading(true);
            const response = await getStaffByUuid(slug);
            if (!response) {
                setError("Staff member not found");
                return;
            }
            setStaffData(response);
        } catch (err) {
            console.error(err);
            setError("An unexpected error occurred. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (slug) {
            fetchStaffData();
        }
    }, [slug]);

    if (loading) return <div>Loading...</div>;
    if (error) return (
        <div className="container mx-auto p-4">
            <div className="flex flex-col items-center justify-center min-h-[50vh]">
                <h2 className="text-2xl font-semibold text-gray-200 mb-4">{error}</h2>
                <Button
                    variant="outline"
                    onClick={() => router.push('/dashboard/staff')}
                >
                    Return to Staff List
                </Button>
            </div>
        </div>
    );

    const handleEdit = () => {
        setIsEditModalOpen(true);
    };

    const handleDelete = () => {
        setIsDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        try {
            await deleteStaff(slug);
            router.push('/dashboard/staff'); // Redirect to staff list
            router.refresh(); // Refresh the page data
        } catch (error) {
            console.error("Failed to delete staff:", error);
            setError("Failed to delete staff member");
        }
        setIsDeleteDialogOpen(false);
    };

    return (
        <div className="container mx-auto p-4">
            <div className="container mx-auto p-4">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">{staffData.firstName} {staffData.lastName}</h1>
                    <div className="space-x-2">
                        <Button onClick={handleEdit} variant="outline">
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Profile
                        </Button>
                        <Button onClick={handleDelete} variant="destructive">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete Account
                        </Button>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Personal Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 capitalize">
                        <div className="flex items-center justify-center mb-4">
                            <Avatar className="h-24 w-24">
                                <AvatarImage
                                    src={`https://api.dicebear.com/9.x/fun-emoji/svg?seed=${staffData.nameInFull}`}
                                    alt={staffData.nameInFull}
                                />
                                <AvatarFallback>
                                    {staffData.firstName[0]}
                                    {staffData.lastName[0]}
                                </AvatarFallback>
                            </Avatar>
                        </div>
                        <InfoItem icon={<User />} label="Full Name" value={staffData.nameInFull} />
                        <InfoItem icon={<Mail />} label="Email" value={staffData.email} />
                        <InfoItem icon={<Phone />} label="Contact No" value={staffData.contactNo} />
                        <InfoItem
                            icon={<MapPin />}
                            label="Address"
                            value={`${staffData.address}, ${staffData.staff.postalCode}`}
                        />
                        <InfoItem icon={<Calendar />} label="Date of Birth" value={staffData.dob} />
                        <InfoItem icon={<Users />} label="Gender" value={staffData.gender} />
                        <InfoItem icon={<UserCheck />} label="Civil Status" value={staffData.staff.civilStatus} />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Account Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 capitalize">
                        <InfoItem icon={<Briefcase />} label="User Type" value={staffData.userType} />
                        <div className="flex items-center space-x-2 capitalize">
                            <Badge variant={staffData.accountStatus === "active" ? "default" : "secondary"}>
                                {staffData.accountStatus}
                            </Badge>
                            {staffData.staff.hasApprovedInformation &&
                                <Badge>Information Approved</Badge>}
                        </div>
                        <InfoItem icon={<CreditCard />} label="NIC No" value={staffData.staff.nicNo} />
                        <div className="grid grid-cols-2 gap-4 mt-4">
                            <img src={staffData.staff.nicFrontUrl || "https://placehold.co/600x400"} alt="NIC Front"
                                className="rounded-md" />
                            <img src={staffData.staff.nicBackUrl || "https://placehold.co/600x400"} alt="NIC Back"
                                className="rounded-md" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Secondary Contact</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <InfoItem icon={<User />} label="Name" value={staffData.staff.secondaryContact.name} />
                        <InfoItem icon={<Users />} label="Relationship"
                            value={staffData.staff.secondaryContact.relationship} />
                        <InfoItem icon={<Phone />} label="Contact No"
                            value={staffData.staff.secondaryContact.contactNo} />
                        <InfoItem icon={<Mail />} label="Email" value={staffData.staff.secondaryContact.email} />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Bank Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <InfoItem icon={<User />} label="Account Holder"
                            value={staffData.staff.bankDetails.accountHolderName} />
                        <InfoItem icon={<CreditCard />} label="Account No"
                            value={staffData.staff.bankDetails.accountNo} />
                        <InfoItem icon={<Building />} label="Bank Name"
                            value={staffData.staff.bankDetails.bankName} />
                        <InfoItem icon={<MapPin />} label="Branch Name"
                            value={staffData.staff.bankDetails.branchName} />
                    </CardContent>
                </Card>
            </div>
            <StaffEditModal
                staff={staffData}
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false)
                    fetchStaffData()
                }}
            />
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the staff
                            member&apos;s account and remove their data from the system.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDelete}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

function
    InfoItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number | boolean }) {
    return (
        <div className="flex items-center space-x-2">
            {icon}
            <span className="font-semibold">{label}:</span>
            <span>{value.toString()}</span>
        </div>
    )
}
