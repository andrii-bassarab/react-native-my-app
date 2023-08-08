import { X_CUSTOMER_ID, X_SIDE_ID } from "~/constants/env";
import { makeRequest } from "~/utils/fetch";

export const getUserNameById = (id: string) => makeRequest({url: `core/api/user/${id}`, mutation: "GET", headers: {
    "x-customer-id": X_CUSTOMER_ID,
    "x-site-id": X_SIDE_ID
}});

export const getAvailableUsers = () => makeRequest({url: `core/api/user`, method: "GET", headers: {
    "x-customer-id": X_CUSTOMER_ID,
    "x-site-id": X_SIDE_ID
}});