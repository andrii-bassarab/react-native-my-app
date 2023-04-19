import React from "react";
import { NavigationProp, ParamListBase, RouteProp } from "@react-navigation/native";
import { View, Text, StyleSheet } from "react-native";
import { Screen } from "../components/Screen";
import { colors } from "../theme";
import { TouchableOpacity } from "react-native-gesture-handler";
import { SelectedInspection } from "../components/SelectedInspection";

interface Inspection {
  title: string;
  date: string;
  stringDate: string;
  location: string;
  assigned: string;
  status: string;
  extra?: string;
}

interface Props {
  route: RouteProp<{ params: Inspection }, "params">;
  navigation: NavigationProp<ParamListBase>;
}

export const InspectionItem: React.FC<Props> = ({ navigation, route }) => {
  const inspection = route.params;

  const goBack = () => navigation.navigate("Inspections");

  console.log("item", inspection);

  return (
    <Screen backgroundColor={colors.layout} paddingTop={0}>
      <View style={styles.screen}>
        <View style={styles.content}>
          <SelectedInspection item={inspection} goBack={goBack} />
        </View>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.layout,
    paddingTop: 15,
  },
  content: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopRightRadius: 55,
    borderTopLeftRadius: 55,
    padding: 25,
    paddingTop: 25,
  },
});
