import React, { useState } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  TextInput,
} from "react-native";
import EyeIcon from "~/view/assets/icons/eyeslash.svg";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import { colors, textStyles } from "~/view/theme";
import { normalize } from "~/utils/normalize/normalize";

interface Props {
  goToHome: () => void;
  navigation: NavigationProp<ParamListBase>;
  setUserName: React.Dispatch<React.SetStateAction<string>>;
  userName: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  password: string;
  errorLogin: boolean;
}

export const LoginForm: React.FC<Props> = ({
  goToHome,
  navigation,
  setPassword,
  password,
  setUserName,
  userName,
  errorLogin,
}) => {
  const [hidePassword, setHidePassword] = useState(true);

  const handleSubmit = () => {
    goToHome();
    // setTimeout(() => {
    //   setErrorLogin(true)
    // }, 3000);
    setHidePassword(true);
  };

  const handleForgotPassword = () => {
    navigation.navigate("ForgotPassword");
  };

  return (
    <View style={styles.formContainer}>
      <Text style={styles.title}>Sign In</Text>
      <View style={styles.label}>
        <Text style={styles.labelText}>Username *</Text>
        <TextInput
          style={{
            ...styles.input,
            borderColor: errorLogin
              ? "rgba(219, 0, 28, 1)"
              : userName
              ? "rgba(37, 192, 220, 1)"
              : "#B4BCC0",
          }}
          value={userName}
          onChangeText={setUserName}
          placeholder="Username"
          placeholderTextColor={"#979797"}
        />
        {errorLogin && (
          <Text style={styles.errorMessage}>*User does not exist.</Text>
        )}
      </View>
      <View style={styles.label}>
        <Text style={styles.labelText}>Password *</Text>
        <View>
          <TextInput
            style={{
              ...styles.input,
              borderColor: errorLogin
                ? "rgba(219, 0, 28, 1)"
                : userName
                ? "rgba(37, 192, 220, 1)"
                : "#B4BCC0",
            }}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={hidePassword}
            placeholder="Password"
            placeholderTextColor={"#979797"}
          />
          <TouchableOpacity
            onPress={() => setHidePassword((prevState) => !prevState)}
            style={{
              position: "absolute",
              right: normalize(40),
              top: "15%",
              width: normalize(40),
              height: normalize(40),
            }}
          >
            <EyeIcon
              height={"100%"}
              color={hidePassword ? "#2C4660" : "#D8DFE2"}
            />
          </TouchableOpacity>
        </View>
        {errorLogin && (
          <Text style={styles.errorMessage}>
            *Incorrect username or password.
          </Text>
        )}
      </View>
      <TouchableOpacity
        style={styles.forgotPasswordButton}
        onPress={handleForgotPassword}
      >
        <Text style={styles.forgotPassword}>Forgot Password?</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={handleSubmit}
        style={{
          ...styles.signInButton,
          backgroundColor: !userName || !password ? "#B4BCC0" : "#2C4660",
        }}
        disabled={!userName || !password}
      >
        <Text style={styles.signIn}>Sign In</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    marginTop: "5%",
  },
  labelText: {
    paddingBottom: "2%",
    color: "rgba(127, 136, 141, 1)",
    fontWeight: "600",
    ...textStyles.regular,
  },
  formContainer: {
    backgroundColor: "#fff",
    height: "65%",
    alignSelf: "stretch",
    borderTopRightRadius: 50,
    borderTopLeftRadius: 50,
    paddingVertical: "7%",
    justifyContent: "flex-start",
    alignItems: "stretch",
    paddingHorizontal: "7%",
  },
  logo: {
    marginBottom: 0,
    alignItems: "center",
  },
  input: {
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "#B4BCC0",
    padding: normalize(15),
    paddingLeft: normalize(20),
    fontWeight: '500',
    ...textStyles.small,
  },
  title: {
    ...textStyles.great,
    fontWeight: "600",
    color: "rgba(44, 70, 96, 1)",
  },
  forgotPasswordButton: {
    alignSelf: "flex-end",
    marginTop: "5%",
  },
  forgotPassword: {
    color: "rgba(37, 192, 220, 1)",
    ...textStyles.medium,
  },
  signInButton: {
    paddingVertical: "3%",
    borderRadius: 50,
    backgroundColor: "#2C4660",
    alignSelf: "flex-end",
    marginTop: "15%",
    paddingHorizontal: "10%",
  },
  signIn: {
    color: "#fff",
    fontWeight: "600",
    ...textStyles.medium,
  },
  errorMessage: {
    color: "rgba(219, 0, 28, 1)",
    marginTop: 10,
  },
});
