import apiClient, { type AuthRequestConfig } from "@/config/ApiClient"
import type LoginData from "@/models/LoginData";
import type LoginResponseData from "@/models/LoginResponseData";
import type RegisterData from "@/models/RegisterData"
import type User from "@/models/User";

export const registerUser= async (signupData: RegisterData) => {
    // api call to server to save data
    const response =  await apiClient.post('/auth/register', signupData);
    return response.data;
}

// login
export const loginUser= async (loginData:LoginData): Promise<LoginResponseData> => {
   const response =  await apiClient.post<LoginResponseData>('/auth/login', loginData)
   return response.data;
}

export const logoutUser = async (): Promise<void> => {
    await apiClient.post('/auth/logout', undefined, {
        skipAuthRefresh: true,
        skipAuthHeader: true,
    } as AuthRequestConfig)
}

// get current login user
export const getCurrentUser= async(emailId: string|undefined)=>{
    const response = await apiClient.get<User>(`/users/email/${emailId}`)
    return response.data;
}

// refresh token
export const refreshToken = async(): Promise<LoginResponseData> => {
    const response= await apiClient.post<LoginResponseData>(`/auth/refresh`, undefined, {
        skipAuthRefresh: true,
        skipAuthHeader: true,
    } as AuthRequestConfig)
    return response.data;
}
// apis
