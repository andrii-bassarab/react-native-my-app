import { InspectionStatus } from "~/types/inspectionStatus";

export const getInspectionStatus = ( status: string, hasPassed: boolean) => {
  switch (true) {
    case status === "--":
    case status === "incomplete":
      return InspectionStatus.SCHEDULED;
    case status === "complete" && !hasPassed:
      return InspectionStatus.PASSED;
    case status === "complete" && hasPassed:
      return InspectionStatus.FAILED;
    default:
      return InspectionStatus.NEW;
  }
}