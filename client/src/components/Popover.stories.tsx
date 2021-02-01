import { css } from '@emotion/react'
import { action } from '@storybook/addon-actions'
import React from 'react'
import Box from 'src/components/Box'
import Popover, { PopoverAnchorPoint } from 'src/components/Popover'
import * as SVG from 'src/components/SVG'
import * as Text from 'src/components/Text'

export default {
  title: 'Popover',
  component: Popover,
  excludeStories: /.*Data$/,
}

export const actionsData = {
  onClick: action('clicked'),
}

export const AnchoredOnTop = () => {
  const options = [
    PopoverAnchorPoint.Top,
    PopoverAnchorPoint.TopRight,
    PopoverAnchorPoint.TopLeft,
  ]
  const [anchorPoint, setAnchorPoint] = React.useState(PopoverAnchorPoint.Top)
  //   const [selectedOption, setSelectedOption] = React.useState(options[0])

  return (
    <Box display="inline-block" ml={6} mt={6}>
      <Popover
        anchorPoint={anchorPoint}
        icon={<SVG.Options />}
        popoverContents={
          <Box p={2}>
            <Text.Body3 color="africanElephant">Anchor to</Text.Body3>
            {options.map((option) => (
              <Box
                cursor="pointer"
                onClick={() => setAnchorPoint(option)}
                display="flex"
                justifyContent="flex-start"
                alignItems="center"
                py={1}
                pr={2}
              >
                {option === anchorPoint ? (
                  <SVG.Check
                    color="black"
                    css={css`
                      width: 25px;
                    `}
                  />
                ) : (
                  <Box width="25px" height="25px" />
                )}
                <Text.Body2
                  css={css({
                    whiteSpace: 'nowrap',
                  })}
                >
                  {option}
                </Text.Body2>
              </Box>
            ))}
          </Box>
        }
      />
    </Box>
  )
}
