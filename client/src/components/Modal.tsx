import { css, Global } from '@emotion/react'
import * as CSS from 'csstype'
import { rgba } from 'polished'
import * as React from 'react'
import ReactDOM from 'react-dom'
import { animated, useTransition } from 'react-spring'
import Box from 'src/components/Box'
import Button from 'src/components/Button'
import Icon from 'src/components/Icon'
import * as Text from 'src/components/Text'
import { colors } from 'src/styles'
import { use100vh } from 'src/utils/ui'
import {
  RequiredTheme,
  ResponsiveValue,
  TLengthStyledSystem,
} from 'styled-system'

export enum ActionType {
  Cancel = 'cancel',
  Submit = 'submit',
}

interface Action {
  close?: boolean
  text: string
  handler?: () => void
  submitForm?: string
  inProgress?: boolean
  inProgressText?: string
}

type Actions = {
  primary?: Action
  secondary?: Action
}

type AnchorStyle = 'center' | 'right'
interface ChildOptions {
  onModalClose?: () => void
}

interface HeaderDetails {
  title: string
  subtitle?: string
}

interface Props {
  isOpen: boolean
  onClose: (confirmed?: boolean) => void
  // If omitted, defaults to using onClose
  onClickOutside?: () => void
  children: React.ReactNode | ((options: ChildOptions) => React.ReactNode)
  maxWidth?: ResponsiveValue<
    CSS.Property.MaxWidth<TLengthStyledSystem>,
    RequiredTheme
  >
  width?: ResponsiveValue<
    CSS.Property.Width<TLengthStyledSystem>,
    RequiredTheme
  >
  height?: ResponsiveValue<
    CSS.Property.MaxHeight<TLengthStyledSystem>,
    RequiredTheme
  >
  confirmClose: () => boolean
  actions?: Actions
  preventCloseWithOutsideClick?: boolean
  // Controls where the modal is anchored, currently either at center (typical) or anchored to the right edge
  anchorStyle: AnchorStyle
  header?: HeaderDetails
}

