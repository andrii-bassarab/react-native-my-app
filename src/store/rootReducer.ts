import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers } from 'redux';
import { createTransform, persistReducer } from 'redux-persist';

import { resetStore } from '~/modules/app/actions';
import { userReducer } from '~/modules/user/reducer';
import notificationsReducer from '~/modules/notifications';
import filterInspectionsReducer from '~/modules/filterInspections';
import inspectionsReducer from '~/modules/inspections';
import inspectionItemReducer from '~/modules/inspectionItem';
import toastNotificationReducer from '~/modules/toastNotification';
import showWindowReducer from '~/modules/showWindow';
import networkConnectivityReducer from '~/modules/networkConnectivity';
import categoryTemplateReducer from '~/modules/categoriesTemplates';
import categoryAmenitiesValuesReducer from '~/modules/categoryAmenitiesValues'; 
import categoryItemsValuesReducer from '~/modules/categoryItemsValue'; 
import categoryItemReducer from '~/modules/categoryItem'; 
import inspectionFilesReducer from '~/modules/inspectionFiles'; 


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
  whitelist: ['user', 'notifications', 'inspections', 'categoriesTemplates', 'categoryAmenitiesValues', 'categoryItemsValues'],
  transforms,
};

const appReducer = combineReducers({
  user: userReducer,
  notifications: notificationsReducer,
  filterInspections: filterInspectionsReducer,
  inspections: inspectionsReducer,
  toastNotification: toastNotificationReducer,
  inspectionItem: inspectionItemReducer,
  showWindow: showWindowReducer,
  networkConnectivity: networkConnectivityReducer,
  categoriesTemplates: categoryTemplateReducer,
  categoryAmenitiesValues: categoryAmenitiesValuesReducer,
  categoryItem: categoryItemReducer,
  categoryItemsValues: categoryItemsValuesReducer,
  inspectionFiles: inspectionFilesReducer,
});

const reducer: typeof appReducer = (state, action) => {
  if (action.type === resetStore) {
    state = undefined;
  }
  return appReducer(state, action);
};

export const rootReducer = persistReducer<ReturnType<typeof reducer>>(rootPersistConfig, reducer);
