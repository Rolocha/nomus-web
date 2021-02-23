import { css } from '@emotion/react'
import * as React from 'react'
import {
  Redirect,
  Route,
  Switch,
  useHistory,
  useLocation,
  useRouteMatch,
} from 'react-router-dom'
import Box from 'src/components/Box'
import Button from 'src/components/Button'
import { InternalLink } from 'src/components/Link'
import Spinner from 'src/components/Spinner'
import * as Text from 'src/components/Text'
import { colors } from 'src/styles'
import { mq } from 'src/styles/breakpoints'
import Icon, { IconName } from './Icon'

export interface WizardStepProps {
  onTransitionToPreviousStep?: () => Promise<void>
  onTransitionToNextStep?: () => Promise<void>
  ref?: React.RefObject<any>
}

export interface WizardTabItem {
  icon: IconName
  label: React.ReactNode
  content: React.ReactElement<WizardStepProps>
  key: string
  linkPath?: string
  matchPath?: string
  accessCondition?: boolean | (() => boolean)
}

interface Props {
  steps: Array<WizardTabItem>
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
  const history = useHistory()

  const [
    processingNextTransition,
    setProcessingNextTransition,
  ] = React.useState(false)
  const [
    processingPreviousTransition,
    setProcessingPreviousTransition,
  ] = React.useState(false)

  const stepComponents = React.useRef<StepComponentsRecord>({})

  if (Object.keys(stepComponents.current).length !== steps.length) {
    // add refs
    stepComponents.current = steps.reduce<StepComponentsRecord>((acc, tab) => {
      acc[tab.key] = React.createRef()
      return acc
    }, {})
  }

  const isStepDisabled = React.useCallback(
    (index: number) => {
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
    },
    [steps],
  )

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
        {steps.map(({ linkPath, key, icon, label }, index) => {
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
                of={icon}
                color="white"
                boxSize="1.5em"
                mb={{ _: '0.5em', [bp]: 0 }}
                mr={{ _: 0, [bp]: '0.7em' }}
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
        <Switch>
          {steps.map(({ matchPath, key, content }, index) => (
            <Route key={key} path={`${routeMatch.path}/${matchPath ?? key}`}>
              {
                // If the step trying to be accessed is disabled (not enough user-provided state to render it yet)
                // redirect to the root route, which will redirect to step 1
                isStepDisabled(index) ? (
                  (() => {
                    console.log({ index, steps })
                    return true
                  })() && <Redirect to={routeMatch.url} />
                ) : (
                  <Box overflowY="hidden" height="100%">
                    <Box overflowY="hidden" height="100%">
                      {React.cloneElement(content, {
                        ref: stepComponents.current[key],
                      })}
                    </Box>
                    {/* Previous step button */}
                    {!isStepDisabled(index - 1) && (
                      <Button
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
                        size="big"
                        variant="primary"
                        disabled={processingPreviousTransition}
                        onClick={async () => {
                          setProcessingPreviousTransition(true)
                          try {
                            const previousStepAction =
                              stepComponents.current[key].current
                                ?.onTransitionToPreviousStep
                            if (previousStepAction != null) {
                              await previousStepAction()
                            }
                            const previousStepPath =
                              steps[index - 1].linkPath ||
                              (steps[index - 1].key as string)
                            if (previousStepPath != null) {
                              history.push(previousStepPath)
                            }
                          } finally {
                            setProcessingPreviousTransition(false)
                          }
                        }}
                      >
                        <Box
                          display="flex"
                          flexDirection="row"
                          alignItems="center"
                        >
                          {processingPreviousTransition ? (
                            <Spinner size="1em" />
                          ) : (
                            <Icon
                              of="arrowRightO"
                              transform="rotate(180deg)"
                              color="white"
                            />
                          )}
                          <Text.Plain ml={2}>{`Previous step: ${
                            steps[index - 1].label
                          }`}</Text.Plain>
                        </Box>
                      </Button>
                    )}
                    {/* Next step (or submit) button */}
                    {(!isStepDisabled(index + 1) || // Next step exists
                      (index === steps.length - 1 && exitPath != null)) && ( // or this is the last step and an exit path is provided
                      <Button
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
                        size="big"
                        variant={
                          index === steps.length - 1 ? 'success' : 'primary'
                        }
                        disabled={processingNextTransition}
                        onClick={async () => {
                          setProcessingNextTransition(true)
                          try {
                            const nextStepAction =
                              stepComponents.current[key].current
                                ?.onTransitionToNextStep
                            if (nextStepAction != null) {
                              await nextStepAction()
                            }

                            const nextStepPath =
                              index === steps.length - 1
                                ? exitPath ?? '/'
                                : steps[index + 1].linkPath ||
                                  (steps[index + 1].key as string)
                            if (nextStepPath != null) {
                              history.push(nextStepPath)
                            }
                          } finally {
                            setProcessingNextTransition(false)
                          }
                        }}
                      >
                        <Box
                          display="flex"
                          flexDirection="row"
                          alignItems="center"
                        >
                          <Text.Plain mr={2}>
                            {index === steps.length - 1
                              ? exitText
                              : `Next step: ${steps[index + 1].label}`}
                          </Text.Plain>
                          {processingNextTransition ? (
                            <Spinner size="1em" />
                          ) : (
                            <Icon of="arrowRightO" color="white" />
                          )}
                        </Box>
                      </Button>
                    )}
                  </Box>
                )
              }
            </Route>
          ))}
          {/* If user lands on a route that doesn't match any, redirect to the first one */}
          <Route>
            <Redirect
              to={`${routeMatch.url}/${steps[0].linkPath ?? steps[0].key}`}
            />
            {() => {
              console.log('redirecting')
              return null
            }}
          </Route>
        </Switch>
      </Box>
    </Box>
  )
}

Wizard.defaultProps = {
  disableNextStep: () => false,
  exitText: 'Submit',
}

export default Wizard
