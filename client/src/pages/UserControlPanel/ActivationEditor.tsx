import { useMutation } from 'src/apollo'
import { UpdateProfileMutation } from 'src/apollo/types/UpdateProfileMutation'
import { UPDATE_PROFILE_MUTATION } from './mutations'
import Box from 'src/components/Box'
import * as React from 'react'
import Button from 'src/components/Button'
import * as Text from 'src/components/Text'
import Modal from 'src/components/Modal'

interface Props {
  activatedValue: boolean
  pageSizeBp: string
}

export default ({ activatedValue, pageSizeBp }: Props) => {
  const [isConfirming, setIsConfirming] = React.useState(false)
  const [updateProfile] = useMutation<UpdateProfileMutation>(
    UPDATE_PROFILE_MUTATION,
  )

  const onActivationChange = (activationStatus: boolean) => {
    updateProfile({
      variables: {
        updatedUser: { activated: activationStatus },
      },
    })
  }

  return (
    <Box>
      {activatedValue ? (
        <Box>
          <Button
            width={{ base: '100%', [pageSizeBp]: '85%' }}
            variant="danger"
            onClick={() => setIsConfirming(true)}
            key={0}
          >
            <Text.Plain fontSize="14px" color="invalidRed">
              Deactivate
            </Text.Plain>
          </Button>
          <Modal
            isOpen={isConfirming}
            onClose={() => setIsConfirming(false)}
            width="calc(min(95%, 800px))"
            key={1}
            actions={{
              primary: {
                text: 'Cancel',
                handler: () => setIsConfirming(false),
              },
              secondary: {
                text: 'Deactivate',
                handler: () => {
                  onActivationChange(false)
                  setIsConfirming(false)
                },
              },
            }}
          >
            <Box>
              <Text.PageHeader mb={3}>Are you sure?</Text.PageHeader>
              <Text.Body>
                Upon deactivating your account, you will no longer have a public
                profile tied to any physical business cards you’ve printed, but
                those who already have your contact wlil still have access to
                your profile. <br />
                <br />
                You will be able to Reactivate at any time in the future.
              </Text.Body>
            </Box>
          </Modal>
        </Box>
      ) : (
        <Button
          width={{ base: '100%', [pageSizeBp]: '85%' }}
          variant="success"
          onClick={async () => {
            await onActivationChange(true)
          }}
        >
          <Text.Plain fontSize="14px" color="validGreen">
            Activate
          </Text.Plain>
        </Button>
      )}
    </Box>
  )
}
