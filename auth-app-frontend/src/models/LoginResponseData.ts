import type User from "./User";

export default interface LoginResponseData{
    accessToken: string;
    userdto: User;
    refreshToken: string;
    expiresIn: number;
}