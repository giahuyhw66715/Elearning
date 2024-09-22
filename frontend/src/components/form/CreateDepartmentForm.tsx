import { useMutation, useQueryClient } from "@tanstack/react-query";
import { App, Button, Flex, Form, Input } from "antd";
import { ErrorMessage, IDepartment } from "../../types";
import { createDepartment } from "../../api/department";

type CreateDepartmentFormProps = {
    toggleOpen: () => void;
};
const CreateDepartmentForm = ({ toggleOpen }: CreateDepartmentFormProps) => {
    const [form] = Form.useForm();
    const { message } = App.useApp();
    const queryClient = useQueryClient();

    const mutation = useMutation<IDepartment, ErrorMessage, IDepartment>({
        mutationFn: async (department) => {
            return await createDepartment(department);
        },
        onSuccess: () => {
            message.success("Create department successfully");
            queryClient.invalidateQueries({ queryKey: ["departments"] });
            toggleOpen();
        },
        onError: (error) => {
            message.error(error.response.data.message);
        },
    });

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={(values) => mutation.mutate(values)}
            autoComplete="off"
            clearOnDestroy
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
                    Create new department
                </Button>
            </Flex>
        </Form>
    );
};

export default CreateDepartmentForm;
