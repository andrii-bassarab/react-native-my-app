import React from "react";
import {
  View,
  Text,
  StyleSheet,
} from "react-native";
import { colors } from "../../theme";
import { CategoryItemField } from "~/types/Category";
import { AmenitiesCard } from "./AmenitiesCard";

interface Props {
  categoryItemsValues: CategoryItemField[];
  loading: boolean;
  categoryApplyToInspection: boolean;
}

export const CategoryAmenitiesList: React.FC<Props> = ({
    categoryItemsValues: categoryAmenitiesValues,
    categoryApplyToInspection,
}) => {
  return (
    <>
      {categoryAmenitiesValues.length > 0 ? (
        <>
        <Text style={styles.amenitiesTitle}>Amenities</Text>
          {categoryAmenitiesValues.map((item) => (
            <AmenitiesCard
              key={item.id}
              title={item.name}
              message={item.description}
              result={"Yes"}
              categoryApplyToInspection={categoryApplyToInspection}
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
