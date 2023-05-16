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

  return showTimeDate ?
   `${months[Number(month) - 1]} ${day?.length < 2 ? `0${day}` : day}, ${year} at ${currentTime?.slice(0, -3)} ${midDay ? midDay.toLocaleLowerCase() : ""}` :
   `${months[Number(month) - 1]} ${day?.length < 2 ? `0${day}` : day}, ${year}`
};

export const getCalendarVisibleDate = (date: Date, showTimeDate: boolean) => {
  const [month, day, year] = date.toLocaleDateString().split('/');
  const [currentTime, midDay] = date.toLocaleTimeString().split(' ');

  return showTimeDate ? 
  `${year}-${month.length > 1 ? month : "0" + month}-${day.length > 1 ? day : "0" + day} at ${currentTime?.slice(0, -3)} ${midDay ? midDay.toLocaleLowerCase() : ""}` : 
  `${year}-${month.length > 1 ? month : "0" + month}-${day.length > 1 ? day : "0" + day}`
}