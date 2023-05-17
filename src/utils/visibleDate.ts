import { Platform } from "react-native";

export const getVisibleDate = (date: Date) => {
  const [currentTime, midDay] = date.toLocaleTimeString().split(' ');

  return `${date.toLocaleDateString()} at ${currentTime?.slice(0, -3)} ${midDay ? midDay.toLocaleLowerCase() : ""}`
}

export const getInspectionDate = (date: Date, showTimeDate: boolean | undefined = false) => {
  const localDateString = date.toLocaleDateString();
  const [month, day, year] = localDateString.split('/');
  const [currentTime, midDay] = date.toLocaleTimeString().split(' ');

  const months = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

  const dateString = `${months[Number(month) - 1]} ${day?.length < 2 ? `0${day}` : day}, ${Platform.OS === 'ios' ? year : "20" + year}`;

  return showTimeDate ?
   `${dateString} at ${currentTime?.slice(0, -3)} ${midDay ? midDay.toLocaleLowerCase() : ""}` :
   dateString
};

export const getCalendarVisibleDate = (date: Date) => {
  const [month, day, year] = date.toLocaleDateString().split('/');

  return `${year}-${month.length > 1 ? month : "0" + month}-${day.length > 1 ? day : "0" + day}`
}