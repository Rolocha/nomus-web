import { css } from '@emotion/core'
import 'css.gg/icons/css/external.css'
import * as React from 'react'
import Box from 'src/components/Box'
import * as Form from 'src/components/Form'
import Icon from 'src/components/Icon'
import { InternalLink } from 'src/components/Link'
import * as SVG from 'src/components/SVG'
import TabSelector, { TabActionType } from 'src/components/TabSelector'
import * as Text from 'src/components/Text'
import { colors } from 'src/styles'

interface Props {
  selectedViewMode?: string
  selectedContactUsernameOrId?: string
  searchQueryValue?: string | null
  onChangeSearchQueryValue: (newValue: string) => void
}

const bp = 'md'

const ContactCardsList = ({
  selectedViewMode,
  selectedContactUsernameOrId,
  searchQueryValue,
  onChangeSearchQueryValue,
}: Props) => {
  const handleChangeSearchQueryValue = (event: React.SyntheticEvent<any>) => {
    // @ts-ignore
    onChangeSearchQueryValue(event.target.value)
  }

  const hideSearchBarInMobile =
    selectedViewMode === 'detail' && selectedContactUsernameOrId != null

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
        <Box
          bg="white"
          borderRadius="50%"
          mx={1}
          p={1}
          role="button"
          onClick={() => {}}
          boxShadow={0}
          display="flex"
          alignItems="center"
          justifyContent="center"
          css={css`
            cursor: pointer;
            svg {
              width: 1.5rem;
              height: 1.5rem;
            }
          `}
        >
          <SVG.Options />
        </Box>
      </Box>

      <Box
        display={{ _: 'none', [bp]: 'block' }}
        gridArea="userPageLink"
        placeSelf="stretch start"
      >
        {selectedContactUsernameOrId && (
          <InternalLink
            asButton
            to={`/u/${selectedContactUsernameOrId}`}
            buttonStyle="secondary"
            overrideStyles={{
              display: 'flex',
              height: '100%',
              padding: '0px 16px',
            }}
          >
            <Box display="flex" flexDirection="row" alignItems="center">
              <Text.Body mr={3} color="inherit">
                nomus.me/u/{selectedContactUsernameOrId}
              </Text.Body>
              <Box>
                <Icon color="inherit" size={0.8} icon="external" />
              </Box>
            </Box>
          </InternalLink>
        )}
      </Box>

      <Box
        gridArea="viewMode"
        width={{ _: '100%', [bp]: undefined }}
        justifySelf="end"
      >
        <TabSelector
          tabs={[
            {
              id: 'glance',
              title: 'Glance',
              Icon: SVG.Grid,
              actionType: TabActionType.InternalLink,
              linkTo: '/dashboard/contacts/glance',
            },
            {
              id: 'detail',
              title: 'Detail',
              Icon: SVG.List,
              actionType: TabActionType.InternalLink,
              linkTo: '/dashboard/contacts/detail',
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
