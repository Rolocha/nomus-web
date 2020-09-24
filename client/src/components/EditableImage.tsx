import { css } from '@emotion/core'
import * as CSS from 'csstype'
import styled from '@emotion/styled'
import * as React from 'react'
import * as Text from 'src/components/Text'
import * as SVG from 'src/components/SVG'
import Box from 'src/components/Box'
import Image from 'src/components/Image'
import { colors, animations } from 'src/styles'
import { rgba } from 'polished'
import {
  ResponsiveValue,
  RequiredTheme,
  TLengthStyledSystem,
} from 'styled-system'

const HiddenUploadInput = styled.input`
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
  top: 0;
  left: 0;
`

interface Props {
  src: string
  editable: boolean
  width?: ResponsiveValue<CSS.WidthProperty<TLengthStyledSystem>, RequiredTheme>
  height?: ResponsiveValue<
    CSS.HeightProperty<TLengthStyledSystem>,
    RequiredTheme
  >
  // eslint-disable-next-line flowtype/no-weak-types
  onImageUpdate: (image: File) => Promise<void>
}

const MAX_SIZE_MB = 3
const TOO_LARGE_MESSAGE = `Profile pictures may not exceed ${MAX_SIZE_MB}MB. Please try again with a smaller image.`

const EditableImage = ({
  src,
  editable,
  width,
  height,
  onImageUpdate,
}: Props) => {
  const [updating, setUpdating] = React.useState(false)
  const uploadInputRef = React.useRef<HTMLInputElement | null>(null)

  const handleUpdatePictureClick = React.useCallback(() => {
    uploadInputRef?.current?.click()
  }, [uploadInputRef])

  const handlePictureSelection = React.useCallback(async () => {
    const image = uploadInputRef?.current?.files?.[0]
    if (image) {
      if (image.size > MAX_SIZE_MB * 10 ** 6) {
        // eslint-disable-next-line no-alert
        window.confirm(TOO_LARGE_MESSAGE)
      } else {
        setUpdating(true)
        await onImageUpdate(image)
        setUpdating(false)
      }
    }
  }, [uploadInputRef, setUpdating, onImageUpdate])

  return (
    <Box
      position="relative"
      width={width}
      height={height}
      overflow="hidden"
      borderRadius="50%"
      css={css``}
    >
      <Image
        src={src}
        position="relative"
        w={width}
        h={height}
        borderRadius="50%"
        css={css`
          overflow: hidden;
          animation: ${updating &&
          css`
            ${animations.fadeIn} 0.5s ease infinite alternate
          `};
        `}
      />
      {editable && (
        <Box
          css={css`
            position: absolute;
            left: 0;
            width: 100%;
            bottom: 0;
            height: ${updating ? '0' : '30'}%;
            opacity: ${updating ? 0 : 1};
            transition: 0.3s ease opacity, 0.3s ease height, 0.3s ease top,
              0.3s ease border-radius, 0.3s ease background-color;
            background-color: ${rgba(colors.white, 0.5)};
            color: white;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            &:hover {
              height: 100%;
              background-color: ${rgba(colors.white, 0.8)};
              .edit-text {
                transform: scaleX(1);
                max-width: 500px;
                opacity: 1;
              }
            }
          `}
          onClick={handleUpdatePictureClick}
        >
          <Box display="flex" alignItems="center">
            <SVG.Pen color={colors.nomusBlue} />
            <Text.Body2
              ml={2}
              className="edit-text"
              color="nomusBlue"
              css={css`
                transform: scaleX(0);
                transform-origin: center;
                max-width: 0;
                width: auto;
                opacity: 0;
                transition: 0.3s ease transform, 0.3s ease opacity,
                  0.3s ease max-width;
              `}
            >
              Edit
            </Text.Body2>
          </Box>
          <HiddenUploadInput
            type="file"
            accept="image/*"
            ref={uploadInputRef}
            onChange={handlePictureSelection}
          />
        </Box>
      )}
    </Box>
  )
}

EditableImage.defaultProps = {
  size: 150,
  editable: false,
}

export default EditableImage