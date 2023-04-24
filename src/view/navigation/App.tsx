import "react-native-gesture-handler";
import { useReduxDevToolsExtension } from "@react-navigation/devtools";
import {
  NavigationContainer,
  useNavigationContainerRef,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthNavigator } from "./AuthNavigator";
import { HomeNavigator } from "./Home";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import { SplashScreen } from "../screens/Splash";
import {
  setProfileStatus,
  setFirstInit,
  setCameraPermission,
  setNotificationPermission,
} from "~/modules/user/actions";
import { Toast } from "../components/Custom/Toast";

const screenOptions = {
  gestureEnabled: false,
  headerShown: false,
};

const AppStack = createNativeStackNavigator();

export const AppNavigator: React.FC = () => {
  const navigationRef = useNavigationContainerRef();
  const dispatch = useAppDispatch();

  useReduxDevToolsExtension(navigationRef);

  const currentUser = useAppSelector((state) => state.user);

  const getUser = async () => {
    try {
      const userData = await AsyncStorage.getItem("firstOpen");

      console.log("console", JSON.parse(userData || "[]"));

      if (!userData) return "error";
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    console.log("currentUser", currentUser);
  }, []);

  if (!currentUser.auth && !currentUser.profile) {
    return (
      <NavigationContainer ref={navigationRef}>
        <AppStack.Navigator screenOptions={screenOptions}>
          <AppStack.Screen name="SplashScreen" component={SplashScreen} />
          <AppStack.Screen name="Auth" component={AuthNavigator} />
        </AppStack.Navigator>
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer ref={navigationRef}>
      <AppStack.Navigator screenOptions={screenOptions} initialRouteName="Home">
        <AppStack.Screen name="Home" component={HomeNavigator} />
      </AppStack.Navigator>
      <Toast />
    </NavigationContainer>
  );
};

export const Loader = () => (
  <NavigationContainer>
    <AppStack.Navigator screenOptions={screenOptions}>
      <AppStack.Screen
        name="SplashScreen"
        component={SplashScreen}
        initialParams={{ loader: true }}
      />
    </AppStack.Navigator>
  </NavigationContainer>
);
