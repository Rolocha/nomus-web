import { css } from '@emotion/react'
import 'css.gg/icons/css/external.css'
import * as React from 'react'
import Box from 'src/components/Box'
import * as Form from 'src/components/Form'
import { InternalLink } from 'src/components/Link'
import Popover, { PopoverAnchorPoint } from 'src/components/Popover'
import * as SVG from 'src/components/SVG'
import SegmentedController, {
  TabActionType,
} from 'src/components/SegmentedController'
import * as Text from 'src/components/Text'
import { colors } from 'src/styles'
import { allContactsSortOptions, ContactsSortOption } from './utils'
import { Contact } from 'src/types/contact'
import { useLocation } from 'react-router-dom'
import Icon from 'src/components/Icon'

interface Props {
  selectedContactSortOption: ContactsSortOption
  onSelectedContactSortOptionChange: (newOption: ContactsSortOption) => void
  selectedViewMode?: string
  selectedContact?: Contact | null
  searchQueryValue?: string | null
  onChangeSearchQueryValue: (newValue: string) => void
}

const bp = 'md'

const ContactCardsList = ({
  selectedContactSortOption,
  onSelectedContactSortOptionChange,
  selectedViewMode,
  selectedContact,
  searchQueryValue,
  onChangeSearchQueryValue,
}: Props) => {
  const handleChangeSearchQueryValue = (event: React.SyntheticEvent<any>) => {
    // @ts-ignore
    onChangeSearchQueryValue(event.target.value)
  }

  const location = useLocation()

  const hideSearchBarInMobile =
    selectedViewMode === 'detail' && selectedContact != null

  return (
    <Box
      display="grid"
      gridTemplateColumns={{
        _: '10fr 2fr',
        [bp]: '3fr 1fr 5fr 3fr',
      }}
      gridTemplateAreas={{
        _: `
        "viewMode viewMode"
        "search searchActions"
      `,
        [bp]: `
        "search searchActions userPageLink viewMode"
    `,
      }}
      gridColumnGap={2}
      gridRowGap={{ _: 3, [bp]: 0 }}
      alignItems={{ _: undefined, [bp]: 'center' }}
    >
      <Box
        display={{ _: hideSearchBarInMobile ? 'none' : 'block', [bp]: 'block' }}
        gridArea="search"
        position="relative"
      >
        <Form.Input
          width="100%"
          value={searchQueryValue || ''}
          onChange={handleChangeSearchQueryValue}
          placeholder="Search"
          pl="calc(8px + 1.3rem + 8px)"
        />
        <SVG.Search
          css={css`
            position: absolute;
            top: 50%;
            left: 8px;
            transform: translateY(-50%);
            height: 1.3rem;
          `}
          color={colors.africanElephant}
        />
      </Box>

      <Box
        display={{ _: hideSearchBarInMobile ? 'none' : 'flex', [bp]: 'flex' }}
        gridArea="searchActions"
        placeSelf={{ _: 'center end', [bp]: 'center start' }}
        alignItems="center"
        justifyContent="flex-start"
        mx={-1}
        px={1}
      >
        <Popover
          anchorPoint={{
            _: PopoverAnchorPoint.TopRight,
            md: PopoverAnchorPoint.Top,
          }}
          icon={<SVG.Options />}
          popoverContents={
            <Box py={2}>
              <Text.Body3 px={2} color="africanElephant">
                Sort by
              </Text.Body3>
              {allContactsSortOptions.map((option) => (
                <Box
                  key={option}
                  cursor="pointer"
                  onClick={() => onSelectedContactSortOptionChange(option)}
                  display="flex"
                  justifyContent="flex-start"
                  alignItems="center"
                  py={1}
                  px={2}
                  css={css({
                    '&:hover': {
                      backgroundColor: colors.hoverBlue,
                    },
                  })}
                >
                  {option === selectedContactSortOption ? (
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

      <Box
        display={{ _: 'none', [bp]: 'block' }}
        gridArea="userPageLink"
        placeSelf="stretch start"
      >
        {selectedContact && (
          <InternalLink
            asButton
            to={`/${selectedContact.username}`}
            buttonStyle="secondary"
            overrideStyles={{
              display: 'flex',
              height: '100%',
              padding: '0px 16px',
            }}
          >
            <Box display="flex" flexDirection="row" alignItems="center">
              <Text.Body2 mr={3} color="linkBlue">
                nomus.me/{selectedContact.username}
              </Text.Body2>
              <Box>
                <Icon color="linkBlue" size={0.8} icon="external" />
              </Box>
            </Box>
          </InternalLink>
        )}
      </Box>

      <Box
        gridArea="viewMode"
        display={{ _: hideSearchBarInMobile ? 'none' : 'block', [bp]: 'block' }}
        width={{ _: '100%', [bp]: undefined }}
        justifySelf="end"
      >
        <SegmentedController
          tabs={[
            {
              id: 'glance',
              title: 'Glance',
              Icon: SVG.Grid,
              actionType: TabActionType.InternalLink,
              onClick: () =>
                onSelectedContactSortOptionChange(
                  ContactsSortOption.MeetingDateNewest,
                ),
              linkTo: `/dashboard/contacts/glance${location.search}`,
            },
            {
              id: 'detail',
              title: 'Detail',
              Icon: SVG.List,
              actionType: TabActionType.InternalLink,
              onClick: () =>
                onSelectedContactSortOptionChange(
                  ContactsSortOption.Alphabetical,
                ),
              linkTo: `/dashboard/contacts/detail${location.search}`,
            },
          ]}
          selectedTabId={selectedViewMode}
          unselectedBg={colors.white}
          unselectedColor={colors.nomusBlue}
          selectedBg={colors.nomusBlue}
          selectedColor={colors.white}
        />
      </Box>
    </Box>
  )
}

export default ContactCardsList
