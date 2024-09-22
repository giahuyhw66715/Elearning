import { Grid, Layout } from "antd";
import Sidebar from "../components/sidebar/Sidebar";
import Navbar from "../components/nav/Navbar";
import { Outlet, useNavigate } from "react-router-dom";
import useUserStore from "../store/userStore";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { fetchMe } from "../api/auth";
const { Content } = Layout;

const { useBreakpoint } = Grid;

const MainLayout = () => {
    const { setUser } = useUserStore();
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState(false);
    const screens = useBreakpoint();

    useEffect(() => {
        setCollapsed(!screens.lg);
    }, [screens.lg]);

    const { data, isLoading, isError, isSuccess } = useQuery({
        queryKey: ["me"],
        queryFn: fetchMe,
        retry: false,
    });

    useEffect(() => {
        if (!isLoading && isError) {
            navigate("/sign-in");
        }
        if (!isLoading && isSuccess && data) {
            setUser(data);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoading, isError, isSuccess, data]);

    if (!data) return;

    return (
        <Layout hasSider>
            <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
            <Layout>
                <Navbar collapsed={collapsed} setCollapsed={setCollapsed} />
                <Content style={{ padding: "40px 48px" }}>
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
};

export default MainLayout;
