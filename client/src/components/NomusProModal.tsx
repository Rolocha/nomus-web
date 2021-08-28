import { useMutation } from 'src/apollo'
import { CreateNomusProCheckoutSession } from 'src/apollo/types/CreateNomusProCheckoutSession'
import { NomusProFeature } from 'src/apollo/types/globalTypes'
import Box from 'src/components/Box'
import Modal from 'src/components/Modal'
import * as Text from 'src/components/Text'
import { CREATE_NOMUS_PRO_CHECKOUT_SESSION } from 'src/pages/UserControlPanel/mutations'

interface Props {
  isOpen: boolean
  onCancel: () => void
  triggerFeature?: NomusProFeature
}

const NomusProModal = ({ isOpen, onCancel, triggerFeature }: Props) => {
  const [
    createNomusProCheckoutSession,
    createNomusProCheckoutSessionResult,
  ] = useMutation<CreateNomusProCheckoutSession>(
    CREATE_NOMUS_PRO_CHECKOUT_SESSION,
  )

  const redirectToNomusProCheckout = async () => {
    const result = await createNomusProCheckoutSession({
      variables: {
        triggerFeature: triggerFeature ?? null,
      },
    })
    const checkoutUrl = result.data?.createNomusProCheckoutSession?.url
    if (!checkoutUrl) {
      throw new Error('Empty checkout session URL: ' + result.errors)
    }
    window.location.replace(checkoutUrl)
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onCancel}
      maxWidth={{ base: undefined, lg: '40vw' }}
      header={{
        title: 'Subscribe to Nomus Pro',
      }}
      actions={{
        primary: {
          text: 'Continue to checkout',
          handler: redirectToNomusProCheckout,
          isLoading:
            createNomusProCheckoutSessionResult.called &&
            createNomusProCheckoutSessionResult.loading,
          loadingText: 'Just a sec...',
        },
        secondary: {
          text: 'Maybe later',
          close: true,
        },
      }}
    >
      <Box>
        <Box>
          <Text.Body2>
            Sending your contacts to a custom website when they tap your card is
            a Nomus Pro feature. Subscribe today for just $5/month.
          </Text.Body2>
        </Box>
      </Box>
    </Modal>
  )
}

export default NomusProModal
