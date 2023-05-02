import { InspectionStatus } from "./inspectionStatus";

export interface InspectionItem {
  id: string;
  scheduledOn: string | null;
  visitationRange: null | string;
  assignedTo: string;
  status: string;
  inspectionType: string;
  propertyType: string;
  hasPassed: boolean;
  createdOn: string;
  createdBy: string;
  completedOn: string;
  hasPermissionToEnter: boolean;
  visibleStatus: InspectionStatus;
  visibleHouseholdName: string
  unit: {
    id: string;
    streetAddress: string;
    city: string;
    state: string;
    postalCode: number;
  };
  household: {
    lastActionName: string;
    headOfHouseholdId: string;
  };
};