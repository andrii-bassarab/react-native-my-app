import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { InspectionType } from "~/models/InspectionItem";
import { textStyles } from "~/view/theme";

interface Props {
  inspection: InspectionType;
}

export const CustomAttributes: React.FC<Props> = ({ inspection }) => {
  return (
    <View style={[styles.card, styles.shadowProp]}>
      <View style={styles.label}>
        <Text style={styles.labelText}>Custom Attributes:</Text>
          <Text style={styles.text}></Text>
      </View>
      <View style={styles.label}>
        <Text style={styles.labelText}>Dog on Premises:</Text>
        <Text style={styles.text}>No</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 15,
    width: "98%",
    flexWrap: "wrap",
    flex: 1,
  },
  shadowProp: {
    shadowColor: "#171717",
    shadowOffset: { width: -1, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  labelText: {
    color: "#8E8E8E",
    fontWeight: "600",
    flex: 0.8,
    marginRight: 10,
    ...textStyles.small,
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
    ...textStyles.small,
  },
});
