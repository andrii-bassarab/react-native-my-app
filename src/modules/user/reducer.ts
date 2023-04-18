import { AsyncStatus } from '@appello/common/lib/constants';
import { createReducer } from '@reduxjs/toolkit';

import { setAuth, setFirstInit, setCameraPermission, setProfileStatus, setUser, signOut, setNotificationPermission, setShowSwitchSite, setSelectedSite, setAvailableSites, setShowNotification, setShowInspectionsFilter } from './actions';
import { UserState } from './types';
import notificationsReducer, { actions as actionsNotifications } from '~/modules/notifications';
import { useAppDispatch } from '~/store/hooks';

export const initialState: UserState = {
  profileStatus: AsyncStatus.IDLE,
  profile: null,
  auth: null,
  firstInit: true,
  permissions: {camera: false, notification: false},
  showSwitchSite: false,
  selectedSite: null,
  availableSites: [],
  showNotification: false,
  showInspectionsFilterWindow: false,
};

export const userReducer = createReducer(initialState, builder =>
  builder
    .addCase(setUser, (state, { payload }) => {
      state.profile = payload;
    })
    .addCase(setAuth, (state, { payload }) => {
      state.auth = payload;
    })
    .addCase(setProfileStatus, (state, { payload }) => {
      state.profileStatus = payload;
    })
    .addCase(setFirstInit, (state, { payload }) => {
      state.firstInit = payload;
    })
    .addCase(signOut, (state) => {
      state.profileStatus = AsyncStatus.IDLE;
      state.profile = null;
      state.auth = null;
      // state.firstInit = true;
      state.availableSites = [];
      state.selectedSite = null;
      state.showNotification = false;
    })
    .addCase(setCameraPermission, (state, {payload}) => {
      state.permissions.camera = payload
    })
    .addCase(setNotificationPermission, (state, {payload}) => {
      state.permissions.notification = payload
    })
    .addCase(setShowSwitchSite, (state, {payload}) => {
      state.showSwitchSite = payload;
    })
    .addCase(setSelectedSite, (state, {payload}) => {
      state.selectedSite = payload;
    })
    .addCase(setAvailableSites, (state, {payload}) => {
      state.availableSites = payload;
    })
    .addCase(setShowNotification, (state, {payload}) => {
      state.showNotification = payload;
    })
    .addCase(setShowInspectionsFilter, (state, {payload}) => {
      state.showInspectionsFilterWindow = payload;
    })
);
