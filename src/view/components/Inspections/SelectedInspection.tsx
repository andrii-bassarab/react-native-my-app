import React, { useEffect, useState } from "react";
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
import { ModalLoader } from "../Loader/ModalLoader";

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
  const { startSignature, signatureCount, inspectionItem, assignedOption } = useAppSelector((state) => state.inspectionItem);
  const showToast = (message: string) => dispatch(actionsToastNotification.showToastMessage(message));
  const itemColor = getInspectionColorByStatus(item.visibleStatus);

  const [updateInspection, { loading, data, error }] = useMutation(UPDATE_INSPECTION);

  useEffect(() => {
    console.log('====================================');
    console.log("assignedOption", assignedOption)
    console.log("data", data)
    console.log("error", error)
    console.log('====================================');
  }, [assignedOption, data, error])

  const updateStatusCache = (status: string) => {
    return (cache: ApolloCache<any>, { data }: any) => {
      if (!data?.updateInspection?.affectedEntity?.id) {
        return;
      }

      const updatedItem = data?.updateInspection;
      const { inspections } = cache.readQuery({ query: GET_ALL_INSPECTIONS }) as {
        inspections: any;
      };

      const itemIndex = inspections.edges.findIndex(
        (edge: any) => edge.node.id === updatedItem?.affectedEntity?.id
      );

      if (itemIndex !== -1) {
        inspections.edges[itemIndex].node = {
          ...inspections.edges[itemIndex].node,
          status,
        };

        cache.writeQuery({
          query: GET_ALL_INSPECTIONS,
          data: { inspections },
        });
      }
    };
  };

  const updatDetailCache = (assignedTo: string) => {
    return (cache: ApolloCache<any>, { data }: any) => {
      if (!data?.updateInspection?.affectedEntity?.id) {
        return;
      }

      const updatedItem = data?.updateInspection;
      const { inspections } = cache.readQuery({ query: GET_ALL_INSPECTIONS }) as {
        inspections: any;
      };

      const itemIndex = inspections.edges.findIndex(
        (edge: any) => edge.node.id === updatedItem?.affectedEntity?.id
      );

      if (itemIndex !== -1) {
        inspections.edges[itemIndex].node = {
          ...inspections.edges[itemIndex].node,
          assignedTo,
        };

        cache.writeQuery({
          query: GET_ALL_INSPECTIONS,
          data: { inspections },
        });
      }
    };
  };

  const handleChangeInspectionStatus = async (status: string) => {
    await updateInspection({
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
      update: updateStatusCache(status),
    });
    dispatch(actionsInspectionItem.setInspectionStatus(status))
  };

  const handleChangeInspectionDetail = async (assignedTo: string, ) => {
    await updateInspection({
      variables: {
        command: {
          id: item.id,
          customerId: "pfdylv",
          siteId: "pfdylv",
          templateId: item.templateId,
          unitId: item.unit?.id,
          assignedTo,
          houseHoldId: item.household?.headOfHouseholdId || "5f6e70c53ddf6a0016378dbf",
          status: inspectionItem?.status,
          hasPassed: false,
          hasPermissionToEnter: item.hasPermissionToEnter,
          inspectionType: item.inspectionType,
          propertyType: item.propertyType,
          isReInspection: item.isReinspection,
          modifiedBy: "nazar.kubyk@appitventures.com",
        },
      },
      update: updatDetailCache(assignedTo),
    });
    dispatch(actionsInspectionItem.setInspectionAssigned(assignedTo));
    showToast("Success! Inspection saved.")
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
        {(inspectionItem?.visibleStatus === InspectionStatus.NEW || inspectionItem?.visibleStatus === InspectionStatus.SCHEDULED) &&
          !includeCategory && (
            <TouchableOpacity
              style={styles.startInspectionButton}
              onPress={() => handleChangeInspectionStatus("incomplete")}
            >
              <Text style={styles.startInspectionText}>Start Inspection</Text>
            </TouchableOpacity>
          )}
        {!startSignature && inspectionItem?.visibleStatus === InspectionStatus.INPROGRESS && !includeCategory && (
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <TouchableOpacity
              style={[styles.startInspectionButton, styles.saveButton]}
              onPress={() => handleChangeInspectionDetail(assignedOption.value)}
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
