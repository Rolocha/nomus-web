import * as React from 'react'

import { SVGProps } from './types'
import { colors } from 'styles'

const LoginSquiggle = ({ color, className }: SVGProps) => (
  <svg
    width="333"
    height="419"
    className={className}
    viewBox="0 0 333 419"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      opacity="0.1"
      d="M351.179 15.4722C353.502 50.9356 344.618 87.466 323.962 116.464C303.306 145.463 270.596 166.301 235.092 170.162C220.432 171.762 204.768 170.287 192.619 161.971C180.471 153.654 173.251 137.178 178.995 123.683C184.144 111.6 198.207 105.041 211.391 105.386C276.153 107.206 302.741 172.515 282.117 227.719C273.359 251.225 260.174 273.068 253.551 297.265C248.151 316.942 247.272 337.844 251.008 357.898C252.86 367.815 255.905 377.732 261.932 385.829C267.959 393.926 277.377 399.952 287.454 399.983C305.692 400.046 319.222 379.458 316.083 361.507C312.944 343.556 297.405 329.778 280.265 323.533C263.125 317.288 244.478 317.225 226.24 317.193C200.844 317.193 175.479 317.193 150.084 317.193C130.244 317.193 110.216 317.162 90.8475 312.894C43.603 302.537 20.4674 264.689 15.8842 218.273C15.2564 211.776 15.0366 204.997 17.3596 198.878C21.1266 188.929 30.9522 182.401 41.0603 178.949C126.508 149.574 160.443 253.077 167.066 316.378C169.641 341.108 170.488 366.936 161.165 390.003C151.842 413.07 129.993 432.748 105.005 432.497"
      stroke={color}
      strokeWidth="25"
      strokeMiterlimit="10"
      strokeLinecap="round"
    />
  </svg>
)

LoginSquiggle.defaultProps = {
  color: colors.primaryGold,
}

export default LoginSquiggle
