import * as React from 'react'
import { css } from '@emotion/core'
import Box from 'src/components/Box'
import * as Text from 'src/components/Text'
import { colors } from 'src/styles'

interface Props {
  // Defaults to the text within children, but can be manually overriden
  copyText?: string
  children: React.ReactNode
}

const CopyableText = ({ copyText, children }: Props) => {
  const [didCopy, setDidCopy] = React.useState(false)
  const textRef = React.useRef<HTMLDivElement | null>(null)

  const handleCopy = React.useCallback(() => {
    const textToCopy = copyText || textRef.current?.textContent
    if (textToCopy != null) {
      // Hack: the copy command only allows what's selected to be copied, so we
      // create a fake input element, set its value to the text we want, make it
      // invisible, select it and copy, then remove the element
      const dummy = document.createElement('input')
      dummy.setAttribute('value', textToCopy)
      document.body.appendChild(dummy)
      dummy.style.position = 'absolute'
      dummy.style.opacity = '0'
      dummy.select()
      document.execCommand('copy')
      document.body.removeChild(dummy)

      setDidCopy(true)
    }
  }, [copyText, textRef])

  return (
    <Box
      as="span"
      position="relative"
      onMouseOver={() => setDidCopy(false)}
      css={css`
        &:hover {
          > :first-child {
            display: block;
          }
          > :nth-child(2) {
            background-color: ${colors.hoverBlue};
          }
        }
      `}
      onClick={handleCopy}
    >
      <Box
        css={css({
          display: 'none',
          position: 'absolute',
          bottom: '110%',
          left: '50%',
          transform: 'translateX(-50%)',
          borderRadius: '4px',
        })}
        bg="hoverBlue"
        py={1}
        px={2}
        as="span"
      >
        <Text.Body2>{didCopy ? 'Copied!' : 'Copy...'}</Text.Body2>
      </Box>

      <Box as="span" ref={textRef}>
        {children}
      </Box>
    </Box>
  )
}

export default CopyableText
