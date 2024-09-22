import { PlusOutlined } from "@ant-design/icons";
import { App, Button, Form, Input, Select, Upload } from "antd";
import { useState } from "react";
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
import { getRandomImage, uploadFile } from "../../api/file";
import { createCourse } from "../../api/course";
import getUploadFile from "../../utils/getUploadFile";
import { getAllUsers } from "../../api/user";

const CreateCourseForm = ({ toggleOpen }: { toggleOpen: () => void }) => {
    const [form] = Form.useForm();
    const { message } = App.useApp();
    const [image, setImage] = useState<FileUploadResult>();
    const { user } = useUserStore();
    const isAdmin = user?.role === Role.admin;
    const queryClient = useQueryClient();

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

    const mutation = useMutation<ICourse, ErrorMessage, ICourse>({
        mutationFn: async (values) => {
            const uploadedImage = image?.file
                ? await uploadFile(image?.file)
                : await getRandomImage();

            const course: ICourse = {
                title: values.title,
                image: uploadedImage,
                department: isAdmin
                    ? values.department
                    : ((user?.department as IDepartment)._id as string),
                lecturer: isAdmin ? values.lecturer : (user?._id as string),
            };

            return createCourse(course);
        },

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["courses"] });
            queryClient.invalidateQueries({ queryKey: ["me"] });
            message.success("Course created successfully");
            toggleOpen();
            setImage(undefined);
            form.resetFields();
        },

        onError: (error) => {
            message.error(error.response.data.message);
        },
    });

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={() => mutation.mutate(form.getFieldsValue())}
            clearOnDestroy
            autoComplete="off"
            initialValues={{
                ["department"]: !isAdmin
                    ? (user?.department as IDepartment)?.name
                    : undefined,
                ["lecturer"]: !isAdmin ? user?.fullName : undefined,
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
                    {image?.tempUrl ? (
                        <img
                            src={image.tempUrl}
                            alt="avatar"
                            style={{ height: "100%" }}
                        />
                    ) : (
                        <button className="upload-btn" type="button">
                            <PlusOutlined />
                            Upload
                        </button>
                    )}
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
                loading={mutation.isPending}
                style={{ marginTop: "10px" }}
            >
                {mutation.isPending ? "Creating..." : "Create"}
            </Button>
        </Form>
    );
};

export default CreateCourseForm;
