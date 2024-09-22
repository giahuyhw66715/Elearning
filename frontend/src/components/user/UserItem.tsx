import { App, Avatar, Button, Flex, Typography } from "antd";
import { ErrorMessage, ICourse, IUser, Role } from "../../types";
import { addStudentToCourse, deleteStudentFromCourse } from "../../api/course";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useUserStore from "../../store/userStore";
import getFileUrl from "../../utils/getFileUrl";

const { Text } = Typography;

type UserItemProps = {
    user: IUser;
    course?: ICourse;
};

const UserItem = ({ user, course }: UserItemProps) => {
    const { message } = App.useApp();
    const queryClient = useQueryClient();
    const authUser = useUserStore((state) => state.user);
    const isAdded = !!course?.students?.find(
        (student) => (student as IUser)._id === (user as IUser)._id
    );
    const isStudent = user.role === Role.student;
    const isCurrentAuthStudent = authUser?.role === Role.student;

    const removeStudentMutation = useMutation<
        void,
        ErrorMessage,
        UserItemProps
    >({
        mutationFn: async ({ user, course }) => {
            return await deleteStudentFromCourse(
                (course as ICourse)._id as string,
                (user as IUser)._id as string
            );
        },
        onSuccess: () => {
            message.success("Removed student from course successfully");
            queryClient.invalidateQueries({
                queryKey: ["course", (course as ICourse)._id],
            });
        },
    });

    const addStudentMutation = useMutation<void, ErrorMessage, UserItemProps>({
        mutationFn: async ({ user, course }) => {
            return await addStudentToCourse(
                (course as ICourse)._id as string,
                (user as IUser)._id as string
            );
        },
        onSuccess: () => {
            message.success("Added student to course successfully");
            queryClient.invalidateQueries({
                queryKey: ["course", (course as ICourse)._id],
            });
        },
    });

    if (!user) return;

    return (
        <Flex
            align="center"
            justify="space-between"
            style={{ padding: "0 16px" }}
        >
            <Flex gap="middle" align="center">
                <Avatar
                    src={user.avatar ? getFileUrl(user.avatar) : "/avatar.svg"}
                />
                <Text>{user.fullName}</Text>
            </Flex>
            {isStudent &&
                !isCurrentAuthStudent &&
                (isAdded ? (
                    <Button
                        type="primary"
                        danger
                        ghost
                        size="small"
                        onClick={() =>
                            removeStudentMutation.mutate({
                                course,
                                user,
                            })
                        }
                    >
                        Remove
                    </Button>
                ) : (
                    <Button
                        type="primary"
                        ghost
                        size="small"
                        onClick={() =>
                            addStudentMutation.mutate({ course, user })
                        }
                    >
                        Add
                    </Button>
                ))}
        </Flex>
    );
};

export default UserItem;
