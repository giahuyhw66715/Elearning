import axiosPrivate from "../config/axios";
import { ICourse } from "../types";

const getAllCourses = async () => {
    const response = await axiosPrivate.get("/courses");
    return response.data;
};

const createCourse = async (course: ICourse) => {
    const response = await axiosPrivate.post("/courses", course);
    return response.data;
};

const getCourseById = async (id: string) => {
    const response = await axiosPrivate.get(`/courses/${id}`);
    return response.data;
};

const deleteStudentFromCourse = async (courseId: string, studentId: string) => {
    const response = await axiosPrivate.delete(
        `/courses/${courseId}/students/${studentId}`
    );
    return response.data;
};

const addStudentToCourse = async (courseId: string, studentId: string) => {
    const response = await axiosPrivate.post(
        `/courses/${courseId}/students/${studentId}`
    );
    return response.data;
};

const updateCourse = async (course: ICourse) => {
    const response = await axiosPrivate.put(`/courses/${course._id}`, course);
    return response.data;
};

const deleteCourse = async (id: string) => {
    const response = await axiosPrivate.delete(`/courses/${id}`);
    return response.data;
};

export {
    getAllCourses,
    createCourse,
    getCourseById,
    deleteStudentFromCourse,
    addStudentToCourse,
    updateCourse,
    deleteCourse,
};
