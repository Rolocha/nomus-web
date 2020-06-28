import { css } from '@emotion/core'
import * as React from 'react'
import Box from 'src/components/Box'
import { makeComplexResponsiveStyles } from 'src/styles/helpers'
import { ResponsiveValue } from 'styled-system'

export enum PopoverAnchorPoint {
  Top = 'Top',
  TopRight = 'TopRight',
  TopLeft = 'TopLeft',
}

interface Props {
  icon: React.ReactNode
  popoverContents: React.ReactNode
  anchorPoint: ResponsiveValue<PopoverAnchorPoint>
}

const PopoverButton = ({ icon, popoverContents, anchorPoint }: Props) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const popoverCard = React.useRef<HTMLDivElement | null>(null)

  const popoverStyles: { [k in PopoverAnchorPoint]: any } = {
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
  }

  const anchorPointStyles =
    anchorPoint != null
      ? // @ts-ignore
        // @ts-ignore above one doesn't work bc it's not at front of line but prettier forces ? at front
        makeComplexResponsiveStyles(popoverStyles, anchorPoint)
      : null

  React.useEffect(() => {
    const listener = (event: MouseEvent) => {
      // @ts-ignore
      if (popoverCard.current && !popoverCard.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.body.addEventListener('click', listener)
    return () => {
      document.body.removeEventListener('click', listener)
    }
  })

  return (
    <Box position="relative">
      <Box
        bg="white"
        borderRadius="50%"
        mx={1}
        p={1}
        role="button"
        boxShadow={0}
        display="flex"
        alignItems="center"
        justifyContent="center"
        onClick={() => setIsOpen(!isOpen)}
        css={css`
          cursor: pointer;
          &,
          svg {
            width: 2rem;
            height: 2rem;
          }
        `}
      >
        {icon}
      </Box>
      {isOpen && (
        <Box
          position="absolute"
          ref={popoverCard}
          {...anchorPointStyles}
          bg="white"
          boxShadow={0}
          borderRadius={2}
        >
          {popoverContents}
        </Box>
      )}
    </Box>
  )
}

PopoverButton.defaultProps = {
  anchorPoint: 'top',
}

export default PopoverButton
