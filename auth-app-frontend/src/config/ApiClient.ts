import useAuth from '@/auth/store';
import { refreshToken } from '@/services/AuthService';
import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';

export type AuthRequestConfig = InternalAxiosRequestConfig & {
    _retry?: boolean;
    skipAuthRefresh?: boolean;
    skipAuthHeader?: boolean;
};

const apiClient= axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8083/api/v1",
    headers:{
        "Content-Type": "application/json"
    },
    withCredentials:true,
    timeout:10000,
});

apiClient.interceptors.request.use((config) => {
    const requestConfig = config as AuthRequestConfig;
    const accessToken = useAuth.getState().accessToken;

    if(accessToken && !requestConfig.skipAuthHeader){
        requestConfig.headers.Authorization = `Bearer ${accessToken}`;
    }
    
    return requestConfig;
});

let refreshPromise: Promise<string> | null = null;

function isAuthBypassRequest(url: string): boolean {
    return [
        "/auth/login",
        "/auth/register",
        "/auth/refresh",
        "/auth/logout",
    ].some((path) => url.includes(path));
}

// RESPONSE INTERCEPTORS
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const axiosError = error as AxiosError;
        const original = (axiosError.config ?? {}) as AuthRequestConfig;
        const status = axiosError.response?.status;
        const requestUrl = original.url ?? "";
        const shouldBypassRefresh = isAuthBypassRequest(requestUrl);
        const isLoggingOut = useAuth.getState().isLoggingOut;

        if (status !== 401 || original._retry || original.skipAuthRefresh || shouldBypassRefresh || isLoggingOut) {
            return Promise.reject(error);
        }

        original._retry = true;

        if (!refreshPromise) {
            refreshPromise = refreshToken()
                .then((loginResponse) => {
                    const newToken = loginResponse.accessToken;

                    if (!newToken) {
                        throw new Error("No access token received from refresh endpoint");
                    }

                    useAuth.getState().changeLocalLoginData(
                        loginResponse.accessToken,
                        loginResponse.userdto,
                        true,
                        false
                    );

                    return newToken;
                })
                .finally(() => {
                    refreshPromise = null;
                });
        }

        try {
            const newToken = await refreshPromise;
            original.headers = original.headers ?? {};
            original.headers.Authorization = `Bearer ${newToken}`;
            return apiClient(original);
        } catch (refreshError) {
            useAuth.getState().logout(true);
            return Promise.reject(refreshError);
        }
    }
);



export default apiClient;
