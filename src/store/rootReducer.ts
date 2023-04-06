import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers } from 'redux';
import { createTransform, persistReducer } from 'redux-persist';

import { resetStore } from '~/modules/app/actions';
import { userReducer } from '~/modules/user/reducer';
import eventsSlice from '~/modules/events';

const transforms = [
  createTransform(
    state => JSON.stringify(state),
    state =>
      JSON.parse(state, (key, value) =>
        typeof value === 'string' && value.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)
          ? new Date(value)
          : value,
      ),
  ),
];

const rootPersistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['user'],
  transforms,
};

const appReducer = combineReducers({
  user: userReducer,
  events: eventsSlice,
});

const reducer: typeof appReducer = (state, action) => {
  if (action.type === resetStore) {
    state = undefined;
  }
  return appReducer(state, action);
};

export const rootReducer = persistReducer<ReturnType<typeof reducer>>(rootPersistConfig, reducer);
