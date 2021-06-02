import CostSummary from 'src/pages/CardBuilder/CostSummary'
import Box from 'src/components/Box'

export default {
  title: 'components/CardBuilder/CostSummary',
  component: CostSummary,
  excludeStories: /.*Data$/,
}

const CostSummaryTemplate = ({ ...options }) => {
  return (
    <Box maxWidth="1200px" border="1px solid #eee" p={4}>
      <CostSummary quantity={options.quantity} state={options.state} />
    </Box>
  )
}

export const CostSummaryComponent = CostSummaryTemplate.bind({})
