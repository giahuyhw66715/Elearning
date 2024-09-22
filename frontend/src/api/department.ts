import axiosPrivate from "../config/axios";
import { IDepartment } from "../types";

const getAllDepartments = async () => {
    const response = await axiosPrivate.get("/departments");
    return response.data;
};

const getDepartmentById = async (id: string) => {
    const response = await axiosPrivate.get(`/departments/${id}`);
    return response.data;
};

const deleteDepartment = async (id: string) => {
    const response = await axiosPrivate.delete(`/departments/${id}`);
    return response.data;
};

const createDepartment = async (department: IDepartment) => {
    const response = await axiosPrivate.post("/departments", department);
    return response.data;
};

const updateDepartment = async (department: IDepartment) => {
    const response = await axiosPrivate.put(
        `/departments/${department._id}`,
        department
    );
    return response.data;
};

export {
    getAllDepartments,
    getDepartmentById,
    deleteDepartment,
    createDepartment,
    updateDepartment,
};
