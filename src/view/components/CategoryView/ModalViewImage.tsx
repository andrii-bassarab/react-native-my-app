import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  Image,
  Modal,
  Pressable,
  Animated,
} from "react-native";
import { Asset } from "react-native-image-picker";
import CloseIcon from "~/view/assets/icons/failed.svg";
import { colors } from "~/view/theme";

interface Props {
  closeModalFunction: () => void;
  image: Asset | null;
}

export const ModalViewImage: React.FC<Props> = ({ closeModalFunction, image }) => {
  return (
    <Modal transparent={true}>
      <Pressable
        style={styles.modalOverlay}
        onPress={(event) => {
          event.stopPropagation();
          event.preventDefault();
          closeModalFunction();
        }}
      >
        {image && (
          <View
            style={styles.content}
            onStartShouldSetResponder={() => true}
            onTouchEnd={(event) => {
              event.stopPropagation();
            }}
          >
            <TouchableOpacity style={styles.closeButton} onPress={closeModalFunction}>
              <CloseIcon color={"#fff"} width={"60%"} height={"60%"} />
            </TouchableOpacity>
            <Image source={{ uri: image.uri }} style={styles.image} />
            <Text style={styles.fileNameText}>{image.fileName}</Text>
          </View>
        )}
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
    height: "50%",
    width: "95%",
    opacity: 1,
    paddingHorizontal: "6%",
    paddingVertical: "10%",
    paddingBottom: "11%",
    borderRadius: 15,
    justifyContent: "space-between",
  },
  image: {
    height: "100%",
    width: "100%",
    resizeMode: "cover",
    borderRadius: 10,
  },
  closeButton: {
    borderRadius: 100,
    backgroundColor: "#BDBDBD",
    width: 25,
    height: 25,
    position: "absolute",
    right: "3%",
    top: "3%",
    justifyContent: "center",
    alignItems: "center",
  },
  fileNameText: {
    width: "90%",
    alignSelf: "center",
    textAlign: "center",
    marginTop: "1%",
    color: colors.textGrey,
    fontWeight: "600",
  },
});
