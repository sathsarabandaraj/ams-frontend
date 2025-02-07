'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen, Calendar, Clock, HardDrive } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getDashboardStats } from "@/service/dashboard.service";

interface DashboardStats {
    totalStudents: number;
    totalStaff: number;
    totalRfids: number;
    todayAttendance: number;
    avgCheckInTime: string;
}

export default function DashboardPage() {
    const router = useRouter();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await getDashboardStats();
                setStats(data);
            } catch (error) {
                console.error('Failed to fetch dashboard stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const statCards = [
        {
            title: "Total Students",
            value: stats?.totalStudents.toLocaleString() ?? '-',
            icon: Users,
            description: "Active students in the system",
            link: "/dashboard/students"
        },
        {
            title: "Total Staff",
            value: stats?.totalStaff.toLocaleString() ?? '-',
            icon: BookOpen,
            description: "Teaching and non-teaching staff",
            link: "/dashboard/staff"
        },
        {
            title: "Today's Attendance",
            value: stats?.todayAttendance.toLocaleString() ?? '-',
            icon: Calendar,
            description: "Students present today",
            link: "/dashboard/attendance"
        },
        {
            title: "Average Check-in",
            value: stats?.avgCheckInTime ?? '-',
            icon: Clock,
            description: "Today's average check-in time",
            link: "/dashboard/attendance/report"
        },
        {
            title: "Total RFIDs",
            value: stats?.totalRfids.toLocaleString() ?? '-',
            icon: HardDrive,
            description: "Active RFID cards in system",
            link: "/dashboard/rfid"
        }
    ];

    const quickLinks = [
        {
            title: "RFID Management",
            description: "Manage RFID cards and assignments",
            link: "/dashboard/rfid"
        },
        {
            title: "Access Modules",
            description: "Configure access control modules",
            link: "/dashboard/access-modules"
        },
        {
            title: "Attendance Report",
            description: "View detailed attendance reports",
            link: "/dashboard/attendance/report"
        }
    ];

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                <p className="text-muted-foreground">
                    Overview of your attendance management system
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {statCards.map((stat) => (
                    <Card
                        key={stat.title}
                        className={`hover:bg-accent/50 cursor-pointer transition-colors ${loading ? 'animate-pulse' : ''
                            }`}
                        onClick={() => router.push(stat.link)}
                    >
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">
                                {stat.title}
                            </CardTitle>
                            <stat.icon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <p className="text-xs text-muted-foreground">
                                {stat.description}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Quick Links */}
            <div className="mt-8">
                <h3 className="text-lg font-medium mb-4">Quick Links</h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {quickLinks.map((link) => (
                        <Card key={link.title} className="hover:bg-accent/50">
                            <Link href={link.link}>
                                <CardHeader>
                                    <CardTitle className="text-md">{link.title}</CardTitle>
                                    <p className="text-sm text-muted-foreground">
                                        {link.description}
                                    </p>
                                </CardHeader>
                            </Link>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex gap-4">
                <Button
                    variant="default"
                    onClick={() => router.push('/dashboard/students/new')}
                >
                    Add New Student
                </Button>
                <Button
                    variant="default"
                    onClick={() => router.push('/dashboard/staff/new')}
                >
                    Add New Staff
                </Button>
            </div>
        </div>
    );
}
