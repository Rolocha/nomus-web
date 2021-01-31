import * as React from 'react'
import { UseFormMethods, FieldElement, ValidationRules } from 'react-hook-form'

export const useRegisterWithRef = (register: UseFormMethods['register']) => {
  return React.useCallback(
    (refObject: React.MutableRefObject<any>, rules: ValidationRules) => (
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
