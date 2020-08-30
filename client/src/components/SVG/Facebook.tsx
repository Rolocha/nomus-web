import * as React from 'react'
import { SVGProps } from './types'
import { colors } from 'src/styles'

const Facebook = ({ color, className }: SVGProps) => (
  <svg
    className={className}
    width="17"
    height="17"
    viewBox="0 0 17 17"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M17 2.81865C17 1.32124 15.6788 0 14.1814 0H2.81865C1.32124 0 0 1.32124 0 2.81865V14.1813C0 15.6787 1.32124 17 2.81865 17H8.54404V10.5699H6.43006V7.7513H8.54404V6.60622C8.54404 4.66839 9.95337 2.99481 11.715 2.99481H14.0052V5.81346H11.715C11.4508 5.81346 11.1865 6.07772 11.1865 6.60622V7.7513H14.0052V10.5699H11.1865V17H14.1814C15.6788 17 17 15.6787 17 14.1813V2.81865Z"
      fill={color}
    />
  </svg>
)

Facebook.defaultProps = {
  color: colors.white,
}

export default Facebook
