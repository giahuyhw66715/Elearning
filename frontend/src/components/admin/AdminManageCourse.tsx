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
import { ErrorMessage, ICourse, IDepartment, IUser } from "../../types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    DeleteOutlined,
    EditOutlined,
    PlusCircleOutlined,
} from "@ant-design/icons";
import useToggle from "../../hooks/useToggle";
import { useState } from "react";
import { deleteCourse, getAllCourses } from "../../api/course";
import CreateCourseForm from "../form/CreateCourseForm";
import UpdateCourseFormModal from "../form/UpdateCourseFormModal";

const { Title } = Typography;

const AdminManageCourse = () => {
    const { message } = App.useApp();
    const [courseId, setCourseId] = useState<string>();
    const { isOpen: isCreateOpen, toggleOpen: toggleCreateOpen } = useToggle();
    const { isOpen: isUpdateOpen, toggleOpen: toggleUpdateOpen } = useToggle();
    const queryClient = useQueryClient();

    const { data, isError, error } = useQuery<ICourse[], ErrorMessage>({
        queryKey: ["courses"],
        queryFn: async () => {
            return await getAllCourses();
        },
    });

    const deleteMutation = useMutation<void, ErrorMessage, string>({
        mutationFn: (id: string) => {
            return deleteCourse(id);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["courses"] });
            message.success("Delete course successfully");
        },
        onError: (error) => {
            message.error(error.response.data.message);
        },
    });

    const columns: TableColumnsType<ICourse> = [
        {
            title: "ID",
            dataIndex: "_id",
        },
        {
            title: "Title",
            dataIndex: "title",
        },
        {
            title: "Department",
            dataIndex: "department",
        },
        {
            title: "Lecturer",
            dataIndex: "lecturer",
        },
        {
            title: "Action",
            key: "action",
            render: (_, record) => (
                <Space size="middle">
                    <EditOutlined
                        onClick={() => {
                            toggleUpdateOpen();
                            setCourseId(record._id);
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
                    Manage course
                </Title>
                <Button
                    type="primary"
                    icon={<PlusCircleOutlined />}
                    iconPosition="end"
                    onClick={toggleCreateOpen}
                >
                    Create new course
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
                    <CreateCourseForm toggleOpen={toggleCreateOpen} />
                </Modal>
            </Flex>
            <Table
                columns={columns}
                rowKey="_id"
                dataSource={data.map((user) => ({
                    ...user,
                    department: (user.department as IDepartment)?.name,
                    lecturer: (user.lecturer as IUser)?.fullName,
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
                        Update course
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
                <UpdateCourseFormModal
                    toggleOpen={toggleUpdateOpen}
                    courseId={courseId}
                />
            </Modal>
        </div>
    );
};

export default AdminManageCourse;
