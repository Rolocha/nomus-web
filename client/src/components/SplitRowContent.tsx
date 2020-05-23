import * as React from 'react'

import Box from 'src/components/Box'

interface ISplitRow {
  key: string
  image: JSX.Element
  title: JSX.Element
  content: JSX.Element
}

type SplitRowContentProps = {
  alternate?: Boolean
  children: ISplitRow[]
  wrapperProps?: React.ComponentProps<typeof Box>
  rowProps?: React.ComponentProps<typeof Box>
  titleProps?: React.ComponentProps<typeof Box>
  imageProps?: React.ComponentProps<typeof Box>
  contentProps?: React.ComponentProps<typeof Box>
}

export const bp = 'lg'

const NARROW_GRID_TEMPLATE = `
  "title"
  "image"
  "content"
`

const EVEN_GRID_TEMPLATE = `
  "image title"
  "image content"
`
const ODD_GRID_TEMPLATE = `
  "title image"
  "content image"
`

const SplitRowContent = ({
  alternate,
  children,
  wrapperProps,
  rowProps,
  titleProps,
  imageProps,
  contentProps,
}: SplitRowContentProps) => (
  <Box container={true}>
    <Box
      display="flex"
      flexDirection="column"
      alignItems="stretch"
      {...wrapperProps}
    >
      {children.map(({ key, title, image, content }, index) => (
        <Box
          key={key}
          display="grid"
          gridTemplateColumns={{
            _: '100%',
            [bp]: alternate && index % 2 !== 0 ? '45% 55%' : '55% 45%',
          }}
          gridTemplateRows={{ [bp]: 'auto 1fr' }}
          gridTemplateAreas={{
            _: NARROW_GRID_TEMPLATE,
            [bp]:
              alternate && index % 2 !== 0
                ? ODD_GRID_TEMPLATE
                : EVEN_GRID_TEMPLATE,
          }}
          {...rowProps}
        >
          {React.cloneElement(title, {
            gridArea: 'title',
            ...titleProps,
          })}
          {React.cloneElement(image, {
            gridArea: 'image',
            ...imageProps,
          })}
          {React.cloneElement(content, {
            gridArea: 'content',
            ...contentProps,
          })}
        </Box>
      ))}
    </Box>
  </Box>
)

SplitRowContent.defaultProps = {
  alternate: false,
  widthSplit: [50, 50],
}

export default SplitRowContent
