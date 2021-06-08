import * as React from 'react'
import Box from './Box'
import Button from './Button'
import * as Text from 'src/components/Text'
interface Props {
  className?: string
  topBarColor: string
  icon: React.ReactNode
  header: string
  subheader?: string
  bodyText: string
  buttonText?: string
  boxShadow?: string
  onClick?: () => void
  onButtonClick?: () => void
  align: 'left' | 'center' | 'mix'
  size: 'small' | 'medium'
}

// https://www.notion.so/Card-Spec-55e903502e484758890bee88689a2daf
const Card = ({
  className,
  align,
  size,
  icon,
  topBarColor,
  header,
  subheader,
  bodyText,
  buttonText,
  boxShadow,
  onClick,
  onButtonClick,
}: Props) => {
  return (
    <Box
      className={className}
      width="100%"
      borderRadius="lg"
      boxShadow={boxShadow ?? 'workingWindow'}
      onClick={onClick}
      cursor={onClick != null ? 'pointer' : undefined}
    >
      {/* Top bar */}
      <Box
        height="16px"
        borderTopLeftRadius="base"
        borderTopRightRadius="base"
        bg={topBarColor}
      />
      {/* Content */}
      <Box
        p={{ small: '16px', medium: '24px' }[size]}
        display="grid"
        gridTemplateColumns={align === 'center' ? '1fr' : '3fr 9fr'}
        gridTemplateAreas={
          {
            left: `
            "icon header"
            "icon body"
            "icon button"
          `,
            center: `
            "icon"
            "header"
            "graphic"
            "body"
            "button"
          `,
            mix: `
            "icon header"
            "body body"
            "button button"
          `,
          }[align]
        }
        gridGap="16px"
      >
        {icon && (
          <Box
            gridArea="icon"
            placeSelf={align === 'center' ? 'center' : 'start'}
          >
            {icon}
          </Box>
        )}

        <Box
          gridArea="header"
          placeSelf={align === 'center' ? 'center' : 'start'}
          textAlign={align === 'center' ? 'center' : 'left'}
        >
          <Text.CardHeader>{header}</Text.CardHeader>
          {subheader && (
            <Text.Body2 color="africanElephant">{subheader}</Text.Body2>
          )}
        </Box>

        {bodyText && (
          <Box gridArea="body">
            <Text.Body2
              textAlign={
                align === 'mix' || align === 'center' ? 'center' : 'unset'
              }
            >
              {bodyText}
            </Text.Body2>
          </Box>
        )}

        {buttonText && (
          <Button gridArea="button" variant="primary" onClick={onButtonClick}>
            {buttonText}
          </Button>
        )}
      </Box>
    </Box>
  )
}

Card.defaultProps = {
  topBarColor: 'transparent',
  align: 'left',
  size: 'medium',
}

export default Card
