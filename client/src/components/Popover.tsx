import { css } from '@emotion/core'
import * as React from 'react'
import Box from 'src/components/Box'
import { useCustomResponsiveStyles } from 'src/styles/helpers'
import { ResponsiveValue } from 'styled-system'

export enum PopoverAnchorPoint {
  Top = 'Top',
  TopRight = 'TopRight',
  TopLeft = 'TopLeft',
}

interface Props {
  omitIconBg: boolean
  icon: React.ReactNode
  popoverContents: React.ReactNode
  anchorPoint: ResponsiveValue<PopoverAnchorPoint>
}

const PopoverButton = ({
  omitIconBg,
  icon,
  popoverContents,
  anchorPoint = PopoverAnchorPoint.Top,
}: Props) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const popoverCard = React.useRef<HTMLDivElement | null>(null)
  const openerButton = React.useRef<HTMLDivElement | null>(null)

  const anchorPointStyles = useCustomResponsiveStyles(anchorPoint, {
    [PopoverAnchorPoint.Top]: {
      top: '100%',
      left: '50%',
      right: 'unset',
      mt: 3,
      transform: 'translateX(-50%)',
    },
    [PopoverAnchorPoint.TopRight]: {
      top: '100%',
      left: 'unset',
      right: '0%',
      mt: 3,
      transform: 'unset',
    },
    [PopoverAnchorPoint.TopLeft]: {
      top: '100%',
      left: '0%',
      right: 'unset',
      mt: 3,
      transform: 'unset',
    },
  })

  React.useEffect(() => {
    const listener = (event: MouseEvent) => {
      if (
        popoverCard.current &&
        // @ts-ignore
        !popoverCard.current.contains(event.target) &&
        // If the click happened on the opener button, ignore it here and let the opener's onClick handle
        // setting isOpen to false instead. Otherwise they clobber each other and it doesn't close.
        openerButton.current &&
        // @ts-ignore
        !openerButton.current.contains(event.target)
      ) {
        setIsOpen(false)
      }
    }

    document.body.addEventListener('click', listener)
    return () => {
      document.body.removeEventListener('click', listener)
    }
  })

  const iconBgProps = {
    bg: 'white',
    boxShadow: 'knob',
    borderRadius: '50%',
    p: 1,
    css: css`
      &,
      svg {
        width: 2rem;
        height: 2rem;
      }
    `,
  }

  return (
    <Box position="relative">
      <Box
        ref={openerButton}
        {...(omitIconBg ? {} : iconBgProps)}
        mx={1}
        role="button"
        display="flex"
        alignItems="center"
        justifyContent="center"
        onClick={() => setIsOpen(!isOpen)}
        cursor="pointer"
      >
        {icon}
      </Box>
      {isOpen && (
        <Box
          position="absolute"
          ref={popoverCard}
          {...anchorPointStyles}
          bg="white"
          boxShadow="workingWindow"
          borderRadius={2}
        >
          {popoverContents}
        </Box>
      )}
    </Box>
  )
}

PopoverButton.defaultProps = {
  omitIconBg: false,
  anchorPoint: PopoverAnchorPoint.Top,
}

export default PopoverButton
