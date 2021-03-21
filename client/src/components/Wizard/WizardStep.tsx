import Box from 'src/components/Box'
import { IconName } from '../Icon'

export interface WizardStepProps<ValidStepType extends string> {
  id: ValidStepType
  icon: IconName
  label: React.ReactNode
  accessCondition?: boolean | (() => boolean)
  children: React.ReactNode
}

//   Renders the content but ignores the rest of the props
export function WizardStep<ValidStepType extends string>(
  props: WizardStepProps<ValidStepType>,
) {
  return <Box>{props.children}</Box>
}
