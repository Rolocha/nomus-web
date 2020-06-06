export const getMonthAbbreviation = (month: number) =>
  [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ][month] || null

export const getMonthString = (month: number) =>
  [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ][month] || null

export const getFormattedFullDate = (date: Date | number) => {
  const dateObj = new Date(date)
  return `${getMonthString(
    dateObj.getMonth(),
  )} ${dateObj.getDate()}, ${dateObj.getFullYear()}`
}
