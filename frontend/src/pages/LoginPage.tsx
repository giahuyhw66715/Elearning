import { useMutation } from "@tanstack/react-query";
import {
    App,
    Button,
    Flex,
    Form,
    FormProps,
    Input,
    Layout,
    Typography,
} from "antd";
import { Link, useNavigate } from "react-router-dom";
import { ErrorMessage, ILogin, Token } from "../types";
import useUserStore from "../store/userStore";
import { setTokens } from "../utils/cookie";
import { fetchMe, loginUser } from "../api/auth";

const { Content } = Layout;

const { Title } = Typography;

const LoginPage = () => {
    const { setUser } = useUserStore();
    const [form] = Form.useForm<ILogin>();
    const { message } = App.useApp();
    const navigate = useNavigate();

    const mutation = useMutation<Token, ErrorMessage, ILogin>({
        mutationFn: ({ username, password }) => {
            return loginUser(username, password);
        },
        onSuccess: async ({ accessToken, refreshToken }) => {
            setTokens(accessToken, refreshToken);
            const user = await fetchMe();
            setUser(user);
            message.success("Login successful");
            navigate("/");
            form.resetFields();
        },
        onError: (error) => {
            message.error(error.response.data.message);
        },
    });

    const handleLogin: FormProps<ILogin>["onFinish"] = (values) => {
        const { username, password } = values;
        mutation.mutate({ username, password });
    };

    return (
        <Layout>
            <Content className="login">
                <Link to="/" style={{ width: "100%" }}>
                    <img src="/login.svg" alt="" />
                </Link>
                <Flex
                    vertical
                    align="center"
                    gap="large"
                    style={{ width: "100%" }}
                >
                    <Title level={2} style={{ color: "white", margin: 0 }}>
                        Login
                    </Title>
                    <Form
                        form={form}
                        onFinish={handleLogin}
                        autoComplete="off"
                        layout="vertical"
                        style={{ width: "100%" }}
                    >
                        <Form.Item
                            label="Username"
                            name="username"
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter your username!",
                                },
                            ]}
                        >
                            <Input placeholder="Username" />
                        </Form.Item>

                        <Form.Item
                            label="Password"
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter your password!",
                                },
                            ]}
                        >
                            <Input.Password placeholder="Password" />
                        </Form.Item>

                        <Button
                            type="primary"
                            htmlType="submit"
                            block
                            loading={mutation.isPending}
                        >
                            {mutation.isPending ? "Logging in..." : "Login"}
                        </Button>
                    </Form>
                </Flex>
            </Content>
        </Layout>
    );
};

export default LoginPage;
