export const getCurrentDateForDateInput = () => {
  return adjustDateByTZOffset(Date.now()).toISOString().substr(0, 10)
}

export const adjustDateByTZOffset = (date: string | Date | number) => {
  const dateObj = new Date(date)
  return new Date(+dateObj - dateObj.getTimezoneOffset() * 60000)
}
