import * as React from 'react'
import { css } from '@emotion/core'
import { rgba } from 'polished'

import * as Text from 'src/components/Text'
import Box from 'src/components/Box'
import Button from 'src/components/Button'
import { colors } from 'src/styles'

interface Action {
  text: string
  handler: () => void
}

type Actions = {
  primary?: Action
  secondary?: Action
}

interface Props {
  isOpen: boolean
  onClose: (confirmed?: boolean) => void
  // If omitted, defaults to using onClose
  onClickOutside?: () => void
  children: React.ReactNode
  width?: string
  height?: string
  confirmClose?: () => boolean
  actions?: Actions
  allowCloseWithOutsideClick?: boolean
}

const Modal = ({
  isOpen,
  children,
  onClose,
  width,
  height,
  confirmClose = () => false,
  actions,
  allowCloseWithOutsideClick = true,
}: Props) => {
  const modalCardRef = React.useRef<HTMLDivElement>(null)
  const [confirmingClose, setConfirmingClose] = React.useState(false)

  const handleOutsideClick = (event: React.SyntheticEvent<any>) => {
    if (
      allowCloseWithOutsideClick &&
      !confirmingClose &&
      modalCardRef.current &&
      !modalCardRef.current.contains(event.target)
    ) {
      tryToClose()
    }
  }

  const tryToClose = React.useCallback(() => {
    if (confirmClose()) {
      if (confirmingClose) {
        onClose(true)
        setConfirmingClose(false)
      } else {
        setConfirmingClose(true)
      }
    } else {
      onClose()
    }
  }, [confirmClose, confirmingClose, setConfirmingClose, onClose])

  const cancelCloseConfirm = React.useCallback(() => {
    setConfirmingClose(false)
  }, [setConfirmingClose])

  return isOpen ? (
    <Box
      as="aside"
      ariaModal
      position="fixed"
      top="0"
      left="0"
      zIndex={10}
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      bg={rgba(colors.primaryTeal, 0.8)}
      onClick={handleOutsideClick}
    >
      <Box
        ref={modalCardRef}
        position="relative"
        zIndex={20}
        maxWidth={width ?? { _: '95%', md: '80%' }}
        maxHeight={height ?? { _: '95%', md: '60%' }}
        minWidth="400px"
        bg="white"
        borderRadius={3}
        boxShadow={0}
        display="flex"
        flexDirection="column"
        alignItems="stretch"
        justifyContent={actions ? 'space-between' : 'flex-start'}
      >
        <Box p={{ _: 3, md: 4 }} overflowX="auto">
          {children}
          <Box
            role="button"
            ariaLabel="Close Modal"
            onClick={tryToClose}
            p="inherit"
            position="absolute"
            top="0"
            right="0"
            css={css`
              cursor: pointer;
            `}
          >
            <Text.Plain fontSize={24}>X</Text.Plain>
          </Box>
        </Box>

        {actions && (
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="flex-end"
            borderTop={`1px solid ${colors.superlightGray}`}
            p="inherit"
          >
            <Box p={3}>
              {actions.secondary && (
                <Button
                  variant="secondaryOutline"
                  mr={2}
                  onClick={actions.secondary.handler}
                >
                  {actions.secondary.text}
                </Button>
              )}
              {actions.primary && (
                <Button variant="primary" onClick={actions.primary.handler}>
                  {actions.primary.text}
                </Button>
              )}
            </Box>
          </Box>
        )}
      </Box>
      {confirmClose() && (
        <Box zIndex={30}>
          <Modal
            allowCloseWithOutsideClick={false}
            isOpen={confirmingClose}
            onClose={cancelCloseConfirm}
            actions={{
              primary: {
                text: 'No thanks',
                handler: cancelCloseConfirm,
              },
              secondary: {
                text: 'Discard',
                handler: tryToClose,
              },
            }}
          >
            <Box>
              <Box>
                <Text.PageHeader mb={3}>Discard?</Text.PageHeader>

                <Text.Body>Changes you have made won't be saved.</Text.Body>
              </Box>
            </Box>
          </Modal>
        </Box>
      )}
    </Box>
  ) : null
}

export default Modal
