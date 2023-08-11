import { FILEROOM_API_KEY, BASE_DOCUMENT_API } from "~/constants/env";
import { FILE_ROOM_API_HEADERS } from "~/models/fileRoom";

export const requestDeleteFile = async (id: number) => {
  const res = await fetch(`${BASE_DOCUMENT_API}/files/${id}`, {
    method: "DELETE",
    headers: {
      ...FILE_ROOM_API_HEADERS
    },
  });

  if (!res.ok || res.status !== 200) {
    throw new Error("Failed to get Inspection Files");
  }
};
