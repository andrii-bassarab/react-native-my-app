import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { StatusBox } from "./StatusBox";
import { colors } from "~/view/theme";
import { RouteProp } from "@react-navigation/native";
import { Inspection } from "~/types/Inspection";
import { AssignedBox } from "./AssignedBox";
import { AdressBox } from "./AdressBox";

interface Props {
  route: RouteProp<{ params: Inspection }, "params">;
}

export const InspectionDetails: React.FC<Props> = ({ route }) => {
  console.log(route);

  return (
    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
      <StatusBox inspection={route.params} />
      <View style={{ height: 10 }} />
      <AssignedBox inspection={route.params} />
      <View style={{ height: 10 }} />
      <AdressBox inspection={route.params} />
      <View style={{ height: 20 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  content: {
    backgroundColor: "#fff",
    flex: 1,
    paddingTop: 5,
  },
});
