import { Fragment, useState } from "react";
import { ErrorMessage, ICourse, IUser, Role } from "../../types";
import useUserStore from "../../store/userStore";
import { App, Button, Divider, Flex, Input, Typography } from "antd";
import { useMutation } from "@tanstack/react-query";
import { searchUserByUsername } from "../../api/user";
import { SearchOutlined } from "@ant-design/icons";
import UserItem from "../user/UserItem";
import { v4 } from "uuid";

const { Title } = Typography;

const PeopleTab = ({ course }: { course: ICourse }) => {
    const [query, setQuery] = useState<string>("");
    const user = useUserStore((state) => state.user);
    const { message } = App.useApp();

    const { data, mutate } = useMutation<IUser, ErrorMessage, string>({
        mutationFn: (username: string) => searchUserByUsername(username),
        onError: (error) => {
            message.error(error.response.data.message);
        },
    });

    console.log(data);
    if (!user) return;
    return (
        <Flex gap="large" vertical style={{ marginTop: "24px" }}>
            {(user.role === Role.lecturer || user?.role === Role.admin) && (
                <Flex gap="large">
                    <Input
                        placeholder="Search student..."
                        style={{ width: "100%" }}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <Button
                        type="primary"
                        icon={<SearchOutlined />}
                        iconPosition="end"
                        onClick={() => mutate(query)}
                        disabled={!query}
                    >
                        Search
                    </Button>
                </Flex>
            )}
            {data && (
                <div style={{ marginTop: "24px" }}>
                    <UserItem user={data} course={course} />
                    <Divider />
                </div>
            )}
            <Flex vertical gap="large" style={{ marginBottom: "24px" }}>
                <Title level={3} style={{ margin: 0 }}>
                    Lecturer
                </Title>
                <Divider style={{ margin: 0 }} />
                <UserItem user={course.lecturer as IUser} />
            </Flex>
            {course.students && course.students?.length > 0 && (
                <Flex vertical gap="large">
                    <Title level={3} style={{ margin: 0 }}>
                        Student
                    </Title>
                    {course.students?.map((student, index) => (
                        <Fragment key={v4()}>
                            <Divider style={{ margin: 0 }} />
                            <UserItem
                                key={index}
                                user={student as IUser}
                                course={course}
                            />
                        </Fragment>
                    ))}
                </Flex>
            )}
        </Flex>
    );
};

export default PeopleTab;
