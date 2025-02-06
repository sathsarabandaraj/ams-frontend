"use client";

import React, { useState, useEffect } from "react";
import { getStudentByUuid, deleteStudent } from "@/service/users.service";
import { Student } from "@/types/student";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
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
import { Button } from "@/components/ui/button";
import { StudentEditModal } from "./editStudentModal";
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
import { LoadingAnimation } from "@/components/loading-animation";
import { getRfidsByUser, detachRfid, getRfid, assignRfid } from "@/service/rfid.service";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Search } from "lucide-react";

export default function StudentProfilePage({ params }: { params: Promise<{ slug: string }> }) {
    const [studentData, setStudentData] = useState<Student>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [rfids, setRfids] = useState([]);
    const [rfidLoading, setRfidLoading] = useState(false);
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [floatingRfids, setFloatingRfids] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loadingFloatingRfids, setLoadingFloatingRfids] = useState(false);
    const { toast } = useToast();

    const [slug, setSlug] = useState<string>("");
    const router = useRouter();

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
            if (!response) {
                setError("Student not found");
                return;
            }
            setStudentData(response);
        } catch (err) {
            console.error(err);
            setError("An unexpected error occurred. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    const fetchRfids = async () => {
        if (!slug) return;
        try {
            setRfidLoading(true);
            const response = await getRfidsByUser(slug);
            setRfids(response || []);
        } catch (err) {
            console.error(err);
        } finally {
            setRfidLoading(false);
        }
    };

    const fetchFloatingRfids = async () => {
        try {
            setLoadingFloatingRfids(true);
            const response = await getRfid(0, 100, true);
            setFloatingRfids(response.items || []);
        } catch (error) {
            console.error("Failed to fetch floating RFIDs:", error);
        } finally {
            setLoadingFloatingRfids(false);
        }
    };

    useEffect(() => {
        if (slug) {
            fetchStudentData();
            fetchRfids();
        }
    }, [slug]);

    if (loading) return <LoadingAnimation />;
    if (error) return (
        <div className="container mx-auto p-4">
            <div className="flex flex-col items-center justify-center min-h-[50vh]">
                <h2 className="text-2xl font-semibold text-gray-200 mb-4">{error}</h2>
                <Button
                    variant="outline"
                    onClick={() => router.push('/dashboard/students')}
                >
                    Return to Students List
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
            await deleteStudent(slug);
            router.push('/dashboard/students'); // Redirect to students list
            router.refresh(); // Refresh the page data
        } catch (error) {
            console.error("Failed to delete student:", error);
            setError("Failed to delete student");
        }
        setIsDeleteDialogOpen(false);
    };

    const handleDetachRfid = async (rfidUuid: string) => {
        try {
            await detachRfid(rfidUuid, slug);
            fetchRfids();
            toast({
                title: "Success",
                description: "RFID detached successfully",
            });
        } catch (error) {
            console.error("Failed to detach RFID:", error);
            toast({
                title: "Error",
                description: "Failed to detach RFID",
                variant: "destructive",
            });
        }
    };

    const handleAssignRfid = async (rfidUuid: string) => {
        try {
            await assignRfid(rfidUuid, slug);
            await fetchRfids();
            setShowAssignModal(false);
            toast({
                title: "Success",
                description: "RFID assigned successfully",
            });
        } catch (error) {
            console.error("Failed to assign RFID:", error);
            toast({
                title: "Error",
                description: "Failed to assign RFID",
                variant: "destructive",
            });
        }
    };

    const filteredRfids = floatingRfids.filter(rfid =>
        rfid.rfidTag.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                        <Trash2 className="w-4 h-4 mr-2" />
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
                                    alt={studentData.nameInFull} />
                                <AvatarFallback>{studentData.firstName[0]}{studentData.lastName[0]}</AvatarFallback>
                            </Avatar>
                        </div>
                        <InfoItem icon={<User />} label="Full Name" value={studentData.nameInFull} />
                        <InfoItem icon={<Mail />} label="Email" value={studentData.email} />
                        <InfoItem icon={<Phone />} label="Contact No" value={studentData.contactNo} />
                        <InfoItem icon={<MapPin />} label="Address" value={studentData.address} />
                        <InfoItem icon={<Calendar />} label="Date of Birth" value={studentData.dob} />
                        <InfoItem icon={<Users />} label="Gender" value={studentData.gender} />
                        <InfoItem icon={<GraduationCap />} label="Grade" value={studentData.student.grade} />
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
                        <InfoItem icon={<User />} label="Name" value={studentData.student.emergencyContact.name} />
                        <InfoItem icon={<Users />} label="Relationship"
                            value={studentData.student.emergencyContact.relationship} />
                        <InfoItem icon={<Phone />} label="Contact No"
                            value={studentData.student.emergencyContact.contactNo} />
                        <InfoItem icon={<Mail />} label="Email" value={studentData.student.emergencyContact.email} />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Guardian Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <InfoItem icon={<User />} label="Name" value={studentData.student.guardian.name} />
                        <InfoItem icon={<Users />} label="Guardian Name"
                            value={studentData.student.guardian.relationship} />
                        <InfoItem icon={<Phone />} label="Contact No"
                            value={studentData.student.guardian.contactNo} />
                        <InfoItem icon={<Mail />} label="Email" value={studentData.student.guardian.email} />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>System Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <InfoItem icon={<User />} label="System ID" value={studentData.systemId} />
                        <InfoItem icon={<Calendar />} label="Created At"
                            value={new Date(studentData.created_at).toLocaleString()} />
                        <InfoItem icon={<Calendar />} label="Updated At"
                            value={new Date(studentData.updated_at).toLocaleString()} />
                        <InfoItem icon={<Users />} label="User Type" value={studentData.userType} />
                    </CardContent>
                </Card>
            </div>
            <div className="mt-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>RFID Cards</CardTitle>
                        <Dialog open={showAssignModal} onOpenChange={setShowAssignModal}>
                            <DialogTrigger asChild>
                                <Button variant="outline" onClick={() => {
                                    fetchFloatingRfids();
                                    setShowAssignModal(true);
                                }}>
                                    Assign RFID
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                    <DialogTitle>Assign RFID to Student</DialogTitle>
                                </DialogHeader>

                                <div className="relative">
                                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search RFID tags..."
                                        className="pl-8"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>

                                <div className="max-h-[400px] overflow-y-auto">
                                    {loadingFloatingRfids ? (
                                        <div className="flex justify-center p-4">
                                            <LoadingAnimation />
                                        </div>
                                    ) : filteredRfids.length > 0 ? (
                                        <div className="space-y-2">
                                            {filteredRfids.map((rfid) => (
                                                <div
                                                    key={rfid.uuid}
                                                    className="flex items-center justify-between p-3 border rounded hover:bg-accent cursor-pointer"
                                                >
                                                    <div>
                                                        <p className="font-medium">{rfid.rfidTag}</p>
                                                        <p className="text-sm text-muted-foreground">
                                                            Type: {rfid.metadata?.tagType || '-'}
                                                        </p>
                                                    </div>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleAssignRfid(rfid.uuid)}
                                                    >
                                                        Assign
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-4 text-muted-foreground">
                                            No floating RFIDs found
                                        </div>
                                    )}
                                </div>
                            </DialogContent>
                        </Dialog>
                    </CardHeader>
                    <CardContent>
                        {rfidLoading ? (
                            <div className="flex justify-center p-4">
                                <LoadingAnimation />
                            </div>
                        ) : rfids.length > 0 ? (
                            <div className="space-y-4">
                                {rfids.map((rfid) => (
                                    <div key={rfid.uuid} className="flex items-center justify-between p-2 border rounded">
                                        <div>
                                            <p className="font-semibold">Tag: {rfid.rfidTag}</p>
                                            <p className="text-sm text-muted-foreground">UUID: {rfid.uuid}</p>
                                        </div>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => handleDetachRfid(rfid.uuid)}
                                        >
                                            <Trash2 className="w-4 h-4 mr-2" />
                                            Detach
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-4 text-muted-foreground">
                                No RFIDs assigned to this student
                            </div>
                        )}
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
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the student&apos;s
                            account and remove their data from the system.
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

function InfoItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number | boolean }) {
    return (
        <div className="flex items-center space-x-2">
            {icon}
            <span className="font-semibold">{label}:</span>
            <span>{value.toString()}</span>
        </div>
    )
}
