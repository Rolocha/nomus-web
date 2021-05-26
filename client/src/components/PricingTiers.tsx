import Box from 'src/components/Box'
import Card from 'src/components/Card'
import * as SVG from 'src/components/SVG'
import { colors } from 'src/styles'
import { formatDollarAmount } from 'src/utils/money'
import { QUANTITY_TO_PRICE } from 'src/utils/pricing'

const bp = 'lg'

interface Props {
  isSelectable?: boolean
  selectedQuantity?: 25 | 100 | 250 | null
  onChangeSelectedQuantity?: (quantity: 25 | 100 | 250) => void
}

const PricingTiers = ({
  isSelectable,
  selectedQuantity,
  onChangeSelectedQuantity,
}: Props) => {
  return (
    <Box
      display="grid"
      gridTemplateColumns={{ base: undefined, [bp]: 'repeat(3, 4fr)' }}
      gridTemplateRows={{ base: 'repeat(3, 4fr)', [bp]: 'unset' }}
      gridGap="16px"
    >
      {([
        {
          quantity: 25,
          icon: <SVG.Smile1 />,
          description:
            'Just enough to get you started in the NFC business cards game.',
          topBarColor: colors.cyanProcess,
        },
        {
          quantity: 100,
          icon: <SVG.Smile2 />,
          description:
            'You’ll be perfectly stocked for your next event or conference.',
          topBarColor: colors.gold,
        },
        {
          quantity: 250,
          icon: <SVG.Smile3 />,
          description: 'Somebody’s popular! Or planning ahead. Or both.',
          topBarColor: colors.brightCoral,
        },
      ] as const).map(({ quantity, description, icon, topBarColor }) => {
        const price = QUANTITY_TO_PRICE[quantity]
        const isSelected = isSelectable && quantity === selectedQuantity
        const card = (
          <Card
            key={quantity}
            topBarColor={
              isSelectable
                ? isSelected
                  ? colors.gold
                  : colors.disabledBlue
                : topBarColor
            }
            align="mix"
            size="small"
            icon={icon}
            header={`${quantity} cards`}
            subheader={`${formatDollarAmount(price)} (${formatDollarAmount(
              Math.round(price / quantity),
            )}/card)`}
            bodyText={description}
            boxShadow="workingWindow"
          />
        )

        return isSelectable && onChangeSelectedQuantity ? (
          <Box
            transition="0.3s ease transform"
            transform={`scale(${isSelected ? 1.02 : 1})`}
            key={quantity}
            role="button"
            cursor="pointer"
            onClick={() => {
              onChangeSelectedQuantity(quantity)
            }}
          >
            {card}
          </Box>
        ) : (
          card
        )
      })}
    </Box>
  )
}

export default PricingTiers
