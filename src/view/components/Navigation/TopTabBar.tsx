import React from "react";
import { StyleSheet, View, TouchableOpacity, Platform, Animated } from "react-native";
import { colors } from "../../theme";
import { ParamListBase, RouteProp } from "@react-navigation/native";
import { MaterialTopTabBarProps } from "@react-navigation/material-top-tabs";

interface TopTabBarProps extends MaterialTopTabBarProps {}

interface BarButtonProps extends TopTabBarProps {
  route: RouteProp<ParamListBase, string>;
  index: number;
}

const BarButton: React.FC<BarButtonProps> = ({ state, descriptors, navigation, route, index }) => {
  const { options } = descriptors[route.key];
  const label =
    options.tabBarLabel !== undefined
      ? options.tabBarLabel
      : options.title !== undefined
      ? options.title
      : route.name;

  const isFocused = state.index === index;

  const onPress = () => {
    const event = navigation.emit({
      type: "tabPress",
      target: route.key,
      canPreventDefault: true,
    });

    if (!isFocused && !event.defaultPrevented) {
      // The `merge: true` option makes sure that the params inside the tab screen are preserved
      navigation.navigate({ name: route.name, params: route.params, merge: true });
    }
  };

  const onLongPress = () => {
    navigation.emit({
      type: "tabLongPress",
      target: route.key,
    });
  };

  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityState={isFocused ? { selected: true } : {}}
      accessibilityLabel={options.tabBarAccessibilityLabel}
      testID={options.tabBarTestID}
      onPress={onPress}
      onLongPress={onLongPress}
      style={[style.button, isFocused && style.active, index !== 0 && {borderLeftWidth: 1, borderColor: colors.blue}]}
    >
      <Animated.Text style={[style.text, isFocused && style.activeText]}>{typeof label === 'string' ? label : ''}</Animated.Text>
    </TouchableOpacity>
  );
};

export const TopTabBar: React.FC<TopTabBarProps> = (props) => {
  const { state } = props;
  return (
    <View style={[style.container]}>
      <View>
        <View style={style.bar}>
          {state.routes.map((route, index) => {
            return <BarButton key={`button-${index}`} {...props} route={route} index={index} />;
          })}
        </View>
      </View>
    </View>
  );
};

const style = StyleSheet.create({
  container: {
    paddingTop: 20,
    paddingBottom: 10,
    elevation: 0,
  },
  bar: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderColor: colors.blue,
    borderWidth: 1,
  },
  button: {
    backgroundColor: "#fff",
    paddingVertical: 5,
    flex: 1,
  },
  active: {
    backgroundColor: colors.blue,
  },
  text: {
    alignSelf: "center",
    color: colors.blue,
    fontWeight: "600",
    fontSize: 14,
  },
  activeText: {
    color: "#fff",
  },
});
