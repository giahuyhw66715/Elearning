import { Space, Tabs, TabsProps, Typography } from "antd";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getCourseById } from "../api/course";
import NotFoundPage from "./NotFoundPage";
import { ErrorMessage, ICourse, IDepartment, IUser, Role } from "../types";
import getFileUrl from "../utils/getFileUrl";
import PeopleTab from "../components/tab/PeopleTab";
import { v4 } from "uuid";
import ClassworkTab from "../components/tab/ClassworkTab";
import useUserStore from "../store/userStore";
import UpdateCourseForm from "../components/form/UpdateCourseForm";

const { Title, Text } = Typography;

const CoursePage = () => {
    const { id } = useParams();
    const user = useUserStore((state) => state.user);

    const {
        data: course,
        isLoading,
        isError,
    } = useQuery<ICourse, ErrorMessage>({
        queryKey: ["course", id],
        queryFn: () => getCourseById(id as string),
        enabled: !!id,
        retry: false,
    });

    if (!isLoading && isError) {
        return <NotFoundPage />;
    }

    if (!course) return;

    const tabItems: TabsProps["items"] = [
        {
            key: v4(),
            label: "Classwork",
            children: <ClassworkTab course={course} />,
        },
        {
            key: v4(),
            label: "People",
            children: <PeopleTab course={course} />,
        },
        ...(user?.role === Role.admin || user?.role === Role.lecturer
            ? [
                  {
                      key: v4(),
                      label: "About",
                      children: <UpdateCourseForm course={course} />,
                  },
              ]
            : []),
    ];

    return (
        <>
            <div className="course-detail">
                <div className="overlay"></div>
                <img src={getFileUrl(course?.image)} alt="Course image" />
                <div className="course-detail-info">
                    <Title level={2} style={{ marginBottom: "8px" }}>
                        {course?.title}
                    </Title>
                    <Space size={4} direction="vertical">
                        <Text>{(course.lecturer as IUser)?.fullName}</Text>
                        <Text>{(course.department as IDepartment)?.name}</Text>
                    </Space>
                </div>
            </div>

            <Tabs
                centered
                size="large"
                defaultActiveKey="1"
                items={tabItems}
                style={{ marginTop: "24px" }}
            />
        </>
    );
};

export default CoursePage;
