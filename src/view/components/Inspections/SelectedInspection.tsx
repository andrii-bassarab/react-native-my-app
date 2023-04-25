import React, { useState } from "react";
import { TouchableOpacity, View, Text, StyleSheet, TextInput } from "react-native";
import CalendarIcon from "~/view/assets/icons/calendar.svg";
import { getInspectionColorByStatus } from "~/utils/getInspectionColor";
import { colors } from "../../theme";
import LeftErrow from "~/view/assets/icons/leftArrow.svg";
import { InspectionStatus } from "~/types/inspectionStatus";
import { Category } from "~/types/Category";
import { CustomToggleInput } from "../Custom/CustomToggleInput";
import { useAppDispatch } from "~/store/hooks";
import { actionsToastNotification } from "~/modules/toastNotification";

interface Props {
  item: {
    title: string;
    date: string;
    location: string;
    status: string;
    extra?: string;
  };
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
  const { title, date, location, status, extra } = item;
  const [categoryIncludeInspection, setCategoryIncludeInspection] = useState(true);

  const dispatch = useAppDispatch();
  const showToast = (message: string) =>
    dispatch(actionsToastNotification.showToastMessage(message));

  const itemColor = getInspectionColorByStatus(status);

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
        {includeCategory && category && (
          <View style={styles.categoryBox}>
            <Text style={{ fontSize: 18, fontWeight: "700", color: colors.darkGrey }}>
              {category.title}
            </Text>
            <View style={styles.content}>
              <View style={{ flex: 1 }}>
                <View style={styles.label}>
                  <Text style={styles.labelText}>Status:</Text>
                  <Text style={styles.text}>{category.status}</Text>
                </View>
                <View style={styles.label}>
                  <Text style={styles.labelText}>Result:</Text>
                  <Text style={styles.text}>{category.result}</Text>
                </View>
              </View>
              <View style={{ flex: 0.6 }}>
                <View style={styles.label}>
                  <Text style={{ ...styles.labelText, flex: 1.4 }}>Items:</Text>
                  <Text style={styles.text}>{category.items}</Text>
                </View>
                <View style={styles.label}>
                  <Text style={{ ...styles.labelText, flex: 1.4 }}>Photos:</Text>
                  <Text style={styles.text}>{category.photos}</Text>
                </View>
              </View>
            </View>
            <View style={styles.applyCategoryBox}>
              <Text style={styles.categoryApplyText}>
                Does this category apply to the inspection?
              </Text>
              <CustomToggleInput
                value={categoryIncludeInspection}
                onValueChange={setCategoryIncludeInspection}
              />
            </View>
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
  categoryBox: {
    marginTop: 10,
    borderTopWidth: 4,
    borderColor: "#EBEBEB",
    paddingTop: 5,
  },
  labelText: {
    color: "#8E8E8E",
    fontWeight: "600",
    flex: 0.5,
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
  categoryApplyText: {
    fontSize: 12,
    flex: 1,
    marginRight: 10,
    color: colors.darkGrey,
  },
  applyCategoryBox: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingRight: 10,
  },
});
