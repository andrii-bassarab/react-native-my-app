import React, { useMemo } from "react";
import { colors } from "../../theme";
import { Calendar } from "react-native-calendars";

interface DateObject {
  [key: string]: any;
}

interface Props {
  selectedDayStartFrom: string;
  selectedDayBy: string;
  setSelectedDayStartFrom: React.Dispatch<React.SetStateAction<string>>;
  setSelectedDayBy: React.Dispatch<React.SetStateAction<string>>;
  setShowCalendar: React.Dispatch<React.SetStateAction<boolean>>;
}

export const CalendarRange: React.FC<Props> = ({
  selectedDayStartFrom,
  selectedDayBy,
  setSelectedDayStartFrom,
  setSelectedDayBy,
  setShowCalendar,
}) => {
  const handleSelectedDate = (date: string) => {
    if (
      selectedDayStartFrom &&
      selectedDayBy === "" &&
      date < selectedDayStartFrom
    )
      return;

    if (selectedDayStartFrom && selectedDayBy === "") {
      setSelectedDayBy(date);
      setTimeout(() => {
        setShowCalendar(false);
      }, 300);
      return;
    }

    setSelectedDayStartFrom(date);
    setSelectedDayBy("");
  };

  const getDatesInRange = (startDate: string, endDate: string) => {
    const dateObject: DateObject = {};
    const currentDate = new Date(startDate);

    while (currentDate <= new Date(endDate || startDate)) {
      dateObject[currentDate.toISOString().split("T")[0] as keyof DateObject] =
        {
          selected: true,
          selectedColor:
            currentDate.toISOString().split("T")[0] === startDate ||
            currentDate.toISOString().split("T")[0] === endDate
              ? colors.layout
              : "rgba(17, 122, 220, 0.4)",
        };
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dateObject;
  };

  const objectOfSelectedDays = useMemo(
    () => getDatesInRange(String(selectedDayStartFrom), String(selectedDayBy)),
    [selectedDayStartFrom, selectedDayBy]
  );

  return (
    <Calendar
      style={{
        borderWidth: 0,
        borderColor: "gray",
        borderRadius: 10,
        opacity: 1,
        zIndex: 2,
        width: "100%",
      }}
      theme={{
        backgroundColor: "#F5F5F5",
        calendarBackground: "#F5F5F5",
        textSectionTitleColor: "#000",
        selectedDayBackgroundColor: colors.layout,
        // selectedDayTextColor: colors.layout,
        todayTextColor: colors.blue,
        dayTextColor: colors.layout,
        textDisabledColor: colors.primary,
        todayBackgroundColor: "#fff",
        arrowColor: colors.primary,
        weekVerticalMargin: 0,
        textDayFontWeight: "600",
        stylesheet: {
          calendar: {
            main: { borderRadius: 0 },
          },
          day: {
            basic: { borderRadius: 0 },
          },
        },
      }}
      markedDates={objectOfSelectedDays}
      markingType="multi-period"
      onDayPress={(date) => handleSelectedDate(date.dateString)}
    />
  );
};
