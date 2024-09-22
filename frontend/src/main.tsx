import { createRoot } from "react-dom/client";
import MyApp from "./MyApp.tsx";
import "./styles/index.css";
import { StyleProvider } from "@ant-design/cssinjs";
import { App, ConfigProvider, theme } from "antd";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { colorTheme } from "./utils/colorTheme.ts";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
    <BrowserRouter>
        <QueryClientProvider client={queryClient}>
            <StyleProvider hashPriority="high">
                <ConfigProvider
                    theme={{
                        algorithm: theme.darkAlgorithm,
                        token: {
                            colorPrimary: colorTheme.primary,
                            fontFamily: "Manrope, sans-serif",
                            colorText: colorTheme.white,
                        },
                        components: {
                            Layout: {
                                bodyBg: colorTheme.theme,
                                headerBg: colorTheme.dark,
                                siderBg: colorTheme.dark,
                                colorText: colorTheme.white,
                            },
                            Input: {
                                colorTextPlaceholder: colorTheme.gray,
                                colorBgContainer: "transparent",
                                hoverBg: "transparent",
                                activeBg: "transparent",
                                borderRadius: 8,
                                colorBorder: colorTheme.border,
                                hoverBorderColor: colorTheme.border,
                                activeBorderColor: colorTheme.border,
                                colorIcon: colorTheme.white,
                                paddingBlock: 8,
                                paddingInline: 16,
                                colorBgContainerDisabled: colorTheme.dark,
                            },
                            Select: {
                                colorBgContainer: "transparent",
                                colorBgContainerDisabled: colorTheme.theme,
                                colorTextBase: colorTheme.white,
                                colorBgElevated: colorTheme.lightDark,
                                colorBorder: colorTheme.border,
                                optionSelectedBg: colorTheme.border,
                                colorTextPlaceholder: colorTheme.gray,
                            },
                            Button: {
                                defaultBg: "transparent",
                                defaultBorderColor: colorTheme.border,
                                defaultHoverBorderColor: colorTheme.border,
                                defaultHoverBg: colorTheme.theme,
                                defaultActiveBg: colorTheme.theme,
                                defaultHoverColor: colorTheme.white,
                                paddingBlock: 24,
                                paddingBlockSM: 16,
                                paddingInlineSM: 20,
                            },
                            Message: {
                                colorText: colorTheme.black,
                                colorBgElevated: colorTheme.white,
                            },
                            DatePicker: {
                                colorBgContainer: "transparent",
                                colorBgElevated: colorTheme.lightDark,
                            },
                            Dropdown: {
                                colorBgElevated: colorTheme.lightDark,
                                paddingBlock: 8,
                            },
                            Divider: {
                                colorBorder: colorTheme.border,
                            },
                            Table: {
                                headerBorderRadius: 8,
                                headerBg: colorTheme.dark,
                                colorBgContainer: colorTheme.theme,
                                headerSortHoverBg: colorTheme.primaryHover,
                                headerSortActiveBg: colorTheme.lightDark,
                            },
                        },
                    }}
                >
                    <App>
                        <MyApp />
                    </App>
                </ConfigProvider>
            </StyleProvider>
        </QueryClientProvider>
    </BrowserRouter>
);
