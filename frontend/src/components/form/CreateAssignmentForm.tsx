import { App, Button, DatePicker, Flex, Form, Input, Upload } from "antd";
import { useState } from "react";
import { UploadOutlined } from "@ant-design/icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { ErrorMessage, FileUploadResult, IAssignment } from "../../types";
import { uploadFile } from "../../api/file";
import { createAssignment } from "../../api/assignment";
import Attachment from "../attachment/Attachment";
import getUploadFile from "../../utils/getUploadFile";
const { TextArea } = Input;

type AssigmentFormProps = {
    toggleOpen: () => void;
};

const CreateAssignmentForm = ({ toggleOpen }: AssigmentFormProps) => {
    const [form] = Form.useForm();
    const { id } = useParams();
    const [attachment, setAttachment] = useState<FileUploadResult>();
    const { message } = App.useApp();
    const queryClient = useQueryClient();

    const mutation = useMutation<IAssignment, ErrorMessage, IAssignment>({
        mutationFn: async (values) => {
            const uploadedAttachment = attachment?.file
                ? await uploadFile(attachment?.file)
                : undefined;

            const assignment = {
                ...values,
                dueDate: values.dueDate
                    ? new Date(values.dueDate).toISOString()
                    : undefined,
                course: id as string,
                attachment: uploadedAttachment,
            };

            return createAssignment(assignment);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["course", id] });
            message.success("Created assignment successfully");
            toggleOpen();
            form.resetFields();
        },
    });

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={() => mutation.mutate(form.getFieldsValue())}
            autoComplete="off"
            clearOnDestroy
        >
            <Flex gap="large">
                <Form.Item
                    label="Title"
                    name="title"
                    style={{ width: "100%" }}
                    // rules={[
                    //     { required: true, message: "Please input your title!" },
                    // ]}
                >
                    <Input placeholder="Title" />
                </Form.Item>
                <Form.Item
                    label="Due Date"
                    name="dueDate"
                    style={{ width: "100%" }}
                >
                    <DatePicker
                        showTime
                        style={{ width: "100%", padding: "8px 16px" }}
                    />
                </Form.Item>
            </Flex>

            <Form.Item label="Instructions" name="instructions">
                <TextArea rows={4} placeholder="Instructions" />
            </Form.Item>

            <Form.Item label="Attachment" name="attachment">
                <Flex vertical gap="large">
                    {attachment?.file?.name && (
                        <Attachment
                            url={attachment.tempUrl}
                            fileName={attachment.file?.name}
                        />
                    )}
                    <Upload
                        maxCount={1}
                        showUploadList={false}
                        beforeUpload={() => false}
                        onChange={(e) => setAttachment(getUploadFile(e))}
                    >
                        <Button block icon={<UploadOutlined />}>
                            Click to Upload
                        </Button>
                    </Upload>
                </Flex>
            </Form.Item>

            <Button
                type="primary"
                block
                htmlType="submit"
                loading={mutation.isPending}
                style={{ marginTop: "10px" }}
            >
                {mutation.isPending ? "Creating..." : "Create"}
            </Button>
        </Form>
    );
};

export default CreateAssignmentForm;
