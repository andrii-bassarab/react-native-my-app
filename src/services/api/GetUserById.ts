import { makeRequest } from "~/utils/fetch";

export const getUserNameById = (id: string) => makeRequest(`core/api/user/${id}`, null, "GET", {
    "x-customer-id": "pfdylv",
    "x-site-id": "pfdylv"
});

export const getAvailableUsers = () => makeRequest(`core/api/user`, null, "GET", {
    "x-customer-id": "pfdylv",
    "x-site-id": "pfdylv"
});