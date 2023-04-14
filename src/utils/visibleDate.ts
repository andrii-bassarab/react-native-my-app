export const visibleDate = (date: Date) => {
  const arrOfDate = date.toLocaleString().split(' ');

  return `${arrOfDate[0].slice(0, -1)} ${arrOfDate[1].slice(0, -3)} ${arrOfDate[2].toLowerCase()}`
}