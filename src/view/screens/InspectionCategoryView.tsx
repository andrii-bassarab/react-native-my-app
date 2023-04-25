import React from "react";
import { NavigationProp, ParamListBase, RouteProp } from "@react-navigation/native";
import { View, Text, StyleSheet } from "react-native";
import { Screen } from "../components/Screen/Screen";
import { colors } from "../theme";
import { SelectedInspection } from "../components/Inspections/SelectedInspection";
import { Inspection } from "~/types/Inspection";
import { Category } from "~/types/Category";

interface Props {
  route: RouteProp<{ params: { category: Category; inspection: Inspection } }, "params">;
  navigation: NavigationProp<ParamListBase>;
}

export const InspectionCategoryScreen: React.FC<Props> = ({ navigation, route }) => {
  const { inspection } = route.params;
  const { category } = route.params;

  const goBack = () => navigation.goBack();

  console.log(category);

  return (
    <Screen backgroundColor={colors.layout} paddingTop={0}>
      <View style={styles.screen}>
        <View style={styles.content}>
          <SelectedInspection
            item={inspection}
            goBack={goBack}
            includeCategory
            category={category}
          />
          {/* <Text>{category.title}</Text> */}
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
    paddingHorizontal: 15,
    paddingTop: 25,
    paddingBottom: 0,
  },
  labelText: {
    color: "#8E8E8E",
    fontWeight: "600",
    flex: 0.5,
    fontSize: 13,
  },
  label: {
    flexDirection: "row",
    marginBottom: 5,
    flexWrap: "wrap",
  },
  text: {
    color: "#8E8E8E",
    fontWeight: "400",
    textAlign: "left",
    flex: 1,
    fontSize: 13,
  },
});
