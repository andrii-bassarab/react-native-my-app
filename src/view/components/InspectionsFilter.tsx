import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  View,
  Pressable,
  Animated,
  PanResponder,
  GestureResponderEvent,
} from "react-native";
import { colors } from "../theme";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import { setShowInspectionsFilter } from "~/modules/user/actions";
import SelectIcon from "../assets/icons/selectArrow.svg";
import CustomCheckbox from "./CustomCheckbox";
import { CustomSelect } from "./CustomSelect";
import { CalendarRange } from "./CalendarRange";

interface Props {
  statusNewUnscheduled: boolean;
  setStatusNewUnscheduled: React.Dispatch<React.SetStateAction<boolean>>;
  statusScheduled: boolean;
  setStatusScheduled: React.Dispatch<React.SetStateAction<boolean>>;
  statusIncomplete: boolean;
  setStatusIncomplete: React.Dispatch<React.SetStateAction<boolean>>;
  statusCompleted: boolean;
  setStatusCompleted: React.Dispatch<React.SetStateAction<boolean>>;
  assignedToMe: boolean;
  setAssignedToMe: React.Dispatch<React.SetStateAction<boolean>>;
  unassigned: boolean;
  setUnassigned: React.Dispatch<React.SetStateAction<boolean>>;
  sortBy: "Scheduled Date/Time" | "Status";
  setSortBy: React.Dispatch<
    React.SetStateAction<"Scheduled Date/Time" | "Status">
  >;
  selectedDayStartFrom: string;
  setSelectedDayStartFrom: React.Dispatch<React.SetStateAction<string>>;
  selectedDayBy: string;
  setSelectedDayBy: React.Dispatch<React.SetStateAction<string>>;
}

