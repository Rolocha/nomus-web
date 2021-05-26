import * as React from 'react'
import Icon from 'src/components/Icon'
import SelectedImagePreview from 'src/components/SelectedImagePreview'
import { colors } from 'src/styles'
import { FileItem } from 'src/types/files'
import Button from './Button'
import { Input } from './Form'

interface Props {
  name: string
  selectedFileItem: FileItem | null
  handleFileItemChange: (file: FileItem | null) => void
  createObjectUrl: boolean
  accept?: string
  width?: string
  height?: string
  uploadText?: string
}

const FileUploadButton = ({
  name,
  width,
  height,
  accept,
  selectedFileItem,
  handleFileItemChange,
  createObjectUrl,
  uploadText,
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
            url: window.URL.createObjectURL(file),
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
    <>
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
        <SelectedImagePreview
          selectedFileItem={selectedFileItem}
          handleDiscardFile={() => handleFileItemChange(null)}
        />
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
          height={height}
          variant="dashedSecondary"
          sx={
            isDragging
              ? {
                  background: colors.hoverSecondaryBlue,
                  '&:hover': {
                    background: colors.hoverSecondaryBlue,
                  },
                }
              : {}
          }
          leftIcon={<Icon of="upload" color={colors.nomusBlue} />}
        >
          {uploadText ?? 'Upload a file or drag and drop'}
        </Button>
      )}
    </>
  )
}

FileUploadButton.defaultProps = {
  createObjectUrl: true,
  showImagePreview: false,
}

export default FileUploadButton
