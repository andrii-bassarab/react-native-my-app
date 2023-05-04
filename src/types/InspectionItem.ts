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
  completedOn: string | null;
  completedBy: string | null;
  hasPermissionToEnter: boolean;
  visibleStatus: InspectionStatus;
  visibleHouseholdName: string
  unit: {
    id: string;
    streetAddress: string;
    city: string;
    state: string;
    postalCode: number;
    numberOfBedrooms: number;
    numberOfBathrooms: number;
    squareFootage: number | null;
    isHandicapAccessible: boolean;
    yearConstructed: number | null;
    landlord: [{
        firstName: string;
        lastName: string;
    }] | null
  };
  household: {
    lastActionName: string;
    headOfHouseholdId: string;
  };
};