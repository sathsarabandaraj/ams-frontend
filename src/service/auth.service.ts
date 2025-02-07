import apiClient from "@/util/api-client.util";

export const login = async (systemId: string, password: string) => {
    try {
        const response = await apiClient.post('/auth/login', { systemId, password });
        console.log(response);
        return response.data; // { message, token }
    } catch (error) {
        console.error(error);
        if (error instanceof Error) {
            // throw resonse.data?.message || 'Something went wrong!';
        }
    }
};

export const otpVerification = async (systemId: string, otp: string): Promise<void> => {
    try {
        const response = await apiClient.post('/auth/verify', { systemId, otp });
        console.log(response);
    } catch (error) {
        console.error(error);
    }
}