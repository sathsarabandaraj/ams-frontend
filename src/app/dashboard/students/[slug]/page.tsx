"use client";

import React, {useState, useEffect} from "react";
import {getStudentByUuid} from "@/service/users.service";
import {Student} from "@/types/student";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar"
import {Badge} from "@/components/ui/badge"
import {
    User,
    Phone,
    Mail,
    MapPin,
    Calendar,
    Users,
    Edit,
    Trash2,
    GraduationCap
} from "lucide-react"
import {Button} from "@/components/ui/button";
import { StudentEditModal } from "./editStudentModal";

export default function StudentProfilePage({params}: { params: Promise<{ slug: string }> }) {
    const [studentData, setStudentData] = useState<Student>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    
    const [slug, setSlug] = useState<string>("");

    useEffect(() => {
        // Resolve the slug from params
        params.then((resolvedParams) => {
            setSlug(resolvedParams.slug);
        });
    }, [params]);

    const fetchStudentData = async () => {
        try {
            setLoading(true);
            const response = await getStudentByUuid(slug);
            setStudentData(response); // Save student data
        } catch (err) {
            console.error(err);
            setError("Failed to load student data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (slug) {
            fetchStudentData();
        }
    }, [slug]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;


    const handleEdit = () => {
        setIsEditModalOpen(true);
    };

    const handleDelete = () => {
        console.log("Delete account");
    };


    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">{studentData.firstName} {studentData.lastName}</h1>
                <div className="space-x-2">
                    <Button onClick={handleEdit} variant="outline">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Profile
                    </Button>
                    <Button onClick={handleDelete} variant="destructive">
                        <Trash2 className="w-4 h-4 mr-2"/>
                        Delete Account
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Personal Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-center mb-4">
                            <Avatar className="h-24 w-24">
                                <AvatarImage
                                    src={`https://api.dicebear.com/6.x/initials/svg?seed=${studentData.nameInFull}`}
                                    alt={studentData.nameInFull}/>
                                <AvatarFallback>{studentData.firstName[0]}{studentData.lastName[0]}</AvatarFallback>
                            </Avatar>
                        </div>
                        <InfoItem icon={<User/>} label="Full Name" value={studentData.nameInFull}/>
                        <InfoItem icon={<Mail/>} label="Email" value={studentData.email}/>
                        <InfoItem icon={<Phone/>} label="Contact No" value={studentData.contactNo}/>
                        <InfoItem icon={<MapPin/>} label="Address" value={studentData.address}/>
                        <InfoItem icon={<Calendar/>} label="Date of Birth" value={studentData.dob}/>
                        <InfoItem icon={<Users/>} label="Gender" value={studentData.gender}/>
                        <InfoItem icon={<GraduationCap/>} label="Grade" value={studentData.student.grade}/>
                        <div className="capitalize flex items-center space-x-2">
                            <Badge variant={studentData.accountStatus === 'active' ? 'default' : 'secondary'}>
                                {studentData.accountStatus}
                            </Badge>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Emergency Contact</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <InfoItem icon={<User/>} label="Name" value={studentData.student.emergencyContact.name}/>
                        <InfoItem icon={<Users/>} label="Relationship"
                                  value={studentData.student.emergencyContact.relationship}/>
                        <InfoItem icon={<Phone/>} label="Contact No"
                                  value={studentData.student.emergencyContact.contactNo}/>
                        <InfoItem icon={<Mail/>} label="Email" value={studentData.student.emergencyContact.email}/>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Guardian Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <InfoItem icon={<User/>} label="Name" value={studentData.student.guardian.name}/>
                        <InfoItem icon={<Users/>} label="Guardian Name"
                                  value={studentData.student.guardian.relationship}/>
                        <InfoItem icon={<Phone/>} label="Contact No"
                                  value={studentData.student.guardian.contactNo}/>
                        <InfoItem icon={<Mail/>} label="Email" value={studentData.student.guardian.email}/>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>System Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <InfoItem icon={<User/>} label="System ID" value={studentData.systemId}/>
                        <InfoItem icon={<Calendar/>} label="Created At"
                                  value={new Date(studentData.created_at).toLocaleString()}/>
                        <InfoItem icon={<Calendar/>} label="Updated At"
                                  value={new Date(studentData.updated_at).toLocaleString()}/>
                        <InfoItem icon={<Users/>} label="User Type" value={studentData.userType}/>
                    </CardContent>
                </Card>
            </div>
            <StudentEditModal
                student={studentData}
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false)
                    fetchStudentData()
                }}
            />
        </div>
    )
}

function InfoItem({icon, label, value}: { icon: React.ReactNode; label: string; value: string | number | boolean }) {
    return (
        <div className="flex items-center space-x-2">
            {icon}
            <span className="font-semibold">{label}:</span>
            <span>{value.toString()}</span>
        </div>
    )
}
