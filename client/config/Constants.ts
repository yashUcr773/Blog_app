import axios from "axios";

export const CONSTANTS = {
    EMAIL_REGEX: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,64}$/,
    PWD_REGEX: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/,
    // APIBASEURL: "https://www.quickpost.dev",
    // APIBASEURL: "http://192.168.1.77:8787",
    APIBASEURL: "http://localhost:8787",
    AUTH: {
        BASE: "/auth",
        POST_SIGNUP: function () {
            return `${this.BASE}/signup`;
        },
        POST_SIGNIN: function () {
            return `${this.BASE}/signin`;
        },
        GET_REFRESH: function () {
            return `${this.BASE}/refresh`;
        },
        GET_LOGOUT: function () {
            return `${this.BASE}/signout`;
        },
    }
};

export const customAxios = axios.create({
    baseURL: CONSTANTS.APIBASEURL,
});

export const customAxiosPrivate = axios.create({
    baseURL: CONSTANTS.APIBASEURL,
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
});
