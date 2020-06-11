import { css } from '@emotion/core'
import * as React from 'react'
import { colors } from 'src/styles'
import { SVGProps } from './types'

const TapCardIllustration = ({ color, color2 }: SVGProps) => (
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
      d="M26.72,36.51C39.85,18.17,60.88,4.14,83.41,4.8s41.91,15.13,63.38,21.76c24.91,7.69,54.93,5.94,72.8,24.93,14.48,15.39,15.21,39.25,11,60s-12.31,40.86-12.59,62c-.22,16.2,4.08,33.32-2.65,48.05-8.61,18.88-33.21,26.18-53.3,21C127.86,233.67,86.47,225,60.61,199.13c-13.82-13.84-20.19-30.8-29.1-47.69C24.94,139,14,130.09,8.3,117.19-3.47,90.32,11,58.5,26.72,36.51Z"
    />
    <path
      className="cls-2"
      d="M36.94,31.57C51,14,72.77,1.08,95.24,2.94s41,17.35,62.12,25.12c24.46,9,54.54,8.86,71.36,28.78,13.64,16.14,13.1,40,7.84,60.47s-14.48,40.14-15.89,61.23c-1.08,16.17,2.3,33.49-5.21,47.84-9.61,18.39-34.56,24.37-54.35,18.12-33.72-10.64-74.58-21.48-99-48.72C49,181.22,43.57,163.94,35.57,146.6c-5.89-12.78-16.39-22.26-21.34-35.44C3.91,83.7,20.05,52.7,36.94,31.57Z"
    />
    <path
      className="cls-3"
      d="M58.62,119.36a13.36,13.36,0,0,1-12.88-9.94l-15.38-58a13.35,13.35,0,0,1,9.48-16.32l98.8-26.18A13.34,13.34,0,0,1,155,18.36l5.57,21a1.22,1.22,0,0,1-2.36.62l-5.56-21a10.92,10.92,0,0,0-13.35-7.75L40.47,37.41a10.93,10.93,0,0,0-7.76,13.35l15.38,58a10.93,10.93,0,0,0,13.35,7.76l60.72-16.1a1.22,1.22,0,0,1,.63,2.36L62.06,118.91A13.43,13.43,0,0,1,58.62,119.36Z"
    />
    <path
      className="cls-3"
      d="M103.34,78.88a1.16,1.16,0,0,1-.62-.17A1.21,1.21,0,0,1,102.3,77c2.86-4.77,3.73-9.73,2.51-14.33s-4.47-8.53-9.38-11.26a1.22,1.22,0,0,1,1.19-2.13c5.49,3.07,9.14,7.48,10.54,12.77s.43,10.85-2.78,16.2A1.2,1.2,0,0,1,103.34,78.88Z"
    />
    <path
      className="cls-3"
      d="M95.33,76.33a1.15,1.15,0,0,1-.64-.18,1.21,1.21,0,0,1-.39-1.67,11.22,11.22,0,0,0-4.4-16.76,1.22,1.22,0,1,1,1.17-2.13,13.64,13.64,0,0,1,5.3,20.17A1.22,1.22,0,0,1,95.33,76.33Z"
    />
    <path
      className="cls-3"
      d="M111.35,81.43a1.16,1.16,0,0,1-.62-.17,1.21,1.21,0,0,1-.43-1.66c3.77-6.4,4.9-13,3.26-19.21S107.66,49,101.22,45.32a1.22,1.22,0,0,1,1.21-2.11c7,4,11.68,9.75,13.48,16.56s.59,14.09-3.52,21.06A1.19,1.19,0,0,1,111.35,81.43Z"
    />
    <path
      className="cls-3"
      d="M87.27,73.84a1.24,1.24,0,0,1-.69-.21,1.22,1.22,0,0,1-.31-1.69,5.62,5.62,0,0,0,1-4.59,5.36,5.36,0,0,0-2.76-3.27A1.22,1.22,0,0,1,85.71,62a7.78,7.78,0,0,1,3.94,4.78,8,8,0,0,1-1.38,6.59A1.21,1.21,0,0,1,87.27,73.84Z"
    />
    <path
      className="cls-3"
      d="M155.64,123.73a21.83,21.83,0,0,1-3.22-.25,21.18,21.18,0,0,1-15.83-11.75,20.5,20.5,0,0,1-1.07-2.68,21.14,21.14,0,1,1,41-3.23h0a21.16,21.16,0,0,1-10.22,15A21.21,21.21,0,0,1,155.64,123.73Zm0-40a18.88,18.88,0,0,0-17.92,24.62,20.55,20.55,0,0,0,1,2.39,18.85,18.85,0,0,0,30.75,4.75,17.25,17.25,0,0,0,1.63-2,18.57,18.57,0,0,0,3.26-8h0A18.86,18.86,0,0,0,158.53,84,19.14,19.14,0,0,0,155.61,83.73Z"
    />
    <path
      className="cls-3"
      d="M156.26,110.42a12.13,12.13,0,0,1-1.8-.14,11.5,11.5,0,1,1,1.8.14Zm0-20.9A9.32,9.32,0,0,0,147,97.4a9.31,9.31,0,0,0,2.06,7.4h0a9.33,9.33,0,0,0,5.71,3.22,9.3,9.3,0,1,0,2.84-18.39A10,10,0,0,0,156.21,89.52Z"
    />
    <path
      className="cls-3"
      d="M167.81,119.33a1.15,1.15,0,0,1-1.12-.92c-.48-2.41-1.43-5.81-4-7.41a1.14,1.14,0,1,1,1.19-2c3.38,2.07,4.52,6.08,5.09,8.91a1.16,1.16,0,0,1-.9,1.35Z"
    />
    <path
      className="cls-3"
      d="M139.13,114.9a1.12,1.12,0,0,1-.53-.13,1.14,1.14,0,0,1-.48-1.54c1.5-2.88,3.71-6.31,7.39-7.22a1.14,1.14,0,0,1,.55,2.21c-2.78.7-4.55,3.46-5.92,6.06A1.14,1.14,0,0,1,139.13,114.9Z"
    />
    <path
      className="cls-3"
      d="M144.17,119.38H144a1.14,1.14,0,0,1-1-1.31c.71-4.58,1.92-6.2,2.05-6.36a1.14,1.14,0,0,1,1.8,1.41c0,.06-1,1.43-1.59,5.3A1.15,1.15,0,0,1,144.17,119.38Z"
    />
    <path
      className="cls-3"
      d="M161.43,122.05l-.18,0a1.13,1.13,0,0,1-.95-1.3c.61-3.94.09-5.52.08-5.54a1.15,1.15,0,0,1,.69-1.45,1.12,1.12,0,0,1,1.45.65c.08.2.75,2.1,0,6.69A1.15,1.15,0,0,1,161.43,122.05Z"
    />
    <circle className="cls-3" cx="150.71" cy="99.4" r="1.14" />
    <circle className="cls-3" cx="161.13" cy="101.01" r="1.14" />
    <path
      className="cls-3"
      d="M155.68,106.19a3.86,3.86,0,0,1-.58,0A3.7,3.7,0,0,1,152,103a1.14,1.14,0,1,1,2.26-.33,1.45,1.45,0,0,0,2.74.42,1.14,1.14,0,1,1,2.05,1A3.69,3.69,0,0,1,155.68,106.19Z"
    />
    <path
      className="cls-3"
      d="M193.51,233a12.65,12.65,0,0,1-1.93-.15L115.53,221.1A12.58,12.58,0,0,1,105,206.73L129.75,46.61a12.59,12.59,0,0,1,14.36-10.53l76.06,11.75A12.61,12.61,0,0,1,230.69,62.2L206,222.33A12.62,12.62,0,0,1,193.51,233ZM192,230.45A10.17,10.17,0,0,0,203.54,222L228.28,61.83a10.16,10.16,0,0,0-8.48-11.59L143.74,38.49A10.15,10.15,0,0,0,132.15,47L107.41,207.1a10.18,10.18,0,0,0,8.49,11.6Z"
    />
    <path
      className="cls-3"
      d="M200.46,57.55a5.79,5.79,0,0,1-.92-.07l-38.67-6a6,6,0,0,1-5-6.79l1-6.66,50.44,7.79-1,6.66a5.94,5.94,0,0,1-5.87,5ZM159,40.84l-.65,4.25a3.52,3.52,0,0,0,2.94,4l38.67,6a3.55,3.55,0,0,0,2.62-.64,3.48,3.48,0,0,0,1.4-2.3l.66-4.25Z"
    />
    <path
      className="cls-3"
      d="M187.66,50.05l-.19,0-12.84-2a1.22,1.22,0,1,1,.37-2.41l12.84,2a1.22,1.22,0,0,1-.18,2.42Z"
    />
    <path
      className="cls-3"
      d="M166.88,223.71h-.18l-24.87-3.84a1.22,1.22,0,0,1,.37-2.41l24.87,3.84a1.22,1.22,0,0,1-.19,2.42Z"
    />
    <circle className="cls-3" cx="192.26" cy="49.54" r="0.79" />
    <path
      className="cls-3"
      d="M197.15,79.74a13.28,13.28,0,0,1-4.7-.83,24.43,24.43,0,0,1-6.27-3.9c-2.44-1.89-4.75-3.68-7.52-3.94a15.42,15.42,0,0,0-5.27.75,20.86,20.86,0,0,1-5.15.86h0c-3.57,0-6.65-1.69-10-3.71-2.68-1.6-5.71-3.41-8.85-3.51-2.76-.06-6,1.84-6.12,4.54A1.19,1.19,0,0,1,142,71.09a1.14,1.14,0,0,1-1.09-1.19c.19-4.17,4.52-6.82,8.46-6.72,3.75.11,7.05,2.09,10,3.83,3.08,1.85,5.87,3.38,8.86,3.39h0a18.53,18.53,0,0,0,4.58-.8,17.77,17.77,0,0,1,6.06-.81c3.43.33,6.11,2.41,8.7,4.41a22.32,22.32,0,0,0,5.66,3.57C199,78.9,205.39,75.61,211,72.36a1.14,1.14,0,0,1,1.15,2C207.49,77,202.32,79.74,197.15,79.74Z"
    />
    <path
      className="cls-3"
      d="M204.11,112.8a11.05,11.05,0,0,1-4.24-.88,28.35,28.35,0,0,1-4.32-2.44A30,30,0,0,0,192,107.4c-2.33-1.07-5.47-1.38-7.22.36a1.13,1.13,0,0,1-1.61,0,1.14,1.14,0,0,1,0-1.62c2.7-2.68,7-2.12,9.79-.81a31.05,31.05,0,0,1,3.86,2.23,26.49,26.49,0,0,0,4,2.25c2.28,1,5.47,1.12,7.06-.8a1.14,1.14,0,1,1,1.76,1.45A6.87,6.87,0,0,1,204.11,112.8Z"
    />
    <path
      className="cls-3"
      d="M199.3,123a1.15,1.15,0,0,1-1.14-1.11c0-.83-1.21-1.44-2.3-1.43a10.6,10.6,0,0,0-2.38.43,16.49,16.49,0,0,1-2.18.46c-3.64.42-7.06-1.5-9.56-2.9a1.15,1.15,0,0,1-.44-1.56,1.13,1.13,0,0,1,1.55-.43c2.9,1.62,5.51,2.94,8.18,2.62a13.64,13.64,0,0,0,1.87-.4,12.48,12.48,0,0,1,2.91-.51h.1c2.15,0,4.46,1.38,4.54,3.65a1.14,1.14,0,0,1-1.11,1.17Z"
    />
    <path
      className="cls-3"
      d="M139.17,150.66a11.76,11.76,0,0,1-3.47-.58,8.57,8.57,0,0,1-5.75-5.15c-.7-2.09.23-6.41,1.85-8.56h0a3.59,3.59,0,0,1,2.77-1.67,5.76,5.76,0,0,1,4.06,1.78c.46.44.87.9,1.27,1.35a13.84,13.84,0,0,0,1.23,1.29c.33.3.69.58,1,.85a12,12,0,0,1,1.84,1.62,4.84,4.84,0,0,1,1.11,3.55,6.3,6.3,0,0,1-2.06,4.24A5.79,5.79,0,0,1,139.17,150.66ZM134.71,137h-.06c-.41,0-.82.48-1,.76h0c-1.31,1.75-1.9,5.31-1.52,6.47a6.33,6.33,0,0,0,4.27,3.69c1.35.42,3.81.95,5.18-.25a4,4,0,0,0,1.28-2.67,2.57,2.57,0,0,0-.55-1.89,10.94,10.94,0,0,0-1.51-1.31c-.4-.31-.81-.62-1.19-1a17.4,17.4,0,0,1-1.4-1.47c-.37-.41-.73-.82-1.12-1.19A3.76,3.76,0,0,0,134.71,137Zm-2,.07h0Z"
    />
    <path
      className="cls-3"
      d="M131.46,195.79a5.82,5.82,0,0,1-4.28-1.87,9,9,0,0,1-.68-.85,5.94,5.94,0,0,0-.64-.78,4.92,4.92,0,0,0-1.26-.83,3.94,3.94,0,0,1-2.56-4.14,5.72,5.72,0,0,1,1.89-3.91,4.4,4.4,0,0,1,3.26-1.17,11.09,11.09,0,0,1,2.21.44c.39.11.79.22,1.19.3s1,.13,1.6.18,1.13.09,1.69.18a5.5,5.5,0,0,1,3.62,2,3.4,3.4,0,0,1,.39,3h0c-.61,2.35-1.54,5.89-4.35,7A5.32,5.32,0,0,1,131.46,195.79Zm-4.57-11.28a2.23,2.23,0,0,0-1.44.61,3.47,3.47,0,0,0-1.13,2.3c0,1.28.33,1.48,1.34,2a6.66,6.66,0,0,1,1.8,1.22,7.44,7.44,0,0,1,.87,1.05c.17.23.34.46.53.67a3.56,3.56,0,0,0,3.81.89c1.76-.72,2.51-3.6,3-5.51h0a1.44,1.44,0,0,0,0-1.08,3.44,3.44,0,0,0-2.16-1.09,14.84,14.84,0,0,0-1.48-.15,17.55,17.55,0,0,1-1.85-.22c-.47-.08-.92-.21-1.38-.33a10.24,10.24,0,0,0-1.77-.38Z"
    />
    <path
      className="cls-3"
      d="M137.16,174.82a4.18,4.18,0,0,1-.72-.07,6.69,6.69,0,0,1-3-1.71l-.26-.23a6.89,6.89,0,0,0-1.76-1.28,7.93,7.93,0,0,0-1.29-.37,4.83,4.83,0,0,1-3.25-1.77,3.7,3.7,0,0,1-.16-3.58c.72-1.63,3.15-4.89,4.9-5.9a6,6,0,0,1,4.86-.28,4.88,4.88,0,0,1,3,2.76v0a6.7,6.7,0,0,1,0,3.69,5.64,5.64,0,0,0-.17,2.3,6,6,0,0,0,.43,1.14,4.21,4.21,0,0,1,.4,3.47A3.19,3.19,0,0,1,137.16,174.82Zm-2.88-13.29a3.12,3.12,0,0,0-1.53.37,14.59,14.59,0,0,0-3.95,4.83,1.57,1.57,0,0,0,0,1.4c.28.42.89.58,1.86.81a9.54,9.54,0,0,1,1.67.48,9.42,9.42,0,0,1,2.39,1.67l.25.23a4.58,4.58,0,0,0,1.95,1.19,1.1,1.1,0,0,0,1.18-.41c.15-.35,0-.85-.4-1.64a9.16,9.16,0,0,1-.56-1.55,7.63,7.63,0,0,1,.16-3.25,4.89,4.89,0,0,0,.11-2.46,2.72,2.72,0,0,0-1.67-1.42A4.49,4.49,0,0,0,134.28,161.53Z"
    />
    <path
      className="cls-3"
      d="M186.11,155.13a13.14,13.14,0,0,1-5-1.12c-.85-.37-1.68-.78-2.48-1.19a17.31,17.31,0,0,0-5.31-2,17.27,17.27,0,0,0-4.17.1,15.86,15.86,0,0,1-5.74-.11,16.23,16.23,0,0,1-3.58-1.56,21.36,21.36,0,0,0-2.09-1c-1.5-.61-3.45-.74-4.42.32a1.14,1.14,0,1,1-1.69-1.53c1.83-2,4.9-1.75,7-.9a22.72,22.72,0,0,1,2.32,1.14,10.26,10.26,0,0,0,8,1.41,19.46,19.46,0,0,1,4.71-.09,19.25,19.25,0,0,1,6,2.23c.8.41,1.57.79,2.35,1.13,1.09.47,4.84,1.85,7.14-.06a1.14,1.14,0,0,1,1.46,1.75A6.84,6.84,0,0,1,186.11,155.13Z"
    />
    <path
      className="cls-3"
      d="M164.8,175.68a15.08,15.08,0,0,1-7-1.71c-.63-.33-1.24-.71-1.85-1.09a11.85,11.85,0,0,0-3.56-1.74,3.67,3.67,0,0,0-2.83.56,1.57,1.57,0,0,0-.71,1.17,1.17,1.17,0,0,1-1.23,1.06,1.15,1.15,0,0,1-1-1.23,3.88,3.88,0,0,1,1.63-2.84,6,6,0,0,1,4.7-.94,13.61,13.61,0,0,1,4.26,2c.56.35,1.13.71,1.71,1a12.82,12.82,0,0,0,10.27.68,1.14,1.14,0,1,1,.79,2.14A14.77,14.77,0,0,1,164.8,175.68Z"
    />
    <path
      className="cls-3"
      d="M161.54,141.84l-.18,0-8.92-1.38a1.13,1.13,0,0,1-.95-1.3,1.12,1.12,0,0,1,1.3-.95l8.92,1.38a1.14,1.14,0,0,1,1,1.3A1.16,1.16,0,0,1,161.54,141.84Z"
    />
    <path
      className="cls-3"
      d="M156.83,163.88h-.18l-8.07-1.25a1.14,1.14,0,1,1,.35-2.26l8.07,1.25a1.14,1.14,0,0,1-.17,2.27Z"
    />
    <path
      className="cls-3"
      d="M155.69,191h-.18l-10.2-1.58a1.13,1.13,0,0,1-.95-1.3,1.12,1.12,0,0,1,1.3-1l10.2,1.57a1.14,1.14,0,0,1-.17,2.27Z"
    />
    <path
      className="cls-3"
      d="M185.91,203.24c-2.94,0-5.58-1.32-8.13-2.6s-5.19-2.61-7.83-2.25a14.17,14.17,0,0,0-4.16,1.54,15.67,15.67,0,0,1-4.94,1.77c-3,.37-5.72-.82-8.37-2s-5.13-2.23-7.59-1.66a1.14,1.14,0,0,1-.51-2.23c3.19-.74,6.15.55,9,1.8,2.48,1.07,4.83,2.09,7.17,1.79a13.62,13.62,0,0,0,4.22-1.55,16.38,16.38,0,0,1,4.87-1.76c3.32-.45,6.29,1,9.16,2.48,2.44,1.23,4.76,2.38,7.19,2.36h0a1.14,1.14,0,0,1,0,2.28Z"
    />
    <path
      className="cls-3"
      d="M53.25,156.41a1.23,1.23,0,0,1-1-.55,1.21,1.21,0,0,1,.37-1.68,72.37,72.37,0,0,1,25.11-10,23.22,23.22,0,0,1-5.62-2.79,1.22,1.22,0,1,1,1.37-2A21.35,21.35,0,0,0,85.59,143c.88-.08,1.77-.16,2.65-.21a1.21,1.21,0,0,1,.26,2.41,20.82,20.82,0,0,1-2.75.23,71.8,71.8,0,0,0-31.85,10.8A1.2,1.2,0,0,1,53.25,156.41Z"
    />
    <path
      className="cls-3"
      d="M57,166.44a1.22,1.22,0,0,1-.87-2.07,70.44,70.44,0,0,1,17-12.72,1.21,1.21,0,1,1,1.15,2.14,68.31,68.31,0,0,0-16.4,12.28A1.19,1.19,0,0,1,57,166.44Z"
    />
    <path
      className="cls-3"
      d="M73.87,179.27h0a1.21,1.21,0,0,1-1.22-1.22,33.42,33.42,0,0,1,5.76-18.57L76,160a1.21,1.21,0,0,1-.53-2.37l5.64-1.27a1.2,1.2,0,0,1,1.3.55,1.22,1.22,0,0,1-.1,1.41,31,31,0,0,0-7.22,19.72A1.22,1.22,0,0,1,73.87,179.27Z"
    />
    <path
      className="cls-3"
      d="M89.65,161.84a1.21,1.21,0,0,1-1.12-.76,15.64,15.64,0,0,1,.19-12.34,1.2,1.2,0,0,1,1.61-.59,1.21,1.21,0,0,1,.6,1.61,13.24,13.24,0,0,0-.15,10.41,1.21,1.21,0,0,1-.67,1.58A1.25,1.25,0,0,1,89.65,161.84Z"
    />
  </svg>
)

TapCardIllustration.defaultProps = {
  color: colors.ivory,
  color2: colors.brightCoral,
}

export default TapCardIllustration
