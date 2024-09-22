import { Button, Flex, Modal, Typography } from "antd";
import useToggle from "../../hooks/useToggle";
import useUserStore from "../../store/userStore";
import { ICourse, Role } from "../../types";
import { PlusCircleOutlined } from "@ant-design/icons";
import AssignmentItem from "../assignment/AssignmentItem";
import CreateAssignmentForm from "../form/CreateAssignmentForm";

const { Title } = Typography;

const ClassworkTab = ({ course }: { course: ICourse }) => {
    const { isOpen, toggleOpen } = useToggle();
    const user = useUserStore((state) => state.user);
    if (!user) return;
    return (
        <Flex gap="large" vertical style={{ marginTop: "24px" }}>
            {(user.role === Role.lecturer || user?.role === Role.admin) && (
                <Button
                    type="primary"
                    style={{ alignSelf: "flex-end" }}
                    icon={<PlusCircleOutlined />}
                    iconPosition="end"
                    onClick={toggleOpen}
                >
                    New assignment
                </Button>
            )}
            <Flex vertical gap="large">
                {course.assignments?.map((assignment, index) => (
                    <AssignmentItem key={index} assignment={assignment} />
                ))}
            </Flex>
            <Modal
                title={
                    <Title
                        level={3}
                        style={{
                            textAlign: "center",
                        }}
                    >
                        Create new assignment
                    </Title>
                }
                closeIcon={false}
                open={isOpen}
                onCancel={toggleOpen}
                centered
                footer={null}
                width={800}
                destroyOnClose
            >
                <CreateAssignmentForm toggleOpen={toggleOpen} />
            </Modal>
        </Flex>
    );
};

export default ClassworkTab;
