// Runs a callback N times and returns an array with the callbacks' results
export function doNTimes<T>(n: number, callback: (index: number) => T): Array<T> {
  const output = []
  for (let i = 0; i < n; i++) {
    output.push(callback(i))
  }
  return output
}
