import React, { useCallback, useEffect, useState } from "react";
import { Text, StyleSheet, View, FlatList } from "react-native";
import { colors } from "../theme";
import { WelcomeBox } from "../components/Screen/WelcomeBox";
import { SearchForm } from "../components/Inspections/SearchForm";
import { useAppSelector } from "~/store/hooks";
import { InspectionsFilter } from "../components/Inspections/InspectionsFilter";
import { useMemo } from "react";
import { ModalLoader } from "../components/Custom/ModalLoader";
import SearchIcon from "../assets/icons/search.svg";
import { NavigationProp, ParamListBase, RouteProp } from "@react-navigation/native";
import { Screen } from "../components/Screen/Screen";
import { InspectionStatus } from "~/types/inspectionStatus";
import { InspectionCard } from "../components/Inspections/InspectionCard";
import { getCalendarVisibleDate } from "~/utils/visibleDate";

interface Props {
  route: RouteProp<{ params: {} }, "params">;
  navigation: NavigationProp<ParamListBase>;
}

export const Inspections: React.FC<Props> = ({ route, navigation }) => {
  const { inspections } = useAppSelector((state) => state.inspections);

  const [query, setQuery] = useState("");
  const [visibleInspections, setVisibleInspections] = useState(inspections);
  const [loader, setLoader] = useState(false);

  const showWindow = useAppSelector((state) => state.showWindow);

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

  const getSortedInspections = () => {
    if (sortBy === "Scheduled Date/Time") {
      setVisibleInspections((prev) =>
        prev.sort((current, next) => {
          if (current.scheduledOn && next.scheduledOn) {
            return new Date(current.scheduledOn).getTime() - new Date(next.scheduledOn).getTime();
          } else if (current.scheduledOn) {
            return -1;
          } else if (next.scheduledOn) {
            return 1;
          } else {
            return new Date(current.createdOn).getTime() - new Date(next.createdOn).getTime();
          }
        })
      );
    } else {
      setVisibleInspections((prev) => {
        const newInspections = prev.filter((item) => item.visibleStatus === InspectionStatus.NEW);
        const scheduled = prev.filter((item) => item.visibleStatus === InspectionStatus.SCHEDULED);
        const inProgress = prev.filter((item) => item.visibleStatus === InspectionStatus.INPROGRESS);
        const failed = prev.filter((item) => item.visibleStatus === InspectionStatus.FAILED);
        const passed = prev.filter((item) => item.visibleStatus === InspectionStatus.PASSED);

        return [...inProgress, ...scheduled, ...newInspections, ...passed, ...failed];
      });
    }
  };

  const makeRequest = () => {
    console.log("Making request...", query);
    setVisibleInspections((prev) =>
      prev.filter((item) =>
        item.unit.streetAddress.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase())
      )
    );
  };

  const getFilteredInspections = useCallback(() => {
    statusNewUnscheduled
      ? setVisibleInspections((prev) => [
          ...inspections.filter(
            (item) =>
              item.visibleStatus === InspectionStatus.UNSCHEDULED ||
              item.status === InspectionStatus.NEW
          ),
        ])
      : setVisibleInspections([]);

    statusScheduled &&
      setVisibleInspections((prev) => [
        ...prev,
        ...inspections.filter((item) => item.visibleStatus === InspectionStatus.SCHEDULED),
      ]);

    statusIncomplete &&
      setVisibleInspections((prev) => [
        ...prev,
        ...inspections.filter((item) => item.visibleStatus === InspectionStatus.INPROGRESS),
      ]);

    statusCompleted &&
      setVisibleInspections((prev) => [
        ...prev,
        ...inspections.filter(
          (item) =>
            item.visibleStatus === InspectionStatus.PASSED ||
            item.visibleStatus === InspectionStatus.FAILED
        ),
      ]);

    if (assignedToMe && !unassigned) {
      setVisibleInspections((prev) =>
        prev.filter((item) => item.assignedTo === "5e94b7f0fa86cf0016c4d92c")
      );
    }

    if (!assignedToMe && unassigned) {
      setVisibleInspections((prev) =>
        prev.filter((item) => item.assignedTo !== "5e94b7f0fa86cf0016c4d92c")
      );
    }

    if (!assignedToMe && !unassigned) {
      setVisibleInspections([]);
    }

    if (arrOFSelectedDates.length > 0) {
      setVisibleInspections((prev) =>
        prev.filter((item) =>
          arrOFSelectedDates.includes(
            item.scheduledOn
              ? getCalendarVisibleDate(new Date(item.scheduledOn))
              : getCalendarVisibleDate(new Date(item.createdOn))
          )
        )
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
    setLoader(true);
    getFilteredInspections();
    getSortedInspections();
    makeRequest();
    setLoader(false);
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
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <InspectionCard
                    inspection={item}
                    onPress={() => navigation.navigate("InspectionItem", item)}
                  />
                )}
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
        {showWindow.showInspectionsFilter && <InspectionsFilter />}
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
    justifyContent: "center",
    alignItems: "center",
  },
  noResultText: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 20,
  },
});
