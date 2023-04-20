import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { colors } from "~/view/theme";
import { Inspection } from "~/types/Inspection";
import EditIcon from "~/view/assets/icons/edit.svg";

interface Props {
  inspection: Inspection;
}

export const AssignedBox: React.FC<Props> = ({ inspection }) => {
  return (
    <View style={[styles.card, styles.shadowProp]}>
      <View style={styles.label}>
        <Text style={styles.labelText}>Assigned:</Text>
        <View style={{ flexDirection: "row", justifyContent: "space-between", flex: 1 }}>
          <Text style={styles.text}>{inspection.assigned}</Text>
          <TouchableOpacity>
            <EditIcon color={colors.blue} height={15} width={15} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.label}>
        <Text style={styles.labelText}>Appointment Time:</Text>
        <Text style={styles.text}>{inspection.date}</Text>
      </View>
      <View style={styles.label}>
        <Text style={styles.labelText}>Inspection Type:</Text>
        <Text style={styles.text}>Annual</Text>
      </View>
      <View style={styles.label}>
        <Text style={styles.labelText}>Inspection Form:</Text>
        <Text style={styles.text}>HQS</Text>
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
  },
  labelText: {
    color: "#8E8E8E",
    fontWeight: "600",
    flex: 0.8,
    marginRight: 10,
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
