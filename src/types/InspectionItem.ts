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
  templateId: string | null;
  hasPassed: boolean;
  createdOn: string;
  createdBy: string;
  completedOn: string | null;
  completedBy: string | null;
  hasPermissionToEnter: boolean;
  householdPhone: string | null;
  visibleStatus: InspectionStatus;
  visibleHouseholdName: string;
  visibleInspectionForm: string;
  inspectionComments: Comment[];
  isReinspection: boolean;
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
    landlord: {
        firstName: string;
        lastName: string;
        phoneNumber: string | null;
    } | null
  };
  household: {
    lastActionName: string;
    headOfHouseholdId: string;
  };
};