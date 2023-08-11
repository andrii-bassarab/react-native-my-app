import { AsyncStatus } from "@appello/common/lib/constants";
import { createReducer } from "@reduxjs/toolkit";

import {
  setAuth,
  setFirstInit,
  setProfileStatus,
  setUser,
  signOut,
  setSelectedSite,
  setAvailableSites,
  setAvailableUsers,
} from "./actions";
import { UserState } from "./types";

export const initialState: UserState = {
  profileStatus: AsyncStatus.IDLE,
  profile: null,
  auth: null,
  firstInit: true,
  selectedSite: {
    sideId: "vzmdyk",
    customerId: "vzmdyk",
  },
  availableSites: [],
  availableUsers: [],
};

export const userReducer = createReducer(initialState, (builder) =>
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
      state.firstInit = true;
      state.availableSites = [];
      state.selectedSite = {
        sideId: "vzmdyk",
        customerId: "vzmdyk",
      };
    })
    .addCase(setSelectedSite, (state, { payload }) => {
      state.selectedSite = payload;
    })
    .addCase(setAvailableSites, (state, { payload }) => {
      state.availableSites = payload;
    })
    .addCase(setAvailableUsers, (state, { payload }) => {
      state.availableUsers = payload;
    })
);
