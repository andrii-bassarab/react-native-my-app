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
import { colors, textStyles } from "../../theme";
import SelectIcon from "~/view/assets/icons/selectArrow.svg";
import { normalize } from "~/utils/normalize/normalize";

export type OptionItem = string | { name: string; value: string | null };

interface Props {
  data: OptionItem[];
  selectedItem: OptionItem;
  setSelectedItem: React.Dispatch<React.SetStateAction<OptionItem>>;
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

  const handleSelectItem = (item: OptionItem) => {
    setSelectedItem(item);
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
          {
            ...styles.selectedLabel,
            borderColor: error ? colors.red : colors.primary,
          },
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
          {typeof selectedItem === "string" ? selectedItem : selectedItem.name}
        </Text>
        <SelectIcon height={10} width={20} color={colors.primary} />
      </TouchableOpacity>
      {showDropdown && (
        <ScrollView
          style={{
            ...styles.dropdownOptionsContainer,
            maxHeight: maxHeight ? maxHeight : 130,
          }}
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
                  ...textStyles.regular,
                }}
              >
                {typeof item === "string" ? item : item.name}
              </Text>
            </TouchableOpacity>
          ))}
          {data.length > 4 && <View style={{ height: normalize(20) }}></View>}
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
    borderTopLeftRadius: normalize(40),
    borderTopRightRadius: normalize(40),
    borderColor: colors.primary,
    borderTopWidth: 0,
    zIndex: 2,
    backgroundColor: "#fff",
    paddingBottom: normalize(10),
  },
  selectedLabel: {
    borderRadius: normalize(50),
    borderWidth: 1,
    paddingHorizontal: normalize(25),
    paddingVertical: normalize(15),
    borderColor: colors.primary,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    zIndex: 3,
  },
  selectedText: {
    ...textStyles.regular,
    color: colors.primary,
    fontWeight: "500",
  },
  dropdownOptionsContainer: {
    paddingVertical: normalize(10),
    borderBottomLeftRadius: normalize(20),
    borderBottomRightRadius: normalize(20),
    maxHeight: 130,
    zIndex: -3
  },
  dropdownOptionsLabel: {
    padding: normalize(10),
    paddingHorizontal: normalize(25),
    borderColor: colors.layout,
  },
  errorText: {
    color: colors.red,
    marginLeft: "5%",
    fontWeight: "600",
    marginTop: "2%",
    ...textStyles.small,
  },
});
