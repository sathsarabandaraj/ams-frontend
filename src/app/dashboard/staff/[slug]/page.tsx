'use client'

import React, { useState, useEffect } from "react";
import { getStaffByUuid } from "@/service/users.service";
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

export default function StaffProfilePage({ params }: { params: Promise<{ slug: string }> }) {
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [staffData, setStaffData] = useState<Staff>(null);

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
            setStaffData(response); // Assuming the response is the staff data
        } catch (err) {
            console.error(err);
            setError("Failed to load staff data");
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
    if (error) return <div>{error}</div>;

    const handleEdit = () => {
        // Implement edit functionality
        console.log("Edit profile")
    }

    const handleDelete = () => {
        // Implement delete functionality
        console.log("Delete account")
    }

    return (
        <div className="container mx-auto p-4">
            <div className="container mx-auto p-4">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">{staffData.nameInFull}</h1>
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
