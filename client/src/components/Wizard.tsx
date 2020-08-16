import { css } from '@emotion/core'
import * as React from 'react'
import { Redirect, Route, useLocation, useRouteMatch } from 'react-router-dom'
import Box from 'src/components/Box'
import { InternalLink } from 'src/components/Link'
import * as SVG from 'src/components/SVG'
import * as Text from 'src/components/Text'
import { colors } from 'src/styles'
import { mq } from 'src/styles/breakpoints'

export interface WizardStepProps {
  onClickPreviousStep?: () => void
  onClickNextStep?: () => void
  readyForNextStep?: () => boolean
  ref?: React.RefObject<any>
}

interface TabItem {
  Icon: (...args: any) => JSX.Element
  label: React.ReactNode
  content: React.ReactElement<WizardStepProps>
  key: string
  linkPath?: string
  matchPath?: string
  accessCondition?: boolean | (() => boolean)
}

interface Props {
  steps: Array<TabItem>
  exitText: string
  exitPath?: string
}

const bp = 'md'
const POINTY_TAB_INDICATOR = css`
  ${mq[bp]} {
    &:after {
      content: ' ';
      display: block;
      width: 1rem;
      height: 1rem;
      position: absolute;
      top: 50%;
      left: 100%;
      transform: translate(-50%, -50%) rotate(45deg);
      background-color: ${colors.nomusBlue};
    }
  }
`

type StepComponentsRecord = Record<string, React.RefObject<WizardStepProps>>

