import { css } from '@emotion/core'
import * as React from 'react'
import * as SVG from 'src/components/SVG'
import * as Text from 'src/components/Text'
import Box from 'src/components/Box'
import Image from 'src/components/Image'
import { Input } from './Form'
import Button from './Button'
import { colors } from 'src/styles'
import { FileItem } from 'src/types/files'

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
    [handleFileItemChange],
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
    [],
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
          borderRadius={2}
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
                borderRadius={2}
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
            css={css`
              padding: 0 !important;
            `}
            onClick={() => handleFileItemChange(null)}
          >
            <SVG.Close color={colors.nomusBlue} />
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
          css={css`
            border: 1px dashed ${colors.nomusBlue};
            background: white;
            color: ${colors.nomusBlue};
            display: flex;
            align-items: center;
            justify-content: center;

            ${isDragging &&
            `
          background: ${colors.hoverBlue};
          `}
            &:hover {
              background: ${colors.hoverBlue};
            }
          `}
        >
          <SVG.Upload
            color={colors.nomusBlue}
            css={css`
              margin-right: 8px;
            `}
          />
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
