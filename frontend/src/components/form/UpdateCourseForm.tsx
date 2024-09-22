import { App, Button, Col, Flex, Form, Input, Row, Select, Upload } from "antd";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import {
    ErrorMessage,
    FileUploadResult,
    ICourse,
    IDepartment,
    IUser,
} from "../../types";
import { deleteCourse, updateCourse } from "../../api/course";
import getUploadFile from "../../utils/getUploadFile";
import getFileUrl from "../../utils/getFileUrl";
import { uploadFile } from "../../api/file";
import useUserStore from "../../store/userStore";
import { getAllUsers } from "../../api/user";
import { getAllDepartments } from "../../api/department";

type UpdateCourseFormProps = {
    course: ICourse;
};

const UpdateCourseForm = ({ course }: UpdateCourseFormProps) => {
    const [form] = Form.useForm();
    const [image, setImage] = useState<FileUploadResult>();
    const { message } = App.useApp();
    const user = useUserStore((state) => state.user);
    const isAdmin = user?.role === "admin";
    const queryClient = useQueryClient();
    const navigate = useNavigate();

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
            queryClient.invalidateQueries({
                queryKey: ["me"],
            });
            queryClient.invalidateQueries({
                queryKey: ["course", course._id],
            });
        },
        onError: (error) => {
            message.error(error.response.data.message);
        },
    });

    const deleteMutation = useMutation<void, ErrorMessage, string>({
        mutationFn: async (courseId) => {
            return await deleteCourse(courseId);
        },
        onSuccess: () => {
            message.success("Deleted course successfully");
            queryClient.invalidateQueries({
                queryKey: ["me"],
            });
            navigate("/");
        },
        onError: (error) => {
            message.error(error.response.data.message);
        },
    });
    useEffect(() => {
        if (course.image) {
            setImage({
                tempUrl: course.image,
                file: undefined,
            });
        }
    }, [course.image]);

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={() => updateMutation.mutate(form.getFieldsValue())}
            clearOnDestroy
            autoComplete="off"
            initialValues={{
                title: course.title,
                department: (course.department as IDepartment).name,
                lecturer: (course.lecturer as IUser).fullName,
            }}
        >
            <Row gutter={24} align="middle">
                <Col span={24}>
                    <Form.Item style={{ textAlign: "center" }}>
                        <Upload
                            listType="picture-card"
                            maxCount={1}
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
                </Col>
                <Col span={8}>
                    <Form.Item label="Title" name="title">
                        <Input placeholder="Title" />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item label="Department" name="department">
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
                </Col>
                <Col span={8}>
                    <Form.Item label="Lecturer" name="lecturer">
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
                </Col>
            </Row>
            <Flex justify="center" gap="middle">
                <Button
                    type="primary"
                    ghost
                    danger
                    icon={<DeleteOutlined />}
                    loading={updateMutation.isPending}
                    onClick={() => deleteMutation.mutate(course._id as string)}
                >
                    {updateMutation.isPending ? "Deleting..." : "Delete course"}
                </Button>
                <Button
                    type="primary"
                    htmlType="submit"
                    icon={<EditOutlined />}
                    loading={updateMutation.isPending}
                >
                    {updateMutation.isPending ? "Editing..." : "Edit course"}
                </Button>
            </Flex>
        </Form>
    );
};

export default UpdateCourseForm;