const Modal = ({
  isOpen,
  children,
  onClose,
  maxWidth,
  width,
  height,
  header,
  confirmClose,
  actions,
  preventCloseWithOutsideClick,
  anchorStyle,
}: Props) => {
  const modalCardRef = React.useRef<HTMLDivElement>(null)
  const [confirmingClose, setConfirmingClose] = React.useState(false)
  const backgroundTransitions = useTransition(isOpen, null, {
    // Need position and zIndex to give it a stacking context to guarantee
    // it renders over modal underneath (if there is one)
    from: { opacity: 0, position: 'relative', zIndex: 0 },
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
      width: '100%',
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
      !preventCloseWithOutsideClick &&
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

  const fullHeight = use100vh()

  return ReactDOM.createPortal(
    <Box>
      {/* Apply some global styles when the modal is open to prevent body scrolling and ensure Navbar has lower z-index */}
      {/* This is sliiightly hacky but it's just for Navbar, I don't anticipate needing to do this elsewhere */}
      {isOpen && (
        <Global
          styles={css`
            html {
              overflow: hidden;
            }
            #navbar {
              z-index: -1;
            }
          `}
        />
      )}
      {backgroundTransitions.map(
        ({ item, key, props }) =>
          item && (
            <animated.div key={key} style={props}>
              <Box
                as="aside"
                data-testid="modal"
                aria-modal
                position="fixed"
                top="0"
                left="0"
                zIndex={10}
                width="100vw"
                height={fullHeight ?? undefined}
                // https://stackoverflow.com/a/55003985
                minHeight="-webkit-fill-available"
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
                p={{ _: 2, md: 'unset' }}
              >
                {foregroundTransitions.map(
                  ({ item, key, props }) =>
                    item && (
                      <animated.div key={key} style={props}>
                        <Box
                          ref={modalCardRef}
                          position="relative"
                          zIndex={20}
                          maxWidth={maxWidth ?? '90vw'}
                          maxHeight={
                            {
                              center: '80vh',
                              right: '100vh',
                            }[anchorStyle]
                          }
                          width={
                            {
                              center: width ?? { _: '100%', md: '80%' },
                              right: width ?? { _: '90%', md: '50%' },
                            }[anchorStyle]
                          }
                          height={
                            {
                              center: undefined,
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
                          {header && (
                            <Box
                              p={{ _: 3, md: 4 }}
                              borderBottom={`1px solid ${colors.superlightGray}`}
                            >
                              <Text.CardHeader mb={3}>
                                {header.title}
                              </Text.CardHeader>
                              {header.subtitle && (
                                <Text.Body2>{header.subtitle}</Text.Body2>
                              )}
                            </Box>
                          )}

                          <Box
                            p={{ _: 3, md: 4 }}
                            flexGrow={0}
                            overflowY="auto"
                          >
                            {typeof children === 'function'
                              ? children({ onModalClose: onClose })
                              : children}
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
                              <Icon of="close" color={colors.midnightGray} />
                            </Box>
                          </Box>

                          {actions && (
                            <Box
                              display="flex"
                              flexDirection="row"
                              borderTop={`1px solid ${colors.superlightGray}`}
                              p="inherit"
                            >
                              <Box
                                p={3}
                                width="100%"
                                display="grid"
                                gridTemplateColumns="1fr 1fr 1fr 1fr"
                                gridTemplateAreas={`". . secondary primary"`}
                              >
                                {actions.secondary && (
                                  <Button
                                    gridArea="secondary"
                                    variant="secondary"
                                    mr={2}
                                    onClick={() => {
                                      if (actions.secondary?.handler) {
                                        actions.secondary.handler()
                                      }
                                      if (actions.secondary?.close) {
                                        tryToClose()
                                      }
                                    }}
                                    form={
                                      actions.secondary.submitForm ?? undefined
                                    }
                                    inProgress={actions.secondary.inProgress}
                                    inProgressText={
                                      actions.secondary.inProgressText
                                    }
                                    type={
                                      actions.secondary.submitForm
                                        ? 'submit'
                                        : undefined
                                    }
                                  >
                                    {actions.secondary.text}
                                  </Button>
                                )}
                                {actions.primary && (
                                  <Button
                                    gridArea="primary"
                                    variant="primary"
                                    onClick={actions.primary.handler}
                                    form={
                                      actions.primary.submitForm ?? undefined
                                    }
                                    inProgress={actions.primary.inProgress}
                                    inProgressText={
                                      actions.primary.inProgressText
                                    }
                                    type={
                                      actions.primary.submitForm
                                        ? 'submit'
                                        : undefined
                                    }
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
                      preventCloseWithOutsideClick={true}
                      isOpen={confirmingClose}
                      onClose={cancelCloseConfirm}
                      maxWidth="90%"
                      width="400px"
                      actions={{
                        primary: {
                          text: 'No, cancel',
                          handler: cancelCloseConfirm,
                        },
                        secondary: {
                          text: 'Yes, discard',
                          handler: tryToClose,
                        },
                      }}
                    >
                      <Box>
                        <Box>
                          <Text.CardHeader mb={3}>Discard?</Text.CardHeader>

                          <Text.Body2>
                            Changes you have made won't be saved.
                          </Text.Body2>
                        </Box>
                      </Box>
                    </Modal>
                  </Box>
                )}
              </Box>
            </animated.div>
          ),
      )}
    </Box>,
    // Render Modals via a portal to a div#modal-root that's a sibling of
    // the main app's div#root (check client/public/index.html)
    // See https://reactjs.org/docs/portals.html for more details
    document.getElementById('modal-root')!,
  )
}

Modal.defaultProps = {
  anchorStyle: 'center',
  preventCloseWithOutsideClick: false,
  confirmClose: () => false,
  onClose: () => {},
}

export default Modal
