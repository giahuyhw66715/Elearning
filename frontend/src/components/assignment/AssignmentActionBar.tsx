import {
    CopyOutlined,
    DeleteOutlined,
    EditOutlined,
    EllipsisOutlined,
} from "@ant-design/icons";
import { App, Dropdown, Flex, MenuProps, Modal, Typography } from "antd";
import stopPropagation from "../../utils/stopPropagation";
import { ErrorMessage, IAssignment } from "../../types";
import { v4 } from "uuid";
import copyLink from "../../utils/copyLink";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteAssignment } from "../../api/assignment";
import useToggle from "../../hooks/useToggle";
import UpdateAssignmentForm from "../form/UpdateAssignmentForm";
import useUserStore from "../../store/userStore";

const { Title } = Typography;

type AssigmentActionProps = {
    assignment: IAssignment;
};

const AssignmentActionBar = ({ assignment }: AssigmentActionProps) => {
    const queryClient = useQueryClient();
    const { message } = App.useApp();
    const user = useUserStore((state) => state.user);
    const { isOpen, toggleOpen } = useToggle();

    const deleteMutation = useMutation<IAssignment, ErrorMessage, string>({
        mutationFn: async (assignmentId) => {
            return deleteAssignment(assignmentId);
        },
        onSuccess: () => {
            message.success("Assignment deleted successfully");
            queryClient.invalidateQueries({
                queryKey: ["course", assignment.course],
            });
        },
        onError: (error) => {
            message.error(error.response.data.message);
        },
    });

    const actions: MenuProps["items"] = [
        {
            key: v4(),
            label: (
                <Flex
                    align="center"
                    gap="small"
                    onClick={() => {
                        copyLink(
                            `${import.meta.env.VITE_APP_BASE_URL}/assignment/${
                                assignment._id
                            }`
                        );
                        message.success("Link copied to clipboard");
                    }}
                >
                    <CopyOutlined />
                    Copy link
                </Flex>
            ),
        },
        ...(user?.role === "admin" || user?.role === "lecturer"
            ? [
                  {
                      key: v4(),
                      label: (
                          <Flex align="center" gap="small" onClick={toggleOpen}>
                              <EditOutlined />
                              Edit assignment
                          </Flex>
                      ),
                  },
                  {
                      key: v4(),
                      label: (
                          <Flex
                              align="center"
                              gap="small"
                              onClick={() =>
                                  deleteMutation.mutate(
                                      assignment._id as string
                                  )
                              }
                          >
                              <DeleteOutlined />
                              Move to trash
                          </Flex>
                      ),
                  },
              ]
            : []),
    ];

    return (
        <div onClick={stopPropagation}>
            <Dropdown
                menu={{ items: actions }}
                placement="bottom"
                arrow={{ pointAtCenter: true }}
                trigger={["click"]}
            >
                <EllipsisOutlined />
            </Dropdown>
            <Modal
                title={
                    <Title
                        level={3}
                        style={{
                            textAlign: "center",
                        }}
                    >
                        Edit assignment
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
                <UpdateAssignmentForm
                    toggleOpen={toggleOpen}
                    assignment={assignment}
                />
            </Modal>
        </div>
    );
};

export default AssignmentActionBar;
