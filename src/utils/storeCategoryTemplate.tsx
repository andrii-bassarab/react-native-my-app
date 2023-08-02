import { CategoryItemValueField, CategoryType } from "~/types/Category";

export const getCategoryResult = (
  responseCategories: CategoryType[],
  categoryItemsValues: Record<string, CategoryItemValueField>,
) => {
  const arrayOfCategoryItemsValuse = Object.values(categoryItemsValues);
  return responseCategories.map((category) => ({
        ...category,
        amenities: category.amenities,
        status: !category.isRequired
          ? "--"
          : arrayOfCategoryItemsValuse.length > 0
          ? "Complete"
          : "Incomplete",
        result: !category.isRequired
          ? "--"
          : arrayOfCategoryItemsValuse.length > 0
          ? arrayOfCategoryItemsValuse.every(
              ({ value }) => value === "true"
            )
            ? "Passed"
            : "Failed"
          : "No results yet",
      })) as CategoryType[]
};
