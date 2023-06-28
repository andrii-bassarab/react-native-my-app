import React from "react";
import { TouchableOpacity, StyleSheet, View, Platform, TextInput } from "react-native";
import SettingInspectionsIcon from "~/view/assets/icons/settingInspections.svg";
import SearchIcon from "~/view/assets/icons/search.svg";
import { colors } from "../../theme";
import { useAppDispatch } from "~/store/hooks";
import CloseIcon from "~/view/assets/svg/close";
import { actionsShowWindow } from "~/modules/showWindow";

interface Props {
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  showFilterButton?: boolean;
  placeholder?: string;
}

export const SearchForm: React.FC<Props> = ({ query, setQuery, showFilterButton, placeholder }) => {
  const dispatch = useAppDispatch();

  return (
    <View style={styles.formContainer}>
      <View style={[styles.searchLabel, styles.shadowProp, !showFilterButton && {marginRight: 0}]}>
        <View style={styles.inputContainer}>
          <SearchIcon color={colors.primary} width={15} height={15} />
          <TextInput
            style={styles.searchInput}
            textAlignVertical="center"
            placeholder={placeholder || "Search"}
            value={query}
            onChangeText={setQuery}
          />
        </View>
        {query && (
          <TouchableOpacity onPress={() => setQuery("")}>
            <CloseIcon size={24} />
          </TouchableOpacity>
        )}
      </View>
      {showFilterButton && (
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => dispatch(actionsShowWindow.setShowInspectionsFilter(true))}
        >
          <SettingInspectionsIcon color="#fff" width={30} height={30} />
        </TouchableOpacity>
      )}
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
    flexWrap: "wrap",
    borderWidth: 1,
    borderColor: colors.primary,
    flex: 1,
    alignSelf: "center",
    paddingRight: 5,
    paddingLeft: 20,
    borderRadius: 40,
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
    lineHeight: 20,
    paddingVertical: "1%"
  },
  shadowProp: {
    shadowColor: "#171717",
    shadowOffset: { width: -1, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  inputContainer: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
  },
});
