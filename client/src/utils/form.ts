import * as React from 'react'
import { UseFormMethods, FieldElement, RegisterOptions } from 'react-hook-form'

export const useRegisterWithRef = (register: UseFormMethods['register']) => {
  return React.useCallback(
    (refObject?: React.MutableRefObject<any>, rules?: RegisterOptions) => (
      element: FieldElement<any> | null,
    ) => {
      if (refObject) {
        refObject.current = element
      }
      return register(element, rules)
    },
    [register],
  )
}
