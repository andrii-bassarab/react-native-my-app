import React from "react";
import {
  View,
  Text,
  StyleSheet,
} from "react-native";
import { colors } from "../../theme";
import { CategoryItemField } from "~/types/Category";
import { CharacterCard } from "../../components/CategoryView/CharacterCard";

interface Props {
  categoryItemsValues: CategoryItemField[];
  loading: boolean;
  categoryApplyToInspection: boolean;
}

export const CategoryItemsList: React.FC<Props> = ({
    categoryItemsValues,
    loading,
    categoryApplyToInspection,
}) => {
  return (
    <>
      {categoryItemsValues.length > 0 ? (
        <>
          {categoryItemsValues.map((item) => (
            <CharacterCard
              key={item.id}
              title={item.name}
              message={item.description}
              result={item.result}
              categoryApplyToInspection={categoryApplyToInspection}
              comment={item.comment}
              id={item.id}
              loading={loading}
            />
          ))}
        </>
      ) : (
        <View style={styles.noItemsBox}>
          <Text style={styles.noItemsText}>No category items</Text>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  noItemsBox: {
    alignItems: "center",
    justifyContent: "center",
    height: 60,
  },
  noItemsText: {
    fontSize: 20,
    color: colors.textGrey,
    fontWeight: "700",
  },
});
