import { CategoryItemsValues, CategoryType } from "~/types/Category";

export const getCategoryResult = (
  responseCategories: CategoryType[],
  categoryItemsValues: Record<string, CategoryItemsValues>,
) => {
  return responseCategories.map((category) => {
    const arrayOfCategoryItemsValuesKeys = Object.keys(categoryItemsValues[category.id] || {});
    const status: Record<string, string> = {};
    const result: Record<string, string> = {};

    arrayOfCategoryItemsValuesKeys.forEach((inspectionId) => {
      status[inspectionId] = !category.isRequired
        ? "--"
        : Object.values(categoryItemsValues?.[category.id]?.[inspectionId] || {}).length > 0
        ? "Complete"
        : "Incomplete";

      result[inspectionId] = !category.isRequired
        ? "--"
        : Object.values(categoryItemsValues?.[category.id]?.[inspectionId]|| {}).length > 0
        ? Object.values(categoryItemsValues?.[category.id]?.[inspectionId]|| {}).every(({ value }) => value === "true")
          ? "Passed"
          : "Failed"
        : "No results yet";
    });

    return {
      ...category,
      amenities: category.amenities,
      status,
      result,
    };
  }) as CategoryType[];
};
