type StyleObject = { [k: string]: string | number }

export function makeComplexResponsiveStyles<T extends string>(
  complexStyles: { [k in T]: StyleObject },
  responsiveKeys: { [k: string]: T },
) {
  const styleKeysToApply = Array.from(
    new Set(
      (Object.values(
        complexStyles,
      ) as StyleObject[]).flatMap((styles: StyleObject) => Object.keys(styles)),
    ),
  )

  return styleKeysToApply.reduce<{ [k in string]: any }>((acc, styleKey) => {
    Object.keys(responsiveKeys).forEach((bp) => {
      const point: T = responsiveKeys[bp]

      if (acc[styleKey] == null) {
        acc[styleKey] = {}
      }
      acc[styleKey][bp] = complexStyles[point][styleKey]
    })
    return acc
  }, {})
}
