import * as React from 'react'
import Box from 'src/components/Box'
import Button from 'src/components/Button'
import * as Text from 'src/components/Text'
import { ComplexCondition } from 'src/pages/CardBuilder/types'
import { colors } from 'src/styles'
import { mq, useBreakpoint } from 'src/styles/breakpoints'
import Icon from '../Icon'
import { WizardStepProps } from './WizardStep'

type WizardStepElement<V extends string> =
  | React.ReactElement<WizardStepProps<V>>
  | null
  | false

interface Props<ValidStepType extends string> {
  // allStepDetails: Array<WizardStep>
  children: Array<WizardStepElement<ValidStepType>>
  currentStep: ValidStepType
  completionButtonLabel?: string
  handleStepTransition: (goingToStep: string) => void | Promise<void>
  handleSubmit?: () => Promise<void>
}

const bp = 'lg'

const POINTY_TAB_INDICATOR = {
  [mq[bp]]: {
    '&:after': {
      content: '""',
      display: 'block',
      width: '1rem',
      height: '1rem',
      position: 'absolute',
      top: '50%',
      left: '100%',
      transform: 'translate(-50%, -50%) rotate(45deg)',
      backgroundColor: `${colors.nomusBlue}`,
    },
  },
}

// Method for properly handling complex conditions that are booleans or return booleans
const checkComplexCondition = (complexCondition: ComplexCondition): boolean => {
  if (complexCondition == null) {
    return true
  } else if (typeof complexCondition === 'boolean') {
    return complexCondition
  } else {
    return complexCondition()
  }
}

