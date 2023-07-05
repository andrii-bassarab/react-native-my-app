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
  value: string | null;
  comment: string;
}

export interface CategoryAmenityField {
  id: string;
  value: string;
  comment: string | null;
}

export interface CategoryAmenities {
  id: string;
  name: string;
  amenityValues: CategoryAmenityField[];
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

export interface CategoryItems {
  id: string;
  name: string;
  description: string;
  itemsValues: CategoryItemField[];
}

export interface CategoryType {
  id: string;
  inspectionTemplateId: string;
  name: string;
  isRequired: boolean;
  importKey: null | string;
  createdBy: string | null;
  amenities: CategoryAmenities[];
  items: CategoryItems[];
  status?: string;
  result?: string;
}
