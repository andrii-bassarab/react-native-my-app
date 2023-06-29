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
  Modal,
  Dimensions,
  Platform,
} from "react-native";
import { colors, textStyles } from "~/view/theme";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import SelectIcon from "~/view/assets/icons/selectArrow.svg";
import CustomCheckbox from "../Custom/CustomCheckbox";
import { CustomSelect } from "../Custom/CustomSelect";
import { CalendarRange } from "../Custom/CalendarRange";
import { filterInspectionsActions } from "../../../modules/filterInspections";
import { actionsShowWindow } from "~/modules/showWindow";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { normalize } from "~/utils/getWindowHeight";

export const InspectionsFilter = () => {
  const windowHeight = Dimensions.get('window').height;
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();

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

  const { topNavigationHeight} = useAppSelector((state) => state.showWindow);

  const {
    setStatusNewUnscheduled,
    setStatusScheduled,
    setStatusIncomplete,
    setStatusCompleted,
    setAssignedToMe,
    setUnassigned,
    setSortBy,
    setSelectedDayStartFrom,
    setSelectedDayBy,
  } = filterInspectionsActions;

  const [statusNewUnscheduledChange, setStatusNewUnscheduledChange] = useState(statusNewUnscheduled);
  const [statusScheduledChange, setStatusScheduledChange] = useState(statusScheduled);
  const [statusIncompleteChange, setStatusIncompleteChange] = useState(statusIncomplete);
  const [statusCompletedChange, setStatusCompletedChange] = useState(statusCompleted);
  const [assignedToMeChange, setAssignedToMeChange] = useState(assignedToMe);
  const [unassignedChange, setUnassignedChange] = useState(unassigned);
  const [sortByChange, setSortByChange] = useState(sortBy);
  const sortByOptions = ["Scheduled Date/Time", "Status"];
  const [selectedDayStartFromChange, setSelectedDayStartFromChange] = useState(selectedDayStartFrom);
  const [selectedDayByChange, setSelectedDayByChange] = useState(selectedDayBy);
  const [showCalendarChange, setShowCalendarChange] = useState(false);

  const closeInspectionFilterWindow = () => dispatch(actionsShowWindow.setShowInspectionsFilter(false));

  const applyChangesFilter = () => {
    dispatch(setStatusNewUnscheduled(statusNewUnscheduledChange));
    dispatch(setStatusScheduled(statusScheduledChange));
    dispatch(setStatusIncomplete(statusIncompleteChange));
    dispatch(setStatusCompleted(statusCompletedChange));
    dispatch(setAssignedToMe(assignedToMeChange));
    dispatch(setUnassigned(unassignedChange));
    dispatch(setSortBy(sortByChange));
    dispatch(setSelectedDayStartFrom(selectedDayStartFromChange));
    dispatch(setSelectedDayBy(selectedDayByChange));
    closeInspectionFilterWindow();
  };

  const getDataToShow = (data: string) => {
    const arrOfData = data.split("-");

    return `${arrOfData[1]}/${arrOfData[2]}/${arrOfData[0]}`;
  };

  const position = useMemo(() => new Animated.ValueXY({ x: 0, y: windowHeight * 0.25 }), []);
  const pan = useRef(new Animated.ValueXY()).current;
  const opacity = pan.y.interpolate({
    inputRange: [windowHeight * 0.2, windowHeight * 0.4],
    outputRange: [1, 0.5],
    extrapolate: 'clamp',
  });
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gestureState) => {
        if (gestureState.dy > windowHeight * 0.25) {
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
    setShowCalendarChange(false);
  };

  const clearFilters = () => {
    setSelectedDayStartFromChange("");
    setSelectedDayByChange("");
    setStatusNewUnscheduledChange(true);
    setStatusScheduledChange(true);
    setStatusIncompleteChange(true);
    setStatusCompletedChange(true);
    setAssignedToMeChange(true);
    setUnassignedChange(true);
    setSortByChange("Scheduled Date/Time");
  };

  return (
    <Modal transparent>
      <Pressable
        style={{...styles.modalOverlay, paddingTop: insets.top + (topNavigationHeight * 1.4)}}
        onPress={(event) => {
          event.stopPropagation();
          event.preventDefault();
          closeInspectionFilterWindow();
        }}
      >
        <Animated.View
          style={[
            styles.content,
            styles.shadowProp,
            position.getLayout(),
            { transform: [{ translateY: pan.y }], opacity },
          ]}
          onStartShouldSetResponder={() => true}
        >
          <Pressable onPress={handleHideCalendar}>
            <Animated.View {...panResponder.panHandlers}>
              <TouchableOpacity style={styles.labelBox} activeOpacity={0.5}>
                <View style={styles.closeLabel} />
              </TouchableOpacity>
            </Animated.View>
            <Text style={styles.title}>Filter and Sort By</Text>
            {showCalendarChange && (
              <View style={styles.calendarBox}>
                <CalendarRange
                  selectedDayStartFrom={selectedDayStartFromChange}
                  selectedDayBy={selectedDayByChange}
                  setSelectedDayStartFrom={setSelectedDayStartFromChange}
                  setSelectedDayBy={setSelectedDayByChange}
                  setShowCalendar={setShowCalendarChange}
                />
              </View>
            )}
            <View style={styles.calendar}>
              <Text style={styles.calendarTitle}>Scheduled Date Range</Text>
              <TouchableOpacity
                style={styles.calendarRange}
                onPress={() => setShowCalendarChange(true)}
              >
                <Text style={styles.dataRangeText}>
                  {selectedDayStartFromChange
                    ? getDataToShow(selectedDayStartFromChange)
                    : "__/__/____"}
                </Text>
                <Text style={styles.dataRangeText}>to</Text>
                <Text style={styles.dataRangeText}>
                  {selectedDayByChange ? getDataToShow(selectedDayByChange) : "__/__/____"}
                </Text>
                <SelectIcon color={colors.primary} height={normalize(25)} width={normalize(25)} />
              </TouchableOpacity>
            </View>
            <View style={styles.statusContainer}>
              <Text style={styles.statusTitle}>Status</Text>
              <View style={styles.statusBox}>
                <View>
                  <CustomCheckbox
                    checked={statusNewUnscheduledChange}
                    onChange={setStatusNewUnscheduledChange}
                    label="New & Unscheduled"
                  />
                  <CustomCheckbox
                    checked={statusIncompleteChange}
                    onChange={setStatusIncompleteChange}
                    label="Incomplete"
                  />
                </View>
                <View>
                  <CustomCheckbox
                    checked={statusScheduledChange}
                    onChange={setStatusScheduledChange}
                    label="Scheduled"
                  />
                  <CustomCheckbox
                    checked={statusCompletedChange}
                    onChange={setStatusCompletedChange}
                    label="Completed"
                  />
                </View>
              </View>
            </View>
            <View style={styles.statusContainer}>
              <Text style={styles.statusTitle}>Assigned To</Text>
              <View style={styles.statusBox}>
                <CustomCheckbox
                  checked={assignedToMeChange}
                  onChange={setAssignedToMeChange}
                  label="Me"
                />
                <CustomCheckbox
                  checked={unassignedChange}
                  onChange={setUnassignedChange}
                  label="Unassigned"
                />
              </View>
            </View>
            <View style={styles.statusContainer}>
              <Text style={styles.statusTitle}>Sort By</Text>
              <CustomSelect
                data={sortByOptions}
                selectedItem={sortByChange}
                setSelectedItem={setSortByChange}
              />
            </View>
          </Pressable>
          <Pressable style={styles.buttonsContainer} onPress={handleHideCalendar}>
            <TouchableOpacity style={styles.clearFiltersButtton} onPress={clearFilters}>
              <Text style={styles.clearButtonText}>Clear Filters</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.applyFiltersButtton} onPress={applyChangesFilter}>
              <Text style={styles.applyButtonText}>Apply Filters</Text>
            </TouchableOpacity>
          </Pressable>
        </Animated.View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    backgroundColor: "rgba(0, 0, 0, 0.40)",
    opacity: 1,
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "stretch",
  },
  content: {
    flex: 1,
    backgroundColor: "#fff",
    opacity: 1,
    borderTopRightRadius: 55,
    borderTopLeftRadius: 55,
    padding: 30,
    paddingTop: 10,
    paddingHorizontal: '10%'
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
    fontWeight: "600",
    marginTop: 10,
    ...textStyles.xlarge,
  },
  closeLabel: {
    height: 5,
    backgroundColor: "rgba(193, 188, 185, 1)",
    alignSelf: "center",
    width: "60%",
    borderRadius: 40,
  },
  labelBox: {
    paddingVertical: "4%",
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
    top: normalize(70),
  },
  calendarTitle: {
    color: colors.primary,
    fontWeight: "600",
    ...textStyles.medium,
    marginTop: 10,
    marginBottom: "3%",
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
    ...textStyles.medium,
  },
  statusContainer: {
    marginVertical: 10,
  },
  statusTitle: {
    color: colors.primary,
    fontWeight: "600",
    ...textStyles.large,
    marginBottom: '2%'
  },
  statusBox: {
    paddingHorizontal: "1%",
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
    borderRadius: normalize(30),
    paddingVertical: "2%",
    paddingHorizontal: "4%",
  },
  applyFiltersButtton: {
    borderWidth: 1,
    borderColor: colors.layout,
    borderRadius: normalize(30),
    paddingVertical: "2%",
    paddingHorizontal: "4%",
    backgroundColor: colors.layout,
    marginLeft: '2%',
  },
  clearButtonText: {
    fontWeight: "500",
    ...textStyles.medium,
    color: colors.blue,
  },
  applyButtonText: {
    fontWeight: "500",
    ...textStyles.medium,
    color: "#fff",
  },
});
