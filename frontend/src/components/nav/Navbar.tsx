import React from "react";
import {
    App,
    Avatar,
    Button,
    Dropdown,
    Flex,
    Layout,
    MenuProps,
    Space,
    Typography,
} from "antd";
import {
    LogoutOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UserOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { removeTokens } from "../../utils/cookie";
import { v4 } from "uuid";
import useUserStore from "../../store/userStore";
import getFileUrl from "../../utils/getFileUrl";
const { Header } = Layout;
const { Title } = Typography;

const Navbar = ({
    collapsed,
    setCollapsed,
}: {
    collapsed: boolean;
    setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    const navigate = useNavigate();
    const user = useUserStore((state) => state.user);
    const { message } = App.useApp();
    if (!user) return null;

    const handleLogout = () => {
        removeTokens();
        navigate("/sign-in");
        message.success("Logout successfully");
    };

    const items: MenuProps["items"] = [
        {
            key: v4(),
            label: (
                <Link to="/profile">
                    <Space>
                        <UserOutlined />
                        Profile
                    </Space>
                </Link>
            ),
        },
        {
            key: v4(),
            label: (
                <Space onClick={handleLogout}>
                    <LogoutOutlined />
                    Sign out
                </Space>
            ),
        },
    ];

    return (
        <Header
            style={{
                position: "sticky",
                top: 0,
                left: 0,
                zIndex: 50,
                paddingBottom: "12px",
                paddingTop: "12px",
            }}
        >
            <Flex
                justify="space-between"
                align="center"
                style={{ height: "100%" }}
            >
                <Space align="center">
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
                    <Link to="/">
                        <Title level={3} style={{ margin: 0 }}>
                            Elearning
                        </Title>
                    </Link>
                </Space>
                {user ? (
                    <Dropdown
                        menu={{ items }}
                        placement="bottom"
                        autoAdjustOverflow
                        arrow={{ pointAtCenter: true }}
                        overlayStyle={{ width: "200px" }}
                    >
                        {user.avatar ? (
                            <Avatar
                                src={getFileUrl(user.avatar)}
                                style={{ cursor: "pointer" }}
                            />
                        ) : (
                            <Avatar
                                src="/avatar.svg"
                                style={{ cursor: "pointer" }}
                            />
                        )}
                    </Dropdown>
                ) : (
                    <Button type="primary">Login</Button>
                )}
            </Flex>
        </Header>
    );
};

export default Navbar;
