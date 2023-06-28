import React from "react";
import {
  View,
  Text,
  StyleSheet,
} from "react-native";
import { colors, textStyles } from "../../theme";
import { CategoryAmenityField } from "~/types/Category";
import { AmenitiesCard } from "./AmenitiesCard";

interface Props {
  categoryAmenitiesValues: CategoryAmenityField[];
  loading: boolean;
  categoryApplyToInspection: boolean;
}

export const CategoryAmenitiesList: React.FC<Props> = ({
    categoryAmenitiesValues,
    categoryApplyToInspection,
    loading
}) => {
  return (
    <>
      {categoryAmenitiesValues.length > 0 ? (
        <>
        <Text style={styles.amenitiesTitle}>Amenities</Text>
          {categoryAmenitiesValues.map((amenity) => (
            <AmenitiesCard
              key={amenity.id}
              title={amenity.name}
              result={amenity.result}
              categoryApplyToInspection={categoryApplyToInspection}
              loading={loading}
              comment={amenity.comment}
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
    ...textStyles.regular,
    color: colors.textGrey,
    fontWeight: "700",
  },
  amenitiesTitle: {
    marginBottom: '5%',
    ...textStyles.regular,
    fontWeight: '600',
    color: colors.textGrey
  }
});
