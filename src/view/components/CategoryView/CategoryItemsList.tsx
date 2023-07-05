import React from "react";
import {
  View,
  Text,
  StyleSheet,
} from "react-native";
import { colors, textStyles } from "../../theme";
import { CategoryItems } from "~/types/Category";
import { CharacterCard } from "../../components/CategoryView/CharacterCard";

interface Props {
  categoryItemsValues: CategoryItems[];
  categoryId: string;
}

export const CategoryItemsList: React.FC<Props> = ({
    categoryItemsValues,
    categoryId
}) => {
  return (
    <>
      {categoryItemsValues.length > 0 ? (
        <View style={{paddingTop: "1%"}}>
          {categoryItemsValues.map((item) => (
            <CharacterCard
              key={item.id}
              title={item.name}
              message={item.description}
              result={item.itemsValues[0]?.value === undefined ? undefined : item.itemsValues[0]?.value === "true"}
              comment={item.itemsValues[0]?.comment === undefined ? undefined : item.itemsValues[0]?.comment}
              inspectionItemId={item.id}
              id={item.id}
              categoryId={categoryId} 
            />
          ))}
        </View>
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
    color: colors.textGrey,
    fontWeight: "700",
    ...textStyles.regular
  },
});
