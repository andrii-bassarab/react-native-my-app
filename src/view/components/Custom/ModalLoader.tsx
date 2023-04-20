import React from "react"
import { ActivityIndicator, View, StyleSheet } from "react-native";

export const ModalLoader = () => (
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
)

const styles = StyleSheet.create({
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.33)",
    opacity: 0.9,
  },
})