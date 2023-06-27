import "react-native-gesture-handler";
import { NavigationProp, ParamListBase, useNavigation } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  Platform,
} from "react-native";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import { Screen } from "../components/Screen/Screen";
import {
  setAuth,
  setFirstInit,
  setProfileStatus,
  setUser,
  setAvailableSites,
} from "~/modules/user/actions";
import { LoginForm } from "../components/Auth/LoginForm";
import { ModalLoader } from "../components/Loader/ModalLoader";
import { colors } from "../theme";
import { AsyncStatus } from "@appello/common/lib/constants";
import { actionsShowWindow } from "~/modules/showWindow";
import { PERMISSIONS, request, requestNotifications } from "react-native-permissions";

const mocksSites = [
  { name: "Kanso Industries", code: "Kanso Industries" },
  { name: "Site 3", code: "Site 3" },
  { name: "Site 2", code: "Site 2" },
  { name: "Site 4", code: "Site 4" },
  { name: "Site 5", code: "Site 5" },
  { name: "Site 6", code: "Site 6" },
];

export const AuthScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const [loader, setLoader] = useState(false);
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [errorLogin, setErrorLogin] = useState(false);

  const dispatch = useAppDispatch();

  const currentUser = useAppSelector((state) => state.user);

  const handleRequestPermissions = async () => {
    const resultRequestCamera = await request(Platform.OS === "ios" ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA)
    console.log("requestCameraPermissions", resultRequestCamera);

    const resultRequestNotifications = await requestNotifications(['alert', 'sound', 'badge'])
    console.log("requestNotificationsPermissions", resultRequestNotifications)
  };

  const handleSubmit = useCallback(async () => {
    setLoader(true);
    try {
      setLoader(false);
  
      if (currentUser.firstInit) {
        await handleRequestPermissions();
      }

      dispatch(setUser({ id: 1, email: userName.toLocaleLowerCase().replace(/ /g, '.') + "@appitventures.com", userName: userName}));
      dispatch(setProfileStatus(AsyncStatus.SUCCESS));
      dispatch(setAuth({ access: "string", refresh: "string" }));
      dispatch(setFirstInit(false));
      dispatch(setAvailableSites(mocksSites));

      if (mocksSites.length > 1 && !currentUser.selectedSite) {
        dispatch(actionsShowWindow.setShowSwitchSite(true));
      }

      setUserName("");
      setPassword("");
    } catch (error) {
      console.error("Error:", error);
      setLoader(false);
    }
  }, [currentUser, userName, password]);

  // console.log("loader", loader);
  // console.log("user", currentUser);
  // console.log("events", events);

  return (
    <Screen backgroundColor={colors.layout}>
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
