import { FILEROOM_API_KEY, BASE_DOCUMENT_API } from "~/constants/env";

export const requestDeleteFile = async (id: number) => {
  const res = await fetch(`${BASE_DOCUMENT_API}/files/${id}`, {
    method: "DELETE",
    headers: {
      "x-api-key": FILEROOM_API_KEY,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok || res.status !== 200) {
    throw new Error("Failed to get Inspection Files");
  }
};
