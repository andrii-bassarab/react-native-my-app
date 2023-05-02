import React from "react";
import { StyleSheet, TouchableOpacity, View, Text } from "react-native";
import CalendarIcon from "../../assets/icons/calendar.svg";
import { colors } from "~/view/theme";
import { getInspectionDate } from "~/utils/visibleDate";
import { getInspectionColorByStatus } from "~/utils/getInspectionColor";
import { InspectionItem } from "~/types/InspectionItem";
import { HouseHoldName } from "./HouseHoldName";

interface Props {
  item: InspectionItem;
  onPress: () => void;
}

export const InspectionCard: React.FC<Props> = ({ item, onPress }) => {
  const itemColor = getInspectionColorByStatus(item.visibleStatus);

  return (
    <TouchableOpacity style={[styles.card, styles.shadowProp]} onPress={onPress}>
      <View style={{ ...styles.mainInfo, borderColor: itemColor }}>
        <View style={styles.contentCard}>
          <Text style={{ ...styles.cardTitle, color: itemColor }}>
            {`Inspection ${item.unit.streetAddress}`}
          </Text>
          <Text style={{ color: itemColor, fontWeight: "600" }}>{item.visibleStatus}</Text>
        </View>
        <View style={styles.dateLabel}>
          <CalendarIcon height={15} width={15} color={colors.primary} style={{ marginRight: 2 }} />
          <Text style={styles.textInfo}>
            {item.scheduledOn
              ? `Scheduled ${getInspectionDate(new Date(item.scheduledOn))} ${
                  item.visitationRange ? `from ${item.visitationRange}` : ""
                }`
              : `Created on ${getInspectionDate(new Date(item.createdOn))}`}
          </Text>
        </View>
        {item.household?.headOfHouseholdId && (
          <HouseHoldName inspection={item} />
        )}
        <Text style={styles.textInfo}>
          {`${item.unit.streetAddress} ${item.unit.city}, ${item.unit.state} ${item.unit.postalCode}`}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    justifyContent: "center",
    alignItems: "stretch",
    alignSelf: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingVertical: 20,
    paddingHorizontal: 10,
    width: "98%",
    flexWrap: "wrap",
  },
  contentCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
  },
  shadowProp: {
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "500",
  },
  mainInfo: {
    borderLeftWidth: 3,
    paddingLeft: 10,
    alignSelf: "stretch",
    width: "100%",
  },
  textInfo: {
    fontSize: 13,
    color: "#8E8E8E",
  },
  dateLabel: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginBottom: "1%",
  },
});
