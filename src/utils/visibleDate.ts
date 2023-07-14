import { Platform } from "react-native";

export const getVisibleDate = (date: Date) => {
  const [currentTime, midDay] = date.toLocaleTimeString().split(" ");

  return `${date.toLocaleDateString()} at ${currentTime?.slice(0, -3)} ${
    midDay ? midDay.toLocaleLowerCase("en-US") : ""
  }`;
};

export const getInspectionDate = (
  date: Date,
  showTimeDate: boolean | undefined = false
) => {
  const [currentTime, midDay] = date.toLocaleTimeString().split(" ");
  const currMonth = date.getMonth();
  const day = date.getDate();
  const year = date.getFullYear();

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

  const dateString = `${months[Number(currMonth)]} ${String(day)?.length < 2 ? `0${day}` : day}, ${year}`;

  return showTimeDate
    ? `${dateString} at ${currentTime?.slice(0, -3)} ${
        midDay ? midDay.toLocaleLowerCase("en-US") : ""
      }`
    : dateString;
};

export const getCalendarVisibleDate = (date: Date) => {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const currYear = date.getFullYear();

  return `${currYear}-${String(month).length > 1 ? month : "0" + month}-${
    String(day).length > 1 ? day : "0" + day
  }`;
};
