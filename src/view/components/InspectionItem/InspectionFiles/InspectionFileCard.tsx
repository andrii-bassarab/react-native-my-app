import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, GestureResponderEvent } from "react-native";
import { getColorIconFileByFormat } from "~/utils/getInspectionColor";
import DotsIcon from "~/view/assets/icons/dots.svg";
import { colors, textStyles } from "~/view/theme";
import DeleteIcon from "~/view/assets/icons/delete.svg";
import { ModalDeleteItem } from "../../Custom/ModalDeleteItem";
import DeleteModalIcon from "~/view/assets/icons/deleteModal.svg";
import { normalize } from "~/utils/getWindowHeight";
import { getInspectionDate } from "~/utils/visibleDate";
import { InspectionFile } from "~/types/InspectionFile";

interface Props {
  file: InspectionFile;
  deleteFile: (fileToDeleter: InspectionFile) => void;
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
            backgroundColor: getColorIconFileByFormat(file.extension),
          }}
        >
          <Text style={styles.docIconText}>{file.extension}</Text>
        </View>
        <Text style={[styles.fileInfoText, styles.fileNameText]}>{file.name}</Text>
      </View>
      <View style={{ ...styles.label, width: "52%", justifyContent: "space-between" }}>
        <Text style={{...styles.fileInfoText, flex: 1}}>{getInspectionDate(new Date(file.createdOn), true)}</Text>
        {showDeleteLabel && (
          <TouchableOpacity
            style={[styles.deleteLabel, styles.shadowProp]}
            onPress={() => setShowDeleteModalWindow((prev) => !prev)}
          >
            <DeleteIcon color={colors.layout} width={normalize(25)} height={normalize(25)} />
            <Text style={textStyles.little}>Delete</Text>
          </TouchableOpacity>
        )}
        {displayDeleteIcon && (
          <TouchableOpacity style={styles.deleteButton} onPress={clickToDotsButton}>
            <DotsIcon color={colors.darkGrey} height={normalize(25)} width={normalize(20)} />
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
    height: normalize(50),
    width: normalize(50),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: normalize(10),
    marginRight: "5%",
  },
  fileInfoText: {
    color: colors.darkGrey,
    fontWeight: "400",
    ...textStyles.little,
  },
  docIconText: {
    color: "#fff",
    textTransform: "uppercase",
    fontWeight: "700",
    ...textStyles.little,
  },
  fileNameText: {
    color: "#5F6064",
  },
  deleteButton: {
    paddingHorizontal: normalize(30),
    paddingVertical: normalize(10),
  },
  deleteLabel: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 5,
    position: "absolute",
    right: "20%",
    paddingVertical: normalize(10),
    paddingHorizontal: normalize(10)
  },
  shadowProp: {
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
});
