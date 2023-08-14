import React from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Notifications } from "../../screens/Notification";
import { useAppSelector } from "~/store/hooks";

interface Props {
  children: React.ReactNode;
  backgroundColor: string;
  paddingTop?: string | number;
  borderRadius?: number; 
  showNotificationScreen?: boolean;
}

export const Screen: React.FC<Props> = ({ children, backgroundColor, paddingTop, borderRadius, showNotificationScreen = true}) => {
  const insets = useSafeAreaInsets();
  const showWindow = useAppSelector((state) => state.showWindow);

  return (
    <View
      style={{
        paddingTop: paddingTop ?? insets.top,
        paddingLeft: insets.left,
        paddingRight: insets.right,
        backgroundColor,
        flex: 1,
      }}
    >
      {children}
      {showWindow.showNotification && showNotificationScreen && <Notifications />}
    </View>
  );
};
