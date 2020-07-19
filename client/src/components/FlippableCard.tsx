import { css } from '@emotion/core'
import * as CSS from 'csstype'
import * as React from 'react'
import Box from 'src/components/Box'
import Image from 'src/components/Image'
import * as SVG from 'src/components/SVG'
import { rotateNoShow, rotateShow } from 'src/styles/animations'
import {
  RequiredTheme,
  ResponsiveValue,
  TLengthStyledSystem,
} from 'styled-system'

interface Props {
  frontImageUrl: string
  backImageUrl: string
  // Both width and height are optional but you should probably provide at least one or the image won't show up
  height?: ResponsiveValue<
    CSS.HeightProperty<TLengthStyledSystem>,
    RequiredTheme
  >
  width?: ResponsiveValue<CSS.WidthProperty<TLengthStyledSystem>, RequiredTheme>
}

const faceStyles = css({
  perspectiveOrigin: 'top center',
  animationDuration: '0.3s',
  animationTimingFunction: 'linear',
  transitionProperty: 'transform',
  animationFillMode: 'forwards',
  overflow: 'hidden',
  perspective: '1000px',
  position: 'relative',
  display: 'inline-block',
})

const FlipButton = ({ onClick }: { onClick: () => void }) => (
  <Box
    position="absolute"
    top="0"
    right="0"
    width="30px"
    height="30px"
    bg="white"
    borderRadius="50%"
    p={1}
    role="button"
    onClick={onClick}
    boxShadow={0}
    zIndex={3}
    css={css`
      transform: translate(40%, -40%);
      cursor: pointer;
      svg {
        width: 100%;
        height: 100%;
      }
    `}
  >
    <SVG.Sync />
  </Box>
)

const FlippableCard = ({
  frontImageUrl,
  backImageUrl,
  width,
  height,
}: Props) => {
  const [showBack, setShowBack] = React.useState(false)

  return (
    <Box position="relative" display="inline-block" width={width}>
      <Box
        width={width}
        css={css(faceStyles, {
          zIndex: 2,
          transform: 'rotateY(0deg)',
          animationName: showBack ? rotateNoShow : rotateShow,
        })}
      >
        <Image boxShadow={0} w={width} h={height} src={frontImageUrl} />
      </Box>
      <Box
        width={width}
        css={css(faceStyles, {
          zIndex: 1,
          transform: 'rotateY(-180deg)',
          animationName: showBack ? rotateShow : rotateNoShow,
        })}
      >
        <Image boxShadow={0} w={width} h={height} src={backImageUrl} />
      </Box>
      <FlipButton onClick={() => setShowBack(!showBack)} />
    </Box>
  )
}

export default FlippableCard
