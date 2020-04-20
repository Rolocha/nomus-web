import * as React from 'react'
import { SVGProps } from './types'

const Squiggle = ({ color }: SVGProps) => (
  <svg
    width="227"
    height="32"
    viewBox="0 0 227 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M6.48721 16.5213C4.35952 12.6188 8.9943 7.82261 13.4357 8.03859C17.8696 8.25457 21.5 11.4942 24.7139 14.5701C27.9277 17.6459 31.4986 20.9228 35.9251 21.2505C45.4179 21.9506 50.8412 9.34191 60.1628 7.42789C66.9699 6.02776 73.4274 10.742 78.5085 15.4861C83.5897 20.2376 89.0279 25.6371 95.9615 26.0542C102.166 26.4265 107.842 22.6134 112.38 18.3534C124.432 7.02573 135.472 22.5389 148.834 17.0278C159.137 12.7752 165.669 2.75085 178.22 8.53758C186.433 12.3209 188.322 17.8023 197.86 17.2139C206.757 16.6628 215.521 11.956 221.048 5"
      stroke={color}
      strokeOpacity="0.75"
      strokeWidth="10"
      strokeMiterlimit="10"
      strokeLinecap="round"
    />
  </svg>
)

Squiggle.defaultProps = {
  color: 'white',
}

export default Squiggle
