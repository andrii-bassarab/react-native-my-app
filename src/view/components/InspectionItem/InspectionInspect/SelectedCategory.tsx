import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { colors, textStyles } from "~/view/theme";
import { CustomToggleInput } from "../../Custom/CustomToggleInput";
import { Category } from "~/types/Category";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import { actionsInspectionItem } from "~/modules/inspectionItem";
import { InspectionStatus } from "~/types/inspectionStatus";
import CompletedIcon from "~/view/assets/icons/completed.svg";
import { normalize } from "~/utils/getWindowHeight";
import FailedIcon from "~/view/assets/icons/failed.svg";

interface Props {
  category: Category;
}

export const SelectedCategory: React.FC<Props> = ({ category }) => {
  const dispatch = useAppDispatch();
  const { status, result, items, photos, id } = category;
  const { inspectionItem, categories } = useAppSelector((state) => state.inspectionItem);

  const dynamycCategoryApplyToInspection = categories.find(categoryToCheck => categoryToCheck.id === id)?.isRequired;

  const handleChangeCategoryApplyToInspection = () =>
    dispatch(
      actionsInspectionItem.setCategoryApplyToInspection({
        categoryId: category.id,
        value: !dynamycCategoryApplyToInspection,
      })
    );

  return (
    <View style={styles.categoryBox}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Text
          style={{
            fontWeight: "700",
            color: colors.darkGrey,
            ...textStyles.regular,
            marginBottom: '1%'
          }}
        >
          {category.title}
        </Text>
        {status === "Complete" && result === "Passed" && (
          <CompletedIcon
            color={"#96BF5B"}
            style={{ marginLeft: "2%" }}
            height={normalize(20)}
            width={normalize(20)}
          />
        )}
        {status === "Complete" && result === "Failed" && (
           <View style={styles.failedBox}>
           <FailedIcon color={"#fff"} height={normalize(15)} width={normalize(15)} />
         </View>
        )}
      </View>
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
      <View
        style={[
          styles.applyCategoryBox,
          inspectionItem?.status === InspectionStatus.COMPLETE &&
            styles.disabledApplyCategoryBox,
        ]}
      >
        <Text style={styles.categoryApplyText}>
          Does this category apply to the inspection?
        </Text>
        <CustomToggleInput
          value={Boolean(dynamycCategoryApplyToInspection)}
          onValueChange={handleChangeCategoryApplyToInspection}
          disabled={inspectionItem?.status === InspectionStatus.COMPLETE}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  categoryBox: {
    marginTop: normalize(15),
    borderTopWidth: normalize(4),
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
    ...textStyles.little,
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
    ...textStyles.little,
  },
  categoryApplyText: {
    ...textStyles.little,
    flex: 1,
    marginRight: 10,
    color: colors.darkGrey,
    marginTop: '1%'
  },
  applyCategoryBox: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingRight: 10,
  },
  disabledApplyCategoryBox: {
    opacity: 0.7,
  },
  failedBox: {
    width: normalize(25),
    height: normalize(25),
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.red,
    borderRadius: 100,
    marginLeft: '2%',
  },
});