export const InspectionsFilter: React.FC<Props> = ({
  statusNewUnscheduled,
  setStatusNewUnscheduled,
  statusScheduled,
  setStatusScheduled,
  statusIncomplete,
  setStatusIncomplete,
  statusCompleted,
  setStatusCompleted,
  assignedToMe,
  setAssignedToMe,
  unassigned,
  setUnassigned,
  sortBy,
  setSortBy,
  selectedDayStartFrom,
  setSelectedDayStartFrom,
  selectedDayBy,
  setSelectedDayBy,
}) => {
  const currentUser = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  // const [statusNewUnscheduled, setStatusNewUnscheduled] = useState(false);
  // const [statusScheduled, setStatusScheduled] = useState(false);
  // const [statusIncomplete, setStatusIncomplete] = useState(false);
  // const [statusCompleted, setStatusCompleted] = useState(false);
  // const [assignedToMe, setAssignedToMe] = useState(false);
  // const [unassigned, setUnassigned] = useState(false);
  // const [sortBy, setSortBy] = useState("Scheduled Date/Time");
  const sortByOptions = ["Scheduled Date/Time", "Status"];
  // const [selectedDayStartFrom, setSelectedDayStartFrom] = useState("");
  // const [selectedDayBy, setSelectedDayBy] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);

  const closeInspectionFilterWindow = () =>
    dispatch(setShowInspectionsFilter(false));

  const getDataToShow = (data: string) => {
    const arrOfData = data.split("-");

    return `${arrOfData[1]}/${arrOfData[2]}/${arrOfData[0]}`;
  };

  const position = new Animated.ValueXY({ x: 0, y: 500 });
  const pan = useRef(new Animated.ValueXY()).current;
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gestureState) => {
        if (gestureState.dy > 250) {
          pan.extractOffset();
          closeInspectionFilterWindow();
        }
        if (gestureState.dy > 0) {
          Animated.event([null, { dx: pan.x, dy: pan.y }], {
            useNativeDriver: false,
          })(event, gestureState);
        }
      },
      onPanResponderRelease: () => {
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
        }).start();
      },
    })
  ).current;

  useEffect(() => {
    return Animated.timing(position, {
      toValue: { x: 0, y: 0 },
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, []);

  useEffect(() => {
    pan.y.setValue(0);

    return () => {
      closeInspectionFilterWindow();
    };
  }, []);

  const handleHideCalendar = (event: GestureResponderEvent) => {
    event.stopPropagation();
    setShowCalendar(false);
  };

  const clearFilters = () => {
    setSelectedDayStartFrom("");
    setSelectedDayBy("");
    setStatusNewUnscheduled(true);
    setStatusScheduled(true);
    setStatusIncomplete(true);
    setStatusCompleted(true);
    setAssignedToMe(true);
    setUnassigned(true);
    setSortBy("Scheduled Date/Time");
  };

  console.log("currentUser", currentUser);

  return (
    <Animated.View
      style={[
        styles.content,
        styles.shadowProp,
        position.getLayout(),
        { transform: [{ translateY: pan.y }] },
      ]}
    >
      <Pressable onPress={handleHideCalendar}>
        <Animated.View {...panResponder.panHandlers}>
          <TouchableOpacity style={styles.labelBox} activeOpacity={0.5}>
            <View style={styles.closeLabel} />
          </TouchableOpacity>
        </Animated.View>
        <Text style={styles.title}>Filter and Sort By</Text>
        {showCalendar && (
          <View
            style={styles.calendarBox}
          >
            <CalendarRange
              selectedDayStartFrom={selectedDayStartFrom}
              selectedDayBy={selectedDayBy}
              setSelectedDayStartFrom={setSelectedDayStartFrom}
              setSelectedDayBy={setSelectedDayBy}
              setShowCalendar={setShowCalendar}
            />
          </View>
        )}
        <View style={styles.calendar}>
          <Text style={styles.calendarTitle}>Scheduled Date Range</Text>
          <TouchableOpacity
            style={styles.calendarRange}
            onPress={() => setShowCalendar(true)}
          >
            <Text style={styles.dataRangeText}>
              {selectedDayStartFrom
                ? getDataToShow(selectedDayStartFrom)
                : "__/__/____"}
            </Text>
            <Text style={styles.dataRangeText}>to</Text>
            <Text style={styles.dataRangeText}>
              {selectedDayBy ? getDataToShow(selectedDayBy) : "__/__/____"}
            </Text>
            <SelectIcon color={colors.primary} height={15} width={15} />
          </TouchableOpacity>
        </View>
        <View style={styles.statusContainer}>
          <Text style={styles.statusTitle}>Status</Text>
          <View style={styles.statusBox}>
            <View>
              <CustomCheckbox
                checked={statusNewUnscheduled}
                onChange={setStatusNewUnscheduled}
                label="New & Unscheduled"
              />
              <CustomCheckbox
                checked={statusIncomplete}
                onChange={setStatusIncomplete}
                label="Incomplete"
              />
            </View>
            <View>
              <CustomCheckbox
                checked={statusScheduled}
                onChange={setStatusScheduled}
                label="Scheduled"
              />
              <CustomCheckbox
                checked={statusCompleted}
                onChange={setStatusCompleted}
                label="Completed"
              />
            </View>
          </View>
        </View>
        <View style={styles.statusContainer}>
          <Text style={styles.statusTitle}>Assigned To</Text>
          <View style={styles.statusBox}>
            <CustomCheckbox
              checked={assignedToMe}
              onChange={setAssignedToMe}
              label="Me"
            />
            <CustomCheckbox
              checked={unassigned}
              onChange={setUnassigned}
              label="Unassigned"
            />
          </View>
        </View>
        <View style={styles.statusContainer}>
          <Text style={styles.statusTitle}>Sort By</Text>
          <CustomSelect
            data={sortByOptions}
            selectedItem={sortBy}
            setSelectedItem={setSortBy}
          />
        </View>
      </Pressable>
      <Pressable style={styles.buttonsContainer} onPress={handleHideCalendar}>
        <TouchableOpacity style={styles.clearFiltersButtton} onPress={clearFilters}>
          <Text style={styles.clearButtonText}>Clear Filters</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.applyFiltersButtton} onPress={closeInspectionFilterWindow}>
          <Text style={styles.applyButtonText}>Apply Filters</Text>
        </TouchableOpacity>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: "#fff",
    opacity: 1,
    borderTopRightRadius: 55,
    borderTopLeftRadius: 55,
    padding: 30,
    paddingTop: 10,
  },
  shadowProp: {
    shadowColor: "#171717",
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },
  title: {
    color: colors.primary,
    fontWeight: "600",
    fontSize: 22,
    marginTop: 10,
  },
  closeLabel: {
    height: 5,
    backgroundColor: "rgba(193, 188, 185, 1)",
    alignSelf: "center",
    width: "60%",
    borderRadius: 40,
  },
  labelBox: {
    paddingVertical: 10,
    flex: 1,
  },
  calendar: {
    marginVertical: 10,
  },
  calendarBox: {
    opacity: 1,
    zIndex: 2,
    position: "absolute",
    width: "100%",
    top: 70,
  },
  calendarTitle: {
    color: colors.primary,
    fontWeight: "600",
    fontSize: 16,
    marginTop: 10,
    marginBottom: 10,
  },
  calendarRange: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderRadius: 50,
    borderWidth: 1,
    borderColor: colors.primary,
    paddingVertical: 8,
    paddingRight: 10,
    paddingLeft: 20,
  },
  dataRangeText: {
    color: colors.primary,
    fontWeight: "600",
    fontSize: 16,
  },
  statusContainer: {
    marginVertical: 10,
  },
  statusTitle: {
    color: colors.primary,
    fontWeight: "600",
    fontSize: 16,
  },
  statusBox: {
    paddingHorizontal: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingTop: "10%",
    paddingBottom: "30%",
  },
  clearFiltersButtton: {
    borderWidth: 1,
    borderColor: colors.blue,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  applyFiltersButtton: {
    borderWidth: 1,
    borderColor: colors.layout,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 20,
    backgroundColor: colors.layout,
    marginLeft: 10,
  },
  clearButtonText: {
    fontWeight: "500",
    fontSize: 16,
    color: colors.blue,
  },
  applyButtonText: {
    fontWeight: "500",
    fontSize: 16,
    color: "#fff",
  },
});
