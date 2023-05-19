import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, GestureResponderEvent } from "react-native";
import { getColorIconFileByFormat } from "~/utils/getInspectionColor";
import DotsIcon from "~/view/assets/icons/dots.svg";
import { colors } from "~/view/theme";
import DeleteIcon from "~/view/assets/icons/delete.svg";
import { ModalDeleteItem } from "../../Custom/ModalDeleteItem";
import DeleteModalIcon from "~/view/assets/icons/deleteModal.svg";
import { File } from "./InspectionFilesView";

interface Props {
  file: File;
  deleteFile: (fileToDeleter: File) => void;
  displayDeleteIcon?: boolean;
}

export const InspectionFileCard: React.FC<Props> = ({
  file,
  deleteFile,
  displayDeleteIcon = false,
}) => {
  const [showDeleteLabel, setShowDeleteLabel] = useState(false);
  const [showDeleteModalWindow, setShowDeleteModalWindow] = useState(false);

  const clickToDotsButton = (e: GestureResponderEvent) => {
    e.stopPropagation();
    setShowDeleteLabel((prev) => !prev);
  };

  const handleCancelDeleteFile = () => {
    setShowDeleteModalWindow(false);
    setShowDeleteLabel(false);
  };

  const handleDeleteFile = () => {
    deleteFile(file);
    handleCancelDeleteFile();
  };

  return (
    <View style={styles.card}>
      <View style={{ ...styles.label, width: "35%" }}>
        <View
          style={{
            ...styles.docFileIcon,
            backgroundColor: getColorIconFileByFormat(file.docFormat),
          }}
        >
          <Text style={styles.docIconText}>{file.docFormat}</Text>
        </View>
        <Text style={[styles.fileInfoText, styles.fileNameText]}>{file.name}</Text>
      </View>
      <View style={{ ...styles.label, width: "52%", justifyContent: "space-between" }}>
        <Text style={styles.fileInfoText}>{file.uploadTime}</Text>
        {showDeleteLabel && (
          <TouchableOpacity
            style={[styles.deleteLabel, styles.shadowProp]}
            onPress={() => setShowDeleteModalWindow((prev) => !prev)}
          >
            <DeleteIcon color={colors.layout} width={20} height={15} />
            <Text>Delete</Text>
          </TouchableOpacity>
        )}
        {displayDeleteIcon && (
          <TouchableOpacity style={styles.deleteButton} onPress={clickToDotsButton}>
            <DotsIcon color={colors.darkGrey} height={15} width={10} />
          </TouchableOpacity>
        )}
      </View>
      {showDeleteModalWindow && (
        <ModalDeleteItem
          title={`Are you sure you want to delete “${file.name}?”`}
          Icon={DeleteModalIcon}
          onContinue={handleDeleteFile}
          onCancel={handleCancelDeleteFile}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    width: "100%",
  },
  label: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  docFileIcon: {
    height: 35,
    width: 35,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginRight: 5,
  },
  fileInfoText: {
    color: colors.darkGrey,
    fontWeight: "400",
    fontSize: 12,
  },
  docIconText: {
    color: "#fff",
    textTransform: "uppercase",
    fontWeight: "700",
    fontSize: 13,
  },
  fileNameText: {
    color: "#5F6064",
  },
  deleteButton: {
    paddingHorizontal: "5%",
    paddingVertical: "2%",
  },
  deleteLabel: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    position: "absolute",
    right: "20%",
  },
  shadowProp: {
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
});
