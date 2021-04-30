import * as React from 'react'
import Box from 'src/components/Box'
import Button from 'src/components/Button'
import Icon from 'src/components/Icon'
import Image from 'src/components/Image'
import * as Text from 'src/components/Text'
import { colors } from 'src/styles'
import { FileItem } from 'src/types/files'

interface Props {
  selectedFileItem: FileItem
  handleDiscardFile?: () => void
}

const SelectedImagePreview = ({
  selectedFileItem,
  handleDiscardFile,
}: Props) => {
  return (
    <Box
      display="grid"
      gridTemplateColumns="2fr 3fr 1fr"
      p={2}
      borderRadius="lg"
      gridColumnGap={3}
      bg="activeSecondaryBlue"
    >
      <Box position="relative">
        <Image w="100%" border="1px solid #ccc" src={selectedFileItem.url} />
        <Box
          position="absolute"
          px={2}
          py={1}
          bg={colors.cyanProcess}
          borderRadius="lg"
          right="-5%"
          bottom="-5%"
        >
          <Text.Plain color="white" fontSize="10px">
            {selectedFileItem.file.type.split('/')[1].toUpperCase()}
          </Text.Plain>
        </Box>
      </Box>
      <Box>
        <Text.Body2>{selectedFileItem.file.name}</Text.Body2>
        <Text.Body3 color="africanElephant">
          {Math.round(selectedFileItem.file.size / 10) / 10}kb
        </Text.Body3>
      </Box>
      {handleDiscardFile && (
        <Button variant="tertiary" p="0 !imporant" onClick={handleDiscardFile}>
          <Icon of="close" color={colors.nomusBlue} />
        </Button>
      )}
    </Box>
  )
}

export default SelectedImagePreview
