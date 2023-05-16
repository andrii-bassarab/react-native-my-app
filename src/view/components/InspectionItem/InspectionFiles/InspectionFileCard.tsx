import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { getColorIconFileByFormat } from "~/utils/getInspectionColor";
import DotsIcon from "~/view/assets/icons/dots.svg";
import { colors } from "~/view/theme";

interface Props {
  file: {
    name: string;
    uploadTime: string;
    docFormat: string;
  };
}

export const InspectionFileCard: React.FC<Props> = ({ file }) => {
  return (
    <View style={styles.card}>
      <View style={styles.card}>
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
      <View style={styles.card}>
        <Text style={styles.fileInfoText}>{file.uploadTime}</Text>
        <TouchableOpacity style={styles.deleteButton}>
          <DotsIcon color={colors.darkGrey} height={15} width={10}/>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap"
  },
  docFileIcon: {
    height: 35,
    width: 35,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginRight: 5
  },
  fileInfoText: {
    color: colors.darkGrey,
    fontWeight: "400",
    fontSize: 12
  },
  docIconText: {
    color: '#fff',
    textTransform: 'uppercase',
    fontWeight: "700",
    fontSize: 13
  },
  fileNameText: {
    color: "#5F6064",
  },
  deleteButton: {
    paddingHorizontal: "1%"
  }
});
