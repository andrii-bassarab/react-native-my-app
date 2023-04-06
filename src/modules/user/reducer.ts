import { AsyncStatus } from '@appello/common/lib/constants';
import { createReducer } from '@reduxjs/toolkit';

import { setAuth, setFirstInit, setProfileStatus, setUser, signOut } from './actions';
import { UserState } from './types';

export const initialState: UserState = {
  profileStatus: AsyncStatus.IDLE,
  profile: null,
  auth: null,
  firstInit: false,
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
      state.firstInit = false;
    })
);
