import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, StyleSheet, View } from "react-native";
import SettingInspectionsIcon from "../assets/icons/settingInspections.svg";
import SearchIcon from "../assets/icons/search.svg";
import { colors } from "../theme";
import { TextInput } from "react-native-gesture-handler";
import { useAppDispatch } from "~/store/hooks";
import { setShowInspectionsFilter } from "~/modules/user/actions";

interface Props {
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>
}

export const SearchForm: React.FC<Props> = ({query, setQuery}) => {
  const dispatch = useAppDispatch();

  return (
    <View style={styles.formContainer}>
      <View style={[styles.searchLabel, styles.shadowProp]}>
        <SearchIcon color={colors.primary} width={15} height={15} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          value={query}
          onChangeText={setQuery}
        />
      </View>
      <TouchableOpacity style={styles.filterButton} onPress={() => dispatch(setShowInspectionsFilter(true))}>
        <SettingInspectionsIcon color="#fff" width={30} height={30} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  filterButton: {
    backgroundColor: colors.blue,
    padding: 5,
    borderRadius: 10,
    width: 40,
    height: 40,
  },
  searchLabel: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.primary,
    flex: 1,
    alignSelf: "center",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginRight: "5%",
    borderBottomWidth: 0,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    backgroundColor: "#fff",
  },
  searchInput: {
    fontWeight: "600",
    fontSize: 16,
    paddingLeft: "5%",
    flex: 1,
  },
  shadowProp: {
    shadowColor: "#171717",
    shadowOffset: { width: -1, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
});
