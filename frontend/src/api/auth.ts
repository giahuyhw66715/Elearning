import axios from "axios";
import axiosPrivate from "../config/axios";
import { IUser } from "../types";

const registerUser = async (user: IUser) => {
    const response = await axiosPrivate.post("/auth/register", user);
    return response.data;
};

const loginUser = async (username: string, password: string) => {
    const response = await axiosPrivate.post("/auth/login", {
        username,
        password,
    });
    return response.data;
};

const fetchMe = async () => {
    const response = await axiosPrivate.get("/auth/me");
    return response.data;
};

const refreshNewToken = async (refreshToken: string) => {
    const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/auth/refresh-token`,
        {
            refreshToken,
        }
    );
    return response.data;
};

export { registerUser, loginUser, fetchMe, refreshNewToken };
