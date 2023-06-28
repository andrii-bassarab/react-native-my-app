import React, { createElement, useEffect, useState } from "react";
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
} from "react-native";
import ExpandIcon from "~/view/assets/icons/expand.svg";
import { colors } from "~/view/theme";
import { CustomSelect, OptionItem } from "../Custom/CustomSelect";
import PlusIcon from "~/view/assets/icons/plus.svg";
import CameraIcon from "~/view/assets/icons/camera.svg";
import { CommentItem } from "../InspectionItem/InspectionComments/CommentItem";
import {
  Asset,
  launchCamera,
  launchImageLibrary,
} from "react-native-image-picker";
import CloseIcon from "~/view/assets/icons/failed.svg";
import { ModalViewImage } from "./ModalViewImage";
import { IComment } from "~/types/Comment";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import { ContentLoader } from "../Loader/Loader";
import { useMutation } from "@apollo/client";
import {
  GET_ALL_INSPECTIONS_CATEGORY,
  GET_CATEGORY_ITEM_VALUE,
  UPDATE_CATEGOTY_ITEM,
} from "~/services/api/GetInspectionCategory";
import { useNavigation } from "@react-navigation/native";
import { actionsInspectionItem } from "~/modules/inspectionItem";
import { InspectionStatus } from "~/types/inspectionStatus";

interface Props {
  title: string;
  message: string;
  result?: boolean;
  categoryApplyToInspection?: boolean;
  comment?: IComment;
  inspectionItemId?: string;
  loading: boolean;
  id: string;
}

