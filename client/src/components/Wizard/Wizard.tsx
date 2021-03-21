import * as React from 'react'
import Box from 'src/components/Box'
import Button from 'src/components/Button'
import * as Text from 'src/components/Text'
import { colors } from 'src/styles'
import { mq } from 'src/styles/breakpoints'
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
  exitText?: string
  exitPath?: string
  handleStepTransition: (goingToStep: string) => void | Promise<void>
}

const bp = 'md'

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

function Wizard<ValidStepType extends string>({
  exitText,
  children,
  currentStep,
  handleStepTransition,
}: Props<ValidStepType>): JSX.Element | null {
  const [
    processingNextTransition,
    setProcessingNextTransition,
  ] = React.useState(false)
  const [
    processingPreviousTransition,
    setProcessingPreviousTransition,
  ] = React.useState(false)

  const allStepDetails =
    React.Children.map(children, (child) => {
      if (!React.isValidElement(child)) return
      return child.props as WizardStepProps<ValidStepType>
    })?.filter(Boolean) || []

  const isStepAtIndexAccessible = React.useCallback(
    (atIndex: number) => {
      // Short circuit to false if either
      if (
        // a. the requested index is out of range
        atIndex < 0 ||
        atIndex >= allStepDetails.length ||
        // b. the previous step exists but isn't accessible
        (atIndex > 0 && !isStepAtIndexAccessible(atIndex - 1))
      ) {
        return false
      }

      const step = allStepDetails[atIndex]
      if (step == null) {
        return false
      } else if (step.accessCondition == null) {
        return true
      } else if (typeof step.accessCondition === 'boolean') {
        return step.accessCondition
      } else if (typeof step.accessCondition === 'function') {
        return step.accessCondition()
      }
    },
    [allStepDetails],
  )

  const currentStepIndex = allStepDetails.findIndex(
    (step) => step.id === currentStep,
  )
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
      pb={2}
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
          const isStepAccessible = isStepAtIndexAccessible(index)
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
                isStepAccessible
                  ? isCurrentSection
                    ? colors.nomusBlue
                    : colors.secondaryBlue
                  : colors.disabledBlue
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
                  handleStepTransition(id)
                }
              }}
            >
              <Box
                py="24px"
                px={3}
                display="flex"
                flexDirection={{ base: 'column', [bp]: 'row' }}
                alignItems="center"
              >
                <Icon
                  of={icon}
                  color="white"
                  mb={{ base: '0.5em', md: 0 }}
                  mr={{ base: 0, md: '24px' }}
                />
                <Text.Plain
                  m={0}
                  color="white"
                  fontSize={{ base: 10, [bp]: 'unset' }}
                  fontWeight={isCurrentSection ? 500 : 'undefined'}
                >
                  {`Step ${index + 1} / ${label}`}
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
        minHeight="400px"
      >
        <Box overflowY="hidden" height="100%">
          {/* Content for selected section */}
          <Box
            overflowY="hidden"
            height="100%"
            p={{ base: '24px', md: '48px' }}
          >
            {currentStepDetails.children}
          </Box>

          {/* Previous step button */}
          {isStepAtIndexAccessible(currentStepIndex - 1) && (
            <Button
              px={{ base: 2, [bp]: 4 }}
              py={{ base: 1, [bp]: 3 }}
              position="absolute"
              bottom="0"
              left="0"
              transform={{
                base: 'translate(5%, 110%)',
                [bp]: 'translate(-10%, 30%)',
              }}
              size="big"
              variant="primary"
              isLoading={processingPreviousTransition}
              disabled={processingPreviousTransition}
              leftIcon={
                <Icon
                  of="arrowRightO"
                  transform="rotate(180deg)"
                  color="white"
                />
              }
              onClick={handleTransitionToStepAtIndex(currentStepIndex - 1)}
            >
              {`Previous step: ${allStepDetails[currentStepIndex - 1].label}`}
            </Button>
          )}
          {/* Next step (or submit) button */}
          {currentStepIndex < allStepDetails.length - 1 &&
            isStepAtIndexAccessible(currentStepIndex + 1) && (
              <Button
                px={{ base: 2, [bp]: 4 }}
                py={{ base: 1, [bp]: 3 }}
                position="absolute"
                bottom="0"
                right="0"
                transform={{
                  base: 'translate(-5%, 110%)',
                  [bp]: 'translate(10%, 30%)',
                }}
                size="big"
                variant={isLastStep ? 'success' : 'primary'}
                disabled={processingNextTransition}
                isLoading={processingNextTransition}
                rightIcon={<Icon of="arrowRightO" color="white" />}
                onClick={handleTransitionToStepAtIndex(currentStepIndex + 1)}
              >
                {isLastStep
                  ? exitText || ''
                  : `Next step: ${allStepDetails[currentStepIndex + 1].label}`}
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
