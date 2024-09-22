import { App, Button, Col, Flex, Form, Input, Row, Upload } from "antd";
import useUserStore from "../store/userStore";
import { ErrorMessage, FileUploadResult, IDepartment, IUser } from "../types";
import getFileUrl from "../utils/getFileUrl";
import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUser } from "../api/user";
import getUploadFile from "../utils/getUploadFile";
import { uploadFile } from "../api/file";

interface IProfileForm extends IUser {
    confirmPassword: string;
}

const ProfilePage = () => {
    const user = useUserStore((state) => state.user);
    const [avatar, setAvatar] = useState<FileUploadResult>();
    const { message } = App.useApp();
    useEffect(() => {
        if (user?.avatar) {
            setAvatar({
                tempUrl: user.avatar,
                file: undefined,
            });
        }
    }, [user?.avatar]);
    const [form] = Form.useForm();
    const queryClient = useQueryClient();
    const mutate = useMutation<IUser, ErrorMessage, IProfileForm>({
        mutationFn: async (values) => {
            if (values.password !== values.confirmPassword) {
                return Promise.reject(new Error("Passwords do not match"));
            }

            if (!user) return;
            const uploadedAvatar =
                avatar?.file && user?.avatar !== avatar?.file?.name
                    ? await uploadFile(avatar?.file)
                    : undefined;

            const updatedUser: IUser = {
                _id: user?._id,
                username: values.username,
                fullName: values.fullName,
                email: values.email,
                avatar: uploadedAvatar,
                department: values.department,
                role: user.role,
                ...(values.password && { password: values.password }),
            };
            return updateUser(updatedUser);
        },
        onSuccess: () => {
            message.success("Updated profile successfully");
            queryClient.invalidateQueries({
                queryKey: ["me"],
            });
        },
        onError: (error) => {
            console.log(error);
            message.error(error.response.data.message);
        },
    });
    if (!user) return;
    console.log(user);
    return (
        <Form
            layout="vertical"
            initialValues={{
                avatar: user.avatar,
                username: user.username,
                email: user.email,
                fullName: user.fullName,
                department: (user.department as IDepartment)?.name,
                password: "",
                confirmPassword: "",
            }}
            form={form}
            onFinish={(values) => mutate.mutate(form.getFieldsValue(values))}
        >
            <Row gutter={24} align="middle">
                <Col span={24}>
                    <Form.Item style={{ textAlign: "center" }}>
                        <Upload
                            listType="picture-circle"
                            className="avatar-uploader"
                            maxCount={1}
                            showUploadList={false}
                            beforeUpload={() => false}
                            onChange={(e) => setAvatar(getUploadFile(e))}
                        >
                            <img
                                src={
                                    avatar?.tempUrl
                                        ? getFileUrl(avatar?.tempUrl)
                                        : "/avatar.svg"
                                }
                                alt="avatar"
                                style={{ height: "100%", borderRadius: "50%" }}
                            />
                        </Upload>
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label="Username" name="username">
                        <Input placeholder="Username" disabled />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label="Email" name="email">
                        <Input placeholder="Email" disabled />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label="Full name" name="fullName">
                        <Input placeholder="Full name" />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label="Department" name="department">
                        <Input placeholder="Department" disabled />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label="New password" name="password">
                        <Input.Password placeholder="New password" />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label="Confirm password" name="confirmPassword">
                        <Input.Password placeholder="Confirm new password" />
                    </Form.Item>
                </Col>
            </Row>
            <Flex justify="center">
                <Button
                    type="primary"
                    htmlType="submit"
                    loading={mutate.isPending}
                >
                    {mutate.isPending ? "Updating..." : "Update profile"}
                </Button>
            </Flex>
        </Form>
    );
};

export default ProfilePage;
