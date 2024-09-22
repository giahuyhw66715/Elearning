import Cookies from "js-cookie";

const accessTokenExpiration = 1;
const refreshTokenExpiration = 7;

export const setTokens = (accessToken: string, refreshToken: string) => {
    Cookies.set("accessToken", accessToken, {
        expires: accessTokenExpiration,
    });
    Cookies.set("refreshToken", refreshToken, {
        expires: refreshTokenExpiration,
    });
};

export const getTokens = () => {
    return {
        accessToken: Cookies.get("accessToken"),
        refreshToken: Cookies.get("refreshToken"),
    };
};

export const removeTokens = () => {
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
};
