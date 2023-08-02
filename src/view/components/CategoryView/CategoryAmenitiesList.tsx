import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { colors, textStyles } from "../../theme";
import { CategoryAmenities } from "~/types/Category";
import { AmenitiesCard } from "./AmenitiesCard";
import { ContentLoader } from "../Loader/Loader";
import { useAppSelector } from "~/store/hooks";

interface Props {
  categoryAmenities: CategoryAmenities[];
  categoryId: string;
  loading: boolean;
}

export const CategoryAmenitiesList: React.FC<Props> = ({
  categoryAmenities,
  categoryId,
  loading,
}) => {
  const { inspectionItem } = useAppSelector((state) => state.inspectionItem);
  const { categoryAmenitiesValues } = useAppSelector((state) => state);

  return (
    <View>
      {loading ? (
        <View style={{ flex: 1, justifyContent: "center" }}>
          <ContentLoader size="large" />
        </View>
      ) : (
        <>
          {categoryAmenities.length > 0 ? (
            <>
              <Text style={styles.amenitiesTitle}>Amenities</Text>
              {categoryAmenities.map((amenity) => (
              <AmenitiesCard
                  key={amenity.id}
                  title={amenity.name}
                  result={
                    categoryAmenitiesValues?.[amenity.id]?.[inspectionItem.id]
                      ? categoryAmenitiesValues?.[amenity.id]?.[inspectionItem.id]?.value === "true"
                      : undefined
                  }
                  comment={
                    categoryAmenitiesValues?.[amenity.id]?.[inspectionItem.id]
                      ? categoryAmenitiesValues?.[amenity.id]?.[inspectionItem.id]?.comment
                      : undefined
                  }
                  categoryId={categoryId}
                  id={amenity.id}
                />
                ))}
            </>
          ) : (
            <View style={styles.noItemsBox}>
              <Text style={styles.noItemsText}>No category amenities</Text>
            </View>
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  noItemsBox: {
    alignItems: "center",
    justifyContent: "center",
    height: 60,
  },
  noItemsText: {
    ...textStyles.regular,
    color: colors.textGrey,
    fontWeight: "700",
  },
  amenitiesTitle: {
    marginBottom: "5%",
    ...textStyles.medium,
    fontWeight: "600",
    color: colors.textGrey,
  },
});
