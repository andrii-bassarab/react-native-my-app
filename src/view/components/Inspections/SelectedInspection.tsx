import React from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import CalendarIcon from "~/view/assets/icons/calendar.svg";
import { getInspectionColorByStatus } from "~/utils/getInspectionColor";
import { colors, textStyles } from "../../theme";
import LeftErrow from "~/view/assets/icons/leftArrow.svg";
import { InspectionVisibleStatus } from "~/types/inspectionStatus";
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
import { normalize } from "~/utils/getWindowHeight";

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
  const { profile }= useAppSelector((state) => state.user);
  const showToast = (message: string) => dispatch(actionsToastNotification.showToastMessage(message));
  const itemColor = getInspectionColorByStatus(inspectionItem?.visibleStatus || '');

  const [updateInspection, { loading }] = useMutation(UPDATE_INSPECTION);

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

  const updatDetailCache = (assignedTo: string | null) => {
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

  const updatStatusSubmitCache = () => {
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
          status: "complete",
          hasPassed: false,
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
          modifiedBy: profile?.email || "",
        },
      },
      update: updateStatusCache(status),
    });
    dispatch(actionsInspectionItem.setInspectionStatus(status))
  };

  const handleChangeInspectionDetail = async (assignedTo: string | null ) => {
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
          modifiedBy: profile?.email || "",
        },
      },
      update: updatDetailCache(assignedTo),
    });
    dispatch(actionsInspectionItem.setInspectionAssigned(assignedTo));
    showToast("Success! Inspection saved.")
  };

  const handleSubmitInspection = async () => {
    await updateInspection({
      variables: {
        command: {
          id: item.id,
          customerId: "pfdylv",
          siteId: "pfdylv",
          templateId: item.templateId,
          unitId: item.unit?.id,
          assignedTo: inspectionItem?.assignedTo || "5e94b7f0fa86cf0016c4d92c",
          houseHoldId: item.household?.headOfHouseholdId || "5f6e70c53ddf6a0016378dbf",
          status: "complete",
          hasPassed: false,
          hasPermissionToEnter: item.hasPermissionToEnter,
          inspectionType: item.inspectionType,
          propertyType: item.propertyType,
          isReInspection: item.isReinspection,
          modifiedBy: profile?.email || "",
        },
      },
      update: updatStatusSubmitCache(),
    });
    dispatch(actionsInspectionItem.setInspectionStatus("complete"));
    showToast("Success! Inspection submited.");
    dispatch(actionsInspectionItem.setStartSignature(false));
  };

  return (
    <View style={[styles.card, styles.shadowProp]}>
      <TouchableOpacity style={styles.goBackButton} onPress={goBack}>
        <LeftErrow color={colors.primary} height={normalize(25)} width={normalize(25)} />
      </TouchableOpacity>
      <View
        style={{
          ...styles.mainInfo,
          borderColor: itemColor,
          borderLeftWidth: includeCategory ? 0 : normalize(4),
          paddingLeft: includeCategory ? 0 : normalize(15),
        }}
      >
        <View style={styles.content}>
          <Text style={{ ...styles.cardTitle, color: itemColor }}>
            {`Inspect ${item?.unit?.streetAddress}`}
          </Text>
        </View>
        <View style={styles.dateLabel}>
          <CalendarIcon height={normalize(20)} width={normalize(20)} color={colors.primary} style={{ marginRight: 5 }} />
          <Text style={styles.textInfo}>
            {item?.scheduledOn
              ? `Scheduled ${getInspectionDate(new Date(item?.scheduledOn))} ${
                  item?.visitationRange ? `from ${item?.visitationRange}` : ""
                }`
              : `Created on ${getInspectionDate(new Date(item?.createdOn || item.createdOn))}`}
          </Text>
        </View>
        {(inspectionItem?.visibleStatus === InspectionVisibleStatus.NEW || inspectionItem?.visibleStatus === InspectionVisibleStatus.SCHEDULED) &&
          !includeCategory && (
            <TouchableOpacity
              style={styles.startInspectionButton}
              onPress={() => handleChangeInspectionStatus("incomplete")}
            >
              <Text style={styles.startInspectionText}>Start Inspection</Text>
            </TouchableOpacity>
          )}
        {!startSignature && inspectionItem?.visibleStatus === InspectionVisibleStatus.INPROGRESS && !includeCategory && (
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
            onPress={handleSubmitInspection}
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
    paddingVertical: normalize(15),
    paddingLeft: normalize(15),
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
    fontWeight: "500",
    marginBottom: '1%',
    ...textStyles.regular,
  },
  mainInfo: {
    flex: 1,
    borderLeftWidth: 3,
    paddingLeft: normalize(15),
    alignSelf: "stretch",
    width: "100%",
    paddingRight: 5,
  },
  textInfo: {
    ...textStyles.little,
    color: "#8E8E8E",
    paddingRight: '3%'
  },
  dateLabel: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  goBackButton: {
    padding: normalize(10),
    borderWidth: 1,
    borderColor: colors.blue,
    marginRight: normalize(20),
    borderRadius: 6,
  },
  startInspectionButton: {
    alignSelf: "flex-end",
    marginTop: "5%",
    paddingVertical: normalize(5),
    paddingHorizontal: normalize(25),
    backgroundColor: colors.layout,
    borderRadius: normalize(25),
    textAlign: "justify",
    justifyContent: "center",
    alignItems: "center",
  },
  startInspectionText: {
    color: "#fff",
    fontWeight: "600",
    ...textStyles.small,
  },
  saveButton: {
    width: "48%",
    borderColor: colors.blue,
    borderWidth: 1,
    backgroundColor: "#fff",
  },
  startSignatureButton: {
    width: "90%",
    backgroundColor: colors.green,
    alignSelf: "center",
    paddingVertical: '1.5%'
  },
});
