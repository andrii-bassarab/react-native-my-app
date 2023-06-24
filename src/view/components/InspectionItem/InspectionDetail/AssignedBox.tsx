import React, { useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { colors } from "~/view/theme";
import { InspectionItem } from "~/types/InspectionItem";
import EditIcon from "~/view/assets/icons/edit.svg";
import { ModalSwipeScreen } from "../../Custom/ModalSwipeScreen";
import { CustomSelect, OptionItem } from "../../Custom/CustomSelect";
import { getInspectionDate } from "~/utils/visibleDate";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import { actionsInspectionItem } from "~/modules/inspectionItem";
import { InspectionStatus } from "~/types/inspectionStatus";

interface Props {
  inspection: InspectionItem;
}

export const AssignedBox: React.FC<Props> = ({ inspection }) => {
  const dispatch = useAppDispatch();
  const { availableUsers } = useAppSelector((state) => state.user);
  const { inspectionItem, assignedOption } = useAppSelector((state) => state.inspectionItem);
  const [showModalAssigned, setShowModalAssigned] = useState(false);
  const assignedOptions = availableUsers.map((user) => ({
    value: user._id,
    name: user.fullName,
  }));
  const [assignedTo, setAssignedTo] = useState<OptionItem>(assignedOption);

  const closeModalAssigned = () => {
    setShowModalAssigned(false);
    setAssignedTo(assignedTo);
  };

  const saveAssignedTo = () => {
    setShowModalAssigned(false);
    typeof assignedTo !== "string" && dispatch(actionsInspectionItem.setAssignedOption(assignedTo));
  };

  return (
    <View style={[styles.card, styles.shadowProp]}>
      <View style={styles.label}>
        <Text style={styles.labelText}>Assigned:</Text>
        <View style={styles.assignedBox}>
          <Text style={styles.text}>{assignedOption.name}</Text>
          {inspection.status !== InspectionStatus.COMPLETE && (
            <TouchableOpacity onPress={() => setShowModalAssigned(true)}>
              <EditIcon color={colors.blue} height={15} width={15} />
            </TouchableOpacity>
          )}
        </View>
      </View>
      <View style={styles.label}>
        <Text style={styles.labelText}>Appointment Time:</Text>
        <Text style={styles.text}>
          {inspection.scheduledOn
            ? `${getInspectionDate(new Date(inspection.scheduledOn))} ${
                inspection.visitationRange
                  ? `from ${inspection.visitationRange}`
                  : ""
              }`
            : "--"}
        </Text>
      </View>
      <View style={styles.label}>
        <Text style={styles.labelText}>Inspection Type:</Text>
        <Text style={styles.text}>{inspection.inspectionType}</Text>
      </View>
      <View style={styles.label}>
        <Text style={styles.labelText}>Inspection Form:</Text>
        <Text style={styles.text}>{inspection.visibleInspectionForm}</Text>
      </View>
      {showModalAssigned && (
        <ModalSwipeScreen
          closeModalFunction={closeModalAssigned}
          height={"40%"}
          percentSwipeToClose={0.2}
        >
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Assigned To</Text>
            <CustomSelect
              data={assignedOptions}
              selectedItem={assignedTo}
              setSelectedItem={setAssignedTo}
            />
            <TouchableOpacity
              style={styles.modalSaveButton}
              onPress={saveAssignedTo}
            >
              <Text style={styles.modalSaveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </ModalSwipeScreen>
      )}
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
    flex: 1,
  },
  assignedBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    flex: 1,
  },
  shadowProp: {
    shadowColor: "#171717",
    shadowOffset: { width: -1, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
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
  modalContainer: {
    alignItems: "stretch",
    flex: 1,
    marginTop: "10%",
  },
  modalTitle: {
    color: colors.darkGrey,
    fontSize: 20,
    fontWeight: "600",
  },
  modalSaveButton: {
    paddingVertical: 6,
    width: "40%",
    borderRadius: 50,
    backgroundColor: colors.layout,
    marginTop: 20,
    alignItems: "center",
    alignSelf: "flex-end",
  },
  modalSaveButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
