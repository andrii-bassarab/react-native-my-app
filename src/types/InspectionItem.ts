import { InspectionStatus } from "./inspectionStatus";
import { Comment } from "./Comment";

export interface InspectionItem {
  id: string;
  scheduledOn: string | null;
  visitationRange: string | null;
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
  householdPhone: string | null;
  visibleStatus: InspectionStatus;
  visibleHouseholdName: string;
  inspectionComments: Comment[];
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