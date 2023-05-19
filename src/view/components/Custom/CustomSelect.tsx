import React, { useState } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  ScrollView,
  StyleProp,
  ViewStyle,
} from "react-native";
import { colors } from "../../theme";
import SelectIcon from "~/view/assets/icons/selectArrow.svg";

interface Props {
  data: (string | { name: string; code: string })[];
  selectedItem: string;
  setSelectedItem: React.Dispatch<React.SetStateAction<any>>;
  maxHeight?: number | string;
  selectedItemColor?: string;
  error?: string;
  dropdownStyle?: StyleProp<ViewStyle>;
  selectedItemStyle?: StyleProp<ViewStyle>;
}

export const CustomSelect: React.FC<Props> = ({
  data,
  selectedItem,
  setSelectedItem,
  maxHeight,
  selectedItemColor,
  error,
  dropdownStyle,
  selectedItemStyle,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSelectItem = (
    item:
      | string
      | {
          name: string;
          code: string;
        }
  ) => {
    setSelectedItem(typeof item === "string" ? item : item.code);
    setShowDropdown(false);
  };

  return (
    <View
      style={[
        {
          ...styles.dropdownContainer,
          borderWidth: showDropdown ? 1 : 0,
        },
        dropdownStyle,
      ]}
    >
      <TouchableOpacity
        style={[
          { ...styles.selectedLabel, borderColor: error ? colors.red : colors.primary },
          selectedItemStyle,
        ]}
        onPress={() => setShowDropdown((prev) => !prev)}
      >
        <Text
          style={{
            ...styles.selectedText,
            color: selectedItemColor ? selectedItemColor : colors.primary,
          }}
        >
          {selectedItem}
        </Text>
        <SelectIcon height={10} width={20} color={colors.primary} />
      </TouchableOpacity>
      {showDropdown && (
        <ScrollView
          style={{ ...styles.dropdownOptionsContainer, maxHeight: maxHeight ? maxHeight : 130 }}
        >
          {data.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={{
                ...styles.dropdownOptionsLabel,
                backgroundColor: selectedItem === item ? colors.blue : "#fff",
                borderTopWidth: selectedItem === item ? 0.5 : 0,
                borderBottomWidth: selectedItem === item ? 0.5 : 0,
              }}
              onPress={() => handleSelectItem(item)}
            >
              <Text
                style={{
                  color: selectedItem === item ? "#fff" : colors.primary,
                  fontSize: 16,
                }}
              >
                {typeof item === "string" ? item : item.name}
              </Text>
            </TouchableOpacity>
          ))}
          {data.length > 4 && <View style={{ height: 15 }}></View>}
        </ScrollView>
      )}
      {error && !showDropdown && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  dropdownContainer: {
    marginTop: 20,
    borderRadius: 20,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    borderColor: colors.primary,
    borderTopWidth: 0,
    zIndex: 2,
    backgroundColor: "#fff",
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
    backgroundColor: '#fff',
    zIndex: 3
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
    padding: 8,
    paddingHorizontal: 20,
    borderColor: colors.layout,
  },
  errorText: {
    color: colors.red,
    marginLeft: "5%",
    fontWeight: "600",
    marginTop: 5,
  },
});
