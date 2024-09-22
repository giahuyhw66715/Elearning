import { Link } from "react-router-dom";
import getFileUrl from "../../utils/getFileUrl";
import { ISubmission, IUser } from "../../types";
import useGetFileIcon from "../../hooks/useGetFileIcon";
import { Avatar, Flex, Modal, Space, Typography } from "antd";
import formatDate from "../../utils/formatDate";
import stopPropagation from "../../utils/stopPropagation";
import useToggle from "../../hooks/useToggle";
import GradeStudentForm from "../form/GradeStudentForm";

const { Title, Text } = Typography;

const SubmissionItem = ({ submission }: { submission: ISubmission }) => {
    const icon = useGetFileIcon(submission.file, true);
    const student = submission.student as IUser;
    const { isOpen, toggleOpen } = useToggle();

    return (
        <Link
            to={getFileUrl(submission.file)}
            target="_blank"
            download
            className="attachment"
            style={{ display: "block" }}
        >
            <Flex vertical gap="middle" align="center">
                <Flex align="center" gap="middle">
                    <Avatar src={student.avatar || "/avatar.svg"} />
                    <Space direction="vertical" size={2}>
                        <Title level={5} style={{ margin: 0 }}>
                            {student.fullName}
                        </Title>
                        <Text style={{ fontSize: "12px" }}>
                            {formatDate(submission.createdAt)}
                        </Text>
                    </Space>
                </Flex>
                <Space size="small" direction="vertical" align="center">
                    {icon}
                    {submission.file}
                </Space>
                <Space
                    size={4}
                    onClick={(e) => {
                        stopPropagation(e);
                        toggleOpen();
                    }}
                >
                    <Text type="success">{submission.grade}</Text>
                    <Text>/100</Text>
                </Space>
                <Modal
                    title={
                        <Title
                            level={3}
                            style={{
                                textAlign: "center",
                            }}
                        >
                            Grade submission
                        </Title>
                    }
                    closeIcon={false}
                    open={isOpen}
                    onCancel={toggleOpen}
                    centered
                    footer={null}
                    destroyOnClose
                >
                    <GradeStudentForm
                        toggleOpen={toggleOpen}
                        submission={submission}
                    />
                </Modal>
            </Flex>
        </Link>
    );
};

export default SubmissionItem;
