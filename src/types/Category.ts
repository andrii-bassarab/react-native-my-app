export interface Category {
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
  name: string;
  description: string;
  options: CategoryOptionField[];
}

export interface CategoryType {
  id: string;
  inspectionTemplateId: string;
  name: string;
  isRequired: boolean;
  importKey?: null | string;
  amenities?: any[];
  items?: CategoryItemField[];
}
