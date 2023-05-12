import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { Text, StyleSheet } from "react-native";
import { GET_HOUSEHOLD_NAME, getHouseHoldNameById } from "~/services/api/HouseHoldMembers";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import { actionsInspections } from "~/modules/inspections";
import { InspectionItem } from "~/types/InspectionItem";

interface Props {
  inspection: InspectionItem;
}

export const HouseHoldName: React.FC<Props> = ({ inspection }) => {
  const dispatch = useAppDispatch();
  // const {inspections} = useAppSelector(state => state.inspections);

  // useEffect(() => {

  //   console.log('====================================');
  //   console.log("Renderrrrrrr");
  //   console.log('====================================');

  //   getHouseHoldNameById(inspection.household.headOfHouseholdId)
  //     .then((res) => {
  //       const nameResponse = res.data?.householdMembers?.edges[0]?.node;

  //       if (nameResponse) {
  //         const newHouseHoldName = `${nameResponse.firstName}${nameResponse.middleName ? (" " + nameResponse.middleName) : ""} ${nameResponse.lastName}`;

  //         dispatch(actionsInspections.setVisibleHouseholdName([inspection.id, newHouseHoldName]));
  //       }
  //     });
  // }, []);

  // const { loading, error, data } = useQuery(GET_HOUSEHOLD_NAME, {
  //   variables: {
  //     householdId: "6157769d2dc0505b2c7259c8",
  //   },
  // });

  // console.log("headOfHouseholdId", headOfHouseholdId);
  // console.log("error", error);
  // console.log("loading", loading);
  // console.log("data", data?.householdMembers?.edges[0]?.node);

  if (!inspection.visibleHouseholdName) return null;

  return <Text style={styles.textInfo}>{inspection.visibleHouseholdName}</Text>;
};

const styles = StyleSheet.create({
  textInfo: {
    fontSize: 13,
    color: "#8E8E8E",
  },
});
