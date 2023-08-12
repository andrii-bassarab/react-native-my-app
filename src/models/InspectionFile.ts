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

export interface InspectionFile {
  id: number;
  name: string;
  extension: string;
  path: string;
  description: string;
  fileType: string;
  metadata: IMetadata;
  tags: string[];
  departments: string[];
  createdOn: string;
  createdBy: string;
}
