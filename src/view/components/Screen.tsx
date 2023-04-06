import React, { useState } from "react";
import { Dimensions, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface Props {
  children: React.ReactNode;
  backgroundColor: string;
}

export const Screen: React.FC<Props> = ({ children, backgroundColor}) => {
  const insets = useSafeAreaInsets();
  const dim = Dimensions.get("screen");

  if (dim.width >= dim.height) {
    return (
      <ScrollView
        style={{
          paddingTop: insets.top,
          paddingLeft: insets.left,
          paddingRight: insets.right,
          paddingBottom: insets.bottom,
          backgroundColor,
          flex: 1,
        }}
      >
        {children}
      </ScrollView>
    );
  }

  return (
    <View
      style={{
        paddingTop: insets.top,
        paddingLeft: insets.left,
        paddingRight: insets.right,
        backgroundColor,
        flex: 1,
      }}
    >
      {children}
    </View>
  );
};
