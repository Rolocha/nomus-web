import React from 'react'

import * as Text from 'src/components/Text'
import Box from 'src/components/Box'
import Modal from 'src/components/Modal'
import Button from 'src/components/Button'
import * as Form from './Form'

export default {
  title: 'Modal',
  component: Modal,
  excludeStories: /.*Data$/,
}

export const Primary = () => {
  const [isModalOpen, setIsModalOpen] = React.useState(false)

  return (
    <Box position="relative" zIndex={0}>
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
        }}
      >
        <Box>
          <Text.PageHeader mb={3}>Hello there</Text.PageHeader>
          <Text.Body>
            This is the most basic use case of a modal. No buttons, confirmation
            dialogs, or any other frills.
          </Text.Body>
        </Box>
      </Modal>

      <Button
        onClick={() => {
          setIsModalOpen(true)
        }}
      >
        Open modal
      </Button>
    </Box>
  )
}

export const ConfirmUnsavedChanges = () => {
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [inputValue, setInputValue] = React.useState('')
  const latestSavedInputValue = React.useRef<string>(inputValue)

  const onModalClose = React.useCallback(() => {
    setInputValue(latestSavedInputValue.current)
    setIsModalOpen(false)
  }, [setIsModalOpen])

  return (
    <Box position="relative" zIndex={0}>
      <Modal
        isOpen={isModalOpen}
        onClose={onModalClose}
        confirmClose={() => inputValue !== latestSavedInputValue.current}
        actions={{
          secondary: {
            text: 'Cancel',
            handler: onModalClose,
          },
          primary: {
            text: 'Save',
            handler: () => {
              latestSavedInputValue.current = inputValue
              setIsModalOpen(false)
            },
          },
        }}
      >
        <Box>
          <Text.PageHeader mb={3}>Hello there</Text.PageHeader>

          <Text.Body mb={3}>
            This is a modal that prompts the user for a confirmation if they try
            to close it without saving their changes. For a demo, edit the input
            field below and press the exit 'X' without saving.
          </Text.Body>

          <Text.Label>NAME</Text.Label>
          <Form.Input
            value={inputValue}
            onChange={(e: React.SyntheticEvent<any>) => {
              setInputValue(e.currentTarget.value)
            }}
          />
        </Box>
      </Modal>

      <Button
        onClick={() => {
          setIsModalOpen(true)
        }}
      >
        Open modal
      </Button>
    </Box>
  )
}
