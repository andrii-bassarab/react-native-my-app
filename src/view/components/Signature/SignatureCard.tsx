import React, { Dispatch, SetStateAction } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { colors } from "~/view/theme";
import CompleteIcon from "~/view/assets/icons/completed.svg";

interface Props {
  position: string;
  name: string;
  openSignScreen: () => void;
  signaturePath: string;
  openShowViewSignature?: () => void
}

export const SignatureCard: React.FC<Props> = ({
  position,
  name,
  openSignScreen,
  signaturePath,
  openShowViewSignature,
}) => {
  return (
    <View style={[styles.card, styles.shadowProp]}>
      <View style={{ flex: 0.7 }}>
        <Text style={styles.responsible}>{position}</Text>
        <Text style={[styles.responsible, styles.name]}>{name}</Text>
      </View>
      {signaturePath ? (
        <TouchableOpacity
          style={[styles.signButton, styles.viewSignatureButton]}
          onPress={openShowViewSignature}
        >
          <Text style={[styles.signButtonText, styles.viewSignatureText]}>View Signature</Text>
          <CompleteIcon color={"#fff"} width={20} height={20} />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.signButton} onPress={openSignScreen}>
          <Text style={styles.signButtonText}>Click to Sign</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "5%",
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingRight: 10,
    marginTop: "8%",
  },
  responsible: {
    color: "#7F888D",
    fontSize: 18,
    fontWeight: "500",
    letterSpacing: 1,
  },
  name: {
    fontSize: 14,
    marginTop: "3%",
    letterSpacing: 0,
  },
  shadowProp: {
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  signButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.blue,
    paddingVertical: "2%",
    alignItems: "center",
    borderRadius: 30,
  },
  signButtonText: {
    color: colors.blue,
    fontWeight: "600",
    fontSize: 18,
  },
  viewSignatureButton: {
    backgroundColor: colors.blue,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  viewSignatureText: {
    color: "#fff",
  },
});
