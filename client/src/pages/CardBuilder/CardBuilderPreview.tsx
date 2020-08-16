import { rgba } from 'polished'
import * as React from 'react'
import Box from 'src/components/Box'
import Button from 'src/components/Button'
import Image from 'src/components/Image'
import * as SVG from 'src/components/SVG'
import { colors } from 'src/styles'
import { FileItem } from 'src/types/files'

interface Props {
  frontDesignFile: FileItem | null
  backDesignFile?: FileItem | null
}

const CardBuilderPreview = ({ frontDesignFile, backDesignFile }: Props) => {
  const [hideGuides, setHideGuides] = React.useState(false)
  const [showBack, setShowBack] = React.useState(false)

  return (
    <Box>
      <Box
        display="grid"
        gridTemplateColumns="2fr 1fr 3fr 2fr"
        gridTemplateRows="auto"
        gridColumnGap={3}
        mb={3}
      >
        <Button onClick={() => setHideGuides(!hideGuides)} variant="secondary">
          <Box display="flex" alignItems="center" justifyContent="center">
            <SVG.Ruler color={colors.nomusBlue} />
            <Box ml={2}>{hideGuides ? 'Show' : 'Hide'} guides</Box>
          </Box>
        </Button>
        {/* Empty box to take up the space of the 2nd column */}
        <Box />
        <Button variant="secondary">
          <Box display="flex" alignItems="center" justifyContent="center">
            <SVG.PathBack color={colors.nomusBlue} />
            <Box ml={2}>Show both sides</Box>
          </Box>
        </Button>
        <Button
          variant="secondary"
          disabled={backDesignFile == null || backDesignFile.url == null}
          onClick={() => setShowBack(!showBack)}
        >
          <Box display="flex" alignItems="center" justifyContent="center">
            <SVG.Sync color={colors.nomusBlue} />
            <Box ml={2}>Flip to {showBack ? 'front' : 'back'}</Box>
          </Box>
        </Button>
      </Box>
      <Box border={`24px solid ${rgba('#F7BB3B', 0.5)}`}>
        <Box position="relative" border="5.39px solid #444">
          <Box width="100%" pb="calc(100% * (4/7))" position="relative">
            <Box
              position="absolute"
              top="0"
              left="0"
              width="100%"
              height="100%"
              display="flex"
              alignItems="center"
              justifyContent="center"
              overflow="hidden"
            >
              {!showBack && frontDesignFile && (
                <Image w="100%" h="100%" src={frontDesignFile.url} />
              )}
              {showBack && backDesignFile && (
                <Image w="100%" h="100%" src={backDesignFile.url} />
              )}
            </Box>

            {/* Vertical guides */}
            {!hideGuides && (
              <Box
                position="absolute"
                left="7.5%"
                width="85%"
                height="100%"
                borderLeft={`2.7px dashed ${colors.brightCoral}`}
                borderRight={`2.7px dashed ${colors.brightCoral}`}
              />
            )}
            {/* Horizontal guides */}
            {!hideGuides && (
              <Box
                position="absolute"
                top="7.5%"
                width="100%"
                height="85%"
                borderTop={`2.7px dashed ${colors.brightCoral}`}
                borderBottom={`2.7px dashed ${colors.brightCoral}`}
              />
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default CardBuilderPreview
