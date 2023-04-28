import React, { useState, useId } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
} from "react-native";
import { colors } from "~/view/theme";
import { RouteProp } from "@react-navigation/native";
import { Inspection } from "~/types/Inspection";
import CommentIcon from "~/view/assets/icons/comment.svg";
import { AddCommentBox } from "./AddCommentBox";
import { CommentItem } from "./CommentItem";
import { Comment } from "~/types/Comment";

interface Props {
  route: RouteProp<{ params: Inspection }, "params">;
}

export const InspectionComments: React.FC<Props> = ({ route }) => {
  const mocksComments = [
    {
      id: useId(),
      author: "Nick Gomes",
      comment:
        "Tenants mentioned they were not please about the work order completed last week ad request a new maintenance tech come out to solve the problem.",
      date: "2022-07-06T07:00:00.000Z",
    },
    {
      id: useId(),
      author: "Milly Jones",
      comment: "Inspection is overdue",
      date: "2022-07-06T07:00:00.000Z",
    },
    {
      id: useId(),
      author: "Tim O’Relly",
      comment:
        "Tenants mentioned they were not please about the work order completed last week Tenants mentioned they were not please about the work order completed last week ad request a new maintenance tech come out to solve the problem.",
      date: "2022-07-06T07:00:00.000Z",
    },
    {
      id: useId(),
      author: "Milly Jones",
      comment:
        "Inspection is overdue and required for RTFA and approval of Voucher Unit selection.",
      date: "2022-07-06T07:00:00.000Z",
    },
  ] as Comment[];

  const [input, setInput] = useState("");
  const [comments, setComments] = useState(mocksComments);

  return (
    <View style={styles.content}>
      <View style={[styles.container, styles.shadowProp]}>
        {comments.length > 0 ? (
          <View style={{ flex: 2, marginBottom: 10 }}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {comments.map((comment, index, array) => (
                <CommentItem
                  key={comment.id}
                  comment={comment}
                  index={index}
                  arrayLength={array.length}
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
        <AddCommentBox
          input={input}
          setInput={setInput}
          addNewComment={(newComment: Comment) => setComments((prev) => [newComment, ...prev])}
        />
      </View>
    </View>
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
