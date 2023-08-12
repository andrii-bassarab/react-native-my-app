import { InspectionVisibleStatus } from "../types/inspectionStatus";
import { IComment } from "../types/Comment";

export interface InspectionType {
  id: string;
  scheduledOn: string | null;
  visitationRange: string | null;
  assignedTo: string | null;
  status: string;
  inspectionType: string;
  propertyType: string;
  templateId: string;
  hasPassed: boolean;
  createdOn: string;
  createdBy: string;
  completedOn: string | null;
  completedBy: string | null;
  hasPermissionToEnter: boolean;
  householdPhone: string | null;
  visibleStatus: InspectionVisibleStatus;
  visibleHouseholdName: string;
  visibleInspectionForm: string;
  visibleAssignedTo: string;
  visibleLandlordName: string;
  inspectionComments: IComment[];
  visibleLandlordPhoneNumber: string;
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
    landlordId: string | null;
  };
  household: {
    lastActionName: string;
    headOfHouseholdId: string;
  };
}
