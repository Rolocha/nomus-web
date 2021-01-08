import { css } from '@emotion/core'
import * as React from 'react'
import { gql, useQuery, useMutation } from 'src/apollo'
import {
  UCPCardsSectionQuery,
  UCPCardsSectionQuery_cardVersionsStats as UCPCardsSectionQueryCardVersionsStats,
} from 'src/apollo/types/UCPCardsSectionQuery'
import { UpdateUserCheckpoints } from 'src/apollo/types/UpdateUserCheckpoints'
import Box from 'src/components/Box'
import Button from 'src/components/Button'
import BusinessCardImage from 'src/components/BusinessCardImage'
import * as Text from 'src/components/Text'
import * as SVG from 'src/components/SVG'
import LoadingPage from 'src/pages/LoadingPage'
import { getMonthAbbreviation } from 'src/utils/date'
import {
  CHANGE_ACTIVE_CARD_VERSION,
  UPDATE_USER_CHECKPOINTS,
} from './mutations'
import { ChangeActiveCardVersion } from 'src/apollo/types/ChangeActiveCardVersion'
import Link from 'src/components/Link'
import cardsEmptyStateSvg from './cards_empty_state.svg'
import Image from 'src/components/Image'
import { colors } from 'src/styles'
import { createMailtoURL } from 'src/utils/email'

const bp = 'md'

const formatDate = (date: Date) => {
  const dateObject = new Date(date)
  return `${getMonthAbbreviation(
    dateObject.getMonth(),
  )} ${dateObject.getDate()}, ${dateObject.getFullYear()}`
}

const sendReorderEmail = (cardId: string) => {
  return createMailtoURL(
    'hi@nomus.me',
    "I'd like to reorder a card!",
    `Hi! I'd like to reorder a card please :) \ncardID: ${cardId}\n\nNumber of cards to order:`,
  )
}

const sendModifyEmail = (cardId: string) => {
  return createMailtoURL(
    'hi@nomus.me',
    "I'd like to modify a card!",
    `Hi! I'd like to modify a card please\ncardID: ${cardId}\n\nI'd like to change:`,
  )
}

export default () => {
  const { loading, data } = useQuery<UCPCardsSectionQuery>(
    gql`
      query UCPCardsSectionQuery {
        user {
          id
          defaultCardVersion {
            id
          }
          checkpoints {
            expressedInterestInOrderingNomusCard
          }
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

  const [changeActiveCardVersion] = useMutation<ChangeActiveCardVersion>(
    CHANGE_ACTIVE_CARD_VERSION,
  )
  const [updateUserCheckpoints] = useMutation<UpdateUserCheckpoints>(
    UPDATE_USER_CHECKPOINTS,
  )

  const createCardActivationHandler = React.useCallback(
    (cardVersionId: string) => async (_: any) =>
      await changeActiveCardVersion({
        variables: {
          cardVersionId,
        },
      }),
    [changeActiveCardVersion],
  )

  const handleNomusCardInterestClick = React.useCallback(() => {
    updateUserCheckpoints({
      variables: {
        checkpointsReached: ['expressedInterestInOrderingNomusCard'],
      },
    })
  }, [updateUserCheckpoints])

  if (loading || !data) {
    return <LoadingPage fullscreen />
  }

  const defaultCardVersion = data.cardVersions.find(
    (version) => version.id === data.user.defaultCardVersion?.id,
  )
  const defaultCardVersionStats = data.cardVersionsStats.find(
    (version) => version.id === data.user.defaultCardVersion?.id,
  )

  const nonDefaultCardVersions = data.cardVersions.filter(
    (version) => version.id !== data.user.defaultCardVersion?.id,
  )
  const cardVersionStatsById = data.cardVersionsStats.reduce<
    Record<string, UCPCardsSectionQueryCardVersionsStats>
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
                  <Box px={1} display="flex" justifyContent="stretch">
                    <Link
                      asButton
                      buttonStyle="primary"
                      to={sendReorderEmail(defaultCardVersion.id)}
                    >
                      Reorder card
                    </Link>
                  </Box>
                  <Box px={1} display="flex" justifyContent="stretch">
                    <Link
                      asButton
                      buttonStyle="secondary"
                      to={sendModifyEmail(defaultCardVersion.id)}
                    >
                      Modify card
                    </Link>
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
                  key={cv.id}
                  display="inline-block"
                  css={css({ flexShrink: 0 })}
                  py={2}
                  px={2}
                >
                  {cv.frontImageUrl || cv.backImageUrl ? (
                    <BusinessCardImage
                      frontImageUrl={cv.frontImageUrl}
                      backImageUrl={cv.backImageUrl}
                      width={{ _: '60vw', [bp]: '300px' }}
                    />
                  ) : (
                    <BusinessCardImage
                      placeholder
                      width={{ _: '60vw', [bp]: '300px' }}
                    />
                  )}
                  {cardVersionStatsById[cv.id] && (
                    <Text.Body3>
                      {[
                        `Created ${formattedCreationDate}`,
                        `${cardVersionStatsById[cv.id].numCardsOrdered} cards`,
                        `${cardVersionStatsById[cv.id].numTaps} taps`,
                      ].join(' / ')}
                    </Text.Body3>
                  )}
                  <Box
                    mt={2}
                    display="flex"
                    flexDirection="row"
                    justifyContent="stretch"
                    mx={-1}
                  >
                    <Box px={1} display="flex" justifyContent="stretch">
                      <Link
                        asButton
                        buttonStyle="primary"
                        to={sendReorderEmail(cv.id)}
                        css={css`
                          padding: 9.5px 6px;
                        `}
                      >
                        Reorder card
                      </Link>
                    </Box>
                    <Box px={1} display="flex" justifyContent="stretch">
                      <Link
                        asButton
                        buttonStyle="secondary"
                        to={sendModifyEmail(cv.id)}
                        css={css`
                          padding: 9.5px 6px;
                        `}
                      >
                        Modify card
                      </Link>
                    </Box>
                    <Box px={1}>
                      <Button
                        variant="secondary"
                        onClick={createCardActivationHandler(cv.id)}
                      >
                        Make active
                      </Button>
                    </Box>
                  </Box>
                </Box>
              )
            })}
          </Box>
        </Box>
      )}

      {defaultCardVersion == null && nonDefaultCardVersions.length === 0 && (
        <Box
          display="grid"
          gridTemplateColumns={{ _: '1fr 10fr 1fr', [bp]: '4fr 4fr 4fr' }}
          gridRowGap="16px"
          justifyItems="center"
          css={css({ textAlign: 'center', '&>*': { gridColumn: '2/3' } })}
        >
          <Text.SectionHeader>
            Normal business cards are cool...
          </Text.SectionHeader>
          <Image src={cardsEmptyStateSvg} />
          <Text.Body2>
            But Nomus cards are even cooler. Take your professional game to the
            next level. Reach out to request a Nomus card of your own.
          </Text.Body2>

          {data.user.checkpoints?.expressedInterestInOrderingNomusCard ? (
            <Box display="flex" flexDirection="column" alignItems="center">
              <SVG.Check
                color={colors.nomusBlue}
                css={css({ width: '50px', height: '50px' })}
              />{' '}
              <Text.Body3>
                Thanks for expressing interest. We'll reach out soon!
              </Text.Body3>
            </Box>
          ) : (
            <Button
              variant="primary"
              size="big"
              width="100%"
              onClick={handleNomusCardInterestClick}
            >
              I'm interested!
            </Button>
          )}
        </Box>
      )}
    </Box>
  )
}
