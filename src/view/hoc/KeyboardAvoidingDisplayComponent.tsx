import React from "react";
import { TouchableWithoutFeedback, KeyboardAvoidingView, Platform, Keyboard, ScrollView } from "react-native";

interface Props {
  children: React.ReactNode;
}

export const KeyboardAvoidingDisplayComponent: React.FC<Props> = ({ children }) => {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

        {children}
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};
