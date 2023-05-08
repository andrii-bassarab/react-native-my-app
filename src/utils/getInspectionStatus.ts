import { InspectionStatus } from "~/types/inspectionStatus";

export const getInspectionStatus = (status: string, hasPassed: boolean) => {
  switch (true) {
    case status === "incomplete":
      return InspectionStatus.INPROGRESS
    case status === "scheduled":
      return InspectionStatus.SCHEDULED;
    case status === "unscheduled":
      return InspectionStatus.UNSCHEDULED;
    case status === "new":
      return InspectionStatus.NEW;
    case status === "complete" && !hasPassed:
      return InspectionStatus.FAILED;
    case status === "complete" && hasPassed:
      return InspectionStatus.PASSED;
    default:
      return InspectionStatus.NEW;
  }
}