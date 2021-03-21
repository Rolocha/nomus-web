import * as React from 'react'
import Banner from 'src/components/Banner'
import Box from 'src/components/Box'
import FileUploadButton from 'src/components/FileUploadButton'
import * as Form from 'src/components/Form'
import Link from 'src/components/Link'
import * as Text from 'src/components/Text'
import { FileItem } from 'src/types/files'
import { getImageDimensions } from 'src/utils/image'
import CardBuilderPreview from './CardBuilderPreview'
import { acceptableImageFileTypes } from './config'
import { specs } from './copy'
import { CardBuilderAction, CardBuilderState } from './reducer'

interface Props {
  selectedBaseType: string | undefined
  cardBuilderState: CardBuilderState
  updateCardBuilderState: React.Dispatch<CardBuilderAction>
}

const BuildStep = ({
  selectedBaseType,
  cardBuilderState,
  updateCardBuilderState,
}: Props) => {
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

  const [dimensionMismatch, setDimensionMismatch] = React.useState(false)

  React.useEffect(() => {
    const compareDimensions = async () => {
      if (frontDesignFile?.url && backDesignFile?.url) {
        const frontDims = await getImageDimensions(frontDesignFile.url)
        const backDims = await getImageDimensions(backDesignFile.url)
        const mismatched =
          frontDims.height !== backDims.height ||
          frontDims.width !== backDims.width
        setDimensionMismatch(mismatched)
      }
    }

    compareDimensions()
  }, [frontDesignFile, backDesignFile])

  return (
    <Box
      height="100%"
      display="grid"
      gridTemplateColumns="4fr 8fr"
      gridColumnGap={3}
    >
      {dimensionMismatch && (
        <Box gridColumn="1/3" pt={2} mb={4} overflow="visible">
          <Banner
            type="danger"
            title="Your card's front and back images have different dimensions!"
            description="We strongly recommend using front and back images with the same dimensions to ensure your card looks great when printed."
          />
        </Box>
      )}
      {selectedBaseType === 'custom' || selectedBaseType === 'template'
        ? {
            custom: (
              <Box overflowY="scroll" pt={4}>
                <Box mb={3}>
                  <Text.SectionSubheader mb={2}>
                    Upload front design
                  </Text.SectionSubheader>
                  <Text.Body2 mb={2}>
                    This side should include an N-mark to indicate NFC
                    compatibility. <Link to="#">Download N-mark .png file</Link>
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
                  <Box
                    display="grid"
                    gridTemplateColumns="1fr 2fr"
                    gridColumnGap={2}
                    gridRowGap={2}
                  >
                    {specs.map((specLine) => [
                      <Text.Body2 key={0}>{specLine[0]}</Text.Body2>,
                      <Text.Body2 key={1}>{specLine[1]}</Text.Body2>,
                    ])}
                  </Box>
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
          }[selectedBaseType]
        : null}
      <Box
        overflow="visible"
        sx={{
          '& > div': {
            height: '100%',
          },
        }}
      >
        <CardBuilderPreview
          // frontFallback={
          //   <FileUploadButton
          //     name="frontDesignFile"
          //     width="100%"
          //     height="100%"
          //     accept={acceptableImageFileTypes.join(' ')}
          //     selectedFileItem={frontDesignFile}
          //     handleFileItemChange={setFrontDesignFile}
          //     uploadText="Upload front"
          //   />
          // }
          selectedFrontImageFile={frontDesignFile}
          handleFrontImageFileChange={setFrontDesignFile}
          selectedBackImageFile={backDesignFile}
          handleBackImageFileChange={setBackDesignFile}
          // backFallback={
          //   <Box height="100%" width="100%">
          //     <FileUploadButton
          //       name="backDesignFile"
          //       width="100%"
          //       height="100%"
          //       accept={acceptableImageFileTypes.join(' ')}
          //       selectedFileItem={backDesignFile}
          //       handleFileItemChange={setBackDesignFile}
          //       uploadText="Upload back"
          //     />
          //   </Box>
          // }
        />
      </Box>
    </Box>
  )
}

export default BuildStep
