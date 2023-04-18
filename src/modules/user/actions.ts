import { AsyncStatus } from '@appello/common/lib/constants';
import { createAction } from '@reduxjs/toolkit';

import { UserProfileModel } from '~/models/user';
import { Permissions } from './types';

export const setUser = createAction<Nullable<UserProfileModel>>('user/SET_USER');

export const setAuth = createAction<Nullable<{ access: string; refresh: string }>>('user/SET_AUTH');

export const setProfileStatus = createAction<AsyncStatus>('user/SET_STATUS')

export const signOut = createAction('user/SIGN_OUT');

export const setFirstInit = createAction<boolean>('user/FIRST_INIT');

export const setCameraPermission = createAction<boolean>('user/SET_CAMERA_PERMISSION');

export const setNotificationPermission = createAction<boolean>('user/SET_NOTIFICATION_PERMISSION');

export const setShowSwitchSite = createAction<boolean>('user/SET_SHOW_SWITCH_SITE');

export const setSelectedSite = createAction<Nullable<{ name: string, code: string }>>('user/SET_SELECTED_SITE');

export const setAvailableSites = createAction<{ name: string, code: string }[]>('user/SET_AVAILABLE_SITES');

export const setShowNotification = createAction<boolean>('user/SET_SHOW_NOTIFICATIONS');

export const setShowInspectionsFilter = createAction<boolean>('user/SET_SHOW_INSPECTIONS_FILTER');