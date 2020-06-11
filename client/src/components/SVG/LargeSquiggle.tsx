import * as React from 'react'
import { colors } from 'src/styles'
import { SVGProps } from './types'

const LargeSquiggle = ({ color, className }: SVGProps) => (
  <svg
    className={className}
    width="529"
    height="623"
    viewBox="0 0 529 623"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M11 75.2205C19.2278 50.3648 38.2222 29.2736 62.1063 18.4965C127.526 -11.0298 175.086 40.9566 179.23 104.277C182.393 152.693 163.788 199.526 146.849 244.997C129.91 290.467 114.099 339.011 122.992 386.709C131.885 434.408 174.327 479.342 222.565 473.718C235.649 472.195 249.452 465.974 254.556 453.841C261.125 438.219 249.418 419.47 233.587 413.411C217.749 407.351 199.809 411.069 184.079 417.403C148.743 431.636 118.223 460.284 107.201 496.722C94.6145 538.34 111.547 589.548 153.015 607.821C190.144 624.181 231.794 597.42 267.438 587.663C311.331 575.644 357.232 570.92 402.65 573.819C441.888 576.322 484.498 583.697 518 563.136"
      stroke={color}
      strokeOpacity="0.7"
      strokeWidth="20"
      strokeMiterlimit="10"
      strokeLinecap="round"
    />
  </svg>
)

LargeSquiggle.defaultProps = {
  color: colors.gold,
}

export default LargeSquiggle
