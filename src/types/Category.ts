import { IComment } from "./Comment";

export interface Category {
  id: string;
  title: string;
  status: string;
  result: string;
  items: number;
  photos: string;
  categoryAdded?: boolean;
  categoryApplyToInspection: boolean;
}

export interface CategoryOptionField {
  name: string;
  description: string;
}

export interface CategoryItemField {
  id: string;
  inspectionItemId?: string;
  name: string;
  description: string;
  options: CategoryOptionField[];
  comment?: IComment;
  result?: boolean;
}

export interface CategoryAmenityField {
  id: string;
  name: string;
  comment?: IComment;
  result?: boolean;
}

export interface CategoryAmenityValue {
  id: string;
  inspectionId: string;
  inspectionAmenityId: string;
  value: "true" | "false";
  comment: string | null;
}

export interface CategoryItemValue {
  id: string;
  inspectionId: string;
  inspectionItemId: string;
  comment: string;
  inspectedBy: null | string;
  inspectedOn: null | string;
  value: "false" | "true";
  itemOptionId: null | string;
}

export interface CategoryType {
  id: string;
  inspectionTemplateId: string;
  name: string;
  isRequired: boolean;
  importKey?: null | string;
  createdBy: string | null;
  amenities: CategoryAmenityField[];
  items: CategoryItemField[];
  result?: string;
}
