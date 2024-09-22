import axiosPrivate from "../config/axios";
import { IUser } from "../types";

const getAllUsers = async (role?: string) => {
    const response = await axiosPrivate.get(
        `/users${role ? `?role=${role}` : ""}`
    );
    return response.data;
};

const getUserById = async (id: string) => {
    const response = await axiosPrivate.get(`/users/${id}`);
    return response.data;
};

const searchUserByUsername = async (username: string) => {
    const response = await axiosPrivate.get(
        `/users/search?username=${username}`
    );
    return response.data;
};

const updateUser = async (user: IUser) => {
    const response = await axiosPrivate.put(`/users/${user._id}`, user);
    return response.data;
};

const deleteUser = async (id: string) => {
    const response = await axiosPrivate.delete(`/users/${id}`);
    return response.data;
};

export {
    getAllUsers,
    getUserById,
    searchUserByUsername,
    updateUser,
    deleteUser,
};
