import React, { useCallback, useEffect, useState } from "react";
import { Text, SafeAreaView, StyleSheet, View, FlatList, Modal, Pressable } from "react-native";
import { colors } from "../theme";
import { WelcomeBox } from "../components/Screen/WelcomeBox";
import { SearchForm } from "../components/Inspections/SearchForm";
import { mocksData } from "../screens/Home";
import { ActivityItem } from "../components/Inspections/ActivityItem";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { setShowInspectionsFilter } from "~/modules/user/actions";
import { InspectionsFilter } from "../components/Inspections/InspectionsFilter";
import { useMemo } from "react";
import { ModalLoader } from "../components/Custom/ModalLoader";
import SearchIcon from '../assets/icons/search.svg';
import { NavigationProp, ParamListBase, RouteProp } from "@react-navigation/native";
import { Screen } from "../components/Screen/Screen";
import { InspectionStatus } from "~/types/inspectionStatus";

interface Props {
  route: RouteProp<{ params: {} }, "params">;
  navigation: NavigationProp<ParamListBase>;
}

export const Inspections: React.FC<Props> = ({route, navigation}) => {
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState("");
  const [visibleInspections, setVisibleInspections] = useState<typeof mocksData>(mocksData);
  const [loader, setLoader] = useState(false);

  const currentUser = useAppSelector((state) => state.user);
  const {
    statusNewUnscheduled,
    statusScheduled,
    statusIncomplete,
    statusCompleted,
    assignedToMe,
    unassigned,
    sortBy,
    selectedDayStartFrom,
    selectedDayBy,
  } = useAppSelector((state) => state.filterInspections);

  const dispatch = useAppDispatch();
  const closeInspectionFilterWindow = () => dispatch(setShowInspectionsFilter(false));

  const getSortedInspections = () => {
    if (sortBy === "Scheduled Date/Time") {
      setVisibleInspections((prev) =>
        prev.sort((current, next) => current.date.localeCompare(next.date))
      );
    } else {
      setVisibleInspections((prev) => {
        const newInspections = prev.filter((item) => item.status === InspectionStatus.NEW);
        const scheduled = prev.filter((item) => item.status === InspectionStatus.SCHEDULED);
        const inProgress = prev.filter((item) => item.status === InspectionStatus.INPROGRESS);
        const failed = prev.filter((item) => item.status === InspectionStatus.FAILED);
        const passed = prev.filter((item) => item.status === InspectionStatus.PASSED);

        return [...inProgress, ...scheduled, ...newInspections, ...failed, ...passed];
      });
    }
  };

  const makeRequest = () => {
    console.log("Making request...", query);
    setVisibleInspections((prev) =>
      prev.filter((item) =>
        item.title.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase())
      )
    );
  };

  const getFilteredInspections = useCallback(() => {
    statusNewUnscheduled
      ? setVisibleInspections((prev) => [
          ...mocksData.filter((item) => item.status === "Unscheduled" || item.status === "New"),
        ])
      : setVisibleInspections([]);

    statusScheduled &&
      setVisibleInspections((prev) => [
        ...prev,
        ...mocksData.filter((item) => item.status === "Scheduled"),
      ]);

    statusIncomplete &&
      setVisibleInspections((prev) => [
        ...prev,
        ...mocksData.filter((item) => item.status === "In Progress"),
      ]);

    statusCompleted &&
      setVisibleInspections((prev) => [
        ...prev,
        ...mocksData.filter((item) => item.status === "Passed" || item.status === "Failed"),
      ]);

    if (assignedToMe && !unassigned) {
      setVisibleInspections((prev) => prev.filter((item) => item.assigned === "Me"));
    }

    if (!assignedToMe && unassigned) {
      setVisibleInspections((prev) => prev.filter((item) => item.assigned === "Unassigned"));
    }

    if (!assignedToMe && !unassigned) {
      setVisibleInspections([]);
    }

    if (arrOFSelectedDates.length > 0) {
      setVisibleInspections((prev) =>
        prev.filter((item) => arrOFSelectedDates.includes(item.stringDate))
      );
    }
  }, [
    statusNewUnscheduled,
    statusScheduled,
    statusIncomplete,
    statusCompleted,
    assignedToMe,
    unassigned,
    query,
    selectedDayStartFrom,
    selectedDayBy,
  ]);

  const getDatesInRange = (startDate: string, endDate: string) => {
    const dateArray = [];
    const currentDate = new Date(startDate);

    while (currentDate <= new Date(endDate || startDate)) {
      dateArray.push(currentDate.toISOString().split("T")[0]);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dateArray;
  };

  const arrOFSelectedDates = useMemo(
    () => getDatesInRange(selectedDayStartFrom, selectedDayBy),
    [selectedDayStartFrom, selectedDayBy]
  );

  useEffect(() => {
    setTimeout(() => {
      setLoader(true);
    }, 200);

    getFilteredInspections();

    getSortedInspections();

    const timeoutId = setTimeout(() => {
      makeRequest();
      setLoader(false);
    }, 500);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [
    statusNewUnscheduled,
    statusScheduled,
    statusIncomplete,
    statusCompleted,
    assignedToMe,
    unassigned,
    sortBy,
    query,
    selectedDayStartFrom,
    selectedDayBy,
  ]);

  return (
    <Screen backgroundColor={colors.layout} paddingTop={0}>
      <View style={styles.screenContainer}>
        <View style={styles.content}>
          <WelcomeBox backgroundColor="transparant" textColor={colors.primary} />
          <Text style={styles.title}>Inspections</Text>
          <SearchForm query={query} setQuery={setQuery} showFilterButton={true} />
          {visibleInspections.length > 0 ? (
            <View style={{ marginBottom: "45%", marginTop: 10 }}>
              <FlatList
                data={visibleInspections}
                keyExtractor={(_item, index) => `key-${index}`}
                renderItem={({ item }) => <ActivityItem item={item} onPress={() => navigation.navigate('InspectionItem', item)} />}
                ListFooterComponent={() => <View style={{ height: 20 }} />}
                ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                showsVerticalScrollIndicator={false}
              />
            </View>
          ) : (
            <View style={styles.noResultContainer}>
              <SearchIcon width="30%" height="30%" color="#C9D4DA" />
              <Text style={styles.noResultText}>No search results found.</Text>
            </View>
          )}
        </View>
        {currentUser.showInspectionsFilterWindow && (
          <Modal transparent={true}>
            <View
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.33)",
                opacity: 0.9,
                height: insets.top + 60,
              }}
            >
              <Pressable onPress={closeInspectionFilterWindow} style={{ height: insets.top + 60 }} />
            </View>
            <InspectionsFilter />
          </Modal>
        )}
      </View>
      {loader && <ModalLoader />}
    </Screen>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.layout,
  },
  screenContainer: {
    paddingTop: 15,
    flex: 1,
  },
  content: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopRightRadius: 55,
    borderTopLeftRadius: 55,
    padding: 25,
    paddingTop: 15,
  },
  shadowProp: {
    shadowColor: "#171717",
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },
  title: {
    color: colors.primary,
    fontWeight: "700",
    fontSize: 16,
    marginTop: "5%",
    marginBottom: "3%",
  },
  noResultContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noResultText: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20
  }
});
