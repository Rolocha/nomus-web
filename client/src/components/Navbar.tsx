import * as React from 'react'
import { Link } from 'react-router-dom'
import { css } from '@emotion/core'

import Box from 'components/Box'
import Logo from 'components/Logo'
import * as SVG from 'components/SVG'

interface Props {}

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
      css={css`
        & > * {
          padding: 0 10px;
        }
      `}
    >
      <Link to="/cart">
        <SVG.Cart />
      </Link>
      <Link to="/login">
        <SVG.Profile />
      </Link>
    </Box>
  </Box>
)

export default Navbar
