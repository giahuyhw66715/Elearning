import { App, Button, Form, Input, Select, Upload } from "antd";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    ErrorMessage,
    FileUploadResult,
    ICourse,
    IDepartment,
    IUser,
    Role,
} from "../../types";
import useUserStore from "../../store/userStore";
import { getAllDepartments } from "../../api/department";
import { uploadFile } from "../../api/file";
import { getCourseById, updateCourse } from "../../api/course";
import getUploadFile from "../../utils/getUploadFile";
import { getAllUsers } from "../../api/user";
import getFileUrl from "../../utils/getFileUrl";

type UpdateCourseFormModalProps = {
    toggleOpen: () => void;
    courseId: string | undefined;
};

const UpdateCourseFormModal = ({
    toggleOpen,
    courseId,
}: UpdateCourseFormModalProps) => {
    const [form] = Form.useForm();
    const { message } = App.useApp();
    const [image, setImage] = useState<FileUploadResult>();
    const { user } = useUserStore();
    const isAdmin = user?.role === Role.admin;
    const queryClient = useQueryClient();

    const { data: course } = useQuery<ICourse, ErrorMessage>({
        queryKey: ["courses", courseId],
        queryFn: () => getCourseById(courseId as string),
        enabled: !!courseId,
    });

    const {
        data: lecturers,
        isError: isLecturerError,
        error: lecturersError,
    } = useQuery<IUser[], ErrorMessage>({
        queryKey: ["users"],
        queryFn: () => getAllUsers("lecturer"),
        enabled: isAdmin,
    });

    const {
        data: departments,
        isError: isDepartmentError,
        error: departmentError,
    } = useQuery<IDepartment[], ErrorMessage>({
        queryKey: ["departments"],
        queryFn: getAllDepartments,
        enabled: isAdmin,
    });

    if (isLecturerError || isDepartmentError) {
        message.error(
            lecturersError?.response?.data?.message ||
                departmentError?.response?.data?.message
        );
    }

    const updateMutation = useMutation<ICourse, ErrorMessage, ICourse>({
        mutationFn: async (values) => {
            if (!course) return;
            const uploadedImage =
                image?.tempUrl !== course.image && image?.file
                    ? await uploadFile(image?.file)
                    : undefined;
            const updatedCourse: ICourse = {
                _id: course._id,
                title: values.title,
                image: uploadedImage,
                department: isAdmin
                    ? values.department
                    : ((course.department as IDepartment)._id as string),
                lecturer: isAdmin
                    ? values.lecturer
                    : ((course.lecturer as IUser)._id as string),
            };
            return await updateCourse(updatedCourse);
        },
        onSuccess: () => {
            message.success("Updated course successfully");
            toggleOpen();
            queryClient.invalidateQueries({
                queryKey: ["courses"],
            });
        },
        onError: (error) => {
            message.error(error.response.data.message);
        },
    });

    useEffect(() => {
        if (course?.image) {
            setImage({
                tempUrl: course.image,
                file: undefined,
            });
        }
    }, [course?.image]);

    if (!course) return;
    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={() => updateMutation.mutate(form.getFieldsValue())}
            clearOnDestroy
            autoComplete="off"
            initialValues={{
                title: course.title,
                department: (course.department as IDepartment)._id,
                lecturer: (course.lecturer as IUser)._id,
            }}
        >
            <Form.Item style={{ textAlign: "center" }}>
                <Upload
                    name="attachment"
                    maxCount={1}
                    listType="picture-card"
                    className="avatar-uploader"
                    showUploadList={false}
                    beforeUpload={() => false}
                    onChange={(e) => setImage(getUploadFile(e))}
                >
                    <img
                        src={
                            image?.tempUrl
                                ? getFileUrl(image?.tempUrl)
                                : "/avatar.svg"
                        }
                        alt="course image"
                        style={{ height: "100%" }}
                    />
                </Upload>
            </Form.Item>

            <Form.Item
                label="Title"
                name="title"
                rules={[
                    { required: true, message: "Please input your title!" },
                ]}
            >
                <Input placeholder="Title" />
            </Form.Item>

            <Form.Item
                label="Lecturer"
                name="lecturer"
                rules={[
                    {
                        required: true,
                        message: "Please select your lecturer!",
                    },
                ]}
            >
                <Select
                    showSearch
                    placeholder="Lecturer"
                    disabled={!isAdmin}
                    options={lecturers?.map((lecturer) => ({
                        value: lecturer._id,
                        label: lecturer.fullName,
                    }))}
                />
            </Form.Item>

            <Form.Item
                label="Department"
                name="department"
                rules={[
                    {
                        required: true,
                        message: "Please select your department!",
                    },
                ]}
            >
                <Select
                    showSearch
                    placeholder="Department"
                    disabled={!isAdmin}
                    options={departments?.map((department) => ({
                        value: department._id,
                        label: department.name,
                    }))}
                />
            </Form.Item>

            <Button
                type="primary"
                block
                htmlType="submit"
                loading={updateMutation.isPending}
                style={{ marginTop: "10px" }}
            >
                {updateMutation.isPending ? "Editing..." : "Edit course"}
            </Button>
        </Form>
    );
};

export default UpdateCourseFormModal;
