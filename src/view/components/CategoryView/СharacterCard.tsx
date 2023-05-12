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
} from "react-native";
import ExpandIcon from "~/view/assets/icons/expand.svg";
import { colors } from "~/view/theme";
import { CustomSelect } from "../Custom/CustomSelect";
import PlusIcon from "~/view/assets/icons/plus.svg";
import CameraIcon from "~/view/assets/icons/camera.svg";
import { CommentItem } from "../InspectionItem/InspectionComments/CommentItem";

interface Props {
  title: string;
  message: string;
  result: "Fail" | "Passed";
  categoryApplyToInspection?: boolean;
}

const mocksComments = [
  {
    createdBy: "heather@hdslabs.com",
    createdOn: "2020-04-13T19:19:31.460Z",
    commentBody: "Please knock, if no response, then you can enter.",
  },
  {
    createdBy: "dgsdgs@hdslabs.com",
    createdOn: "2022-06-25T19:19:31.460Z",
    commentBody: "Second knock, if no response, then you can enter.",
  },
  {
    createdBy: "fhdhdfhd@hdslabs.com",
    createdOn: "2023-09-10T19:19:31.460Z",
    commentBody: "Third knock, if no response, then you can enter.",
  },
];

export const СharacterCard: React.FC<Props> = ({
  title,
  message,
  result,
  categoryApplyToInspection = false,
}) => {
  const resultDropdownOptions = ["Fail", "Passed"];
  const [selectedResult, setSelectedResult] = useState<string>(result);
  const [comment, setComment] = useState("");
  const [openMainInfo, setOpenMainInfo] = useState(false);

  return (
    <View style={[styles.card, styles.shadowProp]}>
      <TouchableOpacity style={styles.label} onPress={() => setOpenMainInfo((prev) => !prev)}>
        <View style={[styles.expandBox, !openMainInfo && { transform: [{ rotate: "-90deg" }] }]}>
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
              <View
                style={[
                  styles.resultLabel,
                  !categoryApplyToInspection && { justifyContent: "flex-start" },
                ]}
              >
                <Text style={{ ...styles.labelItemText, flex: 1 }}>Result:</Text>
                {categoryApplyToInspection ? (
                  <View style={{ width: "60%", height: 40, backgroundColor: "#fff" }}>
                    <CustomSelect
                      data={resultDropdownOptions}
                      selectedItem={selectedResult}
                      setSelectedItem={setSelectedResult}
                      dropdownStyle={styles.dropdownStyle}
                      selectedItemStyle={styles.selectedResultItem}
                    />
                  </View>
                ) : (
                  <Text style={styles.noResultText}>N/A</Text>
                )}
              </View>
              <View
                style={[
                  styles.commentsLabel,
                  !categoryApplyToInspection && {
                    flexDirection: "row",
                    justifyContent: "space-between",
                  },
                ]}
              >
                <Text style={styles.labelItemText}>Comments:</Text>
                {categoryApplyToInspection ? (
                  <>
                    <ScrollView showsVerticalScrollIndicator={false} style={{ marginTop: 10 }}>
                      {mocksComments.map((comment, index, array) => (
                        <CommentItem
                          key={index}
                          comment={comment}
                          index={index}
                          arrayLength={array.length}
                        />
                      ))}
                    </ScrollView>
                    <TextInput
                      value={comment}
                      onChangeText={setComment}
                      placeholder="Write a comment..."
                      style={styles.commentInput}
                      textAlignVertical="top"
                      multiline={true}
                    />
                  </>
                ) : (
                  <Text style={styles.noResultText}>N/A</Text>
                )}
              </View>
              {categoryApplyToInspection ? (
                <View style={styles.commentsLabel}>
                  <Text style={styles.labelItemText}>Add Photos</Text>
                  <View style={styles.buttonsTakePhotoContainer}>
                    <View>
                      <TouchableOpacity style={styles.takePhotoButton}>
                        <PlusIcon color={"rgba(51, 51, 51, 0.33)"} width={"40%"} height={"40%"} />
                      </TouchableOpacity>
                      <Text style={styles.photoName}>From Gallery</Text>
                    </View>
                    <View>
                      <TouchableOpacity style={styles.takePhotoButton}>
                        <CameraIcon color={"rgba(51, 51, 51, 0.33)"} width={"60%"} height={"60%"} />
                      </TouchableOpacity>
                      <Text style={styles.photoName}>Take Photo</Text>
                    </View>
                  </View>
                </View>
              ) : (
                <View style={styles.resultLabel}>
                  <Text style={styles.labelItemText}>Photos:</Text>
                  <Text style={styles.noResultText}>N/A</Text>
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
    fontSize: 16,
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
  },
  resultLabel: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "5%",
  },
  labelItemText: {
    fontWeight: "600",
    fontSize: 14,
    color: "#808080",
    flex: 1,
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
    fontSize: 12,
    marginTop: "5%",
    color: "#979797",
    fontWeight: "500",
  },
  noResultText: {
    width: "50%",
    color: colors.textGrey,
    fontWeight: "500",
    fontSize: 14,
  },
});
