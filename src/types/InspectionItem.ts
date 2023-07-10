import { InspectionVisibleStatus } from "./inspectionStatus";
import { IComment } from "./Comment";

export interface InspectionItem {
  id: string;
  scheduledOn: string | null;
  visitationRange: string | null;
  assignedTo: string;
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
  };
  household: {
    lastActionName: string;
    headOfHouseholdId: string;
  };
}
