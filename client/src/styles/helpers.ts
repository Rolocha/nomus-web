import { ResponsiveValue } from 'styled-system'

export type StyleObject = { [k: string]: string | number }

// Allows you to create custom responsive styles like StyledSystem does for all its basic ones
// e.g.
// const MyComponent = () => {
//   const borderRadiusStyles = useCustomResponsiveStyles<'NONE'|'DEFAULT'>(
//     {
//       NONE: {
//         borderRadius: 0,
//       },
//       DEFAULT: {
//         borderRadius: 2,
//       },
//     },
//     borderRadius,
//   )
//   return <Box borderRadius={borderRadiusStyles} />
// }
//
// lets you use it to reponsively customize the UI based on the custom higher-order prop ('NONE'|'DEFAULT')
//
// <MyComponent
//   borderRadius={{_: 'NONE', md: 'DEFAULT' }}
// />
export function useCustomResponsiveStyles<T extends string | number | symbol>(
  responsiveKeys: ResponsiveValue<T>,
  customStyles: { [k in T]: StyleObject },
) {
  const styleKeysToApply = Array.from(
    new Set(
      (Object.values(
        customStyles,
      ) as StyleObject[]).flatMap((styles: StyleObject) => Object.keys(styles)),
    ),
  )

  return styleKeysToApply.reduce<{ [k in string]: any }>((acc, styleKey) => {
    const responsiveKeysToUse =
      typeof responsiveKeys === 'object'
        ? responsiveKeys
        : { _: responsiveKeys }

    if (
      // This isn't smart enough to deal with arrays yet so just use objects if you can
      !(responsiveKeysToUse instanceof Array) &&
      responsiveKeysToUse != null
    ) {
      Object.keys(responsiveKeysToUse).forEach((bp) => {
        // @ts-ignore It doesn't like this line if responsiveKeysToUse is an array but it'll still
        // work fine since the "keys" will be indices
        const point: T = responsiveKeysToUse[bp]

        if (acc[styleKey] == null) {
          acc[styleKey] = {}
        }
        acc[styleKey][bp] = customStyles[point][styleKey]
      })
    }
    return acc
  }, {})
}
