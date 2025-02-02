import apiClient from "@/util/api-client.util";

export const getRfid = async (pageNumber: number, pageSize: number, isFloating: boolean = false) => {
    try {
        const response = await apiClient.get('/rfid', {
            params: {
                pageNumber: pageNumber,
                pageSize: pageSize,
                isFloating: isFloating
            },
        });
        return {
            items: response.data.data.items,
            totalItemCount: response.data.data.totalItemCount,
            pageNumber: response.data.data.pageNumber,
        };
    } catch (error) {
        console.error(error);
    }
};

export const getRfidByUuid = async (uuid: string) => {
    try {
        const response = await apiClient.get(`/rfid/uuid/${uuid}`);
        return response.data.data;
    } catch (error) {
        console.error(error);
    }
}

export const getRfidByTag = async (tag: string) => {
    try {
        const response = await apiClient.get(`/rfid/tag/${tag}`);
        return response.data.data;
    } catch (error) {
        console.error(error);
    }
}