import React, { useMemo, useState } from "react";
import { View, StyleSheet, Text, Touchable } from "react-native";
import { Comment } from "~/types/Comment";
import { getVisibleDate } from "~/utils/visibleDate";
import { colors } from "~/view/theme";

interface Props {
  comment: Comment;
  index: number;
  arrayLength: number;
}

export const CommentItem: React.FC<Props> = ({ comment, index, arrayLength }) => {
  const visibleCreatedBy = useMemo(() =>
      comment.createdBy === "nazar.kubyk@appitventures.com" ? "Me -" : `${comment.createdBy} -`,
    [comment]);

  return (
    <View>
      <View style={styles.timePoint} />
      <View
        style={[
          styles.card,
          index === arrayLength - 1 && { borderLeftWidth: 0, borderColor: "#fff" },
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
          <Text style={styles.comment}>{comment.commentBody}</Text>
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
});
