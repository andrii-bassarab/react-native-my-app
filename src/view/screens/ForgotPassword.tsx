import React from "react";
import { NavigationProp, ParamListBase, RouteProp } from "@react-navigation/native";
import {
  View,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity
} from "react-native";
import { Screen } from "../components/Screen/Screen";
import { colors, textStyles } from "../theme";
import LeftErrow from "../assets/icons/leftArrow.svg";
import { normalize } from "~/utils/getWindowHeight";

interface Props {
  children?: React.ReactNode;
  route: RouteProp<{ params: { loader?: boolean } }, "params">;
  navigation: NavigationProp<ParamListBase>;
}

export const ForgotPassword: React.FC<Props> = ({ route, navigation }) => {
  return (
    <Screen backgroundColor={colors.layout} showNotificationScreen={false}>
      <View style={styles.screen}>
        <View style={styles.logo}>
          <Image
            source={require("../assets/images/WhiteKansoLogo.png")}
            style={{ width: "50%", resizeMode: "contain" }}
          />
        </View>
        <View style={styles.formContainer}>
          <TouchableOpacity style={styles.goBackButton} onPress={() => navigation.goBack()}>
            <LeftErrow color={colors.primary} height={normalize(30)} width={normalize(30)} />
          </TouchableOpacity>
          <Text style={styles.title}>Reset Password</Text>
          <Image
            source={require("../assets/images/support.png")}
            style={styles.supportImage}
          />
          <Text style={styles.text}>Please contact your user administrator for assistance.</Text>
        </View>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "stretch",
  },
  logo: {
    marginTop: '20%',
    alignItems: "center",
  },
  formContainer: {
    backgroundColor: "#fff",
    height: "65%",
    alignSelf: "stretch",
    borderTopRightRadius: 50,
    borderTopLeftRadius: 50,
    padding: normalize(40),
    justifyContent: "flex-start",
    alignItems: "stretch",
    paddingHorizontal: '7%'
  },
  goBackButton: {
    borderWidth: 1,
    borderColor: colors.blue,
    alignSelf: "flex-start",
    padding: "2%",
    borderRadius: 5,
  },
  title: {
    fontWeight: "700",
    color: colors.layout,
    marginVertical: "5%",
    ...textStyles.xlarge,
  },
  supportImage: {
    width: normalize(250),
    height: normalize(250),
    alignSelf: "center",
    resizeMode: "contain",
  },
  text: {
    color: colors.primary,
    alignSelf: 'center',
    textAlign: 'center',
    fontWeight: '500',
    marginTop: "7%",
    ...textStyles.medium
  }
});
