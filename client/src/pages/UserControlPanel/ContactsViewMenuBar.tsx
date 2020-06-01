import { css } from '@emotion/core'
import * as React from 'react'
import { useHistory } from 'react-router-dom'
import Box from 'src/components/Box'
import * as Form from 'src/components/Form'
import * as SVG from 'src/components/SVG'
import TabSelector, { TabActionType } from 'src/components/TabSelector'
import { colors } from 'src/styles'
import { Contact } from 'src/types/contact'

interface Props {
  contact?: Contact
  searchQueryValue?: string | null
  onChangeSearchQueryValue: (newValue: string) => void
}

const ContactCardsList = ({
  contact,
  searchQueryValue,
  onChangeSearchQueryValue,
}: Props) => {
  const history = useHistory()
  const handleChangeSearchQueryValue = (event: React.SyntheticEvent<any>) => {
    // @ts-ignore
    onChangeSearchQueryValue(event.target.value)
  }
  return (
    <Box
      display="grid"
      gridTemplateColumns={{
        _: '10fr 2fr',
        lg: '3fr 1fr 5fr 3fr',
      }}
      gridTemplateAreas={{
        _: `
        "viewMode viewMode"
        "search searchActions"
      `,
        lg: `
        "search searchActions userPageLink viewMode"
    `,
      }}
      gridColumnGap={2}
      gridRowGap={{ _: 3, lg: 0 }}
    >
      <Box gridArea="search" position="relative">
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
          color={colors.textOlive}
        />
      </Box>

      <Box
        gridArea="searchActions"
        placeSelf={{ _: 'center end', lg: 'center start' }}
        display="flex"
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
        gridArea="viewMode"
        width={{ _: '100%', lg: undefined }}
        css={css`
          place-self: end;
        `}
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
          selectedTabId={history.location.pathname.split('/').reverse()[0]}
          unselectedBg={colors.white}
          unselectedColor={colors.primaryTeal}
          selectedBg={colors.primaryTeal}
          selectedColor={colors.white}
        />
      </Box>
    </Box>
  )
}

export default ContactCardsList
