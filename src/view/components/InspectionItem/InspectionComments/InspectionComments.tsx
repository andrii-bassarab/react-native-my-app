import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, Text } from "react-native";
import { colors, textStyles } from "~/view/theme";
import { RouteProp } from "@react-navigation/native";
import { InspectionItem } from "~/types/InspectionItem";
import CommentIcon from "~/view/assets/icons/comment.svg";
import { AddCommentBox } from "./AddCommentBox";
import { CommentItem } from "./CommentItem";
import { IComment } from "~/types/Comment";
import { InspectionStatus } from "~/types/inspectionStatus";
import { useAppSelector } from "~/store/hooks";
import { KeyboardAvoidingDisplayComponent } from "~/view/hoc/KeyboardAvoidingDisplayComponent";

interface Props {
  route: RouteProp<{ params: InspectionItem }, "params">;
}

export const InspectionComments: React.FC<Props> = ({ route }) => {
  const { inspectionItem } = useAppSelector((state) => state.inspectionItem);
  const { inspectionComments, id: inspectionId, status } = inspectionItem;

  const [input, setInput] = useState("");
  const [comments, setComments] = useState(
    [...inspectionComments].sort((a, b) => {
      const dateA = new Date(a.createdOn);
      const dateB = new Date(b.createdOn);
      return dateB.getTime() - dateA.getTime();
    })
  );

  useEffect(() => {
    setComments(inspectionComments);
  }, [inspectionComments]);

  const handleAddNewComment = (newComment: IComment) =>
    setComments((prev) => [newComment, ...prev]);

  return (
    <KeyboardAvoidingDisplayComponent>
      <View style={styles.content}>
        <View style={[styles.container, styles.shadowProp]}>
          {comments.length > 0 ? (
            <View style={{ flex: 2, marginBottom: 10 }}>
              <ScrollView showsVerticalScrollIndicator={false}>
                {comments.map((comment, index, array) => (
                  <CommentItem
                    key={index}
                    comment={comment}
                    index={index}
                    arrayLength={array.length}
                    showDotPoint
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
          {status !== InspectionStatus.COMPLETE && (
            <AddCommentBox
              inspectionId={inspectionId}
              input={input}
              setInput={setInput}
              addNewComment={handleAddNewComment}
            />
          )}
        </View>
      </View>
    </KeyboardAvoidingDisplayComponent>
  );
};

const styles = StyleSheet.create({
  content: {
    backgroundColor: "#fff",
    flex: 1,
    paddingTop: 5,
    paddingHorizontal: "7%",
    paddingBottom: 20,
  },
  shadowProp: {
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#fff",
    paddingLeft: "5%",
    paddingRight: "2%",
    paddingTop: "8%",
    paddingBottom: "5%",
    borderRadius: 15,
  },
  noCommentText: {
    color: colors.darkGrey,
    fontWeight: "600",
    alignSelf: "center",
    ...textStyles.medium,
  },
});
