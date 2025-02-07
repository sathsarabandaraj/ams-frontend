'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CreditCard, User, Calendar, Mail, Phone, MapPin, AlertCircle, UserX, ArrowRight } from "lucide-react"
import { useState, useEffect } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Rfid } from "@/types/rfid";
import { getRfidByTag } from "@/service/rfid.service";
import { useRouter } from "next/navigation";
import { LoadingAnimation } from "@/components/loading-animation";

export default function RFIDUserCard({ params }: { params: Promise<{ slug: string }> }) {
    const router = useRouter();
    const [rfidData, setRfidData] = useState<Rfid>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [slug, setSlug] = useState<string>("");

    useEffect(() => {
        params.then((resolvedParams) => {
            setSlug(resolvedParams.slug);
        });
    }, [params]);

    const fetchStudentData = async () => {
        try {
            setLoading(true);
            const response = await getRfidByTag(slug);
            setRfidData(response);
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

    if (loading) return <LoadingAnimation />;
    if (error) return <div>{error}</div>;


    return (
        <div className="flex flex-col md:flex-row gap-4 p-4 max-w-4xl mx-auto">
            {/* RFID Card */}
            <Card className="flex-1 w-full lg:w-[400px]">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5" />
                        RFID Details
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <p className="text-sm text-muted-foreground">Tag ID</p>
                        <p className="font-mono text-lg">{rfidData.rfidTag}</p>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Type</p>
                        <Badge variant="secondary">{rfidData.metadata.tagType}</Badge>
                    </div>
                </CardContent>
            </Card>

            {/* User Card */}
            <Card className="flex-1 w-full lg:w-[400px]">
                <CardHeader className="flex w-full">
                    <CardTitle className="">
                        {rfidData.user ? (
                            <div className="flex justify-between">
                                <div className="flex items-center">
                                    <User className="h-5 w-5 mr-2" />
                                    <span>User Information</span>
                                </div>
                                <button
                                    onClick={() => router.push(`/dashboard/students/${rfidData.user.uuid}`)}
                                    className="p-2 rounded-full hover:bg-gray-700">
                                    <ArrowRight className="h-5 w-5" />
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="flex items-center">
                                    <UserX className="h-5 w-5 mr-2" />
                                    <span>Floating RFID</span>
                                </div>
                            </>
                        )}
                    </CardTitle>

                </CardHeader>
                <CardContent>
                    {rfidData.user ? (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <p className="text-sm text-muted-foreground">Name</p>
                                <p className="font-medium">{rfidData.user.nameInFull}</p>
                                <p className="text-sm text-muted-foreground">
                                    {rfidData.user.firstName} {rfidData.user.lastName}
                                </p>
                            </div>

                            <Separator />

                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                    <p className="text-sm">{rfidData.user.email}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Phone className="h-4 w-4 text-muted-foreground" />
                                    <p className="text-sm">{rfidData.user.contactNo}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-muted-foreground" />
                                    <p className="text-sm">{rfidData.user.address}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <p className="text-sm">{rfidData.user.dob}</p>
                                </div>
                            </div>

                            <Separator />

                            <div className="flex gap-2">
                                <Badge variant={rfidData.user.accountStatus === "active" ? "default" : "destructive"} className="capitalize">
                                    {rfidData.user.accountStatus}
                                </Badge>
                                <Badge variant="outline" className="capitalize">
                                    {rfidData.user.userType}
                                </Badge>
                            </div>
                        </div>
                    ) : (
                        <Alert>
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>No user is currently assigned to this RFID tag.</AlertDescription>
                        </Alert>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
