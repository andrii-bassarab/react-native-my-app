import { AsyncStatus } from '@appello/common/lib/constants';
import { createAction } from '@reduxjs/toolkit';

import { UserProfileModel } from '~/models/user';

export const setUser = createAction<Nullable<UserProfileModel>>('user/SET_USER');

export const setAuth = createAction<Nullable<{ access: string; refresh: string }>>('user/SET_AUTH');

export const setProfileStatus = createAction<AsyncStatus>('user/SET_STATUS')

export const signOut = createAction('user/SIGN_OUT');

export const setFirstInit = createAction<boolean>('user/FIRST_INIT')
