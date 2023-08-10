import "react-native-gesture-handler";
import React, { useEffect } from "react";
import RNBootSplash from "react-native-bootsplash";

import { AppNavigator } from "~/view/navigation/App";
import { Text } from "react-native";

export const App: React.FC = () => {
  interface TextWithDefaultProps extends Text {
    defaultProps?: { allowFontScaling?: boolean };
  }

  (Text as unknown as TextWithDefaultProps).defaultProps =
  (Text as unknown as TextWithDefaultProps).defaultProps || {};
  (Text as unknown as TextWithDefaultProps).defaultProps!.allowFontScaling = false;

  useEffect(() => {
    RNBootSplash.hide();
  }, []);

  return <AppNavigator />;
};
