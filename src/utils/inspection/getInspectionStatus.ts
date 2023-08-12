import { InspectionVisibleStatus } from "~/types/inspectionStatus";

export const getInspectionStatus = (status: string, hasPassed: boolean) => {
  switch (true) {
    case status === "incomplete":
      return InspectionVisibleStatus.INPROGRESS
    case status === "scheduled":
      return InspectionVisibleStatus.SCHEDULED;
    case status === "unscheduled":
      return InspectionVisibleStatus.UNSCHEDULED;
    case status === "new":
      return InspectionVisibleStatus.NEW;
    case status === "complete" && !hasPassed:
      return InspectionVisibleStatus.FAILED;
    case status === "complete" && hasPassed:
      return InspectionVisibleStatus.PASSED;
    default:
      return InspectionVisibleStatus.NEW;
  }
}