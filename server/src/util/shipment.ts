import shippoConstructor from 'shippo'
import { SHIPPO_TOKEN } from 'src/config'
import { Address } from 'src/models/subschemas'
import { CardQuantityOption } from 'src/util/pricing'

const shippo = shippoConstructor(SHIPPO_TOKEN)

/* eslint-disable camelcase */
const RETURN_ADDRESS = {
  name: 'Nomus, Inc.',
  street1: '99 Rausch St',
  city: 'San Francisco',
  state: 'CA',
  zip: '94103',
  country: 'US',
}

const FROM_ADDRESS = {
  name: 'Nomus, Inc.',
  street1: '2780 Loker Ave W W',
  city: 'Carlsbad',
  state: 'CA',
  zip: '92010',
  country: 'US',
}

const buildParcelObject = ({ cardQuantity }: { cardQuantity: CardQuantityOption }) => ({
  length: 9,
  width: 7,
  height: 4,
  distance_unit: 'in',
  weight: {
    25: 4,
    50: 6,
    100: 8,
  }[cardQuantity],
  mass_unit: 'oz',
})

// Query for the object ID for each carrier account by doing a GET
// request to https://api.goshippo.com/v1/carrier_accounts
enum CarrierAccount {
  USPS = '541352e1310b4038a06223a79a139761',
  UPS = 'd5dd2890e915430298bce60af70974b4',
}

interface ShippoTransactionInput {
  destinationName: string
  destinationAddress: Address
  cardQuantity: CardQuantityOption
  metadata?: any
}

interface ShippoTransaction {
  id: string
  trackingNumber: string
  labelUrl: string
}

export const createShippoTransaction = async ({
  destinationName,
  destinationAddress,
  cardQuantity,
  metadata,
}: ShippoTransactionInput): Promise<ShippoTransaction> => {
  const payload = {
    shipment: {
      address_from: FROM_ADDRESS,
      address_return: RETURN_ADDRESS,
      address_to: {
        name: destinationName,
        street1: destinationAddress.line1,
        street2: destinationAddress.line2,
        city: destinationAddress.city,
        state: destinationAddress.state,
        zip: destinationAddress.postalCode,
        country: 'US',
      },
      parcels: [buildParcelObject({ cardQuantity })],
    },
    carrier_account: CarrierAccount.USPS,
    // We could update this line if we want to offer faster but more expensive shipping options
    servicelevel_token: 'usps_first',
    label_file_type: 'PDF',
    metadata: typeof metadata === 'string' ? metadata : JSON.stringify(metadata),
    async: false,
  }

  // See https://goshippo.com/docs/reference/js#transactions for object shape details
  const transaction = await shippo.transaction.create(payload)
  return {
    id: transaction.object_id,
    trackingNumber: transaction.tracking_number,
    labelUrl: transaction.label_url,
  }
}
