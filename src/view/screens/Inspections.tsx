import React, { useEffect, useState } from "react";
import {
  Text,
  SafeAreaView,
  StyleSheet,
  View,
  FlatList,
  Modal,
  Pressable,
} from "react-native";
import { colors } from "../theme";
import { WelcomeBox } from "../components/WelcomeBox";
import { SearchForm } from "../components/SearchForm";
import { mocksData } from "../screens/Home";
import { ActivityItem } from "../components/ActivityItem";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { setShowInspectionsFilter } from "~/modules/user/actions";
import { InspectionsFilter } from "../components/InspectionsFilter";
import { useMemo } from "react";
import { ModalLoader } from "../components/ModalLoader";

export const Inspections = () => {
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState("");
  const [visibleInspections, setVisibleInspections] = useState<typeof mocksData>(mocksData);
  const [statusNewUnscheduled, setStatusNewUnscheduled] = useState(true);
  const [statusScheduled, setStatusScheduled] = useState(true);
  const [statusIncomplete, setStatusIncomplete] = useState(true);
  const [statusCompleted, setStatusCompleted] = useState(true);
  const [assignedToMe, setAssignedToMe] = useState(true);
  const [unassigned, setUnassigned] = useState(true);
  const [sortBy, setSortBy] = useState<"Scheduled Date/Time" | "Status">("Scheduled Date/Time");
  const [selectedDayStartFrom, setSelectedDayStartFrom] = useState("");
  const [selectedDayBy, setSelectedDayBy] = useState("");
  const [loader, setLoader] = useState(false);

  const currentUser = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  const closeInspectionFilterWindow = () => dispatch(setShowInspectionsFilter(false));

  const getSortedInspections = () => {
    if (sortBy === "Scheduled Date/Time") {
      setVisibleInspections((prev) =>
        prev.sort((current, next) => current.date.localeCompare(next.date))
      );
    } else {
      setVisibleInspections((prev) => {
        const newInspections = prev.filter((item) => item.status === "New");
        const scheduled = prev.filter((item) => item.status === "Scheduled");
        const inProgress = prev.filter((item) => item.status === "In Progress");
        const failed = prev.filter((item) => item.status === "Failed");
        const passed = prev.filter((item) => item.status === "Passed");

        return [
          ...inProgress,
          ...scheduled,
          ...newInspections,
          ...failed,
          ...passed,
        ];
      });
    }
  };

  const makeRequest = () => {
    console.log("Making request...", query);
    setVisibleInspections((prev) =>
      prev.filter((item) =>
        item.title
          .toLocaleLowerCase()
          .includes(query.trim().toLocaleLowerCase())
      )
    );
  };

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
    statusNewUnscheduled
      ? setVisibleInspections((prev) => [
          ...mocksData.filter(
            (item) => item.status === "Unscheduled" || item.status === "New"
          ),
        ])
      : setVisibleInspections([]);

    statusScheduled
      ? setVisibleInspections((prev) => [
          ...prev,
          ...mocksData.filter((item) => item.status === "Scheduled"),
        ])
      : setVisibleInspections((prev) => prev);

    statusIncomplete
      ? setVisibleInspections((prev) => [
          ...prev,
          ...mocksData.filter(
            (item) => item.status === "In Progress"
          ),
        ])
      : setVisibleInspections((prev) => prev);

    statusCompleted
      ? setVisibleInspections((prev) => [
          ...prev,
          ...mocksData.filter((item) => item.status === "Passed" || item.status === "Failed"),
        ])
      : setVisibleInspections((prev) => prev);

    if (assignedToMe && !unassigned) {
      setVisibleInspections((prev) =>
        prev.filter((item) => item.assigned === "Me")
      );
    }

    if (!assignedToMe && unassigned) {
      setVisibleInspections((prev) =>
        prev.filter((item) => item.assigned === "Unassigned")
      );
    }

    if (!assignedToMe && !unassigned) {
      setVisibleInspections([]);
    }

    if (arrOFSelectedDates.length > 0) {
      setVisibleInspections((prev) =>
        prev.filter((item) => arrOFSelectedDates.includes(item.stringDate))
      );
    }

    getSortedInspections();

    const timeoutId = setTimeout(() => {
      makeRequest();
    }, 700);

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
    <SafeAreaView style={styles.screen}>
      <View style={styles.screenContainer}>
        <View style={styles.content}>
          <WelcomeBox
            backgroundColor="transparant"
            textColor={colors.primary}
          />
          <Text style={styles.title}>Inspections</Text>
          <SearchForm query={query} setQuery={setQuery} />
          <View style={{ marginBottom: "45%", marginTop: 10 }}>
            <FlatList
              data={visibleInspections}
              keyExtractor={(_item, index) => `key-${index}`}
              renderItem={({ item }) => <ActivityItem item={item} />}
              ListFooterComponent={() => <View style={{ height: 20 }} />}
              ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
              showsVerticalScrollIndicator={false}
            />
          </View>
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
              <Pressable
                onPress={closeInspectionFilterWindow}
                style={{ height: insets.top * 2 }}
              />
            </View>
            <InspectionsFilter
              statusNewUnscheduled={statusNewUnscheduled}
              setStatusNewUnscheduled={setStatusNewUnscheduled}
              statusScheduled={statusScheduled}
              setStatusScheduled={setStatusScheduled}
              statusIncomplete={statusIncomplete}
              setStatusIncomplete={setStatusIncomplete}
              statusCompleted={statusCompleted}
              setStatusCompleted={setStatusCompleted}
              assignedToMe={assignedToMe}
              setAssignedToMe={setAssignedToMe}
              unassigned={unassigned}
              setUnassigned={setUnassigned}
              selectedDayStartFrom={selectedDayStartFrom}
              setSelectedDayStartFrom={setSelectedDayStartFrom}
              selectedDayBy={selectedDayBy}
              setSelectedDayBy={setSelectedDayBy}
              sortBy={sortBy}
              setSortBy={setSortBy}
            />
          </Modal>
        )}
      </View>
      {loader && <ModalLoader />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#2C4660",
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
  notificationsLabel: {
    height: 5,
    backgroundColor: "rgba(193, 188, 185, 1)",
    alignSelf: "center",
    width: "60%",
    borderRadius: 40,
  },
  notificationsLabelBox: {
    paddingVertical: 10,
    flex: 1,
  },
});
