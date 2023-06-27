import React, { useState } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { colors } from "~/view/theme";

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
        <TouchableOpacity style={[styles.item]} onPress={() => onValueChange(item)} key={index}>
          <Text style={styles.resultOption}>{item}</Text>
          {value === item ? (
            <View style={styles.selectedItem}>
              <View
                style={[styles.toggle, { backgroundColor: colors.blue }]}
              />
            </View>
          ) : (
            <View
              style={[styles.toggle, value === item && { backgroundColor: colors.blue }]}
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
    height: 12,
    width: 12,
    backgroundColor: "#BDBDBD",
    marginLeft: "3%",
    alignSelf: 'center'
  },
  selectedItem: {
    height: 18,
    width: 18,
    borderRadius: 100,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: colors.blue,
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    marginLeft: "3%",
  },
  resultOption: {
    color: colors.textGrey,
    fontWeight: "500",
    fontSize: 14,
  },
});
