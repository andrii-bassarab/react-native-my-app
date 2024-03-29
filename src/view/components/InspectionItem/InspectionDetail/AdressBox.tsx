import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  Keyboard,
  Animated,
  Alert,
} from "react-native";
import { colors, textStyles } from "~/view/theme";
import { InspectionType } from "~/models/InspectionItem";
import EditIcon from "~/view/assets/icons/edit.svg";
import { InspectionStatus } from "~/types/inspectionStatus";
import { ModalSwipeScreen } from "../../Custom/ModalSwipeScreen";
import { getInspectionDate } from "~/utils/date/visibleDate";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import { actionsInspectionItem } from "~/modules/inspectionItem";
import { KeyboardAvoidingDisplayComponent } from "~/view/hoc/KeyboardAvoidingDisplayComponent";
import { normalize } from "~/utils/normalize/normalize";
import { updateHouseHoldPhoneNumber } from "~/services/api/houseHold/UpdateHouseholdLandlord";
import { ModalLoader } from "../../Loader/ModalLoader";
import { actionsInspections } from "~/modules/inspections";

interface Props {
  inspection: InspectionType;
}

export const AdressBox: React.FC<Props> = ({ inspection }) => {
  const dispatch = useAppDispatch();
  const [showModalPhoneNumber, setShowModalPhoneNumber] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const { visiblePhoneNumber, inspectionItem } = useAppSelector((state) => state.inspectionItem);
  const { profile, selectedSite } = useAppSelector((state) => state.user);
  const { inspections } = useAppSelector((state) => state.inspections);

  const [loader, setLoader] = useState(false);
  const [keyboardStatus, setKeyboardStatus] = useState(false);

  const [height, setHeight] = useState(new Animated.Value(0));

  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardWillShow", () => {
      setKeyboardStatus(true);
    });
    const hideSubscription = Keyboard.addListener("keyboardWillHide", () => {
      setKeyboardStatus(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  useEffect(() => {
    if (keyboardStatus) {
      // Animate to "60%" height
      Animated.timing(height, {
        toValue: 1,
        duration: 250,
        useNativeDriver: false,
      }).start();
    } else {
      // Animate to "40%" height
      Animated.timing(height, {
        toValue: 0,
        duration: 250,
        useNativeDriver: false,
      }).start();
    }
  }, [keyboardStatus]);

  const animatedHeight = height.interpolate({
    inputRange: [0, 1],
    outputRange: ["40%", "60%"],
  });

  const formatPhoneNumber = (input: string) => {
    let phoneNumber = input.replace(/\D/g, "");

    phoneNumber = phoneNumber.slice(0, 10);

    const phoneNumberLength = phoneNumber.length;
    if (phoneNumberLength > 6) {
      phoneNumber = `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(
        6
      )}`;
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

  const handleSavePhoneNumber = async () => {
    try {
      setLoader(true);
      const response = await updateHouseHoldPhoneNumber(
        inspection.unit?.landlordId || "",
        phoneNumber,
        profile?.email || "",
      );
      const foundInspection = inspections.find(inspection => inspection.id === inspectionItem.id);
      if (foundInspection?.visibleLandlordPhoneNumber) {
        foundInspection.visibleLandlordPhoneNumber = phoneNumber;
        dispatch(actionsInspections.setInspections([...inspections, {...foundInspection}]));
      }
      dispatch(actionsInspectionItem.setVisiblePhoneNumber(phoneNumber));
    } catch (e) {
      console.log("error change houseHold phoneNumber", e);
      Alert.alert(`Failed to update phone number Landlord, who doesn't exist`);
    } finally {
      setLoader(false);
      setShowModalPhoneNumber(false);
    }
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
            {inspectionItem?.status !== InspectionStatus.COMPLETE && (
              <TouchableOpacity onPress={() => setShowModalPhoneNumber(true)}>
                <EditIcon color={colors.blue} height={normalize(20)} width={normalize(20)} />
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
          <Text style={styles.text}>{inspection.hasPermissionToEnter ? "Yes" : "No"}</Text>
        </View>
        <View style={styles.label}>
          <Text style={styles.labelText}>Details:</Text>
          <View style={{ flex: 1 }}>
            <View style={styles.detailBox}>
              <Text style={styles.text}>Bedrooms:</Text>
              <Text style={styles.text}>{inspection.unit.numberOfBedrooms}</Text>
            </View>
            <View style={styles.detailBox}>
              <Text style={styles.text}>Bathroom:</Text>
              <Text style={styles.text}>{inspection.unit.numberOfBathrooms}</Text>
            </View>
            <View style={styles.detailBox}>
              <Text style={styles.text}>Sq. ft:</Text>
              <Text style={styles.text}>{inspection.unit.squareFootage || "--"}</Text>
            </View>
            <View style={styles.detailBox}>
              <Text style={styles.text}>Handicap:</Text>
              <Text style={styles.text}>{inspection.unit.isHandicapAccessible ? "Yes" : "No"}</Text>
            </View>
            <View style={styles.detailBox}>
              <Text style={styles.text}>Year Built:</Text>
              <Text style={styles.text}>{inspection.unit.yearConstructed || "--"}</Text>
            </View>
          </View>
        </View>
        <View style={styles.label}>
          <Text style={styles.labelText}>Landlord:</Text>
          <Text style={styles.text}>{inspection.visibleLandlordName}</Text>
        </View>
        <View style={styles.label}>
          <Text style={styles.labelText}>Phone:</Text>
          <Text style={styles.text}>{visiblePhoneNumber || null}</Text>
        </View>
        {showModalPhoneNumber && (
          <ModalSwipeScreen
            closeModalFunction={handleCloseModalPhone}
            height={animatedHeight}
            percentSwipeToClose={0.2}
          >
            {loader && <ModalLoader />}
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Edit Phone Number</Text>
              <View style={[styles.phoneLabel, styles.shadowProp]}>
                <View style={{ paddingHorizontal: normalize(30) }}>
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
                  placeholderTextColor={"#979797"}
                />
              </View>
              <TouchableOpacity style={styles.modalSaveButton} onPress={handleSavePhoneNumber}>
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
    ...textStyles.little,
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
    ...textStyles.little,
  },
  modalContainer: {
    alignItems: "stretch",
    flex: 1,
    marginTop: "8%",
    paddingHorizontal: "7%",
  },
  modalTitle: {
    color: colors.darkGrey,
    ...textStyles.large,
    fontWeight: "600",
  },
  modalSaveButton: {
    paddingVertical: "2%",
    width: "40%",
    borderRadius: 50,
    backgroundColor: colors.layout,
    marginTop: normalize(25),
    alignItems: "center",
    alignSelf: "flex-end",
  },
  modalSaveButtonText: {
    color: "#fff",
    fontWeight: "600",
    ...textStyles.regular,
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
    paddingVertical: normalize(15),
    paddingHorizontal: 20,
    borderLeftWidth: 3,
    borderColor: "#EBEBEB",
  },
  modalFlag: {
    width: normalize(30),
    resizeMode: "contain",
  },
  detailBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
  },
});
