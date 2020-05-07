import * as React from 'react'
import { css } from '@emotion/core'

import { colors } from 'src/styles'
import { SVGProps } from './types'

const CreateNFCCardIllustration = ({ color, color2 }: SVGProps) => (
  <svg
    id="Layer_1"
    data-name="Layer 1"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 250 250"
    css={css`
      .cls-1 {
        fill: ${color2};
        opacity: 0.75;
      }
      .cls-2 {
        fill: none;
        stroke: ${color2};
        stroke-linecap: round;
        stroke-miterlimit: 10;
        stroke-width: 2.5px;
      }
      .cls-3 {
        fill: #fbf9f0;
      }
    `}
  >
    <path
      className="cls-1"
      d="M209.89,36.05a32.85,32.85,0,0,1,7.81,7c6.57,8.08,10.34,18.08,13.09,28.13,11.9,43.46,6.68,101.5-18,139.88-14.62,22.7-25.84,28-53.86,29.65-44.21,2.63-113.3,6.94-128.33-47.82-5.44-19.83-.95-41.53-7.45-61-2.9-8.7-7.87-16.56-11.39-25C1.08,81.19,12.84,32.26,42.91,24.49,55.33,21.28,68.27,22.42,81,18.76,101.51,12.88,121.21,7.09,142.84,9c16.79,1.52,27.54,9.56,42,16.44C193.4,29.56,202.22,31.1,209.89,36.05Z"
    />
    <path
      className="cls-2"
      d="M226,48.88a32.76,32.76,0,0,1,7,7.78c5.66,8.75,8.33,19.09,10,29.38,7.13,44.49-4.33,101.63-33.06,137.12-17,21-28.71,25-56.75,23.66-44.23-2.17-113.38-5.35-122.41-61.41-3.27-20.3,3.54-41.39-.81-61.48-1.95-9-6-17.32-8.62-26.12-7.81-26.61,9.18-74,39.91-78.46,12.7-1.85,25.43.68,38.51-1.58,21-3.63,41.21-7.27,62.5-3,16.53,3.33,26.35,12.48,40,20.89C210.26,40.64,218.86,43.13,226,48.88Z"
    />
    <path
      className="cls-3"
      d="M160.74,12.85a1.21,1.21,0,0,1-1.21-1.21V7.05H137.47v4.59a1.21,1.21,0,1,1-2.41,0v-7h26.88v7A1.21,1.21,0,0,1,160.74,12.85Z"
    />
    <path
      className="cls-3"
      d="M148.5,30.88a1.21,1.21,0,0,1-1.21-1.2V5.84a1.21,1.21,0,0,1,2.41,0V29.68A1.2,1.2,0,0,1,148.5,30.88Z"
    />
    <path
      className="cls-3"
      d="M154.51,30.88h-12a1.21,1.21,0,1,1,0-2.41h12a1.21,1.21,0,1,1,0,2.41Z"
    />
    <path
      className="cls-3"
      d="M123.65,159.88H22.41A13.23,13.23,0,0,1,9.19,146.66V87.18A13.24,13.24,0,0,1,22.41,74H123.65a13.25,13.25,0,0,1,13.23,13.23v59.48A13.24,13.24,0,0,1,123.65,159.88ZM22.41,76.36A10.83,10.83,0,0,0,11.6,87.18v59.48a10.82,10.82,0,0,0,10.81,10.81H123.65a10.83,10.83,0,0,0,10.82-10.81V87.18a10.83,10.83,0,0,0-10.82-10.82Z"
    />
    <path
      className="cls-3"
      d="M72.4,132.07a1.21,1.21,0,0,1-.84-2.07c4-3.84,6-8.37,6-13.08s-2.12-9.3-6.12-13.16a1.21,1.21,0,0,1,0-1.71,1.2,1.2,0,0,1,1.7,0c4.49,4.33,6.86,9.48,6.86,14.9s-2.34,10.5-6.77,14.81A1.19,1.19,0,0,1,72.4,132.07Z"
    />
    <path
      className="cls-3"
      d="M65.38,127.6a1.2,1.2,0,0,1-.83-2.08,11.1,11.1,0,0,0,0-17.16,1.21,1.21,0,0,1,1.67-1.75,13.51,13.51,0,0,1-.05,20.66A1.22,1.22,0,0,1,65.38,127.6Z"
    />
    <path
      className="cls-3"
      d="M79.42,136.54a1.24,1.24,0,0,1-.86-.35,1.22,1.22,0,0,1,0-1.71c5.24-5.17,8-11.24,8-17.56s-2.76-12.4-8-17.56a1.21,1.21,0,0,1,1.69-1.72C86,103.27,89,109.94,89,116.92s-3,13.64-8.71,19.28A1.21,1.21,0,0,1,79.42,136.54Z"
    />
    <path
      className="cls-3"
      d="M58.29,123.17a1.2,1.2,0,0,1-.91-.43,1.18,1.18,0,0,1,.13-1.69,5.55,5.55,0,0,0,2.14-4.13,5.3,5.3,0,0,0-1.81-3.83,1.21,1.21,0,1,1,1.67-1.74,7.66,7.66,0,0,1,2.55,5.57,7.91,7.91,0,0,1-3,6A1.24,1.24,0,0,1,58.29,123.17Z"
    />
    <path
      className="cls-3"
      d="M228,139.21a1.2,1.2,0,0,1-1.2-1.2V117.62a1.21,1.21,0,1,1,2.41,0V138A1.21,1.21,0,0,1,228,139.21Z"
    />
    <path
      className="cls-3"
      d="M228,114.51a1.21,1.21,0,0,1-1.2-1.21V92.92a1.21,1.21,0,1,1,2.41,0V113.3A1.21,1.21,0,0,1,228,114.51Z"
    />
    <path
      className="cls-3"
      d="M225.13,91.29H209.78a1.21,1.21,0,1,1,0-2.41h15.35a1.21,1.21,0,1,1,0,2.41Z"
    />
    <path
      className="cls-3"
      d="M205.46,91.29h-15a1.21,1.21,0,0,1,0-2.41h15a1.21,1.21,0,0,1,0,2.41Z"
    />
    <path
      className="cls-3"
      d="M187.59,114.51a1.21,1.21,0,0,1-1.21-1.21V92.92a1.21,1.21,0,1,1,2.41,0V113.3A1.2,1.2,0,0,1,187.59,114.51Z"
    />
    <path
      className="cls-3"
      d="M187.59,139.21a1.21,1.21,0,0,1-1.21-1.2V117.62a1.21,1.21,0,1,1,2.41,0V138A1.2,1.2,0,0,1,187.59,139.21Z"
    />
    <path
      className="cls-3"
      d="M205.46,142h-15a1.21,1.21,0,0,1,0-2.41h15a1.21,1.21,0,0,1,0,2.41Z"
    />
    <path
      className="cls-3"
      d="M225.13,142H209.78a1.21,1.21,0,1,1,0-2.41h15.35a1.21,1.21,0,1,1,0,2.41Z"
    />
    <path
      className="cls-3"
      d="M187.59,94.12a4,4,0,1,1,4-4A4,4,0,0,1,187.59,94.12Zm0-5.66a1.63,1.63,0,1,0,1.63,1.62A1.63,1.63,0,0,0,187.59,88.46Z"
    />
    <path
      className="cls-3"
      d="M228,94.12a4,4,0,1,1,4-4A4,4,0,0,1,228,94.12Zm0-5.66a1.63,1.63,0,1,0,1.63,1.62A1.63,1.63,0,0,0,228,88.46Z"
    />
    <path
      className="cls-3"
      d="M187.59,144.87a4,4,0,1,1,4-4A4,4,0,0,1,187.59,144.87Zm0-5.66a1.63,1.63,0,1,0,1.63,1.63A1.63,1.63,0,0,0,187.59,139.21Z"
    />
    <path
      className="cls-3"
      d="M228,144.87a4,4,0,1,1,4-4A4,4,0,0,1,228,144.87Zm0-5.66a1.63,1.63,0,1,0,1.63,1.63A1.63,1.63,0,0,0,228,139.21Z"
    />
    <path
      className="cls-3"
      d="M228,118.82a3.36,3.36,0,1,1,3.37-3.36A3.36,3.36,0,0,1,228,118.82Zm0-4.31a1,1,0,1,0,1,.95A.95.95,0,0,0,228,114.51Z"
    />
    <path
      className="cls-3"
      d="M187.59,118.82a3.36,3.36,0,1,1,3.36-3.36A3.35,3.35,0,0,1,187.59,118.82Zm0-4.31a1,1,0,1,0,.95.95A.94.94,0,0,0,187.59,114.51Z"
    />
    <path
      className="cls-3"
      d="M207.62,93.45A3.37,3.37,0,1,1,211,90.08,3.37,3.37,0,0,1,207.62,93.45Zm0-4.32a1,1,0,1,0,.95,1A1,1,0,0,0,207.62,89.13Z"
    />
    <path
      className="cls-3"
      d="M207.62,144.2a3.37,3.37,0,1,1,3.36-3.36A3.37,3.37,0,0,1,207.62,144.2Zm0-4.32a1,1,0,1,0,.95,1A1,1,0,0,0,207.62,139.88Z"
    />
    <path
      className="cls-3"
      d="M192.71,159.62a1.13,1.13,0,0,1-.45-.09,1.2,1.2,0,0,1-.76-1.12v-12.9a1.21,1.21,0,0,1,2.08-.83l8.37,8.81a1.2,1.2,0,0,1-.82,2l-4.18.19-3.37,3.53A1.2,1.2,0,0,1,192.71,159.62Zm1.2-11.1v6.89l1.64-1.71a1.19,1.19,0,0,1,.81-.38l2-.09Z"
    />
    <circle className="cls-3" cx="207.62" cy="115.46" r="1.12" />
    <path
      className="cls-3"
      d="M138,224.56a6.42,6.42,0,0,1-5.09-2.32c-2.71-3.43-1.07-8.87,1.61-12.47a19.9,19.9,0,0,1,8.48-6.56,15.23,15.23,0,0,0-6-4.23c-6.92-2.76-15.72-.86-21.88,4.73a1.2,1.2,0,0,1-1.62-1.78c6.83-6.2,16.63-8.28,24.4-5.18a17.31,17.31,0,0,1,7.59,5.72,10.76,10.76,0,0,1,7.42.92c3.09,1.65,5,4.69,6.77,7.91l.07.13c1.53,2.75,3.12,5.59,5.57,7.13,2.25,1.42,5.75,1.47,7.72-.87a1.2,1.2,0,0,1,1.85,1.54c-2.82,3.36-7.73,3.33-10.85,1.37-3-1.87-4.71-5-6.39-8l-.08-.13c-1.62-2.9-3.28-5.62-5.8-7a8.16,8.16,0,0,0-4.9-.82l.25.52a15.32,15.32,0,0,1-.47,13.42,11.5,11.5,0,0,1-6.09,5.5A7.89,7.89,0,0,1,138,224.56Zm6.43-19.3a17.44,17.44,0,0,0-8,6c-2.21,3-3.49,7.21-1.65,9.53a4.5,4.5,0,0,0,5,1.11,9.15,9.15,0,0,0,4.77-4.37,12.86,12.86,0,0,0,.38-11.27A9.4,9.4,0,0,0,144.44,205.26Z"
    />
    <path
      className="cls-3"
      d="M111.61,116.5a1.21,1.21,0,0,1,0-2.41c10.34,0,24.64-1.73,31-6.62,5.9-4.57,10.64-11.15,14.09-19.57,8.08-19.72,2.63-40.86-1.75-44.14a1.2,1.2,0,1,1,1.44-1.92c5.86,4.37,10.85,26.7,2.54,47-3.61,8.81-8.61,15.73-14.85,20.56C137.25,114.63,122.84,116.5,111.61,116.5Z"
    />
    <path
      className="cls-3"
      d="M157.7,191.45a1.17,1.17,0,0,1-.65-.19,1.21,1.21,0,0,1-.36-1.67c3.13-4.84,6.64-24.73,3-42.69-1.54-7.49-6.91-14-11.42-18.74-10.2-10.82-30.61-11.66-36.62-11.66a1.21,1.21,0,0,1,0-2.41c6.26,0,27.52.89,38.37,12.42,4.73,5,10.37,11.82,12,19.91,3.68,18,.45,38.68-3.3,44.48A1.2,1.2,0,0,1,157.7,191.45Z"
    />
    <path
      className="cls-3"
      d="M176.15,117.13c-15,0-64.06-.63-64.55-.63a1.21,1.21,0,0,1-1.19-1.22,1.16,1.16,0,0,1,1.22-1.19c.49,0,49.5.63,64.52.63a1.21,1.21,0,1,1,0,2.41Z"
    />
    <path
      className="cls-3"
      d="M120.48,126.87a1.21,1.21,0,0,1-1.13-.8,16.17,16.17,0,0,0-10.21-9.77,1.19,1.19,0,0,1-.84-1.16,1.21,1.21,0,0,1,.88-1.15,14.7,14.7,0,0,0,9.65-8.86,1.2,1.2,0,1,1,2.25.84,17.18,17.18,0,0,1-8.35,9.22,18.7,18.7,0,0,1,8.89,10.06,1.2,1.2,0,0,1-.73,1.54A1.15,1.15,0,0,1,120.48,126.87Z"
    />
  </svg>
)

CreateNFCCardIllustration.defaultProps = {
  color: colors.bgBeige,
  color2: colors.terraCotta,
}

export default CreateNFCCardIllustration
