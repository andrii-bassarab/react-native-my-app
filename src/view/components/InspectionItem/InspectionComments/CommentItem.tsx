import React, { useMemo, useState } from "react";
import { View, StyleSheet, Text, TextInput, TouchableOpacity } from "react-native";
import { Comment } from "~/types/Comment";
import { getVisibleDate } from "~/utils/visibleDate";
import { colors } from "~/view/theme";
import EditIcon from "~/view/assets/icons/edit.svg";

interface Props {
  comment: Comment;
  index: number;
  arrayLength: number;
  showEditComment?: boolean;
}

export const CommentItem: React.FC<Props> = ({
  comment,
  index,
  arrayLength,
  showEditComment = false,
}) => {
  const visibleCreatedBy = useMemo(
    () =>
      comment.createdBy === "nazar.kubyk@appitventures.com"
        ? "Me -"
        : `${comment.createdBy} -`,
    [comment]
  );

  const [editedComment, setEditedComment] = useState(comment.commentBody);

  const showEditInput = false;

  return (
    <View>
      <View style={styles.timePoint} />
      <View
        style={[
          styles.card,
          index === arrayLength - 1 && {
            borderLeftWidth: 0,
            borderColor: "#fff",
          },
        ]}
      >
        <View style={{ flex: 1 }}>
          <View style={styles.header}>
            <Text style={styles.author}>{visibleCreatedBy}</Text>
            <Text style={styles.date}>
              {Date.parse(comment.createdOn) >= Date.now() - 5 * 60 * 1000
                ? "Now"
                : getVisibleDate(new Date(comment.createdOn))}
            </Text>
          </View>
          <View style={styles.comentLabel}>
            {showEditInput ? (
              <TextInput
                value={editedComment}
                onChangeText={setEditedComment}
                multiline
                style={[styles.comment, showEditComment && { flex: 0.9, color: '#000', borderRadius: 5, borderWidth: 1, padding: 5 }]}
              />
            ) : (
            <Text style={[styles.comment, showEditComment && { flex: 0.9 }]}>
              {comment.commentBody}
            </Text>
            )}
            {showEditComment && (
              <TouchableOpacity>
                <EditIcon width={15} height={15} color={colors.blue} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    flexWrap: "wrap",
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
    fontSize: 13,
    fontWeight: "600",
    color: "#8E8E8E",
  },
  date: {
    marginLeft: "2%",
    color: "#8E8E8E",
    fontWeight: "500",
    fontSize: 13,
  },
  comment: {
    color: "#8E8E8E",
    flex: 1,
  },
  comentLabel: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "stretch",
    width: "100%",
    paddingTop: "1%"
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
});
