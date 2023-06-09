import { Platform } from "react-native";

export const getVisibleDate = (date: Date) => {
  const [currentTime, midDay] = date.toLocaleTimeString().split(" ");

  return `${date.toLocaleDateString()} at ${currentTime?.slice(0, -3)} ${
    midDay ? midDay.toLocaleLowerCase() : ""
  }`;
};

export const getInspectionDate = (
  date: Date,
  showTimeDate: boolean | undefined = false
) => {
  const localDateString = date.toLocaleDateString();
  const [month, day, year] = localDateString.split("/");
  const [currentTime, midDay] = date.toLocaleTimeString().split(" ");
  const currMonth = date.getMonth();

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dateString = `${months[Number(currMonth)]} ${day?.length < 2 ? `0${day}` : day}, ${Platform.OS === "ios" ? year : "20" + year}`;

  return showTimeDate
    ? `${dateString} at ${currentTime?.slice(0, -3)} ${
        midDay ? midDay.toLocaleLowerCase("en-US") : ""
      }`
    : dateString;
};

export const getCalendarVisibleDate = (date: Date) => {
  const [month, day] = date.toLocaleDateString().split("/");
  const currYear = date.getFullYear();

  return `${currYear}-${month.length > 1 ? month : "0" + month}-${
    day.length > 1 ? day : "0" + day
  }`;
};
