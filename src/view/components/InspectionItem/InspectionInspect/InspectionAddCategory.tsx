import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { colors, textStyles } from "~/view/theme";
import PlusIcon from "~/view/assets/icons/plus.svg";
import { normalize } from "~/utils/getWindowHeight";

export const InspecitonAddCategory: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Add Inspection Category</Text>
      <View style={styles.addCategoryButton}>
        <PlusIcon color={'#fff'} height={normalize(25)} width={normalize(25)} />
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
    paddingVertical: "1%",
    borderWidth: 1,
    borderColor: "rgba(180, 188, 192, 1)",
    borderRadius: 50,
  },
  addCategoryButton: {
    borderRadius: 100,
    backgroundColor: colors.blue,
    justifyContent: "center",
    alignItems: "center",
    width: normalize(40),
    height: normalize(40),
  },
  text: {
    color: colors.blue,
    fontWeight: "500",
    paddingVertical: 5,
    ...textStyles.regular,
  },
});
