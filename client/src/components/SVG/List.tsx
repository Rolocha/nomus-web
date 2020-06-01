import * as React from 'react'
import { colors } from 'src/styles'
import { SVGProps } from './types'

const List = ({ color, className }: SVGProps) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M17 8.5H11C10.724 8.5 10.5 8.276 10.5 8C10.5 7.724 10.724 7.5 11 7.5H17C17.276 7.5 17.5 7.724 17.5 8C17.5 8.276 17.276 8.5 17 8.5Z"
      fill={color}
    />
    <path
      d="M17 12.5H11C10.724 12.5 10.5 12.276 10.5 12C10.5 11.724 10.724 11.5 11 11.5H17C17.276 11.5 17.5 11.724 17.5 12C17.5 12.276 17.276 12.5 17 12.5Z"
      fill={color}
    />
    <path
      d="M17 16.5H11C10.724 16.5 10.5 16.276 10.5 16C10.5 15.724 10.724 15.5 11 15.5H17C17.276 15.5 17.5 15.724 17.5 16C17.5 16.276 17.276 16.5 17 16.5Z"
      fill={color}
    />
    <path d="M7.5 7.5H6.5V8.5H7.5V7.5Z" fill={color} />
    <path d="M7.5 11.5H6.5V12.5H7.5V11.5Z" fill={color} />
    <path d="M7.5 15.5H6.5V16.5H7.5V15.5Z" fill={color} />
    <path
      d="M21 3C21.551 3 22 3.449 22 4V20C22 20.551 21.551 21 21 21H3C2.449 21 2 20.551 2 20V4C2 3.449 2.449 3 3 3H21ZM21 2H3C1.895 2 1 2.895 1 4V20C1 21.105 1.895 22 3 22H21C22.105 22 23 21.105 23 20V4C23 2.895 22.105 2 21 2Z"
      fill={color}
    />
  </svg>
)

List.defaultProps = {
  color: colors.primaryTeal,
}

export default List
