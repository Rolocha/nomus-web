import * as React from 'react'
import Button from '../Button'
import * as Text from 'src/components/Text'
import { colors } from 'src/styles'

interface Props {
  children: React.ReactNode
  modalOpener: () => void
  fieldRef: React.MutableRefObject<any>
}

// A tertiary-styled button to be used in place of user-configurable text that hasn't been configured yet.
// By providing modalOpener and fieldRef, you can make this button open a modal and focus on the relevant field.
const FieldPrompt = ({ children, modalOpener, fieldRef }: Props) => {
  const openAndFocus = React.useCallback(
    (refObject: React.MutableRefObject<any>) => () => {
      if (modalOpener) modalOpener()

      // Slightly hacky: We can't focus on the ref in the modal right away since the modal needs
      // time to open, so wait 100ms before calling focus. It seems to work but we can raise this
      // number if needed.
      setTimeout(() => {
        refObject.current?.focus()
        refObject.current?.scrollIntoView()
      }, 100)
    },
    [modalOpener],
  )

  return (
    <Button variant="tertiary" px={0} onClick={openAndFocus(fieldRef)}>
      <Text.Plain
        textAlign="left"
        fontWeight="normal"
        fontStyle="italic"
        color={colors.nomusBlue}
      >
        {children}
      </Text.Plain>
    </Button>
  )
}

export default FieldPrompt
