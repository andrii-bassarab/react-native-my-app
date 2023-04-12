import { AsyncStatus } from '@appello/common/lib/constants';

import { UserProfileModel } from '~/models/user';

export interface UserState {
  profileStatus: AsyncStatus;
  profile: Nullable<UserProfileModel>;
  auth: Nullable<UserAuth>;
  firstInit: boolean;
  permissions: Permissions;
  showSwitchSite: boolean;
}

export interface UserAuth {
  access: string;
  refresh: string;
}

export type Permissions = {
  camera: boolean;
  notification: boolean;
}