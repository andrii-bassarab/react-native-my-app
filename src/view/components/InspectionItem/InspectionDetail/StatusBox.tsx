import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { useAppSelector } from "~/store/hooks";
import { InspectionItem } from "~/types/InspectionItem";
import { InspectionStatus } from "~/types/inspectionStatus";
import { getInspectionDate } from "~/utils/visibleDate";
import { textStyles } from "~/view/theme";

interface Props {
  inspection: InspectionItem;
}

export const StatusBox: React.FC<Props> = ({ inspection }) => {
  const { inspectionItem } = useAppSelector((state) => state.inspectionItem);

  return (
    <View style={[styles.card, styles.shadowProp]}>
      <View style={styles.label}>
        <Text style={styles.labelText}>Status:</Text>
        <Text style={styles.text}>{`${
          (inspectionItem?.status[0].toLocaleUpperCase() || "") +
          (inspectionItem?.status?.slice(1) || "")
        }`}</Text>
      </View>
      <View style={styles.label}>
        <Text style={styles.labelText}>Date Completed:</Text>
        <Text style={styles.text}>
          {inspection.completedOn
            ? `${getInspectionDate(new Date(inspection.completedOn))}`
            : "--"}
        </Text>
      </View>
      <View style={styles.label}>
        <Text style={styles.labelText}>Result:</Text>
        <Text style={styles.text}>
          {inspectionItem?.status === InspectionStatus.COMPLETE
            ? inspectionItem?.hasPassed
              ? "Passed"
              : "Failed"
            : "--"}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 15,
    width: "98%",
    flexWrap: "wrap",
  },
  shadowProp: {
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  labelText: {
    color: "#8E8E8E",
    fontWeight: "600",
    flex: 0.8,
    marginRight: 10,
    ...textStyles.little,
  },
  label: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 5,
  },
  text: {
    color: "#8E8E8E",
    fontWeight: "400",
    ...textStyles.little,
    flex: 1,
  },
});
