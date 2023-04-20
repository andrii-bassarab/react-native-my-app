import React, { useState } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  ScrollView,
} from "react-native";
import { colors } from "../../theme";
import SelectIcon from "~/view/assets/icons/selectArrow.svg";

interface Props {
  data: string[];
  selectedItem: string;
  setSelectedItem: React.Dispatch<React.SetStateAction<any>>
}

export const CustomSelect: React.FC<Props> = ({data, selectedItem, setSelectedItem }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <View
      style={{
        ...styles.dropdownContainer,
        borderWidth: showDropdown ? 1 : 0,
      }}
    >
      <TouchableOpacity
        style={styles.selectedLabel}
        onPress={() => setShowDropdown((prev) => !prev)}
      >
        <Text style={styles.selectedText}>{selectedItem}</Text>
        <SelectIcon height={10} width={20} color={colors.primary} />
      </TouchableOpacity>
      {showDropdown && (
        <ScrollView style={styles.dropdownOptionsContainer}>
          {data.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={{
                ...styles.dropdownOptionsLabel,
                backgroundColor:
                selectedItem === item ? colors.blue : "#fff",
                borderTopWidth: selectedItem === item ? 0.5 : 0,
                borderBottomWidth: selectedItem === item ? 0.5 : 0,
              }}
              onPress={() => {
                setSelectedItem(item);
                setShowDropdown(false);
              }}
            >
              <Text
                style={{
                  color:
                  selectedItem === item ? "#fff" : colors.primary,
                  fontSize: 16,
                }}
              >
                {item}
              </Text>
            </TouchableOpacity>
          ))}
          {data.length > 4 && (
            <View style={{ height: 15 }}></View>
          )}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  dropdownContainer: {
    marginTop: 20,
    borderRadius: 20,
    borderColor: colors.primary,
    borderTopWidth: 0,
    zIndex: 2,
  },
  selectedLabel: {
    borderRadius: 50,
    borderWidth: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderColor: colors.primary,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectedText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: "500",
  },
  dropdownOptionsContainer: {
    paddingVertical: 10,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    maxHeight: 130,
  },
  dropdownOptionsLabel: {
    padding: 5,
    paddingHorizontal: 20,
    borderColor: colors.layout,
  },
  saveButton: {
    alignSelf: "flex-end",
    paddingHorizontal: 55,
    paddingVertical: 10,
    backgroundColor: colors.layout,
    borderRadius: 50,
    marginTop: 20,
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  switchSiteLabel: {
    height: 5,
    backgroundColor: "rgba(193, 188, 185, 1)",
    alignSelf: "center",
    width: "60%",
    borderRadius: 40,
  },
  switchSiteLabelBox: {
    paddingVertical: 10,
  },
  switchBox: {
    height: "55%",
    backgroundColor: "#fff",
    borderTopRightRadius: 55,
    borderTopLeftRadius: 55,
    padding: 30,
    paddingTop: 10,
    alignItems: "stretch",
  },
  switchSiteTitle: {
    alignSelf: "flex-start",
    marginTop: 10,
    fontSize: 18,
    fontWeight: "600",
    color: "#808080",
  },
});