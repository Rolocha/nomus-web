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

export const getFormattedFullDate = (date: string | Date | number) => {
  const dateObj = new Date(date)
  return `${getMonthString(
    dateObj.getMonth(),
  )} ${dateObj.getDate()}, ${dateObj.getFullYear()}`
}

export const getFormattedDateFromISODateString = (date: string) => {
  const year = date.substr(0, 4)
  const month = date.substr(5, 2)
  const dateOfMonth = date.substr(8, 2)
  return `${getMonthString(Number(month) - 1)} ${dateOfMonth}, ${year}`
}

export const getDateStringForDateInput = (date: string | Date | number) =>
  new Date(date).toISOString().substr(0, 10)

export const getDateFromDateInputString = (date: string) => {
  const dateObj = new Date(date)
  return new Date(+dateObj + dateObj.getTimezoneOffset() * 60000)
}
