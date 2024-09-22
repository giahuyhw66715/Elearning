import axios from "axios";
import { getTokens } from "../utils/cookie";
import { refreshNewToken } from "../api/auth";

const axiosPrivate = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

axiosPrivate.interceptors.request.use((config) => {
    const { accessToken } = getTokens();
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
});

axiosPrivate.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const { refreshToken } = getTokens();
                if (!refreshToken) {
                    console.log("No token");
                    window.location.href = "/sign-in";
                    return Promise.reject(error);
                }
                const { accessToken } = await refreshNewToken(refreshToken);
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return axiosPrivate(originalRequest);
            } catch (error) {
                console.log(error);
                window.location.href = "/sign-in";
                return Promise.reject(error);
            }
        }
    }
);

export default axiosPrivate;
