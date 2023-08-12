import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { colors, textStyles } from "~/view/theme";
import CloseIcon from "~/view/assets/icons/failed.svg";
import { normalize } from "~/utils/normalize/normalize";
import { InspectionFile } from "~/models/InspectionFile";
import { BASE_DOCUMENT_API } from "~/constants/env";
import { ContentLoader } from "../Loader/Loader";
import { FILE_ROOM_API_HEADERS } from "~/models/fileRoom";
import CameraIcon from "~/view/assets/icons/camera.svg";
import PlusIcon from "~/view/assets/icons/plus.svg";

interface IProps {
  itemImages: InspectionFile[];
  loaderImages: boolean;
  handleOpenModalImage: (imageToSet: InspectionFile) => void;
  handleDeleteImage: (imageToDelete: InspectionFile) => Promise<void>;
  handleChoosePhoto: () => Promise<void>;
  handleTakePhoto: () => Promise<void>;
  inspectionIsComplete: boolean;
}

export const ItemImageList: React.FC<IProps> = ({
  itemImages,
  loaderImages,
  handleOpenModalImage,
  handleDeleteImage,
  handleChoosePhoto,
  handleTakePhoto,
  inspectionIsComplete = false,
}) => {
  return (
    <View style={styles.commentsLabel}>
      <Text style={styles.labelItemText}>{inspectionIsComplete ? "Photos" : "Add Photos"}</Text>
      {!inspectionIsComplete && (
        <View style={styles.buttonsTakePhotoContainer}>
          <View>
            <TouchableOpacity style={styles.takePhotoButton} onPress={handleChoosePhoto}>
              <PlusIcon color={"rgba(51, 51, 51, 0.33)"} width={"40%"} height={"40%"} />
            </TouchableOpacity>
            <Text style={styles.photoName}>From Gallery</Text>
          </View>
          <View style={{ marginLeft: "2%" }}>
            <TouchableOpacity style={styles.takePhotoButton} onPress={handleTakePhoto}>
              <CameraIcon color={"rgba(51, 51, 51, 0.33)"} width={"60%"} height={"60%"} />
            </TouchableOpacity>
            <Text style={styles.photoName}>Take Photo</Text>
          </View>
        </View>
      )}
      <View>
        {!loaderImages ? (
          <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
            {itemImages.map((photo) => (
              <View style={styles.photoLabel} key={photo.id}>
                <TouchableOpacity onPress={() => handleOpenModalImage(photo)}>
                  <Image
                    source={{
                      uri: `${BASE_DOCUMENT_API}/files/${photo.id}`,
                      headers: FILE_ROOM_API_HEADERS,
                    }}
                    style={styles.photoImage}
                  />
                </TouchableOpacity>
                {!inspectionIsComplete && (
                  <TouchableOpacity
                    style={styles.deletePhoto}
                    onPress={() => handleDeleteImage(photo)}
                  >
                    <CloseIcon color={"#fff"} width={"60%"} height={"60%"} />
                  </TouchableOpacity>
                )}
                <Text numberOfLines={1} ellipsizeMode="tail" style={styles.imageFileName}>
                  {photo.name}
                </Text>
              </View>
            ))}
          </View>
        ) : (
          <View style={{ flex: 1 }}>
            <ContentLoader />
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  labelItemText: {
    fontWeight: "600",
    ...textStyles.regular,
    ...textStyles.regular,
    color: "#808080",
  },
  commentsLabel: {
    marginTop: "5%",
    zIndex: -1,
  },
  buttonsTakePhotoContainer: {
    marginTop: "5%",
    flexDirection: "row",
    alignItems: "center",
  },
  takePhotoButton: {
    width: normalize(120),
    height: normalize(120),
    backgroundColor: "#D9D9D9",
    marginRight: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  photoName: {
    ...textStyles.small,
    ...textStyles.small,
    marginTop: "5%",
    color: "#979797",
    fontWeight: "500",
  },
  noResultText: {
    width: "50%",
    color: colors.textGrey,
    fontWeight: "500",
    ...textStyles.regular,
    ...textStyles.regular,
  },

  photoImage: {
    width: normalize(120),
    height: normalize(120),
    resizeMode: "cover",
    borderRadius: 10,
  },
  photoLabel: {
    flexWrap: "wrap",
    width: normalize(140),
    overflow: "hidden",
    marginTop: "5%",
    marginRight: normalize(30),
  },
  imageFileName: {
    ...textStyles.regular,
    ...textStyles.regular,
    flexWrap: "wrap",
    width: "90%",
    alignSelf: "center",
    color: colors.textGrey,
    fontWeight: "400",
    marginTop: "5%",
  },
  deletePhoto: {
    borderRadius: 100,
    position: "absolute",
    backgroundColor: "#BDBDBD",
    width: normalize(30),
    height: normalize(30),
    justifyContent: "center",
    alignItems: "center",
    right: 5,
    top: 5,
  },
});
