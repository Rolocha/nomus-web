import * as React from 'react'
import Link from 'src/components/Link'

export const specs = [
  ['Card dimensions', '3.5 x 2"'],
  ['Text safe space', '3 x 1.5"'],
  ['Bleed allowance', '0.125"'],
  ['File types accepted', '.pdf, .jpg, .jpeg, .png, .ai'],
  ['Resolution', '300 dpi'],
  [
    'Additional note',
    <span>
      {`N-mark to indicate NFC compatibility (`}
      <Link to="#">Download N-mark .png file</Link>
      {')'}
    </span>,
  ],
]
