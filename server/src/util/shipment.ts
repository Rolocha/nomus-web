import shippoConstructor from 'shippo'
import { SHIPPO_TOKEN } from 'src/config'
import { Address } from 'src/models/subschemas'

const shippo = shippoConstructor(SHIPPO_TOKEN)

/* eslint-disable camelcase */
const ADDRESS_FROM = {
  name: 'Nomus, Inc.',
  street1: '99 Rausch St',
  city: 'San Francisco',
  state: 'CA',
  zip: '94103',
  country: 'US',
}

const CARDS_PARCEL = {
  length: 14.5,
  width: 9.5,
  height: 1,
  distance_unit: 'in',
  weight: 1,
  mass_unit: 'lb',
}

// Query for the object ID for each carrier account by doing a GET
// request to https://api.goshippo.com/v1/carrier_accounts
enum CarrierAccount {
  USPS = '541352e1310b4038a06223a79a139761',
  UPS = 'd5dd2890e915430298bce60af70974b4',
}

interface ShippoTransactionInput {
  destinationName: string
  destinationAddress: Address
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
  metadata,
}: ShippoTransactionInput): Promise<ShippoTransaction> => {
  const payload = {
    shipment: {
      address_from: ADDRESS_FROM,
      address_to: {
        name: destinationName,
        street1: destinationAddress.line1,
        street2: destinationAddress.line2,
        city: destinationAddress.city,
        state: destinationAddress.state,
        zip: destinationAddress.postalCode,
        country: 'US',
      },
      parcels: [CARDS_PARCEL],
    },
    carrier_account: CarrierAccount.USPS,
    servicelevel_token: 'usps_priority',
    label_file_type: 'PDF',
    metadata: typeof metadata === 'string' ? metadata : JSON.stringify(metadata),
    async: false,
  }

  // See https://goshippo.com/docs/reference/js#transactions for object shape details
  const transaction = shippo.transaction.create(payload)
  return {
    id: transaction.object_id,
    trackingNumber: transaction.tracking_number,
    labelUrl: transaction.label_url,
  }
}
