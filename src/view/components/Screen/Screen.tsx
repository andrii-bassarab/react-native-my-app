import React, { useEffect, useState } from "react";
import { Dimensions, Platform, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface Props {
  children: React.ReactNode;
  backgroundColor: string;
  paddingTop?: string | number;
  borderRadius?: number; 
}

export const Screen: React.FC<Props> = ({ children, backgroundColor, paddingTop, borderRadius}) => {
  const insets = useSafeAreaInsets();
  const dim = Dimensions.get("screen");


  // if (dim.width >= dim.height) {
  //   return (
  //     <ScrollView
  //       style={{
  //         paddingTop: paddingTop ?? insets.top,
  //         paddingLeft: insets.left,
  //         paddingRight: insets.right,
  //         paddingBottom: insets.bottom,
  //         backgroundColor,
  //         flex: 1,
  //         borderTopRightRadius: borderRadius,
  //         borderTopLeftRadius: borderRadius,
  //       }}
  //     >
  //       {children}
  //     </ScrollView>
  //   );
  // }

  return (
    <View
      style={{
        paddingTop: paddingTop ?? insets.top,
        paddingLeft: insets.left,
        paddingRight: insets.right,
        backgroundColor,
        flex: 1,
        borderTopRightRadius: borderRadius,
        borderTopLeftRadius: borderRadius,
      }}
    >
      {children}
    </View>
  );
};
