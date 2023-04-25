import React, { useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity, TextInput, Image } from "react-native";
import { colors } from "~/view/theme";
import { Inspection } from "~/types/Inspection";
import EditIcon from "~/view/assets/icons/edit.svg";
import { InspectionStatus } from "~/types/inspectionStatus";
import { ModalScreen } from "../../Custom/ModalScreen";

interface Props {
  inspection: Inspection;
}

const mocksDetails = [
  { name: "Bedrooms:", count: "2" },
  { name: "Bathrooms:", count: "2" },
  { name: "Sq. ft:", count: "--" },
  { name: "Handicap:", count: "No" },
  { name: "Year Built:", count: "--" },
];

export const AdressBox: React.FC<Props> = ({ inspection }) => {
  const [showModalPhoneNumber, setShowModalPhoneNumber] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");

  const formatPhoneNumber = (input: string) => {
    let phoneNumber = input.replace(/\D/g, "");

    phoneNumber = phoneNumber.substring(0, 10);

    const phoneNumberLength = phoneNumber.length;
    if (phoneNumberLength > 6) {
      phoneNumber = `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6)}`;
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

  return (
    <View style={[styles.card, styles.shadowProp]}>
      <View style={styles.label}>
        <Text style={styles.labelText}>Address:</Text>
        <View style={{ flexDirection: "row", justifyContent: "space-between", flex: 1 }}>
          <Text style={styles.text}>{inspection.location}</Text>
          {inspection.status !== InspectionStatus.FAILED &&
            inspection.status !== InspectionStatus.PASSED && (
              <TouchableOpacity onPress={() => setShowModalPhoneNumber(true)}>
                <EditIcon color={colors.blue} height={15} width={15} />
              </TouchableOpacity>
            )}
        </View>
      </View>
      <View style={styles.label}>
        <Text style={styles.labelText}>Tenant:</Text>
        <Text style={styles.text}>Samwise Gamgee</Text>
      </View>
      <View style={styles.label}>
        <Text style={styles.labelText}>Last Inspection Date:</Text>
        <Text style={styles.text}>April 20, 2023</Text>
      </View>
      <View style={styles.label}>
        <Text style={styles.labelText}>Permission to Enter:</Text>
        <Text style={styles.text}>Yes</Text>
      </View>
      <View style={styles.label}>
        <Text style={styles.labelText}>Details:</Text>
        <View style={{ flex: 1 }}>
          {mocksDetails.map((item, index) => (
            <View key={index} style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={styles.text}>{item.name}</Text>
              <Text style={styles.text}>{item.count}</Text>
            </View>
          ))}
        </View>
      </View>
      <View style={styles.label}>
        <Text style={styles.labelText}>Landlord:</Text>
        <Text style={styles.text}>Saruman Istar</Text>
      </View>
      <View style={styles.label}>
        <Text style={styles.labelText}>Phone:</Text>
        <Text style={styles.text}>{"(123) 123-1234"}</Text>
      </View>
      {showModalPhoneNumber && (
        <ModalScreen
          closeModalFunction={() => setShowModalPhoneNumber(false)}
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
            <TouchableOpacity style={styles.modalSaveButton} onPress={() => setShowModalPhoneNumber(false)}>
              <Text style={styles.modalSaveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </ModalScreen>
      )}
    </View>
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
  shadowProp: {
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
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
    marginTop: 20
  },
  modalPhoneNumber: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderLeftWidth: 3,
    borderColor: "#EBEBEB"
  },
  modalFlag: {
    width: 20,
    resizeMode: "contain",
  },
});
