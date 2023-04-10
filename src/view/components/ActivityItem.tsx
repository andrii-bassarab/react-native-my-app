import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import CalendarIcon from '../assets/icons/calendar.svg';
import { colors } from "../theme";

interface Props {
  item: {
    title: string;
    date: string;
    location: string;
    status: string;
    extra?: string;
  };
}

export const ActivityItem: React.FC<Props> = ({ item }) => {
  const { title, date, location, status, extra } = item;

  let itemColor = "#54B9D1";

  switch (status) {
    case "In Progress":
    case "Scheduled":
    case "New":
      itemColor = "#54B9D1";
      break;
    case "Passed":
      itemColor = "#96BF5B";
      break;
    case "Failed":
      itemColor = "#ED6A5F";
      break;
    default:
      itemColor = "#54B9D1";
  }

  return (
    <TouchableOpacity style={[styles.card, styles.shadowProp]}>
      <View style={{ ...styles.mainInfo, borderColor: itemColor }}>
        <View style={styles.content}>
          <Text style={{ ...styles.cardTitle, color: itemColor }}>{title}</Text>
          <Text style={{ color: itemColor, fontWeight: "600" }}>{status}</Text>
        </View>
        <View style={styles.dateLabel}>
          <CalendarIcon height={15} width={15} color={colors.primary} style={{marginRight: 5}} />
          <Text style={styles.textInfo}>{date}</Text>
        </View>
        {extra && <Text style={styles.textInfo}>{extra}</Text>}
        <Text style={styles.textInfo}>{location}</Text>
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
  content: {
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
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  }
});
