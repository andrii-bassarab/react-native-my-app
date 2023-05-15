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
import { colors } from "../theme";
import LeftErrow from "../assets/icons/leftArrow.svg";

interface Props {
  children?: React.ReactNode;
  route: RouteProp<{ params: { loader?: boolean } }, "params">;
  navigation: NavigationProp<ParamListBase>;
}

export const ForgotPassword: React.FC<Props> = ({ route, navigation }) => {
  return (
    <Screen backgroundColor={colors.layout}>
      <View style={styles.screen}>
        <View style={styles.logo}>
          <Image
            source={require("../assets/images/WhiteKansoLogo.png")}
            style={{ width: "50%", resizeMode: "contain" }}
          />
        </View>
        <View style={styles.formContainer}>
          <TouchableOpacity style={styles.goBackButton} onPress={() => navigation.goBack()}>
            <LeftErrow color={colors.primary} height={20} width={20} />
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
    marginBottom: 0,
    alignItems: "center",
  },
  formContainer: {
    backgroundColor: "#fff",
    height: "65%",
    alignSelf: "stretch",
    borderTopRightRadius: 50,
    borderTopLeftRadius: 50,
    padding: 30,
    justifyContent: "flex-start",
    alignItems: "stretch",
  },
  goBackButton: {
    borderWidth: 1,
    borderColor: colors.blue,
    alignSelf: "flex-start",
    padding: 5,
    borderRadius: 5,
  },
  title: {
    fontWeight: "700",
    fontSize: 26,
    color: colors.layout,
    marginVertical: "5%",
  },
  supportImage: {
    width: 150,
    height: 150,
    alignSelf: "center",
    resizeMode: "contain",
  },
  text: {
    color: colors.primary,
    alignSelf: 'center',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '500',
    marginTop: 20
  }
});
