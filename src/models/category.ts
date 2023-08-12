export interface Category {
  id: string;
  title: string;
  status: Record<string, string>;
  result: Record<string, string>;
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
  inspectionId: string;
  inspectionAmenityId: string;
  value: "true" | "false";
  comment: null | string;
}

export interface CategoryItemValueField {
  id: string;
  inspectionId: string;
  inspectionItemId: string;
  value: "true" | "false";
  comment: null | string;
  inspectedBy: string | null;
  inspectedOn: string | null;
  itemOptionId: string | null;
}

export interface CategoryAmenitiesResponse {
  [amenityTemplateIds: string]: Record<string, CategoryAmenityField>;
}

export interface CategoryItemsValues {
  [inspectionId: string]: Record<string, CategoryItemValueField>;
}

export interface CategoryAmenities {
  id: string;
  name: string;
}

export interface CategoryItems {
  id: string;
  name: string;
  description: string;
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
  status?: Record<string, string>;
  result?: Record<string, string>;
}
