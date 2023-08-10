import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors, textStyles } from "../../theme";
import { CategoryItems } from "~/types/Category";
import { CharacterCard } from "../../components/CategoryView/CharacterCard";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import { fetchInspectionFiles } from "~/modules/inspectionFiles";

interface Props {
  categoryItems: CategoryItems[];
  categoryId: string;
}

export const CategoryItemsList: React.FC<Props> = ({ categoryItems, categoryId }) => {
  const dispatch = useAppDispatch();
  const { inspectionItem } = useAppSelector((state) => state.inspectionItem);
  const { categoryItemsValues } = useAppSelector((state) => state);

  const { [inspectionItem.id]: currentInspectionFiles } = useAppSelector(
    (state) => state.inspectionFiles
  );

  const currentImages = (currentInspectionFiles?.files || []).filter(
    (file) =>
      file?.metadata?.documentFormat === "image" && file?.metadata?.fileRelatedToCategoryInspection && file?.metadata?.categoryIdRelation === categoryId
  );

  // @ts-ignore
  const callFetchInspectionFiles = async () => dispatch(fetchInspectionFiles(inspectionItem.id));

  return (
    <>
      {categoryItems.length > 0 ? (
        <View style={{ paddingTop: "1%" }}>
          {categoryItems.map((item) => {
            return (
              <CharacterCard
                key={item.id}
                title={item.name}
                message={item.description}
                result={
                  categoryItemsValues?.[categoryId]?.[inspectionItem.id]?.[item.id?.trim()]
                    ?.value === undefined
                    ? undefined
                    : categoryItemsValues?.[categoryId]?.[inspectionItem.id]?.[item.id]?.value ===
                      "true"
                }
                comment={
                  categoryItemsValues?.[categoryId]?.[inspectionItem.id]?.[item.id?.trim()]?.comment
                }
                inspectionItemId={item.id}
                id={item.id}
                categoryId={categoryId}
                itemImages={currentImages.filter(image => image.metadata.inspectionItemIdRelation === item.id)}
                loaderImages={currentInspectionFiles.loading}
              />
            );
          })}
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
    ...textStyles.regular,
  },
});
