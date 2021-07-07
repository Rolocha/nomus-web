export const formatDollarAmount = (amount: number) => {
  const dollars = Math.floor(amount / 100)
  const cents = amount % 100
  const centsDisplay = cents < 10 ? `0${cents}` : String(cents)
  return `$${dollars}.${centsDisplay}`
}
