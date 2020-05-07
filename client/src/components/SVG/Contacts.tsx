import * as React from 'react'
import { SVGProps } from './types'

const Profile = ({ color, className }: SVGProps) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M20 1H4C2.3 1 1 2.3 1 4V20C1 21.7 2.3 23 4 23H20C21.7 23 23 21.7 23 20V4C23 2.3 21.7 1 20 1ZM2 20V4C2 2.9 2.9 2 4 2V22C2.9 22 2 21.1 2 20ZM5 22V21.6C5.4 20.9 8.2 16.7 13 16.7C18 16.7 20.8 21.3 21 21.7C20.7 21.9 20.3 22 20 22H5ZM22 20C22 20.3 21.9 20.7 21.8 20.9C21.1 19.7 18.2 15.7 13.1 15.7C9.1 15.7 6.4 18.3 5.1 19.9V2H20.1C21.2 2 22.1 2.9 22.1 4V20H22Z"
      fill={color}
    />
    <path
      d="M13 5C10.5 5 8.5 7 8.5 9.5C8.5 12 10.5 14 13 14C15.5 14 17.5 12 17.5 9.5C17.5 7 15.5 5 13 5ZM13 13C11.1 13 9.5 11.4 9.5 9.5C9.5 7.6 11.1 6 13 6C14.9 6 16.5 7.6 16.5 9.5C16.5 11.4 14.9 13 13 13Z"
      fill={color}
    />
  </svg>
)

Profile.defaultProps = {
  color: 'white',
}

export default Profile
