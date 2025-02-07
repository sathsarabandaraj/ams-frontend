import apiClient from "@/util/api-client.util";

interface DashboardStats {
    totalStudents: number;
    totalStaff: number;
    totalRfids: number;
    todayAttendance: number;
    avgCheckInTime: string;
}

export const getDashboardStats = async (): Promise<DashboardStats> => {
    try {
        const response = await apiClient.get('/dashboard/stats');
        return response.data.data;
    } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
        throw error;
    }
}; 