import * as React from 'react'
import { Redirect, useParams } from 'react-router-dom'
import Box from 'src/components/Box'
import Button from 'src/components/Button'
import Footer from 'src/components/Footer'
import Icon from 'src/components/Icon'
import Link from 'src/components/Link'
import Navbar from 'src/components/Navbar'
import * as Text from 'src/components/Text'
import { products } from 'src/data/products'
import { useBreakpoint } from 'src/styles/breakpoints'

interface UrlParams {
  productId?: string
}

const bp = 'md'

const ShopProductDetailPage = () => {
  const params = useParams<UrlParams>()
  const isMd = useBreakpoint('md')

  const selectedProduct = products.find(
    (product) => product.id === params.productId,
  )

  if (!selectedProduct) {
    return <Redirect to="/shop" />
  }

  return (
    <Box position="relative" zIndex={0}>
      <Navbar />
      <Box container mb={{ base: '48px', [bp]: '96px' }}>
        <Link
          to="/shop"
          width="auto"
          display="block"
          mt="32px"
          mr="auto" // Pushes the button to hug the left edge
        >
          <Button
            variant="tertiary"
            leftIcon={<Icon of="arrowRight" transform="rotate(180deg)" />}
          >
            Back to Shop
          </Button>
        </Link>

        <Box
          display="grid"
          gridTemplateColumns={{
            base: '1fr',
            md: '1fr 1fr',
            lg: '1fr 5fr 5fr 1fr',
          }}
          gridTemplateAreas={{
            base: `
            "preview"
            "details"
          `,
            md: `"preview details"`,
            lg: `". preview details ."`,
          }}
          gridColumnGap="40px"
        >
          <Box gridArea="preview" placeSelf="center">
            {selectedProduct.preview}
          </Box>
          <Box gridArea="details" mt={{ base: '16px', [bp]: 0 }}>
            <Text.H3 mb="8px">{selectedProduct.name}</Text.H3>
            <Text.Body>{selectedProduct.price}</Text.Body>

            <Link
              my="32px"
              width="100%"
              buttonStyle="primary"
              buttonSize={isMd ? 'big' : 'normal'}
              to={selectedProduct.cta.url}
            >
              {selectedProduct.cta.text}
            </Link>

            <Box>
              {selectedProduct.description.map((line, index, arr) => (
                <Text.Body mb={index < arr.length - 1 ? '8px' : undefined}>
                  {line}
                </Text.Body>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
      <Footer colorScheme="ivory" />
    </Box>
  )
}

export default ShopProductDetailPage
