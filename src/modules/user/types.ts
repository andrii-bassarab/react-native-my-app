import { AsyncStatus } from "@appello/common/lib/constants";

import { UserProfileModel } from "~/models/user";

export interface ISelectedSite {
  sideId: string;
  customerId: string;
}

export interface UserState {
  profileStatus: AsyncStatus;
  profile: Nullable<UserProfileModel>;
  auth: Nullable<UserAuth>;
  firstInit: boolean;
  selectedSite: ISelectedSite;
  availableSites: { name: string; code: string }[];
  availableUsers: AvailableUser[];
}

export interface UserAuth {
  access: string;
  refresh: string;
}

export interface AvailableUser {
  _id: string;
  fullName: string;
}
