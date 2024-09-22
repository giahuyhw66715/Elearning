import {
    BookOutlined,
    DeleteOutlined,
    UploadOutlined,
} from "@ant-design/icons";
import {
    App,
    Button,
    Col,
    Divider,
    Flex,
    Row,
    Space,
    Typography,
    Upload,
} from "antd";
import Attachment from "../components/attachment/Attachment";
import { useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAssignmentById } from "../api/assignment";
import formatDate from "../utils/formatDate";
import useUserStore from "../store/userStore";
import {
    ErrorMessage,
    FileUploadResult,
    IAssignment,
    ICourse,
    ISubmission,
    IUser,
    Role,
} from "../types";
import { colorTheme } from "../utils/colorTheme";
import { uploadFile } from "../api/file";
import { createSubmission, deleteSubmission } from "../api/submission";
import SubmissionItem from "../components/submission/SubmissionItem";
import { useState } from "react";
import getUploadFile from "../utils/getUploadFile";
import moment from "moment";
import AssignmentActionBar from "../components/assignment/AssignmentActionBar";

const { Title, Text, Paragraph } = Typography;

const AssignmentPage = () => {
    const { id } = useParams();
    const user = useUserStore((state) => state.user);
    const message = App.useApp().message;
    const queryClient = useQueryClient();
    const isStudent = user?.role === Role.student;
    const [file, setFile] = useState<FileUploadResult>();

    const { data: assignment } = useQuery<IAssignment, ErrorMessage>({
        queryKey: ["assignments", id],
        queryFn: () => getAssignmentById(id as string),
        retry: false,
        enabled: !!id,
    });

    const mutation = useMutation<ISubmission, ErrorMessage, FileUploadResult>({
        mutationFn: async () => {
            if (!file || !user?._id || !assignment?._id) return;
            const response = file?.file
                ? await uploadFile(file.file)
                : undefined;
            const submission = {
                student: user._id,
                assignment: assignment._id,
                file: response,
            };
            return createSubmission(submission);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["assignments", id],
            });
            message.success("Assignment submitted successfully");
        },
        onError: (error) => {
            message.error(error.response.data.message);
        },
    });

    const deleteMutation = useMutation<ISubmission, ErrorMessage, string>({
        mutationFn: (submissionId) => {
            return deleteSubmission(submissionId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["assignments", id],
            });
            message.success("Assignment deleted successfully");
        },
        onError: (error) => {
            message.error(error.response.data.message);
        },
    });

    if (!assignment || !user) return;

    const submittedAssignment = assignment.submissions?.find(
        (submission) => (submission.student as IUser)._id === user?._id
    );

    const numberOfSubmissions = assignment.submissions?.length as number;
    const numberOfStudents = (assignment.course as ICourse).students
        ?.length as number;
    const numberOfAssigned = numberOfStudents - numberOfSubmissions;

    return (
        <Row gutter={32} align="top" justify="center" style={{ margin: "0" }}>
            <Col span={1}>
                <BookOutlined
                    style={{
                        fontSize: "24px",
                        color: "#2c8fff",
                        marginTop: "8px",
                    }}
                />
            </Col>
            <Col span={isStudent ? 15 : 22}>
                <Flex justify="space-between" align="flex-start" gap="large">
                    <Flex
                        gap="middle"
                        align="flex-start"
                        style={{ width: "100%" }}
                    >
                        <Title level={3} style={{ marginBottom: 4 }}>
                            {assignment.title}
                        </Title>
                    </Flex>
                    <AssignmentActionBar assignment={assignment} />
                </Flex>
                <Flex justify="space-between" style={{ width: "100%" }}>
                    <Text>{formatDate(assignment.createdAt)}</Text>
                    <Text>
                        {assignment.dueDate && formatDate(assignment.dueDate)}
                    </Text>
                </Flex>
                <Divider />
                <Paragraph>{assignment.instructions}</Paragraph>
                {assignment.attachment && (
                    <div style={{ width: "fit-content" }}>
                        <Attachment
                            url={assignment.attachment}
                            fileName={assignment.attachment}
                        />
                    </div>
                )}
                {!isStudent && (
                    <>
                        {(assignment.instructions || assignment.attachment) && (
                            <Divider />
                        )}
                        <Flex gap="large" align="stretch">
                            <Space direction="vertical" size={2} align="center">
                                <Title level={2}>
                                    {numberOfSubmissions
                                        ? numberOfSubmissions
                                        : 0}
                                </Title>
                                <Text>Submmited</Text>
                            </Space>
                            <Divider
                                type="vertical"
                                style={{ height: "auto" }}
                            ></Divider>
                            <Space direction="vertical" size={2} align="center">
                                <Title level={2}>
                                    {numberOfAssigned ? numberOfAssigned : 0}
                                </Title>
                                <Text>Assigned</Text>
                            </Space>
                        </Flex>
                        {assignment.submissions &&
                            assignment.submissions.length > 0 && (
                                <Row
                                    gutter={[16, 16]}
                                    style={{ marginTop: 24 }}
                                >
                                    {assignment.submissions.map(
                                        (submission) => (
                                            <Col
                                                sm={12}
                                                md={8}
                                                xl={6}
                                                key={submission._id}
                                            >
                                                <SubmissionItem
                                                    submission={submission}
                                                />
                                            </Col>
                                        )
                                    )}
                                </Row>
                            )}
                    </>
                )}
            </Col>
            {isStudent && (
                <Col
                    offset={1}
                    span={7}
                    style={{
                        backgroundColor: colorTheme.dark,
                        padding: "24px 16px 16px",
                        borderRadius: 8,
                    }}
                >
                    <Flex gap="small" vertical>
                        <Flex align="flex-start" justify="space-between">
                            <Title level={5}>Your work</Title>
                            <Space size={4}>
                                <Text type="success">
                                    {submittedAssignment?.grade || "_"}
                                </Text>
                                <Text>/100</Text>
                            </Space>
                        </Flex>
                        {submittedAssignment && (
                            <div style={{ marginBottom: 8 }}>
                                <Attachment
                                    url={submittedAssignment.file}
                                    fileName={submittedAssignment.file}
                                />
                            </div>
                        )}
                        {!submittedAssignment ? (
                            <Upload
                                maxCount={1}
                                onChange={(e) => {
                                    const result = getUploadFile(e);
                                    setFile(result);
                                    mutation.mutate(result);
                                }}
                                beforeUpload={() => false}
                                showUploadList={false}
                            >
                                <Button
                                    icon={<UploadOutlined />}
                                    block
                                    disabled={
                                        moment() > moment(assignment.dueDate)
                                    }
                                >
                                    {moment() > moment(assignment.dueDate)
                                        ? "Deadline passed"
                                        : "Submit"}
                                </Button>
                            </Upload>
                        ) : (
                            <Button
                                icon={<DeleteOutlined />}
                                block
                                onClick={() =>
                                    deleteMutation.mutate(
                                        submittedAssignment._id as string
                                    )
                                }
                                danger
                            >
                                Unsubmit
                            </Button>
                        )}
                    </Flex>
                </Col>
            )}
        </Row>
    );
};

export default AssignmentPage;
