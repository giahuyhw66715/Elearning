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
import { ErrorMessage, IDepartment } from "../../types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    DeleteOutlined,
    EditOutlined,
    PlusCircleOutlined,
} from "@ant-design/icons";
import useToggle from "../../hooks/useToggle";
import { useState } from "react";
import { deleteDepartment, getAllDepartments } from "../../api/department";
import CreateDepartmentForm from "../form/CreateDepartmentForm";
import UpdateDepartmentForm from "../form/UpdateDepartmentForm";

const { Title } = Typography;

const AdminManageDepartment = () => {
    const { message } = App.useApp();
    const [departmentId, setDepartmentId] = useState<string>();
    const { isOpen: isCreateOpen, toggleOpen: toggleCreateOpen } = useToggle();
    const { isOpen: isUpdateOpen, toggleOpen: toggleUpdateOpen } = useToggle();
    const queryClient = useQueryClient();

    const { data, isError, error } = useQuery<IDepartment[], ErrorMessage>({
        queryKey: ["departments"],
        queryFn: getAllDepartments,
    });

    const deleteMutation = useMutation<void, ErrorMessage, string>({
        mutationFn: (id: string) => {
            return deleteDepartment(id);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["departments"] });
            message.success("Delete department successfully");
        },
        onError: (error) => {
            message.error(error.response.data.message);
        },
    });

    const columns: TableColumnsType<IDepartment> = [
        {
            title: "ID",
            dataIndex: "_id",
        },
        {
            title: "Name",
            dataIndex: "name",
            sorter: (a, b) => a.name.length - b.name.length,
        },
        {
            title: "Action",
            key: "action",
            render: (_, record) => (
                <Space size="middle">
                    <EditOutlined
                        onClick={() => {
                            toggleUpdateOpen();
                            setDepartmentId(record._id);
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
                    Manage department
                </Title>
                <Button
                    type="primary"
                    icon={<PlusCircleOutlined />}
                    iconPosition="end"
                    onClick={toggleCreateOpen}
                >
                    Create new department
                </Button>
                <Modal
                    title={
                        <Title
                            level={3}
                            style={{
                                textAlign: "center",
                            }}
                        >
                            Create new department
                        </Title>
                    }
                    closeIcon={false}
                    open={isCreateOpen}
                    onCancel={toggleCreateOpen}
                    centered
                    footer={null}
                    destroyOnClose
                >
                    <CreateDepartmentForm toggleOpen={toggleCreateOpen} />
                </Modal>
            </Flex>
            <Table
                columns={columns}
                rowKey="_id"
                dataSource={data}
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
                destroyOnClose
            >
                <UpdateDepartmentForm
                    toggleOpen={toggleUpdateOpen}
                    departmentId={departmentId}
                />
            </Modal>
        </div>
    );
};

export default AdminManageDepartment;
