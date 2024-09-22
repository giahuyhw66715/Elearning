import { BookOutlined } from "@ant-design/icons";
import { Flex, Space, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { IAssignment } from "../../types";
import formatDate from "../../utils/formatDate";
import AssignmentActionBar from "./AssignmentActionBar";

const { Title, Text } = Typography;

type AssigmentItemProps = {
    assignment: IAssignment;
};
const AssignmentItem = ({ assignment }: AssigmentItemProps) => {
    const navigate = useNavigate();
    return (
        <Flex
            justify="space-between"
            align="flex-start"
            className="assigment-item"
            onClick={() => navigate(`/assignment/${assignment._id}`)}
        >
            <Flex gap="middle" align="center">
                <BookOutlined style={{ fontSize: "24px", color: "#2c8fff" }} />
                <Space direction="vertical" size={2}>
                    <Title level={5} style={{ margin: 0 }}>
                        {assignment.title}
                    </Title>
                    <Space>
                        <Text>{formatDate(assignment.createdAt)}</Text>
                        {assignment.dueDate && (
                            <>
                                <span>•</span>
                                <Text>{formatDate(assignment.dueDate)}</Text>
                            </>
                        )}
                    </Space>
                </Space>
            </Flex>

            <AssignmentActionBar assignment={assignment} />
        </Flex>
    );
};

export default AssignmentItem;
