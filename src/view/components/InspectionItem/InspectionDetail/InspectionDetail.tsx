import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { StatusBox } from "./StatusBox";
import { RouteProp } from "@react-navigation/native";
import { InspectionType } from "~/models/InspectionItem";
import { AssignedBox } from "./AssignedBox";
import { AdressBox } from "./AdressBox";
import { CustomAttributes } from "./CustomAttributes";
import { normalize } from "~/utils/normalize/normalize";
import { useAppSelector } from "~/store/hooks";

interface Props {
  route: RouteProp<{ params: InspectionType }, "params">;
}

export const InspectionDetails: React.FC<Props> = ({ route }) => {
  const { inspectionItem } = useAppSelector((state) => state.inspectionItem);

  return (
    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
      <StatusBox inspection={inspectionItem} />
      <View style={{ height: normalize(10) }} />
      <AssignedBox inspection={inspectionItem} />
      <View style={{ height: normalize(10) }} />
      <AdressBox inspection={inspectionItem} />
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
