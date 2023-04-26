import React, { useState, useId } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { colors } from "~/view/theme";
import { RouteProp } from "@react-navigation/native";
import { Inspection } from "~/types/Inspection";
import CommentIcon from "~/view/assets/icons/comment.svg";
import { AddCommentBox } from "./AddCommentBox";
import { CommentItem } from "./CommentItem";

interface Props {
  route: RouteProp<{ params: Inspection }, "params">;
}

export const InspectionComments: React.FC<Props> = ({ route }) => {
  const mocksComments = [
    {
      id: useId(),
      author: "Tim O’Relly",
      comment:
        "Tenants mentioned they were not please about the work order completed last week ad request a new maintenance tech come out to solve the problem.",
      date: "05/30/2023 at 3:00pm",
    },
    {
      id: useId(),
      author: "Milly Jones",
      comment: "Inspection is overdue",
      date: "04/30/2023 at 11:00am",
    },
    {
      id: useId(),
      author: "Tim O’Relly",
      comment:
        "Tenants mentioned they were not please about the work order completed last week Tenants mentioned they were not please about the work order completed last week ad request a new maintenance tech come out to solve the problem.",
      date: "05/30/2023 at 3:00pm",
    },
    {
      id: useId(),
      author: "Milly Jones",
      comment:
        "Inspection is overdue and required for RTFA and approval of Voucher Unit selection.",
      date: "04/30/2023 at 11:00am",
    },
  ];

  const [input, setInput] = useState("");
  const [comments, setComments] = useState(mocksComments);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.content}>
          <View style={[styles.container, styles.shadowProp]}>
            {mocksComments.length > 0 ? (
              <View style={{ flex: 1.5 }}>
                <ScrollView>
                  {mocksComments.map((comment, index) => (
                    <CommentItem
                      key={comment.id}
                      comment={comment}
                      index={index}
                      arrayLength={mocksComments.length}
                    />
                  ))}
                </ScrollView>
              </View>
            ) : (
              <View style={{ flex: 1.5 }}>
                <CommentIcon
                  width={"100%"}
                  height={"70%"}
                  color={"#DADADA"}
                  style={{ alignSelf: "center" }}
                />
                <Text style={styles.noCommentText}>No comments</Text>
              </View>
            )}
            <AddCommentBox input={input} setInput={setInput} />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  content: {
    backgroundColor: "#fff",
    flex: 1,
    paddingTop: 5,
    paddingHorizontal: 25,
    paddingBottom: 20,
  },
  shadowProp: {
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#fff",
    padding: "5%",
    paddingTop: "8%",
    borderRadius: 15,
  },
  noCommentText: {
    color: colors.darkGrey,
    fontWeight: "600",
    alignSelf: "center",
    fontSize: 18,
  },
});
