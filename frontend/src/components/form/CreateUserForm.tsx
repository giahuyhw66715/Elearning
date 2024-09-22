import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { App, Button, Col, Flex, Form, Input, Row, Select } from "antd";
import { ErrorMessage, IDepartment, IUser, Role } from "../../types";
import { getAllDepartments } from "../../api/department";
import { registerUser } from "../../api/auth";

type CreateUserFormProps = {
    toggleOpen: () => void;
};
const CreateUserForm = ({ toggleOpen }: CreateUserFormProps) => {
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

    if (isDepartmentError) {
        message.error(departmentError?.response?.data?.message);
    }

    const mutation = useMutation<IUser, ErrorMessage, IUser>({
        mutationFn: (user) => {
            return registerUser(user);
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

    if (!departments) return;

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={(values) => mutation.mutate(values)}
            autoComplete="off"
            clearOnDestroy
            initialValues={{
                role: Role.student,
                department: departments?.[0]?._id,
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
                    <Form.Item
                        name="password"
                        label="Password"
                        rules={[{ required: true }]}
                    >
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
                    Create new user
                </Button>
            </Flex>
        </Form>
    );
};

export default CreateUserForm;
