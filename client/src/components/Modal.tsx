import { css, Global } from '@emotion/core'
import * as CSS from 'csstype'
import { rgba } from 'polished'
import * as React from 'react'
import Box from 'src/components/Box'
import Button from 'src/components/Button'
import * as Text from 'src/components/Text'
import { colors } from 'src/styles'
import {
  RequiredTheme,
  ResponsiveValue,
  TLengthStyledSystem,
} from 'styled-system'

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
  width?: ResponsiveValue<
    CSS.MaxWidthProperty<TLengthStyledSystem>,
    RequiredTheme
  >
  height?: ResponsiveValue<
    CSS.MaxHeightProperty<TLengthStyledSystem>,
    RequiredTheme
  >
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
  const lastIsOpen = React.useRef(isOpen)
  const modalCardRef = React.useRef<HTMLDivElement>(null)
  const [confirmingClose, setConfirmingClose] = React.useState(false)

  const handleOutsideClick = (event: React.SyntheticEvent<any>) => {
    if (
      allowCloseWithOutsideClick &&
      !confirmingClose &&
      modalCardRef.current &&
      // @ts-ignore
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

  // Disable scroll when modal gets opened
  React.useEffect(() => {
    if (isOpen !== lastIsOpen.current) {
      if (isOpen) {
        document.querySelector('html')?.classList.add('scroll-lock')
      } else {
        document.querySelector('html')?.classList.remove('scroll-lock')
      }
      lastIsOpen.current = isOpen
    }
  }, [isOpen, lastIsOpen])

  return isOpen ? (
    <Box
      as="aside"
      aria-modal
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
      <Global
        styles={css`
          .scroll-lock {
            overflow: hidden;
          }
        `}
      />
      <Box
        ref={modalCardRef}
        position="relative"
        zIndex={20}
        maxWidth={width ?? { _: '95%', md: '80%' }}
        maxHeight={height ?? { _: '95%', md: '80%' }}
        minWidth="calc(min(80vw, 400px))"
        bg="white"
        borderRadius={2}
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
            aria-label="Close Modal"
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
