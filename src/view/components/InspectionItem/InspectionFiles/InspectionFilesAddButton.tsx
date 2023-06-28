import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { colors } from "~/view/theme";
import PlusIcon from "~/view/assets/icons/plus.svg";

export const InspectionFilesAddButton: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Add File</Text>
      <View style={styles.addCategoryButton}>
        <PlusIcon color={'#fff'} height={15} width={15} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: '1%',
    borderWidth: 1,
    borderColor: "rgba(180, 188, 192, 1)",
    borderRadius: 50,
  },
  addCategoryButton: {
    borderRadius: 100,
    backgroundColor: colors.blue,
    justifyContent: "center",
    alignItems: "center",
    width: 25,
    height: 25,
  },
  text: {
    color: colors.blue,
    fontWeight: "500",
    fontSize: 18,
    paddingVertical: 5
  },
});