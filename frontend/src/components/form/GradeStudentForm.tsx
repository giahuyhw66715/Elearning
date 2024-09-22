import { useMutation, useQueryClient } from "@tanstack/react-query";
import { App, Button, Form, Select } from "antd";
import { ErrorMessage, ISubmission } from "../../types";
import { updateSubmission } from "../../api/submission";

type GradeStudentFormProps = {
    toggleOpen: () => void;
    submission: ISubmission;
};

type GradeScore = {
    score: number;
};

const scores: { value: number; label: number }[] = Array.from(
    { length: 20 },
    (_, i) => {
        return {
            value: (i + 1) * 5,
            label: (i + 1) * 5,
        };
    }
);

const GradeStudentForm = ({
    toggleOpen,
    submission,
}: GradeStudentFormProps) => {
    const [form] = Form.useForm();
    const { message } = App.useApp();
    const queryClient = useQueryClient();

    const mutation = useMutation<void, ErrorMessage, GradeScore>({
        mutationFn: async ({ score }) => {
            const updatedSubmission = {
                ...submission,
                grade: score,
            };
            return await updateSubmission(updatedSubmission);
        },
        onSuccess: () => {
            message.success("Submission graded successfully");
            queryClient.invalidateQueries({
                queryKey: ["assignments", submission.assignment],
            });
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
            onFinish={() => mutation.mutate(form.getFieldsValue())}
            autoComplete="off"
            clearOnDestroy
        >
            <Form.Item
                name="score"
                label="Score"
                initialValue={submission.grade || scores[0].value}
            >
                <Select style={{ width: "100%" }} options={scores} />
            </Form.Item>
            <div style={{ textAlign: "center" }}>
                <Button type="primary" htmlType="submit">
                    Grade
                </Button>
            </div>
        </Form>
    );
};

export default GradeStudentForm;
