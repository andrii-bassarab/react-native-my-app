import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { colors } from "../../theme";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import HomeIcon from "~/view/assets/icons/home.svg";
import DocumentIcon from "~/view/assets/icons/document.svg";
import WorkIcon from "~/view/assets/icons/work.svg";
import SwitchIcon from "~/view/assets/icons/switch.svg";
import SyncIcon from "~/view/assets/icons/sync.svg";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import { CustomerSite } from "../Screen/CustomerSite";
import { useQuery } from "@apollo/client";
import { GET_ALL_INSPECTIONS } from "~/services/api/inspections";
import { actionsInspections } from "~/modules/inspections";
import NetInfo from "@react-native-community/netinfo";

interface Props extends BottomTabBarProps {}

export const BottomTabBar: React.FC<Props> = ({ state, descriptors, navigation }) => {
  const insets = useSafeAreaInsets();
  const showWindow = useAppSelector((state) => state.showWindow);
  const dispatch = useAppDispatch();
  const [isInternetConnection, setIsInternetConnection] = useState<boolean | null>(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsInternetConnection(state.isConnected)
    });

    return () => {
      unsubscribe();
    };
  }, [NetInfo]);

  const { refetch, loading } = useQuery(GET_ALL_INSPECTIONS, {
    notifyOnNetworkStatusChange: true,
  });

  useEffect(() => {
    if (!isInternetConnection) {
      return;
    }
  
    dispatch(actionsInspections.setLoading(loading));

    if (loading) {
      dispatch(actionsInspections.setVisibleLoading(true));
    }
  }, [loading]);

  const detectIconByName = (label: string, color: string) => {
    switch (label) {
      case "Home":
        return <HomeIcon height="30%" color={color} />;
      case "Inspections":
        return <DocumentIcon height="30%" color={color} />;
      case "Work Orders":
        return <WorkIcon height="30%" color={color} />;
      case "Sync":
        return <SwitchIcon height="30%" color={color} />;
      default:
        return null;
    }
  };

  return showWindow.showSwitchSite ? (
    <CustomerSite />
  ) : (
    <View
      style={{
        ...styles.container,
        paddingBottom: insets.bottom / 2,
        ...styles.shadowProp,
      }}
    >
      {state.routes.map((route, index) => {
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
            navigation.navigate(route.name);
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
            key={route.name}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.item}
          >
            {typeof label === "string" &&
              detectIconByName(label, isFocused ? colors.blue : colors.primary)}
            <Text
              style={{
                color: isFocused ? colors.blue : colors.primary,
                fontWeight: "500",
              }}
            >
              {typeof label === "string" && label}
            </Text>
          </TouchableOpacity>
        );
      })}
      <TouchableOpacity style={styles.item} onPress={() => refetch({})}>
        <SyncIcon height="35%" color={colors.primary} />
        <Text style={{ color: colors.primary, fontWeight: "500" }}>Sync</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#fff",
    height: "10%",
    justifyContent: "center",
    alignItems: "center",
  },
  item: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  shadowProp: {
    shadowColor: "#171717",
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
});
