import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { App, Button, Col, Flex, Form, Input, Row, Select } from "antd";
import { ErrorMessage, IDepartment, IUser, Role } from "../../types";
import { getAllDepartments } from "../../api/department";
import { getUserById, updateUser } from "../../api/user";

type UpdateUserFormProps = {
    toggleOpen: () => void;
    userId: string | undefined;
};
const UpdateUserForm = ({ toggleOpen, userId }: UpdateUserFormProps) => {
    const [form] = Form.useForm();
    const { message } = App.useApp();
    const queryClient = useQueryClient();

    const {
        data: departments,
        isError: isDepartmentError,
        error: departmentError,
    } = useQuery<IDepartment[], ErrorMessage>({
        queryKey: ["departments"],
        queryFn: getAllDepartments,
    });

    const {
        data: user,
        isError: isUserError,
        error: userError,
    } = useQuery<IUser, ErrorMessage>({
        queryKey: ["user", userId],
        queryFn: () => getUserById(userId as string),
        enabled: !!userId,
    });

    if (isDepartmentError || isUserError) {
        message.error(
            departmentError?.response.data.message ||
                userError?.response.data.message
        );
    }

    const mutation = useMutation<IUser, ErrorMessage, IUser>({
        mutationFn: (user) => {
            if (!user.password) {
                delete user.password;
            }
            user["_id"] = userId;
            return updateUser(user);
        },
        onSuccess: () => {
            message.success("Create user successfully");
            queryClient.invalidateQueries({ queryKey: ["users"] });
            toggleOpen();
        },
        onError: (error) => {
            message.error(error.response.data.message);
        },
    });

    if (!userId || !user) return;

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={(values) => mutation.mutate(values)}
            autoComplete="off"
            clearOnDestroy
            initialValues={{
                username: user.username,
                email: user.email,
                fullName: user.fullName,
                password: undefined,
                role: user.role,
                department: (user?.department as IDepartment)?._id,
            }}
        >
            <Row gutter={24}>
                <Col span={12}>
                    <Form.Item
                        name="username"
                        label="Username"
                        rules={[{ required: true }]}
                    >
                        <Input />
                    </Form.Item>
                </Col>

                <Col span={12}>
                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[{ required: true }]}
                    >
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item name="password" label="Password">
                        <Input.Password />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        name="fullName"
                        label="Full name"
                        rules={[{ required: true }]}
                    >
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        name="role"
                        label="Role"
                        rules={[{ required: true }]}
                    >
                        <Select
                            options={[
                                { value: Role.admin, label: "Admin" },
                                { value: Role.lecturer, label: "Lecturer" },
                                { value: Role.student, label: "Student" },
                            ]}
                        />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        name="department"
                        label="Department"
                        rules={[{ required: true }]}
                    >
                        <Select
                            options={departments?.map((department) => ({
                                value: department._id,
                                label: department.name,
                            }))}
                        />
                    </Form.Item>
                </Col>
            </Row>
            <Flex justify="center" style={{ marginTop: "12px" }}>
                <Button type="primary" htmlType="submit">
                    Update user
                </Button>
            </Flex>
        </Form>
    );
};

export default UpdateUserForm;
