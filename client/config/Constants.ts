import axios from "axios";

export const CONSTANTS = {
    EMAIL_REGEX: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,64}$/,
    PWD_REGEX: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/,
    // APIBASEURL: "https://www.quickpost.dev",
    // APIBASEURL: "http://127.0.0.1:8787",
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
    },
    USER: {
        BASE: "/api/v1/user",
        GET_ALL: function () {
            return `${this.BASE}`;
        },
        GET_BY_ID: function (id: string) {
            return `${this.BASE}/id/${id}`;
        },
        GET_BY_FILTER: function (filter: string) {
            return `${this.BASE}/filter?mask=${filter}`;
        },
        PUT_USER: function () {
            return `${this.BASE}`;
        },
    },
    BLOG: {
        BASE: "/api/v1/blog",
        GET_ALL: function () {
            return `${this.BASE}`;
        },
        POST_UPLOAD_COVER: function () {
            return `${this.BASE}/cover`;
        },
        GET_BLOGS_OF_USER: function (authorId: string) {
            return `${this.BASE}?authorId=${authorId}`;
        },
        PUT_UPDATE: function () {
            return `${this.BASE}`;
        },
        POST_ADD_BLOG: function () {
            return `${this.BASE}`;
        },
        GET_BY_ID: function (id: string) {
            return `${this.BASE}/id/${id}`;
        },
        GET_PUBLISH: function (id: string) {
            return `${this.BASE}/publish/${id}`;
        },
        GET_UNPUBLISH: function (id: string) {
            return `${this.BASE}/unpublish/${id}`;
        },
        GET_DELETE: function (id: string) {
            return `${this.BASE}/delete/${id}`;
        },
    },
    CATEGORY: {
        BASE: "/api/v1/category",
        GET_ALL: function () {
            return `${this.BASE}`;
        },
    },
};

export const customAxios = axios.create({
    baseURL: CONSTANTS.APIBASEURL,
});

export const customAxiosPrivate = axios.create({
    baseURL: CONSTANTS.APIBASEURL,
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
});
