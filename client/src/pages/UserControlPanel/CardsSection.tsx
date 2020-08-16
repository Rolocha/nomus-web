import { css } from '@emotion/core'
import * as React from 'react'
import { gql, useQuery } from 'src/apollo'
import {
  UCPCardsSectionQuery,
  UCPCardsSectionQuery_cardVersionsStats,
} from 'src/apollo/types/UCPCardsSectionQuery'
import Box from 'src/components/Box'
import Button from 'src/components/Button'
import BusinessCardImage from 'src/components/BusinessCardImage'
import * as Text from 'src/components/Text'
import LoadingPage from 'src/pages/LoadingPage'
import { getMonthAbbreviation } from 'src/utils/date'

const bp = 'md'

const formatDate = (date: Date) => {
  const dateObject = new Date(date)
  return `${getMonthAbbreviation(
    dateObject.getMonth(),
  )} ${dateObject.getDate()}, ${dateObject.getFullYear()}`
}

export default () => {
  const { loading, data } = useQuery<UCPCardsSectionQuery>(
    gql`
      query UCPCardsSectionQuery {
        user {
          id
          defaultCardVersion
        }

        cardVersions {
          id
          createdAt
          frontImageUrl
          backImageUrl
        }

        cardVersionsStats {
          id
          numCardsOrdered
          numTaps
        }
      }
    `,
  )

  if (loading || !data) {
    return <LoadingPage />
  }

  const defaultCardVersion = data.cardVersions.find(
    (version) => version.id === data.user.defaultCardVersion,
  )
  const defaultCardVersionStats = data.cardVersionsStats.find(
    (version) => version.id === data.user.defaultCardVersion,
  )

  const nonDefaultCardVersions = data.cardVersions.filter(
    (version) => version.id !== data.user.defaultCardVersion,
  )
  const cardVersionStatsById = data.cardVersionsStats.reduce<
    Record<string, UCPCardsSectionQuery_cardVersionsStats>
  >((acc, cvs) => {
    acc[cvs.id] = cvs
    return acc
  }, {})

  return (
    <Box p={{ _: '24px', md: '48px' }} overflowY="scroll" height="100%">
      {defaultCardVersion && defaultCardVersionStats && (
        <Box>
          <Text.SectionHeader mb={2}>Active card</Text.SectionHeader>
          <Box
            display="flex"
            flexDirection={{ _: 'column', [bp]: 'row' }}
            my={{ _: -2, [bp]: 0 }}
            mx={{ _: 0, [bp]: -3 }}
          >
            <Box
              px={{ _: 0, [bp]: 3 }}
              py={{ _: 2, [bp]: 0 }}
              display="flex"
              flexDirection="column"
            >
              <Box display="inline-block">
                <BusinessCardImage
                  frontImageUrl={defaultCardVersion?.frontImageUrl || ''}
                  backImageUrl={defaultCardVersion?.backImageUrl || ''}
                  width={{ _: '100%', [bp]: '300px' }}
                />
                <Box
                  display="flex"
                  flexDirection="row"
                  justifyContent="stretch"
                  mt={3}
                  mx={-1}
                  css={css`
                    & > * {
                      flex-grow: 1;
                      > * {
                        width: 100%;
                      }
                    }
                  `}
                >
                  <Box px={1}>
                    <Button variant="primary">Reorder card</Button>
                  </Box>
                  <Box px={1}>
                    <Button variant="secondary">Modify card</Button>
                  </Box>
                </Box>
              </Box>
            </Box>

            <Box
              px={{ _: 0, [bp]: 3 }}
              py={{ _: 2, [bp]: 0 }}
              // Not worth using grid for the parent Box so we fake it here to mimic 4fr / 12fr
              width="calc(100% * (4/12))"
            >
              <Text.SectionSubheader mb={2}>
                Version information
              </Text.SectionSubheader>
              <Box
                display="grid"
                gridTemplateColumns="1fr 1fr"
                gridRowGap={{ _: 1, [bp]: 2 }}
              >
                <Text.Body2>Date created</Text.Body2>
                <Text.Body2>
                  {formatDate(defaultCardVersion.createdAt)}
                </Text.Body2>

                <Text.Body2>Cards ordered</Text.Body2>
                <Text.Body2>
                  {defaultCardVersionStats.numCardsOrdered}
                </Text.Body2>

                <Text.Body2>Tap count</Text.Body2>
                <Text.Body2>{defaultCardVersionStats.numTaps}</Text.Body2>
              </Box>
            </Box>
          </Box>
        </Box>
      )}

      {nonDefaultCardVersions.length > 0 && (
        <Box mt={4}>
          <Text.SectionHeader mb={2}>Other card versions</Text.SectionHeader>
          <Box
            overflowX="auto"
            overflowY="auto"
            display="flex"
            flexDirection="row"
            my={0}
            mx={-2}
          >
            {nonDefaultCardVersions.map((cv) => {
              const formattedCreationDate = formatDate(cv.createdAt)
              return (
                <Box
                  display="inline-block"
                  css={css({ flexShrink: 0 })}
                  py={2}
                  px={2}
                >
                  <BusinessCardImage
                    frontImageUrl={cv.frontImageUrl || ''}
                    backImageUrl={cv.backImageUrl || ''}
                    width={{ _: '60vw', [bp]: '300px' }}
                  />
                  <Text.Body3>
                    {[
                      `Created ${formattedCreationDate}`,
                      `${cardVersionStatsById[cv.id].numCardsOrdered} cards`,
                      `${cardVersionStatsById[cv.id].numTaps} taps`,
                    ].join(' / ')}
                  </Text.Body3>
                  <Box
                    mt={2}
                    display="flex"
                    flexDirection="row"
                    justifyContent="stretch"
                    mx={-1}
                  >
                    <Box px={1}>
                      <Button variant="primary">Reorder card</Button>
                    </Box>
                    <Box px={1}>
                      <Button variant="secondary">Modify card</Button>
                    </Box>
                    <Box px={1}>
                      <Button variant="secondary">Make active</Button>
                    </Box>
                  </Box>
                </Box>
              )
            })}
          </Box>
        </Box>
      )}
    </Box>
  )
}
