import apiClient from "@/util/api-client.util";

export const getRfid = async (pageNumber: number, pageSize: number, onlyFloating: boolean = false) => {
    try {
        const response = await apiClient.get('/rfid', {
            params: {
                pageNumber: pageNumber,
                pageSize: pageSize,
                onlyFloating: onlyFloating,
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

export const getRfidByUuid = async (uuid: string) => {
    try {
        const response = await apiClient.get(`/rfid/uuid/${uuid}`);
        return response.data.data;
    } catch (error) {
        if (error.response?.status === 404) {
            return null;
        }
        throw error;
    }
}

export const getRfidByTag = async (tag: string) => {
    try {
        const response = await apiClient.get(`/rfid/tag/${tag}`);
        return response.data.data;
    } catch (error) {
        if (error.response?.status === 404) {
            return null;
        }
        throw error;
    }
}

export const getRfidsByUser = async (userUuid: string) => {
    try {
        const response = await apiClient.get(`/rfid/user/${userUuid}`);
        return response.data.data;
    } catch (error) {
        if (error.response?.status === 404) {
            return [];
        }
        throw error;
    }
};

export const detachRfid = async (rfidUuid: string, userUuid: string) => {
    try {
        const response = await apiClient.post(`/rfid/${rfidUuid}/unassign`);
        return response.data;
    } catch (error) {
        if (error.response?.status === 404) {
            return null;
        }
        throw error;
    }
};

export const assignRfid = async (rfidUuid: string, userUuid: string) => {
    try {
        const response = await apiClient.post(`/rfid/${rfidUuid}/assign/${userUuid}`);
        return response.data;
    } catch (error) {
        if (error.response?.status === 404) {
            return null;
        }
        throw error;
    }
};