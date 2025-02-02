import apiClient from "@/util/api-client.util";

export const getRfid = async (pageNumber: number, pageSize: number, onlyFloating: boolean = false, withUser: boolean = false) => {
    try {
        const response = await apiClient.get('/rfid', {
            params: {
                pageNumber: pageNumber,
                pageSize: pageSize,
                onlyFloating: onlyFloating,
                withUser: withUser
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

export const getRfidsByUser = async (userUuid: string) => {
    try {
        const response = await apiClient.get(`/rfid/user/${userUuid}`);
        return response.data.data;
    } catch (error) {
        console.error(error);
    }
};

export const detachRfid = async (rfidUuid: string, userUuid: string) => {
    try {
        const response = await apiClient.post(`/rfid/${rfidUuid}/unassign`);
        return response.data;
    } catch (error) {
        console.error(error);
    }
};

export const assignRfid = async (rfidUuid: string, userUuid: string) => {
    try {
        const response = await apiClient.post(`/rfid/${rfidUuid}/assign/${userUuid}`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};