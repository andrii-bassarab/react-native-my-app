import { API_URL, X_API_KEY, X_CUSTOMER_ID, X_SIDE_ID } from "~/constants/env";

type RequestMethod = "GET" | "POST" | "PATCH" | "DELETE";

interface IParams {
  url: string,
  query?: string | null,
  method?: RequestMethod,
  headers?: HeadersInit,
  mutation?: string | null,
}

export const makeRequest = async ({
  url,
  query = null,
  method = "POST",
  headers = {},
  mutation = null,
}: IParams) => {
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

  if (mutation) {
    options.body = JSON.stringify({ mutation });
  }

    const res = await fetch(`${API_URL}/${url}`, options);
    if (!res.ok) {
      throw new Error("error fetch")
    }
    return await res.json();

};
