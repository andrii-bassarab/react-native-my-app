import { CategoryType } from "~/models/category";

export interface CategoryTemplate {
    [templateId: string]: CategoryType[];
  }