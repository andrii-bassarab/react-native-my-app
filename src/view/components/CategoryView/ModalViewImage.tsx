import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, Modal, Pressable } from "react-native";
import { BASE_DOCUMENT_API, FILEROOM_API_KEY } from "~/constants/env";
import { normalize } from "~/utils/getWindowHeight";
import CloseIcon from "~/view/assets/icons/failed.svg";
import { colors, textStyles } from "~/view/theme";
import { ContentLoader } from "../Loader/Loader";
import { InspectionFile } from "~/types/InspectionFile";
import { Asset } from "react-native-image-picker";

interface Props {
  closeModalFunction: () => void;
  image: InspectionFile | Asset | null;
}

export const ModalViewImage: React.FC<Props> = ({ closeModalFunction, image }) => {
  const [loader, setLoader] = useState(false);

  if (!image) {
    return null;
  }

  const isAssetType = (file: Asset | InspectionFile): file is Asset => {
    return "uri" in file && "fileName" in file && "type" in file;
  };

  const isImageAsset = isAssetType(image);

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
            <View>
              <View
                style={{
                  ...styles.image,
                  position: "absolute",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {loader && <ContentLoader size="medium" />}
              </View>
              <Image
                source={{
                  uri: isImageAsset ? image.uri : `${BASE_DOCUMENT_API}/files/${image.id}`,
                  headers: {
                    "x-api-key": FILEROOM_API_KEY,
                  },
                }}
                style={styles.image}
                onLoadStart={() => setLoader(true)}
                onLoad={() => setLoader(false)}
              ></Image>
            </View>

            <Text style={styles.fileNameText}>{isImageAsset ? image.fileName : image.name}</Text>
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
    height: "60%",
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
    width: normalize(40),
    height: normalize(40),
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
    ...textStyles.regular,
  },
});
