import { Button, Col, Flex, Modal, Row, Typography } from "antd";
import CourseItem from "../components/course/CourseItem";
import useUserStore from "../store/userStore";
import { Role } from "../types";
import { PlusCircleOutlined } from "@ant-design/icons";
import useToggle from "../hooks/useToggle";
import CreateCourseForm from "../components/form/CreateCourseForm";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const { Title } = Typography;

const HomePage = () => {
    const user = useUserStore((state) => state.user);
    const { isOpen, toggleOpen } = useToggle();
    const navigate = useNavigate();

    useEffect(() => {
        if (user?.role === Role.admin) {
            navigate("/admin/manage/users");
        } else {
            navigate("/");
        }
    }, [navigate, user?.role]);

    if (!user) return;

    return (
        <>
            <Flex
                align="center"
                justify="space-between"
                style={{ marginBottom: 24 }}
            >
                <Title level={2} style={{ marginBottom: 0 }}>
                    Courses
                </Title>
                {(user.role === Role.admin || user.role === Role.lecturer) && (
                    <>
                        <Button type="primary" onClick={toggleOpen}>
                            New course
                            <PlusCircleOutlined />
                        </Button>
                        <Modal
                            title={
                                <Title
                                    level={3}
                                    style={{
                                        textAlign: "center",
                                    }}
                                >
                                    Create new course
                                </Title>
                            }
                            closeIcon={false}
                            open={isOpen}
                            onCancel={toggleOpen}
                            footer={null}
                            centered
                            destroyOnClose
                        >
                            <CreateCourseForm toggleOpen={toggleOpen} />
                        </Modal>
                    </>
                )}
            </Flex>
            <Row gutter={[32, 32]} className="course-list">
                {user.courses?.map((course) => (
                    <Col
                        sm={12}
                        xl={8}
                        xxl={6}
                        key={course._id}
                        style={{ width: "100%" }}
                    >
                        <CourseItem course={course} />
                    </Col>
                ))}
            </Row>
        </>
    );
};

export default HomePage;
