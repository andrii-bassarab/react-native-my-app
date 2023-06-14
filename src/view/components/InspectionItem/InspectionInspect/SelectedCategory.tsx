import React, { useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { colors } from "~/view/theme";
import { CustomToggleInput } from "../../Custom/CustomToggleInput";
import { Category } from "~/types/Category";
import { useAppDispatch, useAppSelector } from "~/store/hooks";

interface Props {
  category: Category;
}

export const SelectedCategory: React.FC<Props> = ({ category }) => {
  const dispatch = useAppDispatch();
  const [categoryIncludeInspection, setCategoryIncludeInspection] = useState(true);
  const { status, result, items, photos, categoryApplyToInspection } = category;
  const { categories } = useAppSelector((state) => state.inspectionItem);

  // const [toggleCategoryApplyToInspection, setToggleCategoryApplyToInspection] = useState(categoryApplyToInspection);

  return (
    <View style={styles.categoryBox}>
      <Text style={{ fontSize: 16, fontWeight: "700", color: colors.darkGrey }}>
        {category.title}
      </Text>
      <View style={styles.content}>
        <View style={{ flex: 1 }}>
          <View style={styles.label}>
            <Text style={styles.labelText}>Status:</Text>
            <Text style={styles.text}>{status}</Text>
          </View>
          <View style={styles.label}>
            <Text style={styles.labelText}>Result:</Text>
            <Text style={styles.text}>{result}</Text>
          </View>
        </View>
        <View style={{ flex: 0.6 }}>
          <View style={styles.label}>
            <Text style={{ ...styles.labelText, flex: 1.4 }}>Items:</Text>
            <Text style={styles.text}>{items}</Text>
          </View>
          <View style={styles.label}>
            <Text style={{ ...styles.labelText, flex: 1.4 }}>Photos:</Text>
            <Text style={styles.text}>{photos}</Text>
          </View>
        </View>
      </View>
      <View style={styles.applyCategoryBox}>
        <Text style={styles.categoryApplyText}>
          Does this category apply to the inspection?
        </Text>
        <CustomToggleInput
          value={categoryApplyToInspection}
          onValueChange={() => null}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  categoryBox: {
    marginTop: 10,
    borderTopWidth: 4,
    borderColor: "#EBEBEB",
    paddingTop: 5,
  },
  content: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
  },
  labelText: {
    color: "#8E8E8E",
    fontWeight: "600",
    flex: 0.5,
    fontSize: 13,
  },
  label: {
    flexDirection: "row",
    marginBottom: 5,
    flexWrap: "wrap",
  },
  text: {
    color: "#8E8E8E",
    fontWeight: "400",
    textAlign: "left",
    flex: 1,
    fontSize: 13,
  },
  categoryApplyText: {
    fontSize: 12,
    flex: 1,
    marginRight: 10,
    color: colors.darkGrey,
  },
  applyCategoryBox: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingRight: 10,
  },
});
