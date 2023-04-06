import { AsyncStatus } from '@appello/common/lib/constants';

import { UserProfileModel } from '~/models/user';

export interface UserState {
  profileStatus: AsyncStatus;
  profile: Nullable<UserProfileModel>;
  auth: Nullable<UserAuth>;
  firstInit: boolean;
}

export interface UserAuth {
  access: string;
  refresh: string;
}
