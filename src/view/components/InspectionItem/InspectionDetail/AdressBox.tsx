import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { colors } from "~/view/theme";
import { Inspection } from "~/types/Inspection";
import EditIcon from "~/view/assets/icons/edit.svg";

interface Props {
  inspection: Inspection;
}

const mocksDetails = [
  { name: "Bedrooms:", count: "2" },
  { name: "Bathrooms:", count: "2" },
  { name: "Sq. ft:", count: "--" },
  { name: "Handicap:", count: "No" },
  { name: "Year Built:", count: "--" },
];

export const AdressBox: React.FC<Props> = ({ inspection }) => {
  return (
    <View style={[styles.card, styles.shadowProp]}>
      <View style={styles.label}>
        <Text style={styles.labelText}>Address:</Text>
        <View style={{ flexDirection: "row", justifyContent: "space-between", flex: 1 }}>
          <Text style={styles.text}>{inspection.location}</Text>
          <TouchableOpacity>
            <EditIcon color={colors.blue} height={15} width={15} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.label}>
        <Text style={styles.labelText}>Tenant:</Text>
        <Text style={styles.text}>Samwise Gamgee</Text>
      </View>
      <View style={styles.label}>
        <Text style={styles.labelText}>Last Inspection Date:</Text>
        <Text style={styles.text}>April 20, 2023</Text>
      </View>
      <View style={styles.label}>
        <Text style={styles.labelText}>Permission to Enter:</Text>
        <Text style={styles.text}>Yes</Text>
      </View>
      <View style={styles.label}>
        <Text style={styles.labelText}>Details:</Text>
        <View style={{ flex: 1 }}>
          {mocksDetails.map((item, index) => (
            <View key={index} style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={styles.text}>{item.name}</Text>
              <Text style={styles.text}>{item.count}</Text>
            </View>
          ))}
        </View>
      </View>
      <View style={styles.label}>
        <Text style={styles.labelText}>Landlord:</Text>
        <Text style={styles.text}>Saruman Istar</Text>
      </View>
      <View style={styles.label}>
        <Text style={styles.labelText}>Phone:</Text>
        <Text style={styles.text}>{"(123) 123-1234"}</Text>
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
    flexWrap: "wrap",
    marginBottom: 5,
  },
  text: {
    color: "#8E8E8E",
    fontWeight: "400",
    flex: 1,
    fontSize: 13,
  },
});
