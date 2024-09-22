import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { App, Button, Flex, Form, Input } from "antd";
import { ErrorMessage, IDepartment } from "../../types";
import { getDepartmentById, updateDepartment } from "../../api/department";

type UpdateDepartmentFormProps = {
    toggleOpen: () => void;
    departmentId: string | undefined;
};
const UpdateDepartmentForm = ({
    toggleOpen,
    departmentId,
}: UpdateDepartmentFormProps) => {
    const [form] = Form.useForm();
    const { message } = App.useApp();
    const queryClient = useQueryClient();

    const { data: department } = useQuery<IDepartment, ErrorMessage>({
        queryKey: ["departments", departmentId],
        queryFn: () => getDepartmentById(departmentId as string),
        enabled: !!departmentId,
    });

    const mutation = useMutation<IDepartment, ErrorMessage, IDepartment>({
        mutationFn: async (department) => {
            if (!departmentId) return;
            department._id = departmentId;
            return await updateDepartment(department);
        },
        onSuccess: () => {
            message.success("Update department successfully");
            queryClient.invalidateQueries({ queryKey: ["departments"] });
            toggleOpen();
        },
        onError: (error) => {
            message.error(error.response.data.message);
        },
    });

    if (!department) return;

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={(values) => mutation.mutate(values)}
            autoComplete="off"
            clearOnDestroy
            initialValues={{
                name: department.name,
            }}
        >
            <Form.Item
                name="name"
                label="Name"
                rules={[
                    {
                        required: true,
                        message: "Please input your name!",
                    },
                ]}
            >
                <Input placeholder="Name" />
            </Form.Item>
            <Flex justify="center" style={{ marginTop: "12px" }}>
                <Button type="primary" htmlType="submit">
                    Update department
                </Button>
            </Flex>
        </Form>
    );
};

export default UpdateDepartmentForm;
