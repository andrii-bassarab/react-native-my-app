import { API_URL, X_API_KEY, X_CUSTOMER_ID, X_SIDE_ID } from "~/constants/env";

type RequestMethod = "GET" | "POST" | "PATCH" | "DELETE";

export const makeRequest = (
  url: string,
  query: string | null = null,
  method: RequestMethod = "POST",
  headers: HeadersInit = {}
) => {
  const options: RequestInit = {
    method,
    headers: {
      "x-api-key": X_API_KEY,
      "x-site-id": X_SIDE_ID,
      "x-customer-id": X_CUSTOMER_ID,
      "Content-Type": "application/json",
      ...headers,
    },
  };

  if (query) {
    options.body = JSON.stringify({ query });
  }

  return fetch(`${API_URL}/${url}`, options)
    .then((res) => res.json())
    .catch((e) => console.log("error fetch ", e));
};
