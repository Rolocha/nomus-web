import * as React from 'react'
import Box from 'src/components/Box'
import Link from 'src/components/Link'
import PricingTiers from 'src/components/PricingTiers'
import * as Text from 'src/components/Text'
import { createMailtoURL } from 'src/utils/email'
import { CardQuantityOption } from 'src/utils/pricing'

interface Props {
  quantity: CardQuantityOption | null
  onChange: (newQuantity: CardQuantityOption) => void
}

const OrderQuantitySelector = ({ quantity, onChange }: Props) => {
  return (
    <Box>
      <PricingTiers
        isSelectable
        selectedQuantity={quantity}
        onChangeSelectedQuantity={onChange}
      />
      <Box display="flex" justifyContent="flex-end">
        <Link
          to={createMailtoURL({
            to: 'hi@nomus.me',
            subject: 'Large Card Order',
            body: `I'd like to put in a large order!\n(Put Details of your order here)`.trim(),
          })}
        >
          <Text.Body2 color="inherit">
            Need more than 100? Let us know.
          </Text.Body2>
        </Link>
      </Box>
    </Box>
  )
}

export default OrderQuantitySelector
