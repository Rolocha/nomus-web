import { css } from '@emotion/core'
import * as React from 'react'
import Box from 'src/components/Box'
import { InternalLink } from 'src/components/Link'
import * as SVG from 'src/components/SVG'
import * as Text from 'src/components/Text'
import { colors } from 'src/styles'

type ValueOf<T> = T[keyof T]

export enum TabActionType {
  InternalLink,
}

interface TabConfig {
  id: string | number
  title: string
  Icon?: ValueOf<typeof SVG>
  actionType: TabActionType
  onClick?: () => void
  // Required if actionType is 'internalLink' or 'externalLink'
  linkTo?: string
}

interface Props {
  selectedTabId?: string
  tabs: TabConfig[]
  unselectedBg?: string
  unselectedColor?: string
  selectedBg?: string
  selectedColor?: string
  borderColor?: string
}

const TabSelector = ({
  tabs,
  selectedTabId,
  unselectedBg,
  unselectedColor,
  selectedBg,
  selectedColor,
  borderColor,
}: Props) => {
  return (
    <Box
      border={`1px solid ${borderColor}`}
      borderRadius={2}
      display="flex"
      flexDirection="row"
      overflow="hidden"
    >
      {tabs.map((tabConfig) => {
        const selected = selectedTabId === tabConfig.id
        const { Icon } = tabConfig
        const InnerContent = (
          <Box
            bg={selected ? selectedBg : unselectedBg}
            p={2}
            display="flex"
            flexDirection="row"
            alignItems="center"
            justifyContent="center"
          >
            {Icon && (
              <Icon
                css={css`
                  height: 1rem;
                  margin-right: 4px;
                `}
                color={selected ? selectedColor : unselectedColor}
              />
            )}
            <Text.Body3
              color={selected ? selectedColor : unselectedColor}
              fontWeight={selected ? 'bold' : undefined}
            >
              {tabConfig.title}
            </Text.Body3>
          </Box>
        )
        return {
          [TabActionType.InternalLink]: (
            <Box width={`${100 / tabs.length}%`}>
              <InternalLink
                noUnderline
                key={tabConfig.id}
                // @ts-ignore
                to={tabConfig.linkTo}
              >
                {InnerContent}
              </InternalLink>
            </Box>
          ),
        }[tabConfig.actionType]
      })}
    </Box>
  )
}

TabSelector.defaultProps = {
  unselectedBg: colors.white,
  unselectedColor: colors.primaryTeal,
  selectedBg: colors.primaryTeal,
  selectedColor: colors.white,
  borderColor: colors.primaryTeal,
}

export default TabSelector
