import { ApolloCache, useMutation } from "@apollo/client";
import React from "react";
import { View, StyleSheet, Text, TextInput, TouchableOpacity } from "react-native";
import { actionsToastNotification } from "~/modules/toastNotification";
import { CREATE_INSPECTION_COMMENT, GET_ALL_INSPECTIONS } from "~/services/api/inspections";
import { useAppDispatch } from "~/store/hooks";
import { Comment } from "~/types/Comment";
import { colors } from "~/view/theme";
import { ModalLoader } from "../../Custom/ModalLoader";

interface Props {
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  addNewComment: (newComment: Comment) => void;
  inspectionId: string;
}

export const AddCommentBox: React.FC<Props> = ({
  input,
  setInput,
  addNewComment,
  inspectionId,
}) => {
  const dispatch = useAppDispatch();
  const showToastNotification = () =>
    dispatch(actionsToastNotification.showToastMessage("Success! Comment added."));

  const [updateInspection, { loading }] = useMutation(CREATE_INSPECTION_COMMENT);

  const updateCache = (commentToAdd: Comment, callback: (commentToAdd: Comment) => void) => {
    return (cache: ApolloCache<any>, { data }: any) => {
      if (!data?.createInspectionComment?.affectedEntity?.id) {
        return;
      }

      // Read the existing inspections list from the cache
      const { inspections } = cache.readQuery({ query: GET_ALL_INSPECTIONS }) as {
        inspections: any;
      };

      // Find the index of the updated item in the list
      const foundItem = inspections.edges.find((edge: any) => edge.node.id === inspectionId);

      if (foundItem) {
        // Replace the item with the updated item
        foundItem.node = {
          ...foundItem.node,
          inspectionComments: [commentToAdd, ...foundItem.node.inspectionComments],
        };

        // Write the modified inspections list back to the cache
        cache.writeQuery({
          query: GET_ALL_INSPECTIONS,
          data: { inspections },
        });
        callback(commentToAdd);
      }
    };
  };

  const handleCreateInspectionComment = (newComment: Comment) => {
    updateInspection({
      variables: {
        command: {
          customerId: "pfdylv",
          siteId: "pfdylv",
          inspectionId: inspectionId,
          commentBody: input,
          createdBy: "nazar.kubyk@appitventures.com",
        },
      },
      update: updateCache(newComment, handleAddNewComment),
    });
  };

  const newCommentBody = {
    createdBy: "nazar.kubyk@appitventures.com",
    commentBody: input,
  };

  const handleAddNewComment = (newComment: Comment) => {
    addNewComment(newComment);
    setInput("");
    showToastNotification();
  };

  return (
    <>
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
          onPress={() =>
            handleCreateInspectionComment({ ...newCommentBody, createdOn: new Date().toJSON() })
          }
        >
          <Text style={styles.commentButtonText}>Comment</Text>
        </TouchableOpacity>
      </View>
      {loading && <ModalLoader/>}
    </>
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
