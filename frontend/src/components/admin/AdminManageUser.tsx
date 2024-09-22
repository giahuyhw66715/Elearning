import {
    App,
    Button,
    Flex,
    Modal,
    Space,
    Table,
    TableColumnsType,
    Typography,
} from "antd";
import { ErrorMessage, IDepartment, IUser, Role } from "../../types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteUser, getAllUsers } from "../../api/user";
import {
    DeleteOutlined,
    EditOutlined,
    PlusCircleOutlined,
} from "@ant-design/icons";
import useToggle from "../../hooks/useToggle";
import CreateUserForm from "../form/CreateUserForm";
import UpdateUserForm from "../form/UpdateUserForm";
import { useState } from "react";

const { Title } = Typography;

const AdminManageUser = () => {
    const { message } = App.useApp();
    const [userId, setUserId] = useState<string>();
    const { isOpen: isCreateOpen, toggleOpen: toggleCreateOpen } = useToggle();
    const { isOpen: isUpdateOpen, toggleOpen: toggleUpdateOpen } = useToggle();
    const queryClient = useQueryClient();

    const { data, isError, error } = useQuery<IUser[], ErrorMessage>({
        queryKey: ["users"],
        queryFn: async () => {
            return await getAllUsers();
        },
    });

    const deleteMutation = useMutation<void, ErrorMessage, string>({
        mutationFn: (id: string) => {
            return deleteUser(id);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
            message.success("Delete user successfully");
        },
        onError: (error) => {
            message.error(error.response.data.message);
        },
    });

    const columns: TableColumnsType<IUser> = [
        {
            title: "ID",
            dataIndex: "_id",
        },
        {
            title: "Username",
            dataIndex: "username",
        },
        {
            title: "Email",
            dataIndex: "email",
        },
        {
            title: "Full name",
            dataIndex: "fullName",
        },
        {
            title: "Department",
            dataIndex: "department",
        },
        {
            title: "Role",
            dataIndex: "role",
            sorter: (a, b) => a.role.length - b.role.length,
            onFilter: (value, record) =>
                record.role.indexOf(value as string) === 0,
            filters: [
                {
                    text: "Student",
                    value: Role.student,
                },
                {
                    text: "Lecturer",
                    value: Role.lecturer,
                },
                {
                    text: "Admin",
                    value: Role.admin,
                },
            ],
        },
        {
            title: "Action",
            key: "action",
            render: (_, record) => (
                <Space size="middle">
                    <EditOutlined
                        onClick={() => {
                            toggleUpdateOpen();
                            setUserId(record._id);
                        }}
                    />
                    <DeleteOutlined
                        onClick={() =>
                            deleteMutation.mutate(record._id as string)
                        }
                    />
                </Space>
            ),
        },
    ];

    if (isError) message.error(error.response.data.message);
    if (!data) return;

    return (
        <div>
            <Flex
                style={{ marginBottom: 20 }}
                align="center"
                justify="space-between"
            >
                <Title style={{ marginBottom: 0 }} level={3}>
                    Manage user
                </Title>
                <Button
                    type="primary"
                    icon={<PlusCircleOutlined />}
                    iconPosition="end"
                    onClick={toggleCreateOpen}
                >
                    Create new user
                </Button>
                <Modal
                    title={
                        <Title
                            level={3}
                            style={{
                                textAlign: "center",
                            }}
                        >
                            Create new user
                        </Title>
                    }
                    closeIcon={false}
                    open={isCreateOpen}
                    onCancel={toggleCreateOpen}
                    centered
                    footer={null}
                    width={800}
                    destroyOnClose
                >
                    <CreateUserForm toggleOpen={toggleCreateOpen} />
                </Modal>
            </Flex>
            <Table
                columns={columns}
                rowKey="_id"
                dataSource={data.map((user) => ({
                    ...user,
                    department: (user.department as IDepartment)?.name,
                }))}
                showSorterTooltip={{ target: "sorter-icon" }}
            />
            <Modal
                title={
                    <Title
                        level={3}
                        style={{
                            textAlign: "center",
                        }}
                    >
                        Update user
                    </Title>
                }
                closeIcon={false}
                open={isUpdateOpen}
                onCancel={toggleUpdateOpen}
                centered
                footer={null}
                width={800}
                destroyOnClose
            >
                <UpdateUserForm toggleOpen={toggleUpdateOpen} userId={userId} />
            </Modal>
        </div>
    );
};

export default AdminManageUser;
