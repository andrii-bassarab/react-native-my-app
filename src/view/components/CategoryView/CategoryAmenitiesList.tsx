import React from "react";
import {
  View,
  Text,
  StyleSheet,
} from "react-native";
import { colors, textStyles } from "../../theme";
import { CategoryAmenities } from "~/types/Category";
import { AmenitiesCard } from "./AmenitiesCard";

interface Props {
  categoryAmenitiesValues: CategoryAmenities[];
  categoryId: string;
}

export const CategoryAmenitiesList: React.FC<Props> = ({
    categoryAmenitiesValues,
    categoryId,
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
              result={amenity?.amenityValues ? amenity?.amenityValues[0]?.value === "true" : true}
              comment={amenity?.amenityValues ? amenity?.amenityValues[0]?.comment : "amenitie comment"}
              categoryId={categoryId}
              id={amenity.id}
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
    ...textStyles.medium,
    fontWeight: '600',
    color: colors.textGrey
  }
});
