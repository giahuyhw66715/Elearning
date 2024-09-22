import axiosPrivate from "../config/axios";
import { ISubmission } from "../types";

const createSubmission = async (submission: ISubmission) => {
    const response = await axiosPrivate.post("/submissions", submission);
    return response.data;
};

const updateSubmission = async (submission: ISubmission) => {
    const response = await axiosPrivate.put(
        `/submissions/${submission._id}`,
        submission
    );
    return response.data;
};

const deleteSubmission = async (id: string) => {
    const response = await axiosPrivate.delete(`/submissions/${id}`);
    return response.data;
};

export { createSubmission, deleteSubmission, updateSubmission };
