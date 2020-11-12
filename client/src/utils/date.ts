export const REGEXP = {
  'YYYY-MM-DD': /([12]\d{3})-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])/,
}

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

export const getFormattedFullDateFromDateInputString = (date: string) => {
  const match = date.match(REGEXP['YYYY-MM-DD'])
  if (match && match.length === 4) {
    const [_, year, month, dayOfMonth] = match
    return `${getMonthString(Number(month) - 1)} ${Number(dayOfMonth)}, ${year}`
  } else {
    return null
  }
}

export const getCurrentDateForDateInput = () => {
  return adjustDateByTZOffset(Date.now()).toISOString().substr(0, 10)
}

export const adjustDateByTZOffset = (date: string | Date | number) => {
  const dateObj = new Date(date)
  return new Date(+dateObj - dateObj.getTimezoneOffset() * 60000)
}
