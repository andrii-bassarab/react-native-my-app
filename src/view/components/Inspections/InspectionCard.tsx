import React from "react";
import { StyleSheet, TouchableOpacity, View, Text } from "react-native";
import CalendarIcon from "../../assets/icons/calendar.svg";
import { colors, textStyles } from "~/view/theme";
import { getInspectionDate } from "~/utils/date/visibleDate";
import { getInspectionColorByStatus } from "~/utils/inspection/getInspectionColor";
import { InspectionType } from "~/models/InspectionItem";
import { normalize } from "~/utils/normalize/normalize";

interface Props {
  inspection: InspectionType;
  onPress: () => void;
}

export const InspectionCard: React.FC<Props> = ({ inspection: item, onPress }) => {
  const itemColor = getInspectionColorByStatus(item.visibleStatus);

  return (
    <TouchableOpacity style={[styles.card, styles.shadowProp]} onPress={onPress}>
      <View style={{ ...styles.mainInfo, borderColor: itemColor }}>
        <View style={styles.contentCard}>
          <Text style={{ ...styles.cardTitle, color: itemColor }}>
            {`Inspection ${item.unit.streetAddress}`}
          </Text>
          <Text style={{ color: itemColor, fontWeight: "600", marginLeft: 5, ...textStyles.small }}>{item.visibleStatus}</Text>
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
        {item.household?.headOfHouseholdId && item.visibleHouseholdName &&  (
          <Text style={styles.textInfo}>{item.visibleHouseholdName}</Text>
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
    paddingVertical: normalize(30),
    paddingHorizontal: "3%",
    width: "98%",
    flexWrap: "wrap",
  },
  contentCard: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    flex: 1
  },
  shadowProp: {
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  cardTitle: {
    ...textStyles.small,
    fontWeight: "500",
    flex: 1
  },
  mainInfo: {
    borderLeftWidth: 3,
    paddingLeft: 10,
    alignSelf: "stretch",
    width: "100%",
  },
  textInfo: {
    ...textStyles.mini,
    color: "#8E8E8E",
    flex: 4,
  },
  dateLabel: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginBottom: "1%",
    flexWrap: 'wrap'
  },
});
