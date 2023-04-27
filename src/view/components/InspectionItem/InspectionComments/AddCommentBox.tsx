import React, { useId } from "react";
import { View, StyleSheet, Text, TextInput, TouchableOpacity } from "react-native";
import { Comment } from "~/types/Comment";
import { colors } from "~/view/theme";

interface Props {
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  addNewComment: (newComment: Comment) => void;
}

export const AddCommentBox: React.FC<Props> = ({ input, setInput, addNewComment }) => {
  const newComment = {
    id: new Date().toLocaleString(),
    author: "Me",
    comment: input,
  };

  const handleAddNewComment = (newComment: Comment) => {
    addNewComment({ ...newComment, date: new Date().toJSON() });
    setInput("");
  };

  return (
    <View style={styles.content}>
      <TextInput
        style={styles.inputLabel}
        placeholder="Write a comment..."
        textAlignVertical="top"
        multiline={true}
        value={input}
        onChangeText={setInput}
        placeholderTextColor={"#979797"}
      />
      <TouchableOpacity
        style={styles.commentButton}
        onPress={() => handleAddNewComment({ ...newComment, date: new Date().toJSON() })}
      >
        <Text style={styles.commentButtonText}>Comment</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    backgroundColor: "#fff",
    flex: 1,
    justifyContent: "space-between",
    paddingLeft: 10
  },
  inputLabel: {
    paddingHorizontal: 20,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: colors.primary,
    height: "50%",
    justifyContent: "flex-end",
  },
  commentButton: {
    alignSelf: "flex-end",
    width: "45%",
    marginTop: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.layout,
    alignItems: "center",
  },
  commentButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
