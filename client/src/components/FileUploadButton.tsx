import * as React from 'react'
import Box from 'src/components/Box'
import Icon from 'src/components/Icon'
import Image from 'src/components/Image'
import * as Text from 'src/components/Text'
import { colors } from 'src/styles'
import { FileItem } from 'src/types/files'
import Button from './Button'
import { Input } from './Form'

interface Props {
  name: string
  accept?: string
  width?: string
  selectedFileItem: FileItem | null
  handleFileItemChange: (file: FileItem | null) => void
  createObjectUrl: boolean
  showImagePreview: boolean
}

const FileUploadButton = ({
  name,
  width,
  accept,
  selectedFileItem,
  handleFileItemChange,
  createObjectUrl,
  showImagePreview,
}: Props) => {
  const inputRef = React.useRef<HTMLInputElement | null>(null)
  const buttonRef = React.useRef<HTMLButtonElement | null>(null)
  const lastFileItemRef = React.useRef<FileItem | null>(null)
  const [isDragging, setIsDragging] = React.useState(false)

  React.useEffect(() => {
    if (selectedFileItem == null && lastFileItemRef.current != null) {
      if (inputRef.current) {
        // Force clear the input's value attr, otherwise it won't trigger an onChange
        // event if the same file is selected, removed, then selected again
        inputRef.current.value = ''
      }
    }

    lastFileItemRef.current = selectedFileItem
  }, [selectedFileItem, lastFileItemRef, inputRef])

  const handleFiles = React.useCallback(
    (files: FileList) => {
      const file = files[0]
      if (file == null) {
        return
      }

      const fileItem = createObjectUrl
        ? {
            file,
            url: window.URL.createObjectURL(files[0]),
          }
        : {
            file,
          }
      handleFileItemChange(fileItem)
    },
    [createObjectUrl, handleFileItemChange],
  )

  const startDragView = () => {
    setIsDragging(true)
  }
  const endDragView = () => {
    setIsDragging(false)
  }

  const handleDragStart = React.useCallback(
    (e: React.DragEvent<HTMLButtonElement>) => {
      e.stopPropagation()
      e.preventDefault()
      startDragView()
    },
    [],
  )
  const handleDragEnd = React.useCallback(
    (e: React.DragEvent<HTMLButtonElement>) => {
      e.stopPropagation()
      e.preventDefault()
      endDragView()
    },
    [],
  )

  const handleFileDrop = React.useCallback(
    (e: React.DragEvent<HTMLButtonElement>) => {
      e.stopPropagation()
      e.preventDefault()

      const dt = e.dataTransfer
      handleFiles(dt.files)
      endDragView()
    },
    [handleFiles],
  )

  return (
    <Box>
      <Input
        ref={inputRef}
        type="file"
        accept={accept}
        name={name}
        hidden
        display="none"
        onChange={(e: React.FormEvent<HTMLInputElement>) => {
          if (e.currentTarget.files) {
            handleFiles(e.currentTarget.files)
          }
        }}
      />
      {selectedFileItem ? (
        <Box
          display="grid"
          gridTemplateColumns={showImagePreview ? '2fr 3fr 1fr' : '5fr 1fr'}
          p={2}
          borderRadius="lg"
          gridColumnGap={3}
          bg="activeBlue"
        >
          {showImagePreview && (
            <Box position="relative">
              <Image
                w="100%"
                border="1px solid #ccc"
                src={selectedFileItem.url}
              />
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
          )}
          <Box>
            <Text.Body2>{selectedFileItem.file.name}</Text.Body2>
            <Text.Body3 color="africanElephant">
              {Math.round(selectedFileItem.file.size / 10) / 10}kb
            </Text.Body3>
          </Box>
          <Button
            variant="tertiary"
            p="0 !imporant"
            onClick={() => handleFileItemChange(null)}
          >
            <Icon of="close" color={colors.nomusBlue} />
          </Button>
        </Box>
      ) : (
        <Button
          ref={buttonRef}
          onDragEnter={handleDragStart}
          onDragOver={handleDragStart}
          onDragLeave={handleDragEnd}
          onDragEnd={handleDragEnd}
          onDrop={handleFileDrop}
          onClick={() => inputRef.current?.click()}
          width={width}
          variant="unstyled"
          border={`1px dashed ${colors.nomusBlue}`}
          background="white"
          color={colors.nomusBlue}
          display="flex"
          alignItems="center"
          justifyContent="center"
          sx={
            isDragging
              ? {
                  background: colors.hoverBlue,
                  '&:hover': {
                    background: colors.hoverBlue,
                  },
                }
              : {}
          }
        >
          <Icon of="upload" color={colors.nomusBlue} mr="8px" />
          Upload a file or drag and drop
        </Button>
      )}
    </Box>
  )
}

FileUploadButton.defaultProps = {
  createObjectUrl: true,
  showImagePreview: false,
}

export default FileUploadButton
