// utils/apiClient.ts
import axios, {AxiosInstance} from 'axios';
import {API_URI} from "@/config/env.config";

// Create an Axios instance
const apiClient:AxiosInstance = axios.create({
    baseURL: API_URI, // Replace with your backend URL
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

export default apiClient;
