import apiClient from "@/util/api-client.util";

export const getStaff = async (pageNumber: number, pageSize: number) => {
    try {
        const response = await apiClient.get('/staff', {
            params: {
                pageNumber: pageNumber,
                pageSize: pageSize,
            },
        });
        return {
            items: response.data.data.items,
            totalItemCount: response.data.data.totalItemCount,
            pageNumber: response.data.data.pageNumber,
            userUuid: response.data.data.userUuid,
        };
    } catch (error) {
        console.error(error);
    }
};

export const getStaffBySysId = async (systemId: string) => {
    try {
        const response = await apiClient.get(`/staff/${systemId}`);
        return response.data.data;
    } catch (error) {
        console.error(error);
    }
}