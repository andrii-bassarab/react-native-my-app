import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { useEffect } from 'react';

import { HomeScreen } from '../screens/Home';
import { Inspections } from '../screens/Inspections';
import { InspectionNavigation } from '../navigation/InspectionNavigation';
import { BottomTabBar } from '../components/Navigation/BottomTabBar';
import { WorkOrder } from '../screens/WorkOrder';
import { useAppDispatch } from '~/store/hooks';
import { actions as actionsNotifications } from "../../modules/notifications";
import { visibleDate } from '~/utils/visibleDate';
import { useQuery } from '@apollo/client';
import { GET_ALL_INSPECTIONS } from '~/services/api/inspections';
import { actions as actionsInspections } from "../../modules/inspections";

const mocksNotifications = [
  {title: '3 inspections pending to be synced', detail: ['Inspect 2062 Gimli Ct.', 'Inspect 6002 Ironwood Ln', 'Inspect 6002 10 Orthanc Road'], date: '05/30/2022 12:30 pm'},
  {title: '2 inspections synced successfully', date: '05/30/2022 12:30 pm'},
  {title: '2 inspections waiting to be synced', date: '05/29/2022 12:30 pm'},
]

const screenOptions = {
  gestureEnabled: false,
  headerShown: false,
};

const BottomTabs = createBottomTabNavigator();

export const MainStack: React.FC = () => {
  const dispatch = useAppDispatch();

  const { loading, error, data } = useQuery(GET_ALL_INSPECTIONS);

  useEffect(() => {
    console.log('---------------------')
    console.log('data', data?.inspections?.edges)
    console.log('error', new Date('2021-11-03T06:00:00.000Z').toLocaleString())
    console.log('---------------------')

    if (data && data.inspections?.edges) {
      dispatch(actionsInspections.setInspections(data.inspections?.edges))
    }
  }, [data])

  useEffect(() => {
    const date = visibleDate(new Date());
    dispatch(actionsNotifications.setNotifications([{title: 'Syncing in progress', date}, ...mocksNotifications]));
  }, []); 

  return (
    <BottomTabs.Navigator screenOptions={screenOptions} initialRouteName="HomeScreen" tabBar={(props) => <BottomTabBar {...props} />}>
      <BottomTabs.Screen name="HomeScreen" component={HomeScreen} options={{tabBarLabel: 'Home'}} />
      <BottomTabs.Screen name="InspectionNavigation" component={InspectionNavigation} options={{tabBarLabel: 'Inspections'}}/> 
      <BottomTabs.Screen name="WorkOrder" component={WorkOrder} options={{tabBarLabel: 'Work Orders'}}/> 
    </BottomTabs.Navigator>
  );
};
