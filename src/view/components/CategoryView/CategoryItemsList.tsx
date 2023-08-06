import React from "react";
import {
  View,
  Text,
  StyleSheet,
} from "react-native";
import { colors, textStyles } from "../../theme";
import { CategoryItems } from "~/types/Category";
import { CharacterCard } from "../../components/CategoryView/CharacterCard";
import { useAppSelector } from "~/store/hooks";

interface Props {
  categoryItems: CategoryItems[];
  categoryId: string;
}

export const CategoryItemsList: React.FC<Props> = ({
    categoryItems,
    categoryId
}) => {
  const { inspectionItem } = useAppSelector((state) => state.inspectionItem);
  const { categoryItemsValues } = useAppSelector((state) => state);

  return (
    <>
      {categoryItems.length > 0 ? (
        <View style={{paddingTop: "1%"}}>
          {categoryItems.map((item) => (
            <CharacterCard
              key={item.id}
              title={item.name}
              message={item.description}
              result={categoryItemsValues?.[categoryId]?.[inspectionItem.id]?.[item.id]?.value === undefined ? undefined : categoryItemsValues?.[categoryId]?.[inspectionItem.id]?.[item.id]?.value === "true"}
              comment={categoryItemsValues?.[categoryId]?.[inspectionItem.id]?.[item.id]?.comment}
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
