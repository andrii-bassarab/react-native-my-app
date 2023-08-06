import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from "react-native";
import ExpandIcon from "~/view/assets/icons/expand.svg";
import { colors, textStyles } from "~/view/theme";
import { CustomRadioCheckbox } from "../Custom/CustomRadioCheckbox";
import EditIcon from "~/view/assets/icons/edit.svg";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import { InspectionStatus } from "~/types/inspectionStatus";
import { normalize } from "~/utils/getWindowHeight";
import { actionsInspectionItem } from "~/modules/inspectionItem";
import { actionsCategoryItem } from "~/modules/categoryItem";

interface Props {
  title: string;
  result?: boolean;
  comment?: string | null;
  categoryId: string;
  id: string;
}

export const AmenitiesCard: React.FC<Props> = ({ title, result, comment, categoryId, id }) => {
  const dispatch = useAppDispatch();
  const resultDropdownOptions = ["Yes", "No"];
  const [selectedResult, setSelectedResult] = useState<string>(result ? "Yes" : "No");
  const [visibleComment, setVisibleComment] = useState(comment || "");
  const [openMainInfo, setOpenMainInfo] = useState(false);
  const { inspectionItem, categories } = useAppSelector((state) => state.inspectionItem);
  const inspectionIsCompleted = useMemo(
    () => inspectionItem?.status === InspectionStatus.COMPLETE,
    [inspectionItem]
  );
  const categoryApplyToInspection = Boolean(
    categories.find((category) => category.id === categoryId)?.isRequired
  );
  const [editedComment, setEditedComment] = useState(comment || "");
  const [showEditInput, setShowEditInput] = useState(false);
  const [showIconEdit, setShowIconEdit] = useState(!inspectionIsCompleted);

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

  useEffect(() => {
    if (visibleComment && typeof selectedResult === "string") {
      dispatch(
        actionsCategoryItem.setChangeCategoryAmenitiesValues({
          amenityId: id,
          inspectionId: inspectionItem.id,
          amenitieComment: visibleComment,
          amenitieResult: selectedResult === "Yes",
        })
      );
    }
  }, [selectedResult, visibleComment]);

  useEffect(() => {
    setVisibleComment(comment || "");
    setSelectedResult(result ? "Yes" : "No");
  }, [comment, result]);

  return (
    <View style={[styles.card, styles.shadowProp]}>
      <TouchableOpacity style={styles.label} onPress={() => setOpenMainInfo((prev) => !prev)}>
        <View style={[styles.expandBox, !openMainInfo && { transform: [{ rotate: "-92deg" }] }]}>
          <ExpandIcon color={"#fff"} width={normalize(25)} height={normalize(25)} />
        </View>
        <Text style={styles.title}>{title}</Text>
      </TouchableOpacity>
      {openMainInfo && (result !== undefined || visibleComment) && (
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.mainInfo}>
              {result !== undefined && (
                <View
                  style={[
                    styles.resultLabel,
                    !categoryApplyToInspection && {
                      justifyContent: "space-between",
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.labelItemText,
                      inspectionIsCompleted && { marginRight: 0, flex: 1 },
                    ]}
                  >
                    Result:
                  </Text>
                  {categoryApplyToInspection ? (
                    <>
                      {inspectionIsCompleted ? (
                        <Text style={[styles.labelItemText, { flex: 1.5 }]}>{selectedResult}</Text>
                      ) : (
                        <CustomRadioCheckbox
                          value={selectedResult}
                          onValueChange={setSelectedResult}
                          data={resultDropdownOptions}
                        />
                      )}
                    </>
                  ) : (
                    <Text style={styles.noResultText}>N/A</Text>
                  )}
                </View>
              )}
              {comment !== undefined && (
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
                  <Text style={{ ...styles.labelItemText, marginRight: "10%" }}>Comments:</Text>
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
                          {visibleComment ? (
                            <View style={{ flex: 1, flexDirection: "row" }}>
                              <Text
                                style={{
                                  ...styles.labelItemText,
                                  flex: 1.5,
                                  ...textStyles.small,
                                  marginRight: 0,
                                }}
                              >
                                {visibleComment}
                              </Text>
                              {showIconEdit && (
                                <TouchableOpacity
                                  onPress={handleStartEditComment}
                                  style={{
                                    paddingVertical: "1%",
                                    paddingHorizontal: "3%",
                                  }}
                                >
                                  <EditIcon
                                    width={normalize(25)}
                                    height={normalize(25)}
                                    color={colors.blue}
                                  />
                                </TouchableOpacity>
                              )}
                            </View>
                          ) : (
                            <>
                              <TextInput
                                value={editedComment}
                                onChangeText={setEditedComment}
                                style={styles.writeCommentInput}
                                placeholder="Write a comment..."
                                multiline
                                placeholderTextColor={"#979797"}
                              />
                              <TouchableOpacity
                                style={{ ...styles.textInputButton, marginTop: "5%" }}
                                onPress={handleSaveCommentButton}
                              >
                                <Text style={styles.inputButtonText}>Save</Text>
                              </TouchableOpacity>
                            </>
                          )}
                        </>
                      )}
                    </>
                  ) : (
                    <Text style={styles.noResultText}>N/A</Text>
                  )}
                </View>
              )}
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      )}
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
  rowLabel: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
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
    transform: [{ rotate: "-2deg" }],
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
    color: colors.textGrey,
    paddingRight: "2%",
    ...textStyles.regular,
  },
  mainInfo: {
    borderTopWidth: 2,
    borderTopColor: "#EBEBEB",
    padding: "5%",
  },
  messageText: {
    color: colors.textGrey,
    fontWeight: "500",
  },
  resultLabel: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    // marginTop: "5%",
  },
  labelItemText: {
    fontWeight: "600",
    ...textStyles.regular,
    color: "#808080",
    marginRight: "20%",
  },
  rowComment: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
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
    marginTop: "5%",
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
    ...textStyles.regular,
    marginTop: "5%",
    color: "#979797",
    fontWeight: "500",
  },
  resultOption: {
    color: colors.textGrey,
    fontWeight: "500",
    ...textStyles.regular,
  },
  noResultText: {
    width: "50%",
    color: colors.textGrey,
    fontWeight: "500",
    ...textStyles.regular,
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
    paddingBottom: "10%",
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
  writeCommentInput: {
    width: "100%",
    color: "#000",
    borderRadius: normalize(15),
    borderWidth: 1,
    borderColor: "#BCBCBC",
    alignSelf: "stretch",
    ...textStyles.small,
    padding: "3%",
    marginTop: "5%",
    paddingBottom: "20%",
  },
});
