import { BASE_DOCUMENT_API, FILEROOM_API_KEY, X_SIDE_ID } from "~/constants/env";
import { Asset } from "react-native-image-picker";
import { Alert, Platform } from "react-native";
import { getUploadFileDate } from "~/utils/visibleDate";
import { DocumentPickerResponse } from "react-native-document-picker";

const isAssetType = (file: Asset | DocumentPickerResponse): file is Asset => {
  return "uri" in file && "fileName" in file && "type" in file;
};

interface IParams {
  singleFile: Asset | DocumentPickerResponse;
  inspectionId: string;
  email: string;
  documentType: "Image" | "Document" | "Signature";
  signaturePosition?: "Inspector" | "Landlord" | "Tenant";
  fileRelatedToCategoryInspection?: boolean;
  categoryIdRelation?: string;
  inspectionItemIdRelation?: string;
}

export interface IMetadata {
  user: string;
  createdOn: string;
  department: string;
  documentType: string;
  documentFormat: "image" | "document" | "signature";
  inspectionId: string;
  signaturePosition?: "Inspector" | "Landlord" | "Tenant";
  fileRelatedToCategoryInspection?: boolean;
  categoryIdRelation?: string;
  inspectionItemIdRelation?: string;
}

export const uploadFile = async ({
  singleFile,
  inspectionId,
  email,
  documentType,
  signaturePosition,
  fileRelatedToCategoryInspection,
  categoryIdRelation,
  inspectionItemIdRelation,
}: IParams) => {
  const metadata: IMetadata = {
    user: email,
    createdOn: getUploadFileDate(new Date()),
    department: "Maintenance",
    documentType: "inspection",
    documentFormat: documentType.toLocaleLowerCase(),
    inspectionId,
  };

  if (documentType === "Signature" && signaturePosition) {
    metadata.signaturePosition = signaturePosition;
  }

  if (fileRelatedToCategoryInspection && categoryIdRelation && inspectionItemIdRelation) {
    metadata.fileRelatedToCategoryInspection = fileRelatedToCategoryInspection;
    metadata.categoryIdRelation = categoryIdRelation;
    metadata.inspectionItemIdRelation = inspectionItemIdRelation;
  }

  const data = new FormData();

  const isAsset = isAssetType(singleFile);

  data.append("Authority", X_SIDE_ID);
  data.append("Name", isAsset ? singleFile.fileName! : singleFile.name!);
  data.append("IsGlobal", "false");
  data.append("Version", "1");
  data.append("IsGlobal", "false");
  data.append(
    "Tags",
    `Inspection, ${
      documentType === "Signature" || documentType === "Image" ? "Image" : "Document"
    }, Other Identifier`
  );
  data.append("Description", `${documentType} Upload`);
  data.append("Metadata", JSON.stringify(metadata));

  // @ts-ignore
  data.append("Files", {
    name: isAsset ? singleFile.fileName : singleFile.name,
    type: singleFile.type,
    uri: Platform.OS === "android" ? singleFile.uri! : singleFile.uri!.replace("file://", ""),
  });

  const uploadResponse: Response = await fetch(`${BASE_DOCUMENT_API}/files`, {
    method: "POST",
    headers: {
      "x-api-key": FILEROOM_API_KEY,
      "Content-Type": "multipart/form-data",
      accept: "text/plain",
    },
    body: data,
  });

  if (uploadResponse.ok) {
    const responseData = await uploadResponse.json();
    console.log("====================================");
    console.log("Upload result:", responseData);
    console.log("====================================");
    return responseData;
  } else {
    console.log("Upload failed:", uploadResponse.status, uploadResponse.statusText);
    throw new Error("Failed to upload file");
  }
};