function Wizard<ValidStepType extends string>({
  completionButtonLabel,
  children,
  currentStep,
  handleStepTransition,
  handleSubmit,
}: Props<ValidStepType>): JSX.Element | null {
  const [
    processingNextTransition,
    setProcessingNextTransition,
  ] = React.useState(false)
  const [
    processingPreviousTransition,
    setProcessingPreviousTransition,
  ] = React.useState(false)
  const isDesktop = useBreakpoint('lg')

  const allStepDetails =
    React.Children.map(children, (child) => {
      if (!React.isValidElement(child)) return
      return child.props as WizardStepProps<ValidStepType>
    })?.filter(Boolean) || []

  const isReadyToMoveForwardFromStepAtIndex = (atIndex: number): boolean => {
    if (atIndex < -1 || atIndex >= allStepDetails.length) {
      // Check for invalid index
      return false
    } else if (atIndex === -1) {
      // Always allowed to be at first step
      return true
    } else {
      const isAllowedToBeAtThisStep = isReadyToMoveForwardFromStepAtIndex(
        atIndex - 1,
      )
      const hasMetExitConditionsForThisStep = checkComplexCondition(
        allStepDetails[atIndex].isReadyForNextStep ?? null,
      )
      return isAllowedToBeAtThisStep && hasMetExitConditionsForThisStep
    }
  }

  const currentStepIndex = allStepDetails.findIndex(
    (step) => step.id === currentStep,
  )
  const isFirstStep = currentStepIndex === 0
  const isLastStep = currentStepIndex === allStepDetails.length - 1

  if (currentStepIndex === -1) {
    return null
  }
  const currentStepDetails = allStepDetails[currentStepIndex]

  if (currentStepDetails == null) {
    return null
  }

  const handleTransitionToStepAtIndex = (stepIndex: number) => async () => {
    if (stepIndex === currentStepIndex) return

    const setProcessingTransition =
      stepIndex < currentStepIndex
        ? setProcessingPreviousTransition
        : setProcessingNextTransition

    setProcessingTransition(true)
    try {
      if (stepIndex >= 0 && stepIndex < allStepDetails.length) {
        await handleStepTransition(allStepDetails[stepIndex].id)
      } else if (stepIndex === allStepDetails.length && handleSubmit) {
        await handleSubmit()
      }
    } finally {
      setProcessingTransition(false)
    }
  }

  return (
    <Box
      display="flex"
      flexDirection={{ base: 'column', [bp]: 'row' }}
      alignItems={{ [bp]: 'flex-start' }}
      pb={{ base: 0, [bp]: '8rem' }}
    >
      {/* Menu for selecting dashboard section */}
      <Box
        display="flex"
        flexDirection={{ base: 'row', [bp]: 'column' }}
        flexShrink={0}
        minWidth={{ [bp]: 200 }}
        // bg={colors.twilight}
        borderTopLeftRadius={{ base: 'none', [bp]: 'xl' }}
        borderBottomLeftRadius={{ base: 'none', [bp]: 'xl' }}
        // Needed to ensure the current-tab caret indicator is visible
        overflow="visible"
        // Need these 2 to make pointy indicator show up
        position="relative"
        zIndex={20}
      >
        {allStepDetails.map((stepDetails, index) => {
          const { id, icon, label } = stepDetails

          const isCurrentSection = currentStep === id
          const isStepAccessible =
            isReadyToMoveForwardFromStepAtIndex(index - 1) &&
            !processingPreviousTransition &&
            !processingNextTransition

          return (
            <Box
              cursor={!isStepAccessible ? 'not-allowed' : 'pointer'}
              key={id}
              borderTopLeftRadius={{
                base: 'none',
                [bp]: index === 0 ? 'xl' : 'none',
              }}
              borderBottomLeftRadius={{
                base: 'none',
                [bp]: index === allStepDetails.length - 1 ? 'xl' : 'none',
              }}
              bg={
                isStepAccessible && isCurrentSection
                  ? colors.nomusBlue
                  : colors.secondaryBlue
              }
              flexBasis={{
                base: `${100 / allStepDetails.length}%`,
                [bp]: 'auto',
              }}
              position="relative"
              sx={isCurrentSection ? POINTY_TAB_INDICATOR : undefined}
              role="button"
              onClick={() => {
                if (isStepAccessible) {
                  handleTransitionToStepAtIndex(index)()
                }
              }}
            >
              <Box
                py={{ base: '0.75em', [bp]: '24px' }}
                px={3}
                display="flex"
                flexDirection={{ base: 'column', [bp]: 'row' }}
                alignItems="center"
                textAlign="center"
              >
                <Icon
                  of={icon}
                  color={isStepAccessible ? colors.white : colors.disabledBlue}
                  mb={{ base: '0.5em', [bp]: 0 }}
                  mr={{ base: 0, [bp]: '8px' }}
                />
                <Text.Plain
                  m={0}
                  color={isStepAccessible ? colors.white : colors.disabledBlue}
                  fontSize={{ base: 10, [bp]: 'unset' }}
                  fontWeight={isCurrentSection ? 500 : 'undefined'}
                >
                  {`Step ${index + 1}`} {isDesktop ? ' / ' : <br />} {label}
                </Text.Plain>
              </Box>
            </Box>
          )
        })}
      </Box>

      <Box
        flexGrow={1}
        boxShadow={{ [bp]: '0px 0px 4px rgba(0, 0, 0, 0.25)' }}
        bg="white"
        borderTopRightRadius={{ [bp]: 'xl' }}
        borderBottomRightRadius={{ [bp]: 'xl' }}
        borderBottomLeftRadius={{ [bp]: 'xl' }}
        position="relative"
        zIndex={10}
        height="100%"
        // Make the content take up at least the remaining space after the navbar (60px) and steps bar (icon + margin + 2 lines of text + padding)
        // minus a liiiitle bit so on iOS it doesn't
        minHeight={{
          base: `calc(100vh - 60px - calc(24px + 0.5em + 30px + 1.5em) - 100px)`,
          [bp]: '400px',
        }}
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
      >
        {/* <Box height="100%"> */}
        {/* Content for selected section */}
        <Box
          overflow="visible"
          height="100%"
          p={{ base: '24px', [bp]: '48px' }}
        >
          {currentStepDetails.children}
        </Box>

        {/* Previous/next buttons */}
        <Box
          position="relative"
          p={{ base: '24px', [bp]: 0 }}
          bg={{ base: colors.white, [bp]: undefined }}
          display="grid"
          gridTemplateColumns="3fr 6fr 3fr"
          gridTemplateAreas={`"previousButton . nextButton"`}
          borderBottomRightRadius="inherit"
        >
          {/* Previous step button */}
          {!isFirstStep && (
            <Button
              gridArea="previousButton"
              width="100%"
              px={{ base: 2, [bp]: 4 }}
              py={{ base: 1, [bp]: 3 }}
              transform={{
                base: undefined,
                [bp]: 'translate(-16px, 16px)',
              }}
              size={isDesktop ? 'big' : 'normal'}
              variant="primary"
              isLoading={processingPreviousTransition}
              disabled={processingPreviousTransition}
              leftIcon={
                <Icon
                  of="arrowRight"
                  transform="rotate(180deg)"
                  color="white"
                />
              }
              onClick={handleTransitionToStepAtIndex(currentStepIndex - 1)}
            >
              {`${isDesktop ? 'Previous step: ' : ''}${
                allStepDetails[currentStepIndex - 1].label
              }`}
            </Button>
          )}
          {/* Next step (or submit) button */}
          {isReadyToMoveForwardFromStepAtIndex(currentStepIndex) &&
            (!isLastStep || completionButtonLabel) && (
              <Button
                gridArea="nextButton"
                width="100%"
                px={{ base: 2, [bp]: 4 }}
                py={{ base: 1, [bp]: 3 }}
                transform={{
                  base: undefined,
                  [bp]: 'translate(16px, 16px)',
                }}
                size={isDesktop ? 'big' : 'normal'}
                variant={isLastStep ? 'success' : 'primary'}
                disabled={processingNextTransition}
                isLoading={processingNextTransition}
                rightIcon={<Icon of="arrowRight" color="white" />}
                onClick={handleTransitionToStepAtIndex(currentStepIndex + 1)}
              >
                {isLastStep
                  ? completionButtonLabel || ''
                  : `${isDesktop ? 'Next step: ' : ''}${
                      allStepDetails[currentStepIndex + 1].label
                    }`}
              </Button>
            )}
        </Box>
      </Box>
    </Box>
  )
}

Wizard.defaultProps = {
  disableNextStep: () => false,
  exitText: 'Submit',
}

export default Wizard
