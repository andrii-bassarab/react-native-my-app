import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
} from "react-native";
import { colors } from "~/view/theme";
import { InspectionItem } from "~/types/InspectionItem";
import EditIcon from "~/view/assets/icons/edit.svg";
import { InspectionStatus, InspectionVisibleStatus } from "~/types/inspectionStatus";
import { ModalSwipeScreen } from "../../Custom/ModalSwipeScreen";
import { getInspectionDate } from "~/utils/visibleDate";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import { actionsInspectionItem } from "~/modules/inspectionItem";
import { KeyboardAvoidingDisplayComponent } from "~/view/hoc/KeyboardAvoidingDisplayComponent";

interface Props {
  inspection: InspectionItem;
}

export const AdressBox: React.FC<Props> = ({ inspection }) => {
  const dispatch = useAppDispatch();
  const [showModalPhoneNumber, setShowModalPhoneNumber] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const { visiblePhoneNumber } = useAppSelector(
    (state) => state.inspectionItem
  );

  const formatPhoneNumber = (input: string) => {
    let phoneNumber = input.replace(/\D/g, "");

    phoneNumber = phoneNumber.slice(0, 10);

    const phoneNumberLength = phoneNumber.length;
    if (phoneNumberLength > 6) {
      phoneNumber = `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(
        3,
        6
      )}-${phoneNumber.slice(6)}`;
    } else if (phoneNumberLength > 3) {
      phoneNumber = `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    } else {
      phoneNumber = `${phoneNumber}`;
    }

    return phoneNumber;
  };

  const handleChangeText = (input: string) => {
    const formattedPhoneNumber = formatPhoneNumber(input);
    setPhoneNumber(formattedPhoneNumber);
  };

  const handleSavePhoneNumber = () => {
    dispatch(actionsInspectionItem.setVisiblePhoneNumber(phoneNumber));
    setShowModalPhoneNumber(false);
  };

  const handleCloseModalPhone = () => {
    setShowModalPhoneNumber(false);
    setPhoneNumber("");
  };

  return (
    <KeyboardAvoidingDisplayComponent>
      <View style={[styles.card, styles.shadowProp]}>
        <View style={styles.label}>
          <Text style={styles.labelText}>Address:</Text>
          <View style={styles.assignedContainer}>
            <Text style={styles.text}>
              {`${inspection.unit.streetAddress} ${inspection.unit.city}, ${inspection.unit.state} ${inspection.unit.postalCode}`}
            </Text>
            {inspection.status !== InspectionStatus.COMPLETE && (
              <TouchableOpacity onPress={() => setShowModalPhoneNumber(true)}>
                <EditIcon color={colors.blue} height={15} width={15} />
              </TouchableOpacity>
            )}
          </View>
        </View>
        <View style={styles.label}>
          <Text style={styles.labelText}>Tenant:</Text>
          <Text style={styles.text}>{inspection.visibleHouseholdName}</Text>
        </View>
        <View style={styles.label}>
          <Text style={styles.labelText}>Last Inspection Date:</Text>
          <Text style={styles.text}>
            {inspection.completedOn
              ? `${getInspectionDate(new Date(inspection.completedOn))}`
              : "--"}
          </Text>
        </View>
        <View style={styles.label}>
          <Text style={styles.labelText}>Permission to Enter:</Text>
          <Text style={styles.text}>
            {inspection.hasPermissionToEnter ? "Yes" : "No"}
          </Text>
        </View>
        <View style={styles.label}>
          <Text style={styles.labelText}>Details:</Text>
          <View style={{ flex: 1 }}>
            <View style={styles.detailBox}>
              <Text style={styles.text}>Bedrooms:</Text>
              <Text style={styles.text}>
                {inspection.unit.numberOfBedrooms}
              </Text>
            </View>
            <View style={styles.detailBox}>
              <Text style={styles.text}>Bathroom:</Text>
              <Text style={styles.text}>
                {inspection.unit.numberOfBathrooms}
              </Text>
            </View>
            <View style={styles.detailBox}>
              <Text style={styles.text}>Sq. ft:</Text>
              <Text style={styles.text}>
                {inspection.unit.squareFootage || "--"}
              </Text>
            </View>
            <View style={styles.detailBox}>
              <Text style={styles.text}>Handicap:</Text>
              <Text style={styles.text}>
                {inspection.unit.isHandicapAccessible ? "Yes" : "No"}
              </Text>
            </View>
            <View style={styles.detailBox}>
              <Text style={styles.text}>Year Built:</Text>
              <Text style={styles.text}>
                {inspection.unit.yearConstructed || "--"}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.label}>
          <Text style={styles.labelText}>Landlord:</Text>
          <Text style={styles.text}>{`${
            inspection.unit.landlord?.firstName || ""
          } ${inspection.unit.landlord?.lastName || ""}`}</Text>
        </View>
        <View style={styles.label}>
          <Text style={styles.labelText}>Phone:</Text>
          <Text style={styles.text}>{visiblePhoneNumber || null}</Text>
        </View>
        {showModalPhoneNumber && (
          <ModalSwipeScreen
            closeModalFunction={handleCloseModalPhone}
            height={"40%"}
            percentSwipeToClose={0.2}
          >
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Edit Phone Number</Text>
              <View style={[styles.phoneLabel, styles.shadowProp]}>
                <View style={{ paddingHorizontal: 20 }}>
                  <Image
                    source={require("~/view/assets/images/flagUSA.png")}
                    style={styles.modalFlag}
                  />
                </View>
                <TextInput
                  value={phoneNumber}
                  onChangeText={handleChangeText}
                  style={styles.modalPhoneNumber}
                  placeholder="(123) 123-1234"
                  keyboardType="phone-pad"
                />
              </View>
              <TouchableOpacity
                style={styles.modalSaveButton}
                onPress={handleSavePhoneNumber}
              >
                <Text style={styles.modalSaveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </ModalSwipeScreen>
        )}
      </View>
    </KeyboardAvoidingDisplayComponent>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 15,
    width: "98%",
    flexWrap: "wrap",
  },
  assignedContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    flex: 1,
  },
  shadowProp: {
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 2 },
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
    flexWrap: "wrap",
    marginBottom: 5,
  },
  text: {
    color: "#8E8E8E",
    fontWeight: "400",
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
  phoneLabel: {
    borderRadius: 50,
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 2,
    marginTop: 20,
  },
  modalPhoneNumber: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderLeftWidth: 3,
    borderColor: "#EBEBEB",
  },
  modalFlag: {
    width: 20,
    resizeMode: "contain",
  },
  detailBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
  },
});
