import React, { useMemo, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { IComment } from "~/types/Comment";
import { getVisibleDate } from "~/utils/visibleDate";
import { colors, textStyles } from "~/view/theme";
import EditIcon from "~/view/assets/icons/edit.svg";

interface Props {
  comment: IComment;
  index: number;
  arrayLength: number;
  showEditComment?: boolean;
  showDotPoint?: boolean;
  saveEditedComment?: (comment: string) => void;
}

export const CommentItem: React.FC<Props> = ({
  comment,
  index,
  arrayLength,
  showEditComment = false,
  showDotPoint = false,
  saveEditedComment,
}) => {
  const visibleCreatedBy = useMemo(
    () =>
      comment.createdBy === "nazar.kubyk@appitventures.com"
        ? "Me -"
        : `${comment.createdBy} -`,
    [comment]
  );

  const [editedComment, setEditedComment] = useState(comment.commentBody);
  const [showEditInput, setShowEditInput] = useState(false);
  const [showIconEdit, setShowIconEdit] = useState(showEditComment);

  const handleToggleEditComment = () => {
    setShowIconEdit(!showIconEdit);
    setShowEditInput(!showEditInput);
  };

  const handleSaveCommentButton = () => {
    handleToggleEditComment();
    saveEditedComment && saveEditedComment(editedComment);
  };

  const handleResetCommentButton = () => {
    handleToggleEditComment();
    setEditedComment(comment.commentBody);
  };

  return (
    <View>
      {showDotPoint && <View style={styles.timePoint} />}
      <View
        style={[
          styles.card,
          index === arrayLength - 1 && {
            borderLeftWidth: 0,
            borderColor: "#fff",
          },
          !showDotPoint && {
            paddingLeft: 0,
            marginLeft: 0,
            paddingBottom: 0,
          },
        ]}
      >
        <View
          style={{ flex: 1, flexDirection: "row", justifyContent: "center" }}
        >
          {showEditInput ? (
            <View style={{flex: 1}}>
              <TextInput
                value={editedComment}
                onChangeText={setEditedComment}
                multiline
                style={[
                  styles.comment,
                  showEditComment && styles.commentTextInput,
                ]}
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
              <View style={styles.header}>
                <Text style={styles.author}>{visibleCreatedBy}</Text>
                <Text style={styles.date}>
                  {comment.createdOn === "Created time not regognized" ? "N/A" : Date.parse(comment.createdOn) >= Date.now() - 5 * 60 * 1000
                    ? "Now"
                    : getVisibleDate(new Date(comment.createdOn))}
                </Text>
                <View style={styles.comentLabel}>
                  <Text
                    style={[styles.comment, showEditComment && { flex: 1 }]}
                  >
                    {comment.commentBody}
                  </Text>
                </View>
              </View>
            </>
          )}
          {showIconEdit && (
            <TouchableOpacity onPress={handleToggleEditComment}>
              <EditIcon width={15} height={15} color={colors.blue} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    flexWrap: "wrap",
    flex: 1,
  },
  card: {
    paddingBottom: "8%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-start",
    borderLeftWidth: 3,
    borderLeftColor: colors.blue,
    paddingLeft: "5%",
    marginLeft: 5,
  },
  author: {
    ...textStyles.small,
    fontWeight: "600",
    color: "#8E8E8E",
  },
  date: {
    marginLeft: "2%",
    color: "#8E8E8E",
    fontWeight: "500",
    ...textStyles.little,
  },
  comment: {
    color: "#8E8E8E",
    flex: 1,
    ...textStyles.small,
  },
  comentLabel: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "stretch",
    width: "100%",
    paddingTop: "1%",
  },
  timePoint: {
    width: 15,
    height: 15,
    borderRadius: 100,
    backgroundColor: colors.blue,
    alignSelf: "flex-start",
    position: "absolute",
    left: 0,
  },
  commentTextInput: {
    flex: 1,
    color: "#000",
    borderRadius: 5,
    borderWidth: 1,
    padding: 5,
    borderColor: colors.primary,
    alignSelf: 'stretch',
  },
  inputButtonBox: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: "5%",
  },
  textInputButton: {
    borderRadius: 20,
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
