import { Avatar, Flex, Space, Typography } from "antd";
import React from "react";
import { ICourse, IDepartment, IUser } from "../../types";
import { useNavigate } from "react-router-dom";
import getFileUrl from "../../utils/getFileUrl";
import { colorTheme } from "../../utils/colorTheme";

const { Text } = Typography;

type SidebarCourseItemProps = {
    isActive?: boolean;
    course: ICourse;
};

const textMaxWidth: React.CSSProperties = {
    maxWidth: 250,
};

const SidebarCourseItem = ({ isActive, course }: SidebarCourseItemProps) => {
    const navigate = useNavigate();
    return (
        <Space
            size="middle"
            className="course-item"
            style={{
                backgroundColor: isActive ? colorTheme.primaryHover : "",
            }}
            onClick={() => navigate(`/course/${course._id}`)}
        >
            <Avatar src={getFileUrl(course.image)} size={50} />
            <Flex vertical gap="2px">
                <Text
                    strong
                    ellipsis
                    style={{ ...textMaxWidth, marginBottom: "2px" }}
                >
                    {course.title}
                </Text>
                <Text ellipsis style={{ ...textMaxWidth, fontSize: "12px" }}>
                    {(course.lecturer as IUser)?.fullName}
                </Text>
                <Text ellipsis style={{ ...textMaxWidth, fontSize: "12px" }}>
                    {(course.department as IDepartment)?.name}
                </Text>
            </Flex>
        </Space>
    );
};

export default SidebarCourseItem;