export const CharacterCard: React.FC<Props> = ({
  title,
  message,
  result,
  categoryApplyToInspection = false,
  comment,
  loading,
  inspectionItemId,
  id,
}) => {
  const dispatch = useAppDispatch();
  const resultDropdownOptions = ["Fail", "Passed"];
  const [selectedResult, setSelectedResult] = useState<OptionItem>(
    result === true ? "Passed" : "Fail"
  );
  const [openMainInfo, setOpenMainInfo] = useState(false);
  const [newPhoto, setNewPhoto] = useState<Asset | null>(null);
  const [images, setImages] = useState<Asset[]>([]);
  const [showModalImage, setShowModalImage] = useState(false);
  const [visibleComment, setVisibleComment] = useState(comment);
  const { inspectionItem, categories, startUpdateInspectionCategoryView } =
    useAppSelector((state) => state.inspectionItem);
  const navitation = useNavigation();

  const handleTakePhoto = async () => {
    try {
      const takenPhoto = await launchCamera({ mediaType: "photo" });

      if (
        takenPhoto.assets &&
        Array.isArray(takenPhoto.assets) &&
        typeof takenPhoto.assets[0] === "object" &&
        takenPhoto.assets[0].hasOwnProperty("uri")
      ) {
        const asset = takenPhoto.assets[0];

        setNewPhoto(asset);

        setImages((prev) => [...prev, asset]);
      }
    } catch (e) {
      console.log("TakenPhotoError: ", e);
    }
  };

  const handleChoosePhoto = async () => {
    try {
      const chosenImageFromGallery = await launchImageLibrary({
        mediaType: "photo",
      });

      if (
        chosenImageFromGallery.assets &&
        Array.isArray(chosenImageFromGallery.assets) &&
        typeof chosenImageFromGallery.assets[0] === "object" &&
        chosenImageFromGallery.assets[0].hasOwnProperty("uri")
      ) {
        const asset = chosenImageFromGallery.assets[0];

        setNewPhoto(chosenImageFromGallery.assets[0]);

        setImages((prev) => [...prev, asset]);
      }
    } catch (e) {
      console.log("ImageLibraryPhotoError: ", e);
    }
  };

  const handleDeleteImage = (imageToDelete: Asset) => {
    setImages((prev) =>
      prev.filter((photo) => photo.fileName !== imageToDelete.fileName)
    );
  };

  const handleOpenModalImage = (imageToSet: Asset) => {
    setNewPhoto(imageToSet);
    setShowModalImage(true);
  };

  const handleEditComment = (comment: string) => {
    setVisibleComment(
      (prev) =>
        prev && {
          ...prev,
          commentBody: comment,
        }
    );
  };

  const [updateCategoryItem, { loading: load, error }] =
    useMutation(UPDATE_CATEGOTY_ITEM);

  console.log("loading", load);
  console.log("error", error);

  const handleSaveAndGoBack = async () => {
    await updateCategoryItem({
      variables: {
        command: {
          customerId: "pfdylv",
          siteId: "pfdylv",
          id: id,
          inspectionId: inspectionItem?.id,
          inspectionItemId: inspectionItemId,
          value: selectedResult === "Passed",
          comment: visibleComment?.commentBody || "",
        },
      },
      refetchQueries: [
        {
          query: GET_CATEGORY_ITEM_VALUE,
          variables: {
            ids: categories
              .flatMap((category) => category.items.map((item) => item.id))
              .filter((itemId) => itemId.length > 0)
              .flat(),
          },
        },
      ],
      awaitRefetchQueries: true,
    });
  };

  return (
    <View style={[styles.card, styles.shadowProp]}>
      <TouchableOpacity
        style={styles.label}
        onPress={() => setOpenMainInfo((prev) => !prev)}
      >
        <View
          style={[
            styles.expandBox,
            !openMainInfo && { transform: [{ rotate: "-90deg" }] },
          ]}
        >
          <ExpandIcon color={"#fff"} width={15} height={15} />
        </View>
        <Text style={styles.title}>{title}</Text>
      </TouchableOpacity>
      {openMainInfo && (
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.mainInfo}>
              <Text style={styles.messageText}>{message}</Text>
              {loading ? (
                <View>
                  <ContentLoader size="medium" />
                </View>
              ) : (
                <View>
                  {typeof result === "boolean" && (
                    <View
                      style={[
                        styles.resultLabel,
                        !categoryApplyToInspection && {
                          justifyContent: "flex-start",
                        },
                      ]}
                    >
                      <Text style={{ ...styles.labelItemText, flex: 1 }}>
                        Result:
                      </Text>
                      {categoryApplyToInspection ? (
                        <View
                          style={{
                            width: "60%",
                            height: 40,
                            backgroundColor: "#fff",
                            justifyContent: "center",
                          }}
                        >
                          {inspectionItem?.status ===
                          InspectionStatus.COMPLETE ? (
                            <Text style={styles.labelItemText}>
                              {typeof selectedResult === "string" &&
                                selectedResult}
                            </Text>
                          ) : (
                            <CustomSelect
                              data={resultDropdownOptions}
                              selectedItem={selectedResult}
                              setSelectedItem={setSelectedResult}
                              dropdownStyle={styles.dropdownStyle}
                              selectedItemStyle={styles.selectedResultItem}
                            />
                          )}
                        </View>
                      ) : (
                        <Text style={styles.noResultText}>N/A</Text>
                      )}
                    </View>
                  )}
                  {visibleComment && (
                    <View
                      style={[
                        styles.commentsLabel,
                        (!categoryApplyToInspection ||
                          inspectionItem?.status ===
                            InspectionStatus.COMPLETE) && {
                          flexDirection: "row",
                          justifyContent: "space-between",
                          flexWrap: "wrap",
                        },
                      ]}
                    >
                      <Text style={{ ...styles.labelItemText, flex: 1 }}>
                        Comments:
                      </Text>
                      {categoryApplyToInspection ? (
                        <>
                          {inspectionItem?.status ===
                          InspectionStatus.COMPLETE ? (
                            <Text
                              style={{ ...styles.labelItemText, flex: 1.5 }}
                            >
                              {visibleComment.commentBody}
                            </Text>
                          ) : (
                            <ScrollView
                              showsVerticalScrollIndicator={false}
                              style={{ marginTop: 10 }}
                            >
                              <CommentItem
                                comment={visibleComment}
                                index={0}
                                arrayLength={1}
                                showEditComment
                                saveEditedComment={handleEditComment}
                              />
                            </ScrollView>
                          )}
                        </>
                      ) : (
                        <Text style={styles.noResultText}>N/A</Text>
                      )}
                    </View>
                  )}
                  <View>
                    {(categoryApplyToInspection &&
                    inspectionItem?.status !== InspectionStatus.COMPLETE) ? (
                      <View style={styles.commentsLabel}>
                        <Text style={styles.labelItemText}>Add Photos</Text>
                        <View style={styles.buttonsTakePhotoContainer}>
                          <View>
                            <TouchableOpacity
                              style={styles.takePhotoButton}
                              onPress={handleChoosePhoto}
                            >
                              <PlusIcon
                                color={"rgba(51, 51, 51, 0.33)"}
                                width={"40%"}
                                height={"40%"}
                              />
                            </TouchableOpacity>
                            <Text style={styles.photoName}>From Gallery</Text>
                          </View>
                          <View>
                            <TouchableOpacity
                              style={styles.takePhotoButton}
                              onPress={handleTakePhoto}
                            >
                              <CameraIcon
                                color={"rgba(51, 51, 51, 0.33)"}
                                width={"60%"}
                                height={"60%"}
                              />
                            </TouchableOpacity>
                            <Text style={styles.photoName}>Take Photo</Text>
                          </View>
                        </View>
                        <View
                          style={{ flexDirection: "row", flexWrap: "wrap" }}
                        >
                          {images.map((photo) => (
                            <View style={styles.photoLabel} key={photo.uri}>
                              <TouchableOpacity
                                onPress={() => handleOpenModalImage(photo)}
                              >
                                <Image
                                  source={{
                                    uri: photo?.uri,
                                  }}
                                  style={styles.photoImage}
                                />
                              </TouchableOpacity>
                              <TouchableOpacity
                                style={styles.deletePhoto}
                                onPress={() => handleDeleteImage(photo)}
                              >
                                <CloseIcon
                                  color={"#fff"}
                                  width={"60%"}
                                  height={"60%"}
                                />
                              </TouchableOpacity>
                              <Text
                                numberOfLines={1}
                                ellipsizeMode="tail"
                                style={styles.imageFileName}
                              >
                                {photo.fileName}
                              </Text>
                            </View>
                          ))}
                        </View>
                      </View>
                    ) : (
                      <View style={styles.resultLabel}>
                        <Text style={styles.labelItemText}>Photos:</Text>
                        <Text style={styles.noResultText}>N/A</Text>
                      </View>
                    )}
                  </View>
                </View>
              )}
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      )}
      {showModalImage && (
        <ModalViewImage
          closeModalFunction={() => setShowModalImage(false)}
          image={newPhoto}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: "5%",
  },
  label: {
    flexDirection: "row",
    alignItems: "center",
    padding: "4%",
  },
  expandBox: {
    borderRadius: 50,
    backgroundColor: colors.blue,
    width: 25,
    height: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  shadowProp: {
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  title: {
    marginLeft: 10,
    fontWeight: "700",
    fontSize: 20,
    color: colors.textGrey,
  },
  mainInfo: {
    borderTopWidth: 2,
    borderTopColor: "#EBEBEB",
    padding: "5%",
  },
  messageText: {
    color: colors.textGrey,
    fontWeight: "500",
    fontSize: 16
  },
  resultLabel: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "5%",
  },
  labelItemText: {
    fontWeight: "600",
    fontSize: 16,
    color: "#808080",
  },
  dropdownStyle: {
    width: "100%",
    position: "absolute",
    top: 0,
    marginTop: 0,
    borderRadius: 20,
    borderColor: colors.blue,
  },
  commentsLabel: {
    marginTop: "5%",
    zIndex: -1,
  },
  commentInput: {
    height: 100,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#BCBCBC",
    padding: 15,
  },
  selectedResultItem: {
    borderColor: colors.blue,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  buttonsTakePhotoContainer: {
    marginTop: "5%",
    flexDirection: "row",
    alignItems: "center",
  },
  takePhotoButton: {
    width: 70,
    height: 70,
    backgroundColor: "#D9D9D9",
    marginRight: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  photoName: {
    fontSize: 16,
    marginTop: "5%",
    color: "#979797",
    fontWeight: "500",
  },
  noResultText: {
    width: "50%",
    color: colors.textGrey,
    fontWeight: "500",
    fontSize: 16,
  },
  photoLabel: {
    flexWrap: "wrap",
    width: 70,
    overflow: "hidden",
    marginTop: "5%",
    marginRight: 20,
  },
  photoImage: {
    width: 70,
    height: 70,
    resizeMode: "cover",
    borderRadius: 10,
  },
  imageFileName: {
    fontSize: 16,
    flexWrap: "wrap",
    width: 60,
    alignSelf: "center",
    color: colors.textGrey,
    fontWeight: "400",
    marginTop: "5%",
  },
  deletePhoto: {
    borderRadius: 100,
    position: "absolute",
    backgroundColor: "#BDBDBD",
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    right: 5,
    top: 5,
  },
});
