import * as React from 'react'
import Box from 'src/components/Box'
import Button from 'src/components/Button'
import Modal from 'src/components/Modal'

interface Props {
  modalProps: Omit<React.ComponentProps<typeof Modal>, 'isOpen' | 'onClose'>
  buttonProps: Omit<React.ComponentProps<typeof Button>, 'onClick'>
}

const ModalOpener = ({ modalProps, buttonProps }: Props) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const handleButtonClick = React.useCallback(() => {
    setIsOpen(true)
  }, [setIsOpen])

  return (
    <Box>
      <Button {...buttonProps} onClick={handleButtonClick} />
      <Modal {...modalProps} isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </Box>
  )
}

export default ModalOpener
