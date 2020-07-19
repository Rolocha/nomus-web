import { useTransition, animated } from 'react-spring'
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

type AnchorStyle = 'center' | 'right'

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
  confirmClose: () => boolean
  actions?: Actions
  allowCloseWithOutsideClick?: boolean
  // Controls where the modal is anchored, currently either at center (typical) or anchored to the right edge
  anchorStyle: AnchorStyle
}

const Modal = ({
  isOpen,
  children,
  onClose,
  width,
  height,
  confirmClose,
  actions,
  allowCloseWithOutsideClick,
  anchorStyle,
}: Props) => {
  const modalCardRef = React.useRef<HTMLDivElement>(null)
  const [confirmingClose, setConfirmingClose] = React.useState(false)
  const backgroundTransitions = useTransition(isOpen, null, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
  })

  const foregroundTransitions = useTransition(isOpen, null, {
    from: {
      // We need the flexbox base styles on the <animated.div /> so that the modal foreground gets positioned correctly
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: {
        center: 'center',
        right: 'flex-end',
      }[anchorStyle],
      transform: {
        center: 'scale(0)',
        right: 'translateX(100%)',
      }[anchorStyle],
    },
    enter: {
      transform: {
        center: 'scale(1)',
        right: 'translateX(0%)',
      }[anchorStyle],
    },
    leave: {
      transform: {
        center: 'scale(0)',
        right: 'translateX(100%)',
      }[anchorStyle],
    },
  })

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
    if (isOpen) {
      document.querySelector('html')?.classList.add('scroll-lock')
    } else {
      document.querySelector('html')?.classList.remove('scroll-lock')
    }
  }, [isOpen])

  return (
    <Box>
      {backgroundTransitions.map(
        ({ item, key, props }) =>
          item && (
            <animated.div key={key} style={props}>
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
                alignItems={
                  {
                    center: 'center',
                    right: 'flex-end',
                  }[anchorStyle]
                }
                justifyContent="center"
                bg={rgba(colors.nomusBlue, 0.8)}
                onClick={handleOutsideClick}
              >
                <Global
                  styles={css`
                    .scroll-lock {
                      overflow: hidden;
                    }
                  `}
                />
                {foregroundTransitions.map(
                  ({ item, key, props }) =>
                    item && (
                      <animated.div key={key} style={props}>
                        <Box
                          ref={modalCardRef}
                          position="relative"
                          zIndex={20}
                          width={
                            {
                              center: width ?? { _: '95%', md: '80%' },
                              right: width ?? { _: '95%', md: '50%' },
                            }[anchorStyle]
                          }
                          height={
                            {
                              center: 'unset',
                              right: '100vh',
                            }[anchorStyle]
                          }
                          bg="white"
                          borderRadius={anchorStyle === 'center' ? 2 : 0}
                          boxShadow={anchorStyle === 'center' ? 0 : undefined}
                          display="flex"
                          flexDirection="column"
                          alignItems="stretch"
                          justifyContent={
                            actions ? 'space-between' : 'flex-start'
                          }
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
                                    variant="secondary"
                                    mr={2}
                                    onClick={actions.secondary.handler}
                                  >
                                    {actions.secondary.text}
                                  </Button>
                                )}
                                {actions.primary && (
                                  <Button
                                    variant="primary"
                                    onClick={actions.primary.handler}
                                  >
                                    {actions.primary.text}
                                  </Button>
                                )}
                              </Box>
                            </Box>
                          )}
                        </Box>
                      </animated.div>
                    ),
                )}
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

                          <Text.Body>
                            Changes you have made won't be saved.
                          </Text.Body>
                        </Box>
                      </Box>
                    </Modal>
                  </Box>
                )}
              </Box>
              )
            </animated.div>
          ),
      )}
    </Box>
  )
}

Modal.defaultProps = {
  anchorStyle: 'center',
  allowCloseWithOutsideClick: true,
  confirmClose: () => false,
}

export default Modal
