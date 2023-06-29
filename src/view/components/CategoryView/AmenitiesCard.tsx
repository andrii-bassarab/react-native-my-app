import React, { useEffect, useState } from "react";
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
import { ContentLoader } from "../Loader/Loader";
import { CommentItem } from "../InspectionItem/InspectionComments/CommentItem";
import { IComment } from "~/types/Comment";
import { useAppSelector } from "~/store/hooks";
import { InspectionStatus } from "~/types/inspectionStatus";
import { normalize } from "~/utils/getWindowHeight";

interface Props {
  title: string;
  result?: boolean;
  categoryApplyToInspection?: boolean;
  loading: boolean;
  comment?: IComment;
}

export const AmenitiesCard: React.FC<Props> = ({
  title,
  result,
  categoryApplyToInspection = false,
  loading,
  comment,
}) => {
  const resultDropdownOptions = ["Yes", "No"];
  const [selectedResult, setSelectedResult] = useState<string>(
    result ? "Yes" : "No"
  );
  const [visibleComment, setVisibleComment] = useState(comment);
  const [openMainInfo, setOpenMainInfo] = useState(false);
  const { inspectionItem } = useAppSelector((state) => state.inspectionItem);

  const handleEditComment = (comment: string) => {
    setVisibleComment(
      (prev) =>
        prev && {
          ...prev,
          commentBody: comment,
        }
    );
  };

  useEffect(() => {
    setVisibleComment(comment)
  }, [comment])

  const inspectionIsComplete = inspectionItem?.status === InspectionStatus.COMPLETE;

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
            {loading ? (
              <View>
                <ContentLoader size="medium" />
              </View>
            ) : (
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
                    <Text style={[styles.labelItemText, inspectionIsComplete && {marginRight: 0, flex: 1}]}>Result:</Text>
                    {categoryApplyToInspection ? (
                      <>
                        {inspectionIsComplete? (
                          <Text style={[styles.labelItemText, {flex: 1.5}]}>
                            {selectedResult}
                          </Text>
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
                {visibleComment && (
                  <View style={[styles.commentsLabel, !categoryApplyToInspection && styles.rowLabel, inspectionItem?.status === InspectionStatus.COMPLETE && styles.rowComment]}>
                    <Text style={{...styles.labelItemText, flex: 1, marginRight: 0}}>Comments:</Text>
                    {categoryApplyToInspection ? (
                      <>
                        {inspectionItem?.status ===
                        InspectionStatus.COMPLETE ? (
                          <Text style={{...styles.labelItemText, flex: 1.5}}>{visibleComment.commentBody}</Text>
                        ) : (
                          <CommentItem
                            comment={visibleComment}
                            index={0}
                            arrayLength={1}
                            showEditComment
                            saveEditedComment={handleEditComment}
                          />
                        )}
                      </>
                    ) : (
                      <Text style={styles.noResultText}>N/A</Text>
                    )}
                  </View>
                )}
              </View>
            )}
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
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
  rowLabel: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: 'wrap'
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
    marginTop: "5%",
  },
  labelItemText: {
    fontWeight: "600",
    ...textStyles.regular,
    color: "#808080",
    marginRight: "20%",
  },
  rowComment: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start'
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
});
