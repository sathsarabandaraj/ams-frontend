import apiClient from "@/util/api-client.util";

export const getAttendance = async (
    pageNumber: number,
    pageSize: number,
    startDate?: Date,
    endDate?: Date
) => {
    try {
        const response = await apiClient.get('/attendance', {
            params: {
                pageNumber,
                pageSize,
                startDate: startDate?.toISOString(),
                endDate: endDate?.toISOString(),
            },
        });
        return {
            items: response.data.data.items,
            totalItemCount: response.data.data.totalItemCount,
            pageNumber: response.data.data.pageNumber,
        };
    } catch (error) {
        throw error;
    }
}; 