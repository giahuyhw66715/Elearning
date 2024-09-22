import { UserOutlined } from "@ant-design/icons";
import { Card, Flex, Image, Space, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { ICourse, IDepartment, IUser } from "../../types";
import getFileUrl from "../../utils/getFileUrl";

const { Meta } = Card;
const { Title, Text } = Typography;

type CourseItemProps = {
    course: ICourse;
};

const CourseItem = ({ course }: CourseItemProps) => {
    const navigate = useNavigate();

    return (
        <Card
            className="course-item"
            hoverable
            cover={
                <Image
                    height={250}
                    preview={false}
                    src={getFileUrl(course.image)}
                    style={{
                        borderStartStartRadius: "8px",
                        borderStartEndRadius: "8px",
                    }}
                />
            }
            onClick={() => navigate(`/course/${course._id}`)}
        >
            <Meta
                title={
                    <Title
                        ellipsis
                        style={{ maxWidth: "500px", marginBottom: 0 }}
                        level={4}
                    >
                        {course.title}
                    </Title>
                }
                description={
                    <Flex
                        justify="space-between"
                        align="center"
                        gap="middle"
                        className="course-item-description"
                    >
                        <Space size={4} direction="vertical">
                            <Text className="course-item-lecturer">
                                {(course.lecturer as IUser)?.fullName}
                            </Text>
                            <Text className="course-item-department">
                                {(course.department as IDepartment)?.name}
                            </Text>
                        </Space>
                        <Space size={8}>
                            <UserOutlined />
                            {course.students?.length}
                        </Space>
                    </Flex>
                }
            />
        </Card>
    );
};

export default CourseItem;
