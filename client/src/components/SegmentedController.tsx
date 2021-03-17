import * as React from 'react'
import Box from 'src/components/Box'
import Link from 'src/components/Link'
import * as Text from 'src/components/Text'
import { colors } from 'src/styles'
import Icon, { IconName } from './Icon'

export enum TabActionType {
  InternalLink,
  OnClick,
}

interface TabConfig {
  id: string | number
  title: string
  icon?: IconName
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

const SegmentedController = ({
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
      borderRadius="10em"
      p={1}
      bg={unselectedBg}
      display="flex"
      flexDirection="row"
      overflow="hidden"
    >
      {tabs.map((tabConfig) => {
        const selected = selectedTabId === tabConfig.id
        const { icon } = tabConfig
        const InnerContent = (
          <Box
            bg={selected ? selectedBg : unselectedBg}
            p={2}
            borderRadius="10em"
            display="flex"
            flexDirection="row"
            alignItems="center"
            justifyContent="center"
          >
            {icon && (
              <Icon
                of={icon}
                boxSize="1rem"
                mr="4px"
                color={selected ? selectedColor : unselectedColor}
              />
            )}
            <Text.Body3
              color={selected ? selectedColor : unselectedColor}
              fontWeight={selected ? 500 : undefined}
            >
              {tabConfig.title}
            </Text.Body3>
          </Box>
        )
        return {
          [TabActionType.InternalLink]: (
            <Box key={tabConfig.id} width={`${100 / tabs.length}%`}>
              <Link
                // @ts-ignore
                to={tabConfig.linkTo}
                onClick={tabConfig.onClick}
              >
                {InnerContent}
              </Link>
            </Box>
          ),
          [TabActionType.OnClick]: (
            <Box
              role="button"
              cursor="pointer"
              key={tabConfig.id}
              width={`${100 / tabs.length}%`}
              onClick={tabConfig.onClick}
            >
              {InnerContent}
            </Box>
          ),
        }[tabConfig.actionType]
      })}
    </Box>
  )
}

SegmentedController.defaultProps = {
  unselectedBg: colors.white,
  unselectedColor: colors.nomusBlue,
  selectedBg: colors.nomusBlue,
  selectedColor: colors.white,
  borderColor: colors.nomusBlue,
}

export default SegmentedController
