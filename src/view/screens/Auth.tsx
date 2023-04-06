import "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from "react-native";
import { actions as actionsTodo } from "../../modules/events";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import { Screen } from "../components/Screen";
import { userReducer } from "~/modules/user/reducer";
import { setUser } from "~/modules/user/actions";
import { resetStore } from "~/modules/app/actions";
import { LoginForm } from "../components/LoginForm";
import { ModalLoader } from "../components/ModalLoader";

export const AuthScreen: React.FC = () => {
  const navigation = useNavigation();
  const [loader, setLoader] = useState(false);

  const dispatch = useAppDispatch();

  const setTodos = () => dispatch(actionsTodo.setTodo("event"));

  const goToHome = React.useCallback(() => {
    setLoader(true);
    setTimeout(() => {
      setLoader(false);
      navigation.navigate("Home");
    }, 0);
  }, [navigation]);

  const selectedFilter = useAppSelector((state) => state.user);
  const events = useAppSelector((state) => state.events);

  console.log("user", selectedFilter.profile);
  console.log("events", events);

  return (
    <Screen backgroundColor="rgba(35, 71, 99, 0.77)">
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
            <LoginForm goToHome={goToHome} />
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
