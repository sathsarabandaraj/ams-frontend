import apiClient from "@/util/api-client.util";

export const login = async (systemId: string, password: string) => {
    try {
        const response = await apiClient.post('/auth/login', { systemId, password });
        console.log('Raw API response:', response); // Debug the full response

        // Check if we have a response and data
        if (!response || !response.data) {
            throw new Error('No response from server');
        }

        // Log the actual response data
        console.log('Response data:', response.data);

        // Return the full response data even if no token
        return response.data;
    } catch (error) {
        // Log the full error
        console.error('Login error details:', {
            error,
            response: error.response?.data,
            status: error.response?.status
        });
        throw error;
    }
};

export const logout = async () => {
    try {
        await apiClient.post('/auth/logout');
    } catch (error) {
        console.error('Logout failed:', error);
    }
};

export const getCurrentUser = async () => {
    try {
        const response = await apiClient.get('/auth/me');
        return response.data;
    } catch (error) {
        console.error('Failed to get current user:', error);
        return null;
    }
};

export const otpVerification = async (systemId: string, otp: string) => {
    try {
        const response = await apiClient.post('/auth/verify', { systemId, otp });
        return response.data;
    } catch (error) {
        console.error('OTP verification failed:', error);
        throw error;
    }
};

export const requestPasswordReset = async (systemId: string) => {
    try {
        const response = await apiClient.post('/auth/forgot-password', { systemId });
        return response.data;
    } catch (error) {
        console.error('Password reset request failed:', error);
        throw error;
    }
}

export const resetPassword = async (systemId:string,  otp: string, newPassword: string) => {
    try {
        const response = await apiClient.post('/auth/reset-password', {systemId, otp, newPassword });
        return response.data;
    } catch (error) {
        console.error('Password reset failed:', error);
        throw error;
    }
}