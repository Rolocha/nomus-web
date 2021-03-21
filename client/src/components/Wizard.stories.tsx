import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import Box from 'src/components/Box'
import * as Form from 'src/components/Form'
import Wizard, { WizardStep } from 'src/components/Wizard'

export default {
  title: 'components/Wizard',
  component: Wizard,
  excludeStories: /.*Data$/,
}

type SampleWizardStep = 'start' | 'middle' | 'finish'

export const BasicWizard = () => {
  const [wizardStep, setWizardStep] = React.useState<SampleWizardStep>('start')

  const handleStepTransition = (goingToStep: string) => {
    setWizardStep(goingToStep as SampleWizardStep)
  }

  return (
    <Box bg="offWhite" p={5}>
      <BrowserRouter>
        <Wizard
          currentStep={wizardStep}
          handleStepTransition={handleStepTransition}
        >
          <WizardStep id="start" icon="cards" label="Start">
            Start here
          </WizardStep>
          <WizardStep id="middle" icon="formatText" label="Middle">
            Now you're in the middle
          </WizardStep>
          <WizardStep id="finish" icon="cart" label="Finish">
            Last step!
          </WizardStep>
        </Wizard>
      </BrowserRouter>
    </Box>
  )
}

export const WizardWithDisabledSteps = () => {
  const [wizardStep, setWizardStep] = React.useState<SampleWizardStep>('start')

  const [checkedBox, setCheckedBox] = React.useState(false)

  const handleStepTransition = (goingToStep: string) => {
    setWizardStep(goingToStep as SampleWizardStep)
  }

  return (
    <Box bg="offWhite" p={5}>
      <BrowserRouter>
        <Wizard
          currentStep={wizardStep}
          handleStepTransition={handleStepTransition}
        >
          <WizardStep id="start" icon="cards" label="Start">
            Check this box before moving on
            <Box>
              <Form.Input
                type="checkbox"
                checked={checkedBox}
                onChange={(evt: React.ChangeEvent<HTMLInputElement>) =>
                  setCheckedBox(evt.target.checked)
                }
              />{' '}
              Check me!
            </Box>
          </WizardStep>
          <WizardStep
            id="middle"
            icon="contacts"
            label="Restricted"
            accessCondition={checkedBox}
          >
            Nice, you checked the box. Welcome to the party.
          </WizardStep>
        </Wizard>
      </BrowserRouter>
    </Box>
  )
}
export const WizardWithAsyncNextStep = () => {
  const [wizardStep, setWizardStep] = React.useState<'start' | 'finish'>(
    'start',
  )

  const handleStepTransition = async (_goingToStep: string): Promise<void> => {
    const goingToStep = _goingToStep as 'start' | 'finish'
    switch (goingToStep) {
      case 'finish':
        return new Promise((res) => {
          setTimeout(() => {
            setWizardStep(goingToStep)
            res()
          }, 5000)
        })
      default:
        setWizardStep(goingToStep)
    }
  }

  return (
    <Box bg="offWhite" p={5}>
      <BrowserRouter>
        <Wizard
          currentStep={wizardStep}
          handleStepTransition={handleStepTransition}
        >
          <WizardStep id="start" icon="cards" label="Start">
            Hit submit, but it may take a second due to slow Internet and
            whatnot...
          </WizardStep>
          <WizardStep id="finish" icon="contacts" label="Restricted">
            Sorry that took so long.
          </WizardStep>
        </Wizard>
      </BrowserRouter>
    </Box>
  )
}
