import "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  Alert,
} from "react-native";
import { actions as actionsEvents } from "../../modules/events";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import { Screen } from "../components/Screen";
import {
  setAuth,
  setFirstInit,
  setCameraPermission,
  setNotificationPermission,
  setProfileStatus,
  setUser,
  setAvailableSites,
  setShowSwitchSite,
} from "~/modules/user/actions";
import { LoginForm } from "../components/LoginForm";
import { ModalLoader } from "../components/ModalLoader";
import { colors } from "../theme";
import { AsyncStatus } from "@appello/common/lib/constants";

const mocksSites = [
  { name: "Kanso Industries", code: "Kanso Industries" },
  { name: "Site 3", code: "Site 3" },
  { name: "Site 2", code: "Site 2" },
  { name: "Site 4", code: "Site 4" },
  { name: "Site 5", code: "Site 5" },
  { name: "Site 6", code: "Site 6" },
];

export const AuthScreen: React.FC = () => {
  const navigation = useNavigation();
  const [loader, setLoader] = useState(false);
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [errorLogin, setErrorLogin] = useState(false);

  const dispatch = useAppDispatch();

  const setTodos = () => dispatch(actionsEvents.setEvents("event"));
  const currentUser = useAppSelector((state) => state.user);
  const events = useAppSelector((state) => state.events);

  const handlePermissionNotification = useCallback(
    () =>
      new Promise((resolve, reject) => {
        Alert.alert(
          "“Doorways App” Would Like to Send You Notifications",
          "Notifications may include alerts, sounds and icon badges. These can be configured in Settings.",
          [
            {
              text: "Don't Allow",
              onPress: () => {
                dispatch(setNotificationPermission(false));
                resolve("Don't Allow Notifications");
              },
            },
            {
              text: "OK",
              onPress: () => {
                dispatch(setNotificationPermission(true));
                resolve("Allow Notifications");
              },
            },
          ]
        );
      }),
    [currentUser]
  );

  const handlePermissionCamera = useCallback(
    () =>
      new Promise((resolve, reject) => {
        Alert.alert(
          "“Doorways App” Would Like to Access the Camera",
          "This will let you take photos and record video.",
          [
            {
              text: "Don't Allow",
              onPress: () => {
                dispatch(setCameraPermission(false));
                resolve("Don't Allow Notifications");
              },
            },
            {
              text: "OK",
              onPress: () => {
                dispatch(setCameraPermission(true));
                resolve("Allow Notifications");
              },
            },
          ]
        );
      }),
    [currentUser]
  );

  const handleSubmit = useCallback(async () => {
    setLoader(true);
    try {
      if (currentUser.firstInit) {
        await handlePermissionCamera();
        await handlePermissionNotification();
      }

      dispatch(setUser({ id: 1, email: "Nazar Kubyk" }));
      dispatch(setProfileStatus(AsyncStatus.SUCCESS));
      dispatch(setAuth({ access: "string", refresh: "string" }));
      dispatch(setFirstInit(false));
      dispatch(setAvailableSites(mocksSites));

      if (mocksSites.length > 1 && !currentUser.selectedSite) {
        dispatch(setShowSwitchSite(true));
      }

      setUserName("");
      setPassword("");
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoader(false);
    }
  }, [currentUser]);

  // console.log("loader", loader);

  console.log("user", currentUser);
  // console.log("events", events);

  return (
    <Screen backgroundColor={colors.layout}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.screen}>
            <View style={styles.logo}>
              <Image
                source={require("../assets/images/WhiteKansoLogo.png")}
                style={{ width: "50%", resizeMode: "contain" }}
              />
            </View>
            <LoginForm
              goToHome={handleSubmit}
              navigation={navigation}
              userName={userName}
              setUserName={setUserName}
              setPassword={setPassword}
              password={password}
              errorLogin={errorLogin}
            />
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
      {loader && <ModalLoader />}
    </Screen>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "stretch",
  },
  logo: {
    marginBottom: 0,
    alignItems: "center",
  },
});
