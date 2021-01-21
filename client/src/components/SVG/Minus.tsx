import * as React from 'react'
import { colors } from 'src/styles'
import { SVGProps } from './types'

const Minus = ({ color, className }: SVGProps) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M4 12C4 11.4477 4.44772 11 5 11H19C19.5523 11 20 11.4477 20 12C20 12.5523 19.5523 13 19 13H5C4.44772 13 4 12.5523 4 12Z"
      fill={color}
    />
  </svg>
)

Minus.defaultProps = {
  color: colors.midnightGray,
}

export default Minus
