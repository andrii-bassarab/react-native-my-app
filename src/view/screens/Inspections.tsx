import React, { useCallback, useEffect, useState, useMemo } from "react";
import { Text, StyleSheet, View, FlatList } from "react-native";
import { colors, layout, textStyles } from "../theme";
import { WelcomeBox } from "../components/Screen/WelcomeBox";
import { SearchForm } from "../components/Inspections/SearchForm";
import { useAppSelector } from "~/store/hooks";
import { InspectionsFilter } from "../components/Inspections/InspectionsFilter";
import SearchIcon from "../assets/icons/search.svg";
import {
  NavigationProp,
  ParamListBase,
  RouteProp,
} from "@react-navigation/native";
import { Screen } from "../components/Screen/Screen";
import { InspectionVisibleStatus } from "~/types/inspectionStatus";
import { InspectionCard } from "../components/Inspections/InspectionCard";
import { getCalendarVisibleDate } from "~/utils/date/visibleDate";
import { InspectionType } from "~/models/InspectionItem";
import { ContentLoader } from "../components/Loader/Loader";
import { normalize } from "~/utils/normalize/normalize";

interface Props {
  route: RouteProp<{ params: {} }, "params">;
  navigation: NavigationProp<ParamListBase>;
}

export const Inspections: React.FC<Props> = ({ route, navigation }) => {
  const { inspections, visibleLoader } = useAppSelector(
    (state) => state.inspections
  );

  const [query, setQuery] = useState("");
  const [visibleInspections, setVisibleInspections] = useState(inspections);

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
            return (
              new Date(current.scheduledOn).getTime() -
              new Date(next.scheduledOn).getTime()
            );
          } else if (current.scheduledOn) {
            return -1;
          } else if (next.scheduledOn) {
            return 1;
          } else {
            return (
              new Date(current.createdOn).getTime() -
              new Date(next.createdOn).getTime()
            );
          }
        })
      );
    } else {
      setVisibleInspections((prev) => {
        const newInspections = prev.filter(
          (item) => item.visibleStatus === InspectionVisibleStatus.NEW
        );
        const scheduled = prev.filter(
          (item) => item.visibleStatus === InspectionVisibleStatus.SCHEDULED
        );
        const inProgress = prev.filter(
          (item) => item.visibleStatus === InspectionVisibleStatus.INPROGRESS
        );
        const failed = prev.filter(
          (item) => item.visibleStatus === InspectionVisibleStatus.FAILED
        );
        const passed = prev.filter(
          (item) => item.visibleStatus === InspectionVisibleStatus.PASSED
        );

        return [
          ...inProgress,
          ...scheduled,
          ...newInspections,
          ...passed,
          ...failed,
        ];
      });
    }
  };

  const makeRequest = () => {
    setVisibleInspections((prev) =>
      prev.filter((item) =>
        `Inspection ${item?.unit?.streetAddress}`
          .toLocaleLowerCase()
          .includes(query.trim().toLocaleLowerCase())
      )
    );
  };

  const getFilteredInspections = useCallback(() => {
    setVisibleInspections(inspections);

    const newUnscheduledInspections = inspections.filter(
      (item) =>
        item.visibleStatus === InspectionVisibleStatus.UNSCHEDULED ||
        item.visibleStatus === InspectionVisibleStatus.NEW
    );

    const scheduledInspections = inspections.filter(
      (item) => item.visibleStatus === InspectionVisibleStatus.SCHEDULED
    );

    const incompleteInspections = inspections.filter(
      (item) => item.visibleStatus === InspectionVisibleStatus.INPROGRESS
    );

    const completeInspections = inspections.filter(
      (item) =>
        item.visibleStatus === InspectionVisibleStatus.PASSED ||
        item.visibleStatus === InspectionVisibleStatus.FAILED
    );

    let filteredInspections: InspectionType[] = [];

    if (statusNewUnscheduled) {
      filteredInspections.push(...newUnscheduledInspections);
    }

    if (statusScheduled) {
      filteredInspections.push(...scheduledInspections);
    }

    if (statusIncomplete) {
      filteredInspections.push(...incompleteInspections);
    }

    if (statusCompleted) {
      filteredInspections.push(...completeInspections);
    }

    if (assignedToMe && !unassigned) {
      filteredInspections = filteredInspections.filter(
        (item) => item.assignedTo === "5e94b7f0fa86cf0016c4d92c"
      );
    }

    if (!assignedToMe && unassigned) {
      filteredInspections = filteredInspections.filter(
        (item) => item.assignedTo !== "5e94b7f0fa86cf0016c4d92c"
      );
    }

    if (!assignedToMe && !unassigned) {
      filteredInspections = [];
    }

    if (arrOFSelectedDates.length > 0) {
      filteredInspections = filteredInspections.filter((item) =>
        arrOFSelectedDates.includes(
          item.scheduledOn
            ? getCalendarVisibleDate(new Date(item.scheduledOn)).trim()
            : getCalendarVisibleDate(new Date(item.createdOn)).trim()
        )
      );
    }

    setVisibleInspections(filteredInspections);
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
    inspections
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
    getFilteredInspections();
    getSortedInspections();
    makeRequest();
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
    inspections,
  ]);

  return (
    <Screen backgroundColor={colors.layout} paddingTop={layout.screenPadding}>
      <View style={styles.content}>
        <WelcomeBox
          backgroundColor="transparant"
          textColor={colors.primary}
          showText
        />
        <Text style={styles.title}>Inspections</Text>
        <SearchForm query={query} setQuery={setQuery} showFilterButton={true} />
        {visibleLoader && inspections.length === 0 ? (
          <View style={styles.contentLoaderContainer}>
            <ContentLoader />
          </View>
        ) : visibleInspections.length > 0 ? (
          <View style={{ marginBottom: normalize(120), marginTop: "3%" }}>
            <FlatList
              data={visibleInspections}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <InspectionCard
                  inspection={item}
                  onPress={() => navigation.navigate("InspectionItem", item)}
                />
              )}
              ListHeaderComponent={() => (
                <View style={{ height: normalize(5) }} />
              )}
              ListFooterComponent={() => (
                <View style={{ height: normalize(180) }} />
              )}
              ItemSeparatorComponent={() => (
                <View style={{ height: normalize(15) }} />
              )}
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
    </Screen>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.layout,
  },
  content: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopRightRadius: normalize(100),
    borderTopLeftRadius: normalize(100),
    padding: 25,
    paddingHorizontal: "7%",
  },
  shadowProp: {
    shadowColor: "#171717",
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 3,
  },
  title: {
    color: colors.primary,
    fontWeight: "700",
    marginTop: "3%",
    marginBottom: "3%",
    ...textStyles.medium,
  },
  noResultContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noResultText: {
    color: colors.primary,
    ...textStyles.large,
    fontWeight: "600",
    marginBottom: 20,
  },
  contentLoaderContainer: {
    height: "80%",
    justifyContent: "center",
    alignItems: "center",
  },
});
