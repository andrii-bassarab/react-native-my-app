import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TextInput,
  Alert,
} from "react-native";
import ExpandIcon from "~/view/assets/icons/expand.svg";
import { colors, textStyles } from "~/view/theme";
import { CustomSelect, OptionItem } from "../Custom/CustomSelect";
import EditIcon from "~/view/assets/icons/edit.svg";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import { ModalViewImage } from "./ModalViewImage";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import { InspectionStatus } from "~/types/inspectionStatus";
import { normalize } from "~/utils/normalize/normalize";
import { actionsCategoryItem } from "~/modules/categoryItem";
import { uploadFile } from "~/services/api/files/uploadFile";
import { ModalLoader } from "../Loader/ModalLoader";
import { InspectionFile } from "~/models/InspectionFile";
import { requestDeleteFile } from "~/services/api/files/deleteFile";
import { fetchInspectionFiles } from "~/modules/inspectionFiles";
import { ItemImageList } from "./ItemImageList";

interface Props {
  title: string;
  message: string;
  result?: boolean;
  comment?: string | null;
  inspectionItemId?: string;
  id: string;
  categoryId: string;
  itemImages: InspectionFile[];
  loaderImages: boolean;
}

export const CharacterCard: React.FC<Props> = ({
  title,
  message,
  result,
  comment,
  inspectionItemId,
  id,
  categoryId,
  itemImages,
  loaderImages,
}) => {
  const dispatch = useAppDispatch();
  const { inspectionItem, categories } = useAppSelector((state) => state.inspectionItem);
  const { profile, selectedSite } = useAppSelector((state) => state.user);

  //  @ts-ignore
  const callFetchInspectionFiles = async () => dispatch(fetchInspectionFiles(inspectionItem.id));

  const isNotCompleted = useMemo(
    () => inspectionItem?.status !== InspectionStatus.COMPLETE,
    [inspectionItem]
  );
  const resultDropdownOptions = ["Fail", "Passed"];
  const [selectedResult, setSelectedResult] = useState<OptionItem>(
    result === true ? "Passed" : "Fail"
  );
  const [loader, setLoader] = useState(false);
  const [openMainInfo, setOpenMainInfo] = useState(false);
  const [newPhoto, setNewPhoto] = useState<InspectionFile | null>(null);
  const [showModalImage, setShowModalImage] = useState(false);
  const [visibleComment, setVisibleComment] = useState(comment || "");
  const [editedComment, setEditedComment] = useState(comment || "");
  const [showEditInput, setShowEditInput] = useState(false);
  const [showIconEdit, setShowIconEdit] = useState(isNotCompleted);

  const handleStartEditComment = () => {
    setShowIconEdit(false);
    setShowEditInput(true);
  };

  const handleSaveCommentButton = () => {
    setShowIconEdit(true);
    setShowEditInput(false);
    setVisibleComment(editedComment);
  };

  const handleResetCommentButton = () => {
    setShowIconEdit(true);
    setShowEditInput(false);
    setEditedComment(visibleComment);
  };

  const categoryApplyToInspection = Boolean(
    categories.find((category) => category.id === categoryId)?.isRequired
  );

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

        setLoader(true);

        await uploadFile({
          singleFile: asset,
          inspectionId: inspectionItem.id,
          email: profile?.email || "",
          documentType: "Image",
          fileRelatedToCategoryInspection: true,
          categoryIdRelation: categoryId,
          inspectionItemIdRelation: inspectionItemId || "",
        });

        setLoader(false);

        await callFetchInspectionFiles();
      }
    } catch (e) {
      console.log("TakenPhotoError: ", e);
      Alert.alert("Failed to upload photo");
      setLoader(false);
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

        setLoader(true);

        await uploadFile({
          singleFile: asset,
          inspectionId: inspectionItem.id,
          email: profile?.email || "",
          documentType: "Image",
          fileRelatedToCategoryInspection: true,
          categoryIdRelation: categoryId,
          inspectionItemIdRelation: inspectionItemId || "",
        });

        setLoader(false);

        await callFetchInspectionFiles();
      }
    } catch (e) {
      console.log("ImageLibraryPhotoError: ", e);
      Alert.alert("Failed to upload photo");
      setLoader(false);
    }
  };

  const handleDeleteImage = async (imageToDelete: InspectionFile) => {
    setLoader(true);
    await requestDeleteFile(imageToDelete.id);
    setLoader(false);
    await callFetchInspectionFiles();
  };

  const handleOpenModalImage = (imageToSet: InspectionFile) => {
    setNewPhoto(imageToSet);
    setShowModalImage(true);
  };

  useEffect(() => {
    if (comment !== undefined && typeof selectedResult === "string") {
      dispatch(
        actionsCategoryItem.setChangeCategoryItemsValues({
          inspectionItemId: id,
          inspectionId: inspectionItem.id,
          itemComment: visibleComment,
          itemResult: selectedResult === "Passed",
        })
      );
    }
  }, [selectedResult, visibleComment]);

  return (
    <View style={[styles.card, styles.shadowProp]}>
      <TouchableOpacity style={styles.label} onPress={() => setOpenMainInfo((prev) => !prev)}>
        <View style={[styles.expandBox, !openMainInfo && { transform: [{ rotate: "-90deg" }] }]}>
          <ExpandIcon color={"#fff"} width={normalize(25)} height={normalize(25)} />
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
                    <Text style={{ ...styles.labelItemText, flex: 1 }}>Result:</Text>
                    {categoryApplyToInspection ? (
                      <View style={styles.resultBox}>
                        {inspectionItem?.status === InspectionStatus.COMPLETE ? (
                          <Text style={styles.labelItemText}>
                            {typeof selectedResult === "string" && selectedResult}
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
                {comment && (
                  <View
                    style={[
                      styles.commentsLabel,
                      !showEditInput && {
                        flexDirection: "row",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                      },
                      showEditInput && { flexDirection: "column" },
                    ]}
                  >
                    <Text style={{ ...styles.labelItemText, flex: 1 }}>Comments:</Text>
                    {categoryApplyToInspection ? (
                      <>
                        {showEditInput ? (
                          <View style={{ flex: 1, marginTop: "2%", width: "100%" }}>
                            <TextInput
                              value={editedComment}
                              onChangeText={setEditedComment}
                              multiline
                              style={[styles.commentTextInput]}
                            />
                            <View style={styles.inputButtonBox}>
                              <TouchableOpacity
                                style={styles.textInputButton}
                                onPress={handleResetCommentButton}
                              >
                                <Text style={styles.inputButtonText}>Reset</Text>
                              </TouchableOpacity>
                              <TouchableOpacity
                                style={styles.textInputButton}
                                onPress={handleSaveCommentButton}
                              >
                                <Text style={styles.inputButtonText}>Save</Text>
                              </TouchableOpacity>
                            </View>
                          </View>
                        ) : (
                          <>
                            <Text
                              style={{
                                ...styles.labelItemText,
                                flex: 1.5,
                                ...textStyles.small,
                              }}
                            >
                              {visibleComment}
                            </Text>
                            {showIconEdit && (
                              <TouchableOpacity
                                onPress={handleStartEditComment}
                                style={{
                                  paddingVertical: "1%",
                                  paddingHorizontal: "1%",
                                }}
                              >
                                <EditIcon
                                  width={normalize(25)}
                                  height={normalize(25)}
                                  color={colors.blue}
                                />
                              </TouchableOpacity>
                            )}
                          </>
                        )}
                      </>
                    ) : (
                      <Text style={styles.noResultText}>N/A</Text>
                    )}
                  </View>
                )}
                <View style={{ zIndex: -2 }}>
                  {!categoryApplyToInspection && (
                    <View style={styles.resultLabel}>
                      <Text style={styles.labelItemText}>Photos:</Text>
                      <Text style={styles.noResultText}>N/A</Text>
                    </View>
                  )}
                  {categoryApplyToInspection && (
                    <ItemImageList
                      itemImages={itemImages}
                      loaderImages={loaderImages}
                      handleOpenModalImage={handleOpenModalImage}
                      handleDeleteImage={handleDeleteImage}
                      handleChoosePhoto={handleChoosePhoto}
                      handleTakePhoto={handleTakePhoto}
                      inspectionIsComplete={inspectionItem?.status === InspectionStatus.COMPLETE}
                    />
                  )}
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      )}
      {showModalImage && (
        <ModalViewImage closeModalFunction={() => setShowModalImage(false)} image={newPhoto} />
      )}
      {loader && <ModalLoader />}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: "98%",
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: "5%",
    marginHorizontal: "1%",
  },
  label: {
    flexDirection: "row",
    alignItems: "center",
    padding: "4%",
  },
  expandBox: {
    borderRadius: 50,
    backgroundColor: colors.blue,
    width: normalize(35),
    height: normalize(35),
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
    marginLeft: "3%",
    fontWeight: "700",
    ...textStyles.medium,
    ...textStyles.medium,
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
    ...textStyles.regular,
    ...textStyles.regular,
  },
  resultLabel: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "5%",
  },
  resultBox: {
    width: "60%",
    backgroundColor: "#fff",
    justifyContent: "center",
    alignSelf: "center",
    height: normalize(60),
    zIndex: 2,
  },
  labelItemText: {
    fontWeight: "600",
    ...textStyles.regular,
    ...textStyles.regular,
    color: "#808080",
  },
  dropdownStyle: {
    width: "100%",
    position: "absolute",
    top: 0,
    marginTop: 0,
    borderRadius: normalize(30),
    borderColor: colors.blue,
    zIndex: 2,
    borderTopLeftRadius: normalize(30),
    borderTopRightRadius: normalize(30),
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
    borderRadius: normalize(40),
    paddingHorizontal: normalize(20),
    paddingVertical: normalize(10),
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
  photoLabel: {
    flexWrap: "wrap",
    width: normalize(140),
    overflow: "hidden",
    marginTop: "5%",
    marginRight: normalize(30),
  },
  photoImage: {
    width: normalize(120),
    height: normalize(120),
    resizeMode: "cover",
    borderRadius: 10,
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
  commentTextInput: {
    flex: 1,
    color: "#000",
    borderRadius: 5,
    borderWidth: 1,
    padding: 5,
    borderColor: colors.primary,
    alignSelf: "stretch",
    ...textStyles.small,
  },
  inputButtonBox: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: "5%",
  },
  textInputButton: {
    borderRadius: normalize(30),
    borderWidth: 1,
    borderColor: colors.layout,
    paddingHorizontal: "10%",
    paddingVertical: "2%",
    backgroundColor: colors.layout,
  },
  inputButtonText: {
    ...textStyles.small,
    fontWeight: "600",
    color: "#fff",
  },
});
