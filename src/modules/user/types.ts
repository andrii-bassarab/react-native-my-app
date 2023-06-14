import { AsyncStatus } from '@appello/common/lib/constants';

import { UserProfileModel } from '~/models/user';

export interface UserState {
  profileStatus: AsyncStatus;
  profile: Nullable<UserProfileModel>;
  auth: Nullable<UserAuth>;
  firstInit: boolean;
  permissions: Permissions;
  selectedSite: Nullable<{ name: string, code: string }>;
  availableSites: { name: string, code: string }[];
  availableUsers: AvailableUser[]
}

export interface UserAuth {
  access: string;
  refresh: string;
}

export type Permissions = {
  camera: boolean;
  notification: boolean;
}

export interface AvailableUser {
  _id: string;
  email: string;
  fullName: string;
}