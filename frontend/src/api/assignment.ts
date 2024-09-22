import axiosPrivate from "../config/axios";
import { IAssignment } from "../types";

const createAssignment = async (assignment: IAssignment) => {
    const response = await axiosPrivate.post("/assignments", assignment);
    return response.data;
};

const getAssignmentById = async (id: string) => {
    const response = await axiosPrivate.get(`/assignments/${id}`);
    return response.data;
};

const updateAssignment = async (assignment: IAssignment) => {
    const response = await axiosPrivate.put(
        `/assignments/${assignment._id}`,
        assignment
    );
    return response.data;
};

const deleteAssignment = async (id: string) => {
    const response = await axiosPrivate.delete(`/assignments/${id}`);
    return response.data;
};

export {
    createAssignment,
    getAssignmentById,
    updateAssignment,
    deleteAssignment,
};
