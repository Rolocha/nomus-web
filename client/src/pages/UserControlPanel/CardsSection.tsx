import { css } from '@emotion/core'
import * as React from 'react'
import { gql, useQuery } from 'src/apollo'
import {
  UCPCardsSectionQuery,
  UCPCardsSectionQuery_cardVersionsStats,
} from 'src/apollo/types/UCPCardsSectionQuery'
import Box from 'src/components/Box'
import Button from 'src/components/Button'
import FlippableCard from 'src/components/FlippableCard'
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
    <Box>
      {defaultCardVersion && defaultCardVersionStats && (
        <Box>
          <Text.SectionHeader mb={2}>Active Card</Text.SectionHeader>
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
                <FlippableCard
                  frontImageUrl={defaultCardVersion?.frontImageUrl || ''}
                  backImageUrl={defaultCardVersion?.backImageUrl || ''}
                  width={{ _: '100%', [bp]: '300px' }}
                />
                <Box
                  display="flex"
                  flexDirection="row"
                  justifyContent="stretch"
                  mx={-1}
                  css={css`
                    & > ${Box} {
                      flex-grow: 1;
                      > ${Button} {
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

            <Box px={{ _: 0, [bp]: 3 }} py={{ _: 2, [bp]: 0 }}>
              <Text.SectionSubheader>Version Information</Text.SectionSubheader>
              <Text.Body>
                Date created: {formatDate(defaultCardVersion.createdAt)}
              </Text.Body>
              <Text.Body>
                Cards ordered: {defaultCardVersionStats.numCardsOrdered}
              </Text.Body>
              <Text.Body>
                Tap count: {defaultCardVersionStats.numTaps}
              </Text.Body>
            </Box>
          </Box>
        </Box>
      )}

      {nonDefaultCardVersions.length > 0 && (
        <Box mt={4}>
          <Text.SectionHeader mb={2}>Other Card Versions</Text.SectionHeader>
          <Box
            overflowX="auto"
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
                  <FlippableCard
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
                </Box>
              )
            })}
          </Box>
        </Box>
      )}
    </Box>
  )
}
