import React from 'react'
import Box from 'src/components/Box'
import EditableImage from 'src/components/EditableImage'

export default {
  title: 'components/EditableImage',
  component: EditableImage,
  excludeStories: /.*Data$/,
}

export const Primary = () => {
  const onImageUpdate = async (image: File) => {
    'boom'
  }
  return (
    <Box>
      <EditableImage
        editable
        src="https://placehold.it/300x300"
        onImageUpdate={onImageUpdate}
      />
    </Box>
  )
}
