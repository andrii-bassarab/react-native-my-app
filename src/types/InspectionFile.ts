import { IMetadata } from "~/services/api/files/uploadFile";

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
