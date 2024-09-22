import { Avatar, Button, Flex, Grid, Layout, Space, Typography } from "antd";
import SidebarCourseItem from "./SidebarCourseItem";
import { Link, useLocation, useParams } from "react-router-dom";
import useUserStore from "../../store/userStore";
import {
    BankOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    ReadOutlined,
    UserOutlined,
} from "@ant-design/icons";
import { Role } from "../../types";
import { colorTheme } from "../../utils/colorTheme";
const { Sider } = Layout;
const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

type SidebarProps = {
    collapsed: boolean;
    setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
};

const Sidebar = ({ collapsed, setCollapsed }: SidebarProps) => {
    const { id } = useParams();
    const user = useUserStore((state) => state.user);
    const screens = useBreakpoint();
    return (
        <Sider
            width={350}
            trigger={null}
            collapsedWidth={0}
            collapsible
            collapsed={collapsed}
            className="layout-sidebar"
        >
            <>
                {!screens.lg && (
                    <Button
                        type="text"
                        icon={
                            collapsed ? (
                                <MenuUnfoldOutlined />
                            ) : (
                                <MenuFoldOutlined />
                            )
                        }
                        onClick={() => setCollapsed(!collapsed)}
                        style={{
                            padding: 20,
                        }}
                    ></Button>
                )}
                <Link to="/">
                    <Space size="middle" style={{ marginBottom: 40 }}>
                        <Avatar src="/logo.png" size={50} />
                        <Title level={2} style={{ color: "white", margin: 0 }}>
                            Enrolled
                        </Title>
                    </Space>
                </Link>
            </>
            <Flex vertical gap="small">
                {user?.role !== Role.admin ? (
                    user?.courses?.map((course) => (
                        <SidebarCourseItem
                            isActive={course._id === id}
                            key={course._id}
                            course={course}
                        />
                    ))
                ) : (
                    <>
                        <AdminSidebarItem
                            icon={<UserOutlined />}
                            title="User"
                            url="/admin/manage/users"
                        ></AdminSidebarItem>
                        <AdminSidebarItem
                            icon={<ReadOutlined />}
                            title="Course"
                            url="/admin/manage/courses"
                        ></AdminSidebarItem>
                        <AdminSidebarItem
                            icon={<BankOutlined />}
                            title="Department"
                            url="/admin/manage/departments"
                        ></AdminSidebarItem>
                    </>
                )}
            </Flex>
        </Sider>
    );
};

const AdminSidebarItem = ({
    icon,
    title,
    url,
}: {
    icon: React.ReactNode;
    title: string;
    url: string;
}) => {
    const location = useLocation();
    return (
        <Link
            to={url}
            style={{
                padding: "12px",
                borderRadius: 12,
                backgroundColor:
                    location.pathname === url ? colorTheme.primaryHover : "",
            }}
        >
            <Flex gap="small">
                <Text>{icon}</Text>
                <Text>{title}</Text>
            </Flex>
        </Link>
    );
};

export default Sidebar;
