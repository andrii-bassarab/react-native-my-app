import React from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import CalendarIcon from "~/view/assets/icons/calendar.svg";
import { getInspectionColorByStatus } from "~/utils/getInspectionColor";
import { colors } from "../../theme";
import LeftErrow from "~/view/assets/icons/leftArrow.svg";
import { InspectionStatus } from "~/types/inspectionStatus";
import { Category } from "~/types/Category";
import { useAppDispatch } from "~/store/hooks";
import { actionsToastNotification } from "~/modules/toastNotification";
import { SelectedCategory } from "../InspectionItem/InspectionInspect/SelectedCategory";
import { InspectionItem } from "~/types/InspectionItem";
import { getInspectionDate } from "~/utils/visibleDate";

interface Props {
  item: InspectionItem;
  goBack: () => void;
  includeCategory?: boolean;
  category?: Category;
}

export const SelectedInspection: React.FC<Props> = ({
  item,
  goBack,
  includeCategory = false,
  category = null,
}) => {
  const dispatch = useAppDispatch();
  const showToast = (message: string) => dispatch(actionsToastNotification.showToastMessage(message));

  const itemColor = getInspectionColorByStatus(item.visibleStatus);

  return (
    <View style={[styles.card, styles.shadowProp]}>
      <TouchableOpacity style={styles.goBackButton} onPress={goBack}>
        <LeftErrow color={colors.primary} height={20} width={20} />
      </TouchableOpacity>
      <View
        style={{
          ...styles.mainInfo,
          borderColor: itemColor,
          borderLeftWidth: includeCategory ? 0 : 3,
          paddingLeft: includeCategory ? 0 : 10,
        }}
      >
        <View style={styles.content}>
          <Text style={{ ...styles.cardTitle, color: itemColor }}>
            {`Inspect ${item.unit?.streetAddress}`}
          </Text>
        </View>
        <View style={styles.dateLabel}>
          <CalendarIcon height={10} width={10} color={colors.primary} style={{ marginRight: 5 }} />
          <Text style={styles.textInfo}>
            {item.scheduledOn
              ? `Scheduled ${getInspectionDate(new Date(item.scheduledOn))} ${
                  item.visitationRange ? `from ${item.visitationRange}` : ""}`
              : `Created on ${getInspectionDate(new Date(item.createdOn))}`}
          </Text>
        </View>
        {(item.visibleStatus === InspectionStatus.NEW || item.visibleStatus === InspectionStatus.SCHEDULED) && (
          <TouchableOpacity style={styles.startInspectionButton}>
            <Text style={styles.startInspectionText}>Start Inspection</Text>
          </TouchableOpacity>
        )}
        {item.visibleStatus === InspectionStatus.INPROGRESS && (
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <TouchableOpacity
              style={[styles.startInspectionButton, styles.saveButton]}
              onPress={() => showToast("Success! Inspection saved.")}
            >
              <Text style={{ ...styles.startInspectionText, color: colors.blue }}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ ...styles.startInspectionButton, width: "48%" }}>
              <Text style={styles.startInspectionText}>Submit</Text>
            </TouchableOpacity>
          </View>
        )}
        {includeCategory && category && <SelectedCategory category={category} />}
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
    paddingLeft: 15,
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
    padding: 5,
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
  saveButton: {
    width: "48%",
    borderColor: colors.blue,
    borderWidth: 1,
    backgroundColor: "#fff",
  },
});
