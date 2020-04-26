import * as React from 'react'
import { css } from '@emotion/core'

import Box from 'components/Box'
import { InternalLink } from 'components/Link'
import Logo from 'components/Logo'
import * as SVG from 'components/SVG'

interface Props {}

const buttonStyles = css`
  padding: 
  display: flex;
  align-items: center;
  justify-content: space-between;
  svg {
    height: 1em;
    margin-right: 5px;
  }
`

const Navbar = (props: Props) => (
  <Box
    p={35}
    width="100%"
    display="flex"
    flexDirection="row"
    alignItems="center"
    justifyContent="space-between"
  >
    <Logo />
    <Box
      display="flex"
      css={css`
        & > *:not(:last-child) {
          margin-right: 10px;
        }
      `}
    >
      <InternalLink
        to="/shop"
        asButton
        buttonStyle="primary"
        css={buttonStyles}
      >
        <SVG.Cart color="white" />
        Shop
      </InternalLink>
      <InternalLink to="/login" asButton buttonStyle="blue" css={buttonStyles}>
        <SVG.Profile color="white" />
        Sign in
      </InternalLink>
    </Box>
  </Box>
)

export default Navbar
