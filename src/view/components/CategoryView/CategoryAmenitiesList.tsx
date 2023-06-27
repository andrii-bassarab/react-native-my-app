import React from "react";
import {
  View,
  Text,
  StyleSheet,
} from "react-native";
import { colors } from "../../theme";
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
  amenitiesTitle: {
    marginBottom: '5%',
    fontSize: 20,
    fontWeight: '600',
    color: colors.textGrey
  }
});