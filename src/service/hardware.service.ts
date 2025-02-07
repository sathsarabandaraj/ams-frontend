import apiClient from "@/util/api-client.util";

export const getAccessModules = async (pageNumber: number, pageSize: number) => {
    try {
        const response = await apiClient.get('/hardware/access-modules', {
            params: {
                pageNumber,
                pageSize,
            },
        });
        return {
            items: response.data.data.items,
            totalItemCount: response.data.data.totalItemCount,
            pageNumber: response.data.data.pageNumber,
        };
    } catch (error) {
        if (error.response?.status === 404) {
            return null;
        }
        throw error;
    }
}; 