export const getInspectionColor = (status: string) => {
  switch (status) {
    case "In Progress":
    case "Scheduled":
    case "New":
      return "#54B9D1";
    case "Passed":
      return "#96BF5B";
    case "Failed":
      return "#ED6A5F";
    default:
      return "#54B9D1";
  }
}