import React from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import CalendarIcon from "~/view/assets/icons/calendar.svg";
import { getInspectionColorByStatus } from "~/utils/getInspectionColor";
import { colors } from "../../theme";
import LeftErrow from "~/view/assets/icons/leftArrow.svg";
import { InspectionStatus } from "~/types/inspectionStatus";

interface Props {
  item: {
    title: string;
    date: string;
    location: string;
    status: string;
    extra?: string;
  };
  goBack: () => void;
}

export const SelectedInspection: React.FC<Props> = ({ item, goBack }) => {
  const { title, date, location, status, extra } = item;

  const itemColor = getInspectionColorByStatus(status);

  return (
    <View style={[styles.card, styles.shadowProp]}>
      <TouchableOpacity style={styles.goBackButton} onPress={goBack}>
        <LeftErrow color={colors.primary} height={20} width={20} />
      </TouchableOpacity>
      <View style={{ ...styles.mainInfo, borderColor: itemColor }}>
        <View style={styles.content}>
          <Text style={{ ...styles.cardTitle, color: itemColor }}>{title}</Text>
        </View>
        <View style={styles.dateLabel}>
          <CalendarIcon height={10} width={10} color={colors.primary} style={{ marginRight: 5 }} />
          <Text style={styles.textInfo}>{date}</Text>
        </View>
        {(status === InspectionStatus.NEW || status === InspectionStatus.SCHEDULED) && (
          <TouchableOpacity style={styles.startInspectionButton}>
            <Text style={styles.startInspectionText}>Start Inspection</Text>
          </TouchableOpacity>
        )}
        {status === InspectionStatus.INPROGRESS && (
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <TouchableOpacity style={{ ...styles.startInspectionButton, width: "48%", borderColor: colors.blue, borderWidth: 1, backgroundColor: '#fff' }}>
              <Text style={{...styles.startInspectionText, color: colors.blue}}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ ...styles.startInspectionButton, width: "48%" }}>
              <Text style={styles.startInspectionText}>Submit</Text>
            </TouchableOpacity>
          </View>
        )}
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
    flex: 1,
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
  },
  goBackButton: {
    padding: 8,
    borderWidth: 1,
    borderColor: colors.blue,
    marginRight: 10,
    borderRadius: 6,
  },
  startInspectionButton: {
    alignSelf: "flex-end",
    marginTop: 15,
    paddingVertical: 5,
    paddingHorizontal: 20,
    backgroundColor: colors.layout,
    borderRadius: 20,
    textAlign: "justify",
    justifyContent: "center",
    alignItems: "center",
  },
  startInspectionText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
