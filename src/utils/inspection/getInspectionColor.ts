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
    case result === "--":
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

export const getColorIconFileByFormat = (fileType: string) => {
  const fileFormat = fileType.toLocaleLowerCase();
  switch (true) {
    case fileFormat === "pdf":
      return colors.red;
    case fileFormat === "docx":
    case fileFormat === "doc":
      return colors.blue;
    case fileFormat === "csv":
      return colors.green;
    case fileFormat === "jpg":
      return "#ECCB5A";
    case fileFormat === "png":
      return "#ED9F3D";
    default:
      return "#ED9F3D";
  }
}
