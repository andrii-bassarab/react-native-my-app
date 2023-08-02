import React from "react";
import { ActivityIndicator, View, StyleSheet, Modal } from "react-native";

export const ModalLoader = () => (
  <Modal transparent>
    <View style={styles.modalOverlay}>
      <ActivityIndicator
        style={{
          position: "absolute",
          transform: [{ scaleX: 2 }, { scaleY: 2 }],
          paddingTop: "50%",
        }}
        size="large"
        color="#000"
      />
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  modalOverlay: {
    backgroundColor: "rgba(0, 0, 0, 0.33)",
    opacity: 1,
    flex: 1,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
});
