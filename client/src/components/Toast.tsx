import { useTransition, animated } from 'react-spring'
import { css, keyframes } from '@emotion/react'
import * as React from 'react'
import * as Text from 'src/components/Text'
import * as SVG from 'src/components/SVG'
import { colors } from 'src/styles'
import Box from './Box'
import ReactDOM from 'react-dom'

interface Props {
  type: 'success' | 'warning' | 'danger' | 'info'
  title: string
  description: string | JSX.Element
  className?: string
  autoCloseIn?: number // milliseconds to auto-close in
  onClickClose?: () => void
}

const Toast = ({
  type,
  title,
  description,
  className,
  autoCloseIn,
  onClickClose,
}: Props) => {
  const color = {
    success: colors.validGreen,
    warning: colors.poppy,
    danger: colors.invalidRed,
    info: colors.nomusBlue,
  }[type]

  const [isActive, setIsActive] = React.useState<boolean>(true)
  const closable = onClickClose != null

  React.useEffect(() => {
    if (autoCloseIn) {
      setTimeout(() => {
        setIsActive(false)
      }, autoCloseIn)
    }
  }, [autoCloseIn, setIsActive, isActive])

  const swipeOutTransitions = useTransition(isActive, null, {
    from: {
      transform: 'translateX(-200%)',
    },
    enter: {
      transform: 'translateX(0%)',
    },
    leave: {
      transform: 'translateX(-200%)',
    },
  })

  const autoCloseTimerAnimation = keyframes`
    from {
      transform: scaleY(1);
    }
    to {
      transform: scaleY(0);
    }
  `

  return ReactDOM.createPortal(
    swipeOutTransitions.map(
      ({ item, key, props }) =>
        item && (
          <animated.div key={key} style={props}>
            <Box
              className={className}
              borderRadius={2}
              display="flex"
              width="250px"
              alignItems="center"
              boxShadow="banner"
              bg={colors.white}
            >
              <Box
                width="8px"
                alignSelf="stretch"
                borderTopLeftRadius={2}
                borderBottomLeftRadius={2}
                // Used to prevent bg={color} in child from spilling out of this element's rounded borders
                overflow="hidden"
              >
                <Box
                  bg={color}
                  width="100%"
                  height="100%"
                  css={css({
                    animation: autoCloseIn
                      ? `${autoCloseTimerAnimation} ${
                          autoCloseIn / 1000
                        }s forwards`
                      : undefined,
                    transformOrigin: 'bottom center',
                  })}
                />
              </Box>
              <Box width="100%" alignSelf="stretch" alignItems="center" p={2}>
                <Box display="flex" justifyContent="space-between">
                  <Text.Body3 fontWeight={500}>{title}</Text.Body3>
                  {closable && (
                    <Box
                      cursor="pointer"
                      role="button"
                      aria-label="close banner"
                      onClick={onClickClose}
                    >
                      <SVG.Close
                        css={css({ width: '16px' })}
                        color={colors.midnightGray}
                      />
                    </Box>
                  )}
                </Box>
                <Text.Body3>{description}</Text.Body3>
              </Box>
            </Box>
          </animated.div>
        ),
    ),
    document.getElementById('notifications-root')!,
  )
}

export default Toast
