import { FILEROOM_API_KEY, BASE_DOCUMENT_API, X_SIDE_ID } from '~/constants/env';

export const getInspectionFiles = async (id: string) => {
    const res = await fetch(`${BASE_DOCUMENT_API}/search/`, {
        method: 'POST',
        headers: {
            'x-api-key': FILEROOM_API_KEY,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "authority": X_SIDE_ID,
            "household": null,
            "actions": [],
            "keywords": [],
            "tags": [],
            "departments": [],
            "startDate": "",
            "endDate": "",
            "metadata": { "inspectionId": id }
        })
    });

    if (!res.ok) {
        throw new Error("Failed to get Inspection Files");
    }

    return await res.json();
}