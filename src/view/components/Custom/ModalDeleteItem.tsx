import React from "react";
import { Modal, Pressable, View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { SvgProps } from "react-native-svg";
import { colors } from "~/view/theme";
import { ModalLoader } from "../Loader/ModalLoader";

interface Props {
  title: string;
  Icon: React.FC<SvgProps>;
  onContinue: () => void;
  onCancel: () => void;
  message?: string;
  loading?: boolean;
}

export const ModalDeleteItem: React.FC<Props> = ({ title, Icon, onContinue, onCancel, message, loading }) => {
  return (
    <Modal transparent={true}>
      <Pressable
        style={styles.modalOverlay}
        onPress={(event) => {
          event.stopPropagation();
          event.preventDefault();
          onCancel();
        }}
      >
        <View
          style={styles.content}
          onStartShouldSetResponder={() => true}
          onTouchEnd={(event) => {
            event.stopPropagation();
          }}
        >
          <View style={styles.deleteContainer}>
            <Icon color="#fff" width={90} height={90} />
          </View>
          <Text style={styles.title}>{title}</Text>
          {message && <Text style={styles.message}>{message}</Text>}
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={{ ...styles.button, borderColor: colors.blue }}
              onPress={onCancel}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.addButton]}
              onPress={onContinue}
            >
              <Text style={styles.addText}>Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
        {loading && <ModalLoader/>}
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    backgroundColor: "rgba(0, 0, 0, 0.33)",
    opacity: 1,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 40,
    borderRadius: 10,
    width: "85%",
    minHeight: "20%",
    alignItems: "center",
  },
  deleteContainer: {
    backgroundColor: colors.red,
    borderRadius: 100,
    height: 150,
    width: 150,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    textAlign: "center",
    marginTop: 10,
    color: colors.blue,
    fontSize: 20,
    fontWeight: "600",
  },
  buttonsContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 40,
  },
  button: {
    borderRadius: 40,
    borderWidth: 1,
    paddingVertical: 5,
    width: "48%",
    alignItems: 'center'
  },
  addButton: {
    backgroundColor: colors.layout,
    borderColor: colors.layout,
  },
  addText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  cancelText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.blue,
  },
  message: {
    marginTop: 15,
    color: colors.darkGrey,
    fontWeight: '500'
  }
});
