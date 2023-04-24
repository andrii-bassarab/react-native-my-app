import { colors } from "~/view/theme";

export const getInspectionColorByStatus = (status: string) => {
  switch (status) {
    case "In Progress":
    case "Scheduled":
    case "New":
      return colors.blue;
    case "Passed":
      return colors.green;
    case "Failed":
      return colors.red;
    default:
      return colors.blue;
  }
}

export const getColorCategoryByResult = (result: string, status: string) => {
  switch (true) {
    case status === "--":
      return colors.darkGrey;
    case status === "Incomplete" && result == "No results yet":
      return colors.blue;
    case status === "Complete" && result === "Passed":
      return colors.green;
    case status === "Complete" && result === "Failed":
      return colors.red;
    default:
      return colors.blue;
  }
}
