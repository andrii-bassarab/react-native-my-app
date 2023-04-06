import { useReduxDevToolsExtension } from "@react-navigation/devtools"
import {
  NavigationContainer,
  useNavigationContainerRef,
} from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import React, { useEffect, useState } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { AsyncStatus } from "@appello/common/lib/constants"
import { AuthNavigator } from "./Auth"
import { HomeNavigator } from "./Home"
import { useAppDispatch, useAppSelector } from "~/store/hooks"
import { SplashScreen } from "../screens/Splash"
import { setProfileStatus, setFirstInit } from "~/modules/user/actions"

const screenOptions = {
  gestureEnabled: false,
  headerShown: false,
}

const AppStack = createNativeStackNavigator()

export const AppNavigator: React.FC = () => {
  const navigationRef = useNavigationContainerRef()
  const dispatch = useAppDispatch()

  useReduxDevToolsExtension(navigationRef)

  const currentUser = useAppSelector((state) => state.user)

  const getUser = async () => {
    try {
      const userData = await AsyncStorage.getItem("firstOpen")

      console.log("console", JSON.parse(userData || "[]"))

      if (!userData) return "error"
    } catch (error) {
      console.log(error)
    }
  }

  const initUserFirstTime = () => {
    setTimeout(() => {
      dispatch(setFirstInit(false))
    }, 2000)
  }

  useEffect(() => {
    console.log("storage", getUser())
    initUserFirstTime()
  }, [])

  if (
    !currentUser.auth &&
    !currentUser.profile &&
    currentUser.firstInit
  ) {
    return (
      <NavigationContainer ref={navigationRef}>
        <AppStack.Navigator screenOptions={screenOptions}>
          <AppStack.Screen name="SplashScreen" component={SplashScreen} />
        </AppStack.Navigator>
      </NavigationContainer>
    )
  }

  return (
    <NavigationContainer ref={navigationRef}>
      <AppStack.Navigator screenOptions={screenOptions}>
        <AppStack.Screen name="Auth" component={AuthNavigator} />
        <AppStack.Screen name="Home" component={HomeNavigator} />
      </AppStack.Navigator>
    </NavigationContainer>
  )
}

export const Loader = () => (
  <NavigationContainer>
    <AppStack.Navigator screenOptions={screenOptions}>
      <AppStack.Screen name="SplashScreen" component={SplashScreen} initialParams={{loader: true}}/>
    </AppStack.Navigator>
  </NavigationContainer>
)
