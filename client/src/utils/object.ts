export const areObjectsDeepEqual = (a: any, b: any) => {
  if (a === b) return true

  if (typeof a !== 'object' || typeof b !== 'object' || a == null || b == null)
    return false

  let keysA = Object.keys(a),
    keysB = Object.keys(b)

  if (keysA.length !== keysB.length) return false

  for (let key of keysA) {
    if (!keysB.includes(key)) return false

    if (typeof a[key] === 'function' || typeof b[key] === 'function') {
      if (a[key].toString() !== b[key].toString()) return false
    } else {
      if (!areObjectsDeepEqual(a[key], b[key])) return false
    }
  }

  return true
}

/**
 * Simple object check.
 * @param item
 * @returns {boolean}
 */
export function isObject(item: any): boolean {
  return item && typeof item === 'object' && !Array.isArray(item)
}

/**
 * Deep merge two objects.
 * @param target
 * @param ...sources
 */
export function deepMergeObjects(target: any, ...sources: any[]): any {
  if (!sources.length) return target
  const source = sources.shift()

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} })
        deepMergeObjects(target[key], source[key])
      } else {
        Object.assign(target, { [key]: source[key] })
      }
    }
  }

  return deepMergeObjects(target, ...sources)
}
