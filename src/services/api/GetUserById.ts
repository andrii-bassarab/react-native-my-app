import { X_CUSTOMER_ID, X_SIDE_ID } from "~/constants/env";
import { makeRequest } from "~/utils/fetch";

export const getUserNameById = (id: string) => makeRequest(`core/api/user/${id}`, null, "GET", {
    "x-customer-id": X_CUSTOMER_ID,
    "x-site-id": X_SIDE_ID
});

export const getAvailableUsers = () => makeRequest(`core/api/user`, null, "GET", {
    "x-customer-id": X_CUSTOMER_ID,
    "x-site-id": X_SIDE_ID
});