const Wizard = ({ steps, exitPath, exitText }: Props) => {
  const routeMatch = useRouteMatch()
  const location = useLocation()

  const stepComponents = React.useRef<StepComponentsRecord>({})

  if (Object.keys(stepComponents.current).length !== steps.length) {
    // add refs
    stepComponents.current = steps.reduce<StepComponentsRecord>((acc, tab) => {
      acc[tab.key] = React.createRef()
      return acc
    }, {})
  }

  const isStepDisabled = (index: number) => {
    // Recursively verify that we're allowed to be at this step by checking the last step
    if (index > 0 && isStepDisabled(index - 1)) {
      return true
    }

    const step = steps[index]
    if (step == null) {
      return true
    }

    if (step.accessCondition == null) {
      return false
    }
    if (typeof step.accessCondition === 'boolean') {
      return !step.accessCondition
    }
    if (typeof step.accessCondition === 'function') {
      return !step.accessCondition()
    }
  }

  return (
    <Box
      display="flex"
      flexDirection={{ _: 'column', [bp]: 'row' }}
      alignItems={{ [bp]: 'flex-start' }}
      pb={2}
    >
      {/* Menu for selecting dashboard section */}
      <Box
        display="flex"
        flexDirection={{ _: 'row', [bp]: 'column' }}
        flexShrink={0}
        minWidth={{ [bp]: 200 }}
        bg={colors.twilight}
        borderTopLeftRadius={{ _: 0, [bp]: 3 }}
        borderBottomLeftRadius={{ _: 0, [bp]: 3 }}
        // Needed to ensure the current-tab caret indicator is visible
        overflow="visible"
      >
        {steps.map(({ linkPath, key, Icon, label }, index) => {
          const sectionPath = `${routeMatch.url}/${linkPath ?? key}`
          const isCurrentSection = location.pathname.startsWith(sectionPath)
          const stepDisabled = isStepDisabled(index)
          const tabElement = (
            <Box
              py="24px"
              px={3}
              display="flex"
              flexDirection={{ _: 'column', [bp]: 'row' }}
              alignItems="center"
            >
              <Icon
                color="white"
                css={css`
                  height: 1.5em;
                  // Margin below in mobile; on right in desktop
                  margin-bottom: 0.5em;
                  ${mq[bp]} {
                    margin-bottom: 0;
                    margin-right: 0.7em;
                  }
                `}
              />
              <Text.Plain
                m={0}
                color="white"
                fontSize={{ _: 10, [bp]: 'unset' }}
                fontWeight={isCurrentSection ? 500 : 'undefined'}
              >
                {`Step ${index + 1} / ${label}`}
              </Text.Plain>
            </Box>
          )
          return (
            <Box
              cursor={stepDisabled ? 'not-allowed' : 'pointer'}
              key={key}
              borderTopLeftRadius={{ _: 0, [bp]: index === 0 ? 3 : 0 }}
              borderBottomLeftRadius={{
                _: 0,
                [bp]: index === steps.length - 1 ? 3 : 0,
              }}
              bg={
                stepDisabled
                  ? colors.disabledBlue
                  : isCurrentSection
                  ? colors.nomusBlue
                  : undefined
              }
              flexBasis={{
                _: `${100 / steps.length}%`,
                [bp]: 'auto',
              }}
              position="relative"
              css={isCurrentSection ? POINTY_TAB_INDICATOR : null}
            >
              {stepDisabled ? (
                tabElement
              ) : (
                <InternalLink to={sectionPath}>{tabElement}</InternalLink>
              )}
            </Box>
          )
        })}
      </Box>

      {/* Content for selected section */}
      <Box
        flexGrow={1}
        boxShadow={{ [bp]: '0px 0px 4px rgba(0, 0, 0, 0.25)' }}
        bg="white"
        borderTopRightRadius={{ [bp]: 3 }}
        borderBottomRightRadius={{ [bp]: 3 }}
        borderBottomLeftRadius={{ [bp]: 3 }}
        position="relative"
        height="100%"
      >
        {steps.map(({ matchPath, key, content }, index) => (
          <Route key={key} path={`${routeMatch.path}/${matchPath ?? key}`}>
            {({ match }) => (
              <Box
                overflowY="hidden"
                height="100%"
                // Rather than mounting/unmounting the different pages, we simply adjust the
                // display block so that their inner state doesn't get lost. Not the most performant
                // but it'll do fine for now
                display={(() => {
                  // debugger
                  return match?.path.endsWith(matchPath ?? key)
                    ? 'block'
                    : 'none'
                })()}
              >
                <Box overflowY="hidden" height="100%">
                  {React.cloneElement(content, {
                    ref: stepComponents.current[key],
                  })}
                </Box>
                {/* Previous step button */}
                {!isStepDisabled(index - 1) && (
                  <InternalLink
                    px={{ _: 2, [bp]: 4 }}
                    py={{ _: 1, [bp]: 3 }}
                    css={css`
                      position: absolute;
                      bottom: 0;
                      left: 0;
                      transform: translate(5%, 110%);
                      ${mq[bp]} {
                        transform: translate(-10%, 30%);
                      }
                    `}
                    to={
                      steps[index - 1].linkPath ||
                      (steps[index - 1].key as string)
                    }
                    asButton
                    buttonSize="big"
                    buttonStyle="primary"
                    onClick={
                      stepComponents.current[key].current?.onClickPreviousStep
                    }
                  >
                    <Box display="flex" flexDirection="row" alignItems="center">
                      <SVG.ArrowRightO
                        css={css({ transform: 'rotate(180deg)' })}
                        color="white"
                      />
                      <Text.Plain ml={2}>{`Previous step: ${
                        steps[index - 1].label
                      }`}</Text.Plain>
                    </Box>
                  </InternalLink>
                )}
                {/* Next step (or submit) button */}
                {(!isStepDisabled(index + 1) ||
                  (index === steps.length - 1 && exitPath != null)) && (
                  <InternalLink
                    px={{ _: 2, [bp]: 4 }}
                    css={css`
                      position: absolute;
                      bottom: 0;
                      right: 0;
                      transform: translate(-5%, 110%);
                      ${mq[bp]} {
                        transform: translate(10%, 30%);
                      }
                    `}
                    to={
                      index === steps.length - 1
                        ? exitPath ?? '/'
                        : steps[index + 1].linkPath ||
                          (steps[index + 1].key as string)
                    }
                    asButton
                    buttonSize="big"
                    buttonStyle={
                      index === steps.length - 1 ? 'success' : 'primary'
                    }
                    onClick={
                      stepComponents.current[key].current?.onClickNextStep
                    }
                  >
                    <Box display="flex" flexDirection="row" alignItems="center">
                      <Text.Plain mr={2}>
                        {index === steps.length - 1
                          ? exitText
                          : `Next step: ${steps[index + 1].label}`}
                      </Text.Plain>
                      <SVG.ArrowRightO color="white" />
                    </Box>
                  </InternalLink>
                )}
              </Box>
            )}
          </Route>
        ))}
        {/* If user lands on a route that doesn't match any, redirect to the first one */}
        <Route exact path={`${routeMatch.path}`}>
          <Redirect
            to={`${routeMatch.path}/${steps[0].linkPath ?? steps[0].key}`}
          />
        </Route>
      </Box>
    </Box>
  )
}

Wizard.defaultProps = {
  disableNextStep: () => false,
  exitText: 'Submit',
}

export default Wizard
