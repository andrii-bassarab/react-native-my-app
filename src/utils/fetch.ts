const BASE_URL = "https://cloudstack-dev.doorways-services.net";

type RequestMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE';

export const makeRequest = (
  url: string,
  query: string | null = null,
  method: RequestMethod = "POST",
) => {
  const options: RequestInit = {
    method,
    headers: {
      "x-api-key": "GPK7qlm8VeZrxOQ18Gxh9VqnlHCCyUl5PBNjXZ69",
      "x-site-id": "pfdylv",
      "Content-Type": "application/json",
    },
  };

  if (query) {
    options.body = JSON.stringify({ query });
  }

  return fetch(`${BASE_URL}/${url}/graphql/`, options).then(res => res.json());
};