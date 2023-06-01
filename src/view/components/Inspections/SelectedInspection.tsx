import React, { useState } from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import CalendarIcon from "~/view/assets/icons/calendar.svg";
import { getInspectionColorByStatus } from "~/utils/getInspectionColor";
import { colors } from "../../theme";
import LeftErrow from "~/view/assets/icons/leftArrow.svg";
import { InspectionStatus } from "~/types/inspectionStatus";
import { Category } from "~/types/Category";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import { actionsToastNotification } from "~/modules/toastNotification";
import { SelectedCategory } from "../InspectionItem/InspectionInspect/SelectedCategory";
import { InspectionItem } from "~/types/InspectionItem";
import { getInspectionDate } from "~/utils/visibleDate";
import { actionsInspectionItem } from "~/modules/inspectionItem";
import { ApolloCache, useMutation } from "@apollo/client";
import { GET_ALL_INSPECTIONS, UPDATE_INSPECTION } from "~/services/api/inspections";
import { ModalLoader } from "../Custom/ModalLoader";

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
  const startSignatureScreen = () => dispatch(actionsInspectionItem.setStartSignature(true));
  const { startSignature, signatureCount } = useAppSelector((state) => state.inspectionItem);
  const [dynamicStatus, setDynamicStatus] = useState(item.visibleStatus);

  const showToast = (message: string) => dispatch(actionsToastNotification.showToastMessage(message));
  const itemColor = getInspectionColorByStatus(item.visibleStatus);

  const [updateInspection, { loading }] = useMutation(UPDATE_INSPECTION);

  const updateCache = (status: string) => {
    return (cache: ApolloCache<any>, { data }: any) => {
      if (!data?.updateInspection?.affectedEntity?.id) {
        return;
      }

      // Get the updated inspection item from the mutation response
      const updatedItem = data?.updateInspection;

      // Read the existing inspections list from the cache
      const { inspections } = cache.readQuery({ query: GET_ALL_INSPECTIONS }) as {
        inspections: any;
      };

      // Find the index of the updated item in the list
      const itemIndex = inspections.edges.findIndex(
        (edge: any) => edge.node.id === updatedItem?.affectedEntity?.id
      );

      if (itemIndex !== -1) {
        // Replace the item with the updated item
        inspections.edges[itemIndex].node = {
          ...inspections.edges[itemIndex].node,
          status,
        };

        // Write the modified inspections list back to the cache
        cache.writeQuery({
          query: GET_ALL_INSPECTIONS,
          data: { inspections },
        });
        setDynamicStatus(InspectionStatus.INPROGRESS);
      }
    };
  };

  const handleChangeInspectionStatus = (status: string) => {
    updateInspection({
      variables: {
        command: {
          id: item.id,
          customerId: "pfdylv",
          siteId: "pfdylv",
          templateId: item.templateId,
          unitId: item.unit?.id,
          assignedTo: item.assignedTo || "5e94b7f0fa86cf0016c4d92c",
          houseHoldId: item.household?.headOfHouseholdId || "5f6e70c53ddf6a0016378dbf",
          status,
          hasPassed: false,
          hasPermissionToEnter: item.hasPermissionToEnter,
          inspectionType: item.inspectionType,
          propertyType: item.propertyType,
          isReInspection: item.isReinspection,
          modifiedBy: "nazar.kubyk@appitventures.com",
        },
      },
      update: updateCache(status),
    });
  };

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
            {`Inspect ${item?.unit?.streetAddress}`}
          </Text>
        </View>
        <View style={styles.dateLabel}>
          <CalendarIcon height={10} width={10} color={colors.primary} style={{ marginRight: 5 }} />
          <Text style={styles.textInfo}>
            {item?.scheduledOn
              ? `Scheduled ${getInspectionDate(new Date(item?.scheduledOn))} ${
                  item?.visitationRange ? `from ${item?.visitationRange}` : ""
                }`
              : `Created on ${getInspectionDate(new Date(item?.createdOn || item.createdOn))}`}
          </Text>
        </View>
        {(dynamicStatus === InspectionStatus.NEW || dynamicStatus === InspectionStatus.SCHEDULED) &&
          !includeCategory && (
            <TouchableOpacity
              style={styles.startInspectionButton}
              onPress={() => handleChangeInspectionStatus("incomplete")}
            >
              <Text style={styles.startInspectionText}>Start Inspection</Text>
            </TouchableOpacity>
          )}
        {!startSignature && dynamicStatus === InspectionStatus.INPROGRESS && !includeCategory && (
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <TouchableOpacity
              style={[styles.startInspectionButton, styles.saveButton]}
              onPress={() => handleChangeInspectionStatus("scheduled")}
            >
              <Text style={{ ...styles.startInspectionText, color: colors.blue }}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ ...styles.startInspectionButton, width: "48%" }}
              onPress={startSignatureScreen}
            >
              <Text style={styles.startInspectionText}>Submit</Text>
            </TouchableOpacity>
          </View>
        )}
        {startSignature && (
          <TouchableOpacity
            style={[styles.startInspectionButton, styles.startSignatureButton]}
            disabled={signatureCount !== 3}
          >
            <Text style={{ ...styles.startInspectionText, color: "#fff" }}>
              {signatureCount === 3 ? "Complete" : "Pass Remaining and Submit"}
            </Text>
          </TouchableOpacity>
        )}
        {includeCategory && category && <SelectedCategory category={category} />}
      </View>
      {loading && <ModalLoader />}
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
    elevation: 3,
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
    paddingRight: 5,
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
    marginTop: "5%",
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
  startSignatureButton: {
    width: "100%",
    backgroundColor: colors.green,
    alignSelf: "center",
  },
});
