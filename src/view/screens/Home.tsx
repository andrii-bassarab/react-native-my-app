import "react-native-gesture-handler";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import React, { useEffect } from "react";
import { Text, View, StyleSheet, FlatList } from "react-native";
import { WelcomeBox } from "../components/Screen/WelcomeBox";
import { Notifications } from "./Notification";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import { Screen } from "../components/Screen/Screen";
import { colors } from "../theme";
import { InspectionCard } from "../components/Inspections/InspectionCard";

interface Props {
  navigation: NavigationProp<ParamListBase>;
}

export const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const dispatch = useAppDispatch();

  const { inspections } = useAppSelector((state) => state.inspections);
  const showWindow = useAppSelector((state) => state.showWindow);

  return (
    <Screen backgroundColor={colors.layout} paddingTop={5} borderRadius={55}>
        <View style={styles.content}>
          <WelcomeBox backgroundColor="transparant" textColor={colors.darkGrey} />
          <View style={styles.activityBox}>
            <View>
              <FlatList
                data={inspections}
                keyExtractor={(item, index) => `key-${item.id}`}
                renderItem={({ item }) => (
                  <InspectionCard
                    onPress={() =>
                      navigation.navigate("InspectionNavigation", {
                        navigate: "InspectionItem",
                        item,
                      })
                    }
                    inspection={item}
                  />
                )}
                ListHeaderComponent={() => (
                  <Text style={styles.activityTitle}>Recent Activity</Text>
                )}
                ListFooterComponent={() => <View style={{ height: 80 }} />}
                ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                showsVerticalScrollIndicator={false}
              />
            </View>
          </View>
          {showWindow.showNotification && <Notifications />}
        </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopRightRadius: 55,
    borderTopLeftRadius: 55,
    padding: 25,
  },
  activityBox: {
    marginTop: "2%",
  },
  activityTitle: {
    fontSize: 16,
    color: "#7F888D",
    fontWeight: "700",
    marginBottom: 10,
  },
});
