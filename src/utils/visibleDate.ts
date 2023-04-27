export const getVisibleDate = (date: Date) => {
  const arrOfDate = date.toLocaleString().split(' ');

  return `${arrOfDate[0]?.slice(0, -1)} at ${arrOfDate[1]?.slice(0, -3)} ${arrOfDate[2]?.toLowerCase()}`
}

export const getInspectionDate = (date: Date) => {
  const localDateString = date.toLocaleDateString();
  const [month, day, year] = localDateString.split('/');

  const months = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

  return `${months[Number(month) - 1]} ${day?.length < 2 ? `0${day}` : day}, ${year}`
}