import * as Text from 'src/components/Text'
import {
  CardBuilderStep,
  CardBuilderSubmissionError,
} from 'src/pages/CardBuilder/types'
import { colors } from 'src/styles'

interface Props {
  submissionError: CardBuilderSubmissionError
  goToStep: (step: CardBuilderStep) => void
}

const SubmissionError = ({ submissionError, goToStep }: Props) => {
  return (
    <Text.Body2 mt="24px" color={colors.invalidRed}>
      {submissionError.message}
      {submissionError.backlinkToStep && (
        <Text.Body2
          as="span"
          role="button"
          cursor="pointer"
          color={colors.linkBlue}
          onClick={() => {
            if (submissionError?.backlinkToStep) {
              goToStep(submissionError?.backlinkToStep)
            }
          }}
        >
          {` Return to the ${submissionError.backlinkToStep} step.`}
        </Text.Body2>
      )}
    </Text.Body2>
  )
}

export default SubmissionError
