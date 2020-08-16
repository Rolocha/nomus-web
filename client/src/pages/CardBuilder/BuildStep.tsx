import * as React from 'react'
import Box from 'src/components/Box'
import FileUploadButton from 'src/components/FileUploadButton'
import * as Form from 'src/components/Form'
import { ExternalLink } from 'src/components/Link'
import * as Text from 'src/components/Text'
import { FileItem } from 'src/types/files'
import CardBuilderPreview from './CardBuilderPreview'
import { acceptableImageFileTypes } from './config'
import { specs } from './copy'
import { CardBuilderAction, CardBuilderState } from './reducer'

interface Props {
  selectedBaseType: string | undefined
  cardBuilderState: CardBuilderState
  updateCardBuilderState: React.Dispatch<CardBuilderAction>
}

interface ParamsType {
  buildBaseType?: string
}

const BuildStep = ({ cardBuilderState, updateCardBuilderState }: Props) => {
  const buildBaseType = cardBuilderState.baseType

  const {
    frontDesignFile,
    backDesignFile,
    graphicElementFile,
  } = cardBuilderState

  const setFrontDesignFile = (file: FileItem | null) =>
    updateCardBuilderState({
      frontDesignFile: file,
    })
  const setBackDesignFile = (file: FileItem | null) =>
    updateCardBuilderState({
      backDesignFile: file,
    })
  const setGraphicElementFile = (file: FileItem | null) =>
    updateCardBuilderState({
      graphicElementFile: file,
    })

  return (
    <Box
      height="100%"
      display="grid"
      gridTemplateColumns="4fr 8fr"
      gridColumnGap={3}
      p={{ _: '24px', md: '48px' }}
    >
      {buildBaseType === 'custom' || buildBaseType === 'template'
        ? {
            custom: (
              <Box overflowY="scroll" pt={4}>
                <Box mb={3}>
                  <Text.SectionSubheader mb={2}>
                    Upload front design
                  </Text.SectionSubheader>
                  <Text.Body2 mb={2}>
                    This side should include an N-mark to indicate NFC
                    compatibility.{' '}
                    <ExternalLink href="#">
                      Download N-mark .png file
                    </ExternalLink>
                  </Text.Body2>
                  <FileUploadButton
                    name="frontImage"
                    width="100%"
                    accept={acceptableImageFileTypes.join(' ')}
                    selectedFileItem={frontDesignFile}
                    handleFileItemChange={setFrontDesignFile}
                    showImagePreview
                  />
                </Box>

                <Box mb={3}>
                  <Text.SectionSubheader mb={2}>
                    Upload back design
                  </Text.SectionSubheader>
                  <Text.Body2 mb={2}>
                    Full creative freedom! Knock it outta the park.
                  </Text.Body2>
                  <FileUploadButton
                    name="backImage"
                    width="100%"
                    accept={acceptableImageFileTypes.join(' ')}
                    selectedFileItem={backDesignFile}
                    handleFileItemChange={setBackDesignFile}
                    showImagePreview
                  />
                </Box>

                <Box mb={3}>
                  <Text.SectionSubheader mb={2}>
                    Design specifications
                  </Text.SectionSubheader>
                  {specs.map((specLine) => [
                    <Box mb={2}>
                      <Text.Body2>{specLine[0]}</Text.Body2>
                      <Text.Body2>{specLine[1]}</Text.Body2>
                    </Box>,
                  ])}
                </Box>
              </Box>
            ),
            template: (
              <Box overflowY="scroll" pt={4}>
                <Box mb={3}>
                  <Text.SectionSubheader mb={2}>
                    Upload graphic element
                  </Text.SectionSubheader>
                  <Text.Body2 mb={2}>
                    Each template has a space for you to add a personal or
                    company logo. Feel free to upload one, as long as it’s 300
                    dpi and under 5mb. We accept .pdf, .ai, and .png files.
                  </Text.Body2>
                  <FileUploadButton
                    name="graphicElement"
                    width="100%"
                    accept={acceptableImageFileTypes.join(' ')}
                    selectedFileItem={graphicElementFile}
                    handleFileItemChange={setGraphicElementFile}
                  />
                </Box>
                <Box mb={3}>
                  <Text.SectionSubheader>
                    Contact information
                  </Text.SectionSubheader>
                  <Box mb={3}>
                    <Form.Label>Name</Form.Label>
                    <Form.Input width="100%" />
                  </Box>
                  <Box mb={3}>
                    <Form.Label>Line 1</Form.Label>
                    <Form.Input width="100%" />
                  </Box>
                  <Box mb={3}>
                    <Form.Label>Line 2</Form.Label>
                    <Form.Input width="100%" />
                  </Box>
                  <Box mb={3}>
                    <Form.Label>Line 3</Form.Label>
                    <Form.Input width="100%" />
                  </Box>
                </Box>
              </Box>
            ),
          }[buildBaseType]
        : null}
      <Box overflowY="scroll">
        <CardBuilderPreview
          frontDesignFile={frontDesignFile}
          backDesignFile={backDesignFile}
        />
      </Box>
    </Box>
  )
}

export default BuildStep
