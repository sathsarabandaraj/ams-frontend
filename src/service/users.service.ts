import { Staff } from "@/types/staff";
import { Student } from "@/types/student";
import apiClient from "@/util/api-client.util";
import { DeepPartial } from "react-hook-form";

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
        if (error.response?.status === 404) {
            return null;
        }
        throw error;
    }
};

export const getStaffByUuid = async (uuid: string) => {
    try {
        const response = await apiClient.get(`/staff/${uuid}`);
        return response.data.data;
    } catch (error) {
        if (error.response?.status === 404) {
            return null;
        }
        throw error;
    }
}

export const updateStaff = async (uuid: string, updatedData: DeepPartial<Staff>) => {
    try {
        const response = await apiClient.put(`/staff/${uuid}`, { 'user': updatedData });
        return response.data;
    } catch (error) {
        if (error.response?.status === 404) {
            return null;
        }
        throw error;
    }
}

export const deleteStaff = async (uuid: string) => {
    try {
        const response = await apiClient.delete(`/staff/${uuid}`);
        return response.data;
    } catch (error) {
        if (error.response?.status === 404) {
            return null;
        }
        throw error;
    }
}

export const getStudents = async (pageNumber: number, pageSize: number) => {
    try {
        const response = await apiClient.get('/student', {
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
        if (error.response?.status === 404) {
            return null;
        }
        throw error;
    }
}

export const getStudentByUuid = async (uuid: string) => {
    try {
        const response = await apiClient.get(`/student/${uuid}`);
        return response.data.data;
    } catch (error) {
        if (error.response?.status === 404) {
            return null;
        }
        throw error;
    }
}

export const updateStudent = async (uuid: string, updatedData: DeepPartial<Student>) => {
    try {
        const response = await apiClient.put(`/student/${uuid}`, { 'user': updatedData });
        return response.data;
    } catch (error) {
        if (error.response?.status === 404) {
            return null;
        }
        throw error;
    }
};

export const deleteStudent = async (uuid: string) => {
    try {
        const response = await apiClient.delete(`/student/${uuid}`);
        return response.data;
    } catch (error) {
        if (error.response?.status === 404) {
            return null;
        }
        throw error;
    }
}

export const createStaff = async (staffData: any) => {
    try {
        const response = await apiClient.post('/staff', { user: staffData });
        return response.data.data;
    } catch (error) {
        if (error.response?.status === 404) {
            return null;
        }
        throw error;
    }
};

export const createStudent = async (studentData: any) => {
    try {
        const response = await apiClient.post('/student', { user: studentData });
        return response.data.data;
    } catch (error) {
        if (error.response?.status === 404) {
            return null;
        }
        throw error;
    }
};