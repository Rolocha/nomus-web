export const formatPhoneNumber = (number: string) => {
  switch (number.length) {
    case 10:
      return `(${number.substr(0, 3)}) ${number.substr(3, 3)}-${number.substr(
        6,
        4,
      )}`
    case 7:
      return `${number.substr(0, 3)}-${number.substr(3, 4)}`
    default:
      return number
  }
}
