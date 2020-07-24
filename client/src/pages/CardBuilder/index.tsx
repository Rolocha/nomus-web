import * as React from 'react'
import Box from 'src/components/Box'
import Navbar from 'src/components/Navbar'
import * as SVG from 'src/components/SVG'
import * as Text from 'src/components/Text'
import MultiWorkspace from 'src/components/MultiWorkspace'
import breakpoints, { mq } from 'src/styles/breakpoints'
import theme from 'src/styles/theme'

const bp = 'md'
interface Props {}

const CardBuilder = ({}: Props) => {
  return (
    <Box
      bg={theme.colors.ivory}
      minHeight={{ [bp]: '100vh' }}
      minWidth={{ _: '0', [bp]: `calc(1.1 * ${breakpoints.lg})` }}
      position="relative"
      display="flex"
      flexDirection="column"
      alignItems="stretch"
    >
      <Navbar />
      <Box
        pb={{ [bp]: 4 }}
        px={{ _: 0, [bp]: 5 }}
        maxWidth={{ [bp]: `calc(1.5 * ${breakpoints.lg})` }}
      >
        <Box
          overflow="auto"
          mt={4}
          mb="24px"
          display={{ _: 'none', [bp]: 'block' }}
        >
          <Text.PageHeader>Card Builder</Text.PageHeader>
        </Box>
        <MultiWorkspace
          wizard
          children={[
            {
              path: 'step-1-base',
              label: 'Base',
              Icon: SVG.Profile,
              content: <Box />,
            },
            {
              path: 'step-2-build',
              label: 'Build',
              Icon: SVG.Profile,
              content: <Box />,
            },
            {
              path: 'step-3-review',
              label: 'Review',
              Icon: SVG.Profile,
              content: <Box />,
            },
          ]}
        />
      </Box>
    </Box>
  )
}

export default CardBuilder
