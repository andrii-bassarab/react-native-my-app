import React, { useState } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { normalize } from "~/utils/getWindowHeight";
import { colors, textStyles } from "~/view/theme";

interface Props {
  value: string;
  onValueChange: React.Dispatch<React.SetStateAction<string>>;
  data: any[];
  containerStyle?: object;
}

export const CustomRadioCheckbox: React.FC<Props> = ({
  value,
  onValueChange,
  containerStyle = {},
  data,
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      {data.map((item, index) => (
        <TouchableOpacity
          style={[styles.item]}
          onPress={() => onValueChange(item)}
          key={index}
        >
          <Text style={styles.resultOption}>{item}</Text>
          {value === item ? (
            <View style={styles.selectedItem}>
              <View style={[styles.toggle, { backgroundColor: colors.blue }]} />
            </View>
          ) : (
            <View
              style={[
                styles.toggle,
                value === item && { backgroundColor: colors.blue },
              ]}
            />
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  toggle: {
    borderRadius: 100,
    height: normalize(18),
    width: normalize(18),
    backgroundColor: "#BDBDBD",
    marginLeft: "5%",
    alignSelf: "center",
  },
  selectedItem: {
    height: normalize(25),
    width: normalize(25),
    borderRadius: 100,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: colors.blue,
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    marginLeft: "3%",
  },
  resultOption: {
    color: colors.textGrey,
    fontWeight: "500",
    ...textStyles.small,
  },
});
