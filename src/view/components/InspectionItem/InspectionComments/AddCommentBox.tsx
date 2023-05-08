import React, { useId } from "react";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
  TouchableWithoutFeedback,
} from "react-native";
import { actionsToastNotification } from "~/modules/toastNotification";
import { useAppDispatch } from "~/store/hooks";
import { Comment } from "~/types/Comment";
import { colors } from "~/view/theme";

interface Props {
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  addNewComment: (newComment: Comment) => void;
}

export const AddCommentBox: React.FC<Props> = ({ input, setInput, addNewComment }) => {
  const dispatch = useAppDispatch();
  const showToastNotification = () => dispatch(actionsToastNotification.showToastMessage("Success! Comment added."));

  const newComment = {
    createdBy: "Me",
    commentBody: input,
  };

  const handleAddNewComment = (newComment: Comment) => {
    addNewComment(newComment);
    setInput("");
    showToastNotification();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
            onPress={() => handleAddNewComment({ ...newComment, createdOn: new Date().toJSON() })}
          >
            <Text style={styles.commentButtonText}>Comment</Text>
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  content: {
    backgroundColor: "#fff",
    flex: 1,
    justifyContent: "space-between",
    paddingLeft: 10,
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
