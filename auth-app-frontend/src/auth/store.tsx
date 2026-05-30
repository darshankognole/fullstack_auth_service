import type LoginData from "@/models/LoginData";
import type LoginResponseData from "@/models/LoginResponseData";
import type User from "@/models/User";
import { loginUser, logoutUser } from "@/services/AuthService";
import {create} from "zustand";
import {persist} from 'zustand/middleware';

const LOCAL_KEY = "app_state";

// type AuthStatus= "idle"| "authentication" | "authenticated" | "anonymous";

type AuthState ={
    accessToken:string | null,
    user: User | null,
    authStatus: boolean;
    authLoading: boolean;
    isLoggingOut: boolean;

    login:(loginData: LoginData) => Promise<LoginResponseData>;
    logout:(silent?: boolean) => void;
    checkLogin:() => boolean;

    changeLocalLoginData:(accessToken:string, user:User,authStatus:boolean, authLoading:boolean) => void;
    clearAuthState:() => void;
};


const useAuth = create<AuthState>()(persist( (set, get) => ({
    accessToken: null,
    user: null,
    authStatus: false,
    authLoading: false,
    isLoggingOut: false,

    login: async(loginData) => {
        console.log("started login ...");
        set({authLoading: true})

        try{
            const loginResponseData = await loginUser(loginData);
            console.log(loginResponseData);
            set({
                accessToken: loginResponseData.accessToken,
                user: loginResponseData.userdto,
                authStatus: true,
                isLoggingOut: false,
            });
            return loginResponseData;
        } catch(error) {
            console.log(error);
            throw error;
        }
        finally{
            set({
                authLoading: false
            })
        }
    },
    logout: (silent= false) => {
        set({
            isLoggingOut: true,
        });

        get().clearAuthState();

        if (silent) {
            set({ isLoggingOut: false });
            return;
        }

        void logoutUser()
            .catch((error) => {
                console.log("logout request failed", error);
            })
            .finally(() => {
                set({
                    isLoggingOut: false,
                });
            });
    },

    checkLogin: ()=> {
        return Boolean(get().accessToken && get().authStatus && !get().isLoggingOut);
    },

    changeLocalLoginData:(accessToken,user,authStatus, authLoading) => {
        set({
            accessToken,
            user,
            authStatus,
            authLoading,
            isLoggingOut: false,
        })
    },
    clearAuthState:() => {
        set({
            accessToken: null,
            user: null,
            authLoading: false,
            authStatus: false,
        });

        if (typeof window !== "undefined") {
            window.localStorage.removeItem(LOCAL_KEY);
        }
    }
}),
 {
    name: LOCAL_KEY
    }))

export default useAuth;
