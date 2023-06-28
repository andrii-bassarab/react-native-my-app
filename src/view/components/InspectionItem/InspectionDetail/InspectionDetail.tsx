import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { StatusBox } from "./StatusBox";
import { RouteProp } from "@react-navigation/native";
import { InspectionItem } from "~/types/InspectionItem";
import { AssignedBox } from "./AssignedBox";
import { AdressBox } from "./AdressBox";
import { CustomAttributes } from "./CustomAttributes";
import { normalize } from "~/utils/getWindowHeight";

interface Props {
  route: RouteProp<{ params: InspectionItem }, "params">;
}

export const InspectionDetails: React.FC<Props> = ({ route }) => {
  return (
    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
      <StatusBox inspection={route.params} />
      <View style={{ height: normalize(10) }} />
      <AssignedBox inspection={route.params} />
      <View style={{ height: normalize(10) }} />
      <AdressBox inspection={route.params} />
      <View style={{ height: normalize(10) }} />
      {/* <CustomAttributes inspection={route.params} /> */}
      <View style={{ height: normalize(20) }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  content: {
    backgroundColor: "#fff",
    flex: 1,
    paddingTop: 5,
    paddingHorizontal: "7%",
  },
});
