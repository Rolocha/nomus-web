import { css } from '@emotion/react'
import * as React from 'react'
import Banner from 'src/components/Banner'
import Box from 'src/components/Box'
import FileUploadButton from 'src/components/FileUploadButton'
import Icon from 'src/components/Icon'
import Link from 'src/components/Link'
import * as Text from 'src/components/Text'
import { FileItem } from 'src/types/files'
import { getImageDimensions, ImageDimensions } from 'src/utils/image'
import { CardBuilderAction, CardBuilderState } from './card-builder-state'
import CardBuilderPreview from './CardBuilderPreview'
import CardWithGuides from './CardWithGuides'
import { acceptableImageFileTypes } from './config'
import { specs } from './copy'

interface Props {
  cardBuilderState: CardBuilderState
  updateCardBuilderState: React.Dispatch<CardBuilderAction>
}

const CardContainer = ({
  name,
  fileItem,
  showGuides,
  changeHandler,
}: {
  name: 'front' | 'back'
  fileItem: FileItem | null
  showGuides?: boolean
  changeHandler: (file: FileItem | null) => void
}) => {
  const uploadText = { front: `Upload front`, back: 'Upload back' }[name]
  const labelText = { front: `Front`, back: 'Back' }[name]

  const imageUrl = fileItem?.url

  if (!imageUrl) {
    return (
      <Box position="relative">
        {/* Using padding-bottom trick to get a responsive 3.5 x 2 (or 2 x 3.5) aspect ratio rectangle */}
        <Box
          position="relative"
          pb={{
            base: 'calc(100% * calc(2/3.5))',
            lg: 'calc(100% * calc(3.5/2))',
          }}
        />
        <Box
          position="absolute"
          top="0"
          left="0"
          width="100%"
          height="100%"
          display="flex"
          flexDirection="column"
          alignItems="center"
        >
          <FileUploadButton
            name={`${name}DesignFile`}
            width="100%"
            height="100%"
            accept={acceptableImageFileTypes.join(' ')}
            selectedFileItem={fileItem}
            handleFileItemChange={changeHandler}
            uploadText={uploadText}
          />
          <Text.Body2>{labelText}</Text.Body2>
        </Box>
      </Box>
    )
  }
  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <CardWithGuides
        cardImageUrl={imageUrl}
        showGuides={showGuides ?? false}
        css={css({
          flexBasis: 'auto',
          maxHeight: '500px',
        })}
      />
      <Text.Body2>{labelText}</Text.Body2>
    </Box>
  )
}

const CustomBuildStep = ({
  cardBuilderState,
  updateCardBuilderState,
}: Props) => {
  const { frontDesignFile, backDesignFile } = cardBuilderState

  const setFrontDesignFile = (file: FileItem | null) => {
    updateCardBuilderState({
      frontDesignFile: file,
    })
    if (file == null) {
      setDimensionMismatch(false)
    }
  }
  const setBackDesignFile = (file: FileItem | null) => {
    updateCardBuilderState({
      backDesignFile: file,
    })
    if (file == null) {
      setDimensionMismatch(false)
    }
  }

  const [dimensionMismatch, setDimensionMismatch] = React.useState(false)
  const [dimensions, setDimensions] = React.useState<ImageDimensions | null>(
    null,
  )

  React.useEffect(() => {
    const compareDimensions = async () => {
      if (frontDesignFile?.url && backDesignFile?.url) {
        const frontDims = await getImageDimensions(frontDesignFile.url)
        const backDims = await getImageDimensions(backDesignFile.url)
        const mismatched =
          frontDims.height !== backDims.height ||
          frontDims.width !== backDims.width
        setDimensionMismatch(mismatched)
        setDimensions(frontDims)
      }
    }

    compareDimensions()
  }, [frontDesignFile, backDesignFile])

  return (
    <Box
      height="100%"
      display="grid"
      gridTemplateColumns={{ base: '1fr', lg: '4fr 8fr' }}
      gridTemplateAreas={{
        base: `
        "notification"
        "preview"
        "controls"
        `,
        lg: `
        "notification notification"
        "controls preview"
        `,
      }}
      gridGap={3}
      gridColumnGap={3}
    >
      {dimensionMismatch && (
        <Box gridArea="notification" pt={2} mb={4} overflow="visible">
          <Banner
            type="danger"
            title="Your card's front and back images have different dimensions!"
            description="We strongly recommend using front and back images with the same dimensions to ensure your card looks great when printed."
          />
        </Box>
      )}

      <Box gridArea="controls" pt={4}>
        <Box>
          <Text.SectionSubheader mb={2}>
            Upload front design
          </Text.SectionSubheader>
          <Text.Body2 mb={2}>
            This side should include an <strong>N-mark</strong>{' '}
            <Icon of="nfc" /> to indicate NFC compatibility. Download N-mark
            icon (
            <Link download="n-mark.svg" type="external" href="/n-mark.svg">
              svg
            </Link>
            ,{' '}
            <Link download="n-mark.png" type="external" href="/n-mark.png">
              png
            </Link>
            ).
          </Text.Body2>
          <FileUploadButton
            name="frontImage"
            width="100%"
            accept={acceptableImageFileTypes.join(',')}
            selectedFileItem={frontDesignFile}
            handleFileItemChange={setFrontDesignFile}
            showImagePreview
          />
        </Box>

        <Box mt="24px">
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

        <Box mt="24px">
          <Text.SectionSubheader mb={2}>
            Design specifications
          </Text.SectionSubheader>
          <Box
            display="grid"
            gridTemplateColumns="auto 1fr"
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

      <Box
        gridArea="preview"
        overflow="visible"
        sx={{
          '& > div': {
            height: '100%',
          },
        }}
      >
        <CardBuilderPreview
          cardOrientation={
            dimensions
              ? dimensions.height > dimensions.width
                ? 'vertical'
                : 'horizontal'
              : 'vertical'
          }
          renderFront={({ showGuides }) => (
            <CardContainer
              name="front"
              fileItem={frontDesignFile}
              showGuides={!frontDesignFile || showGuides}
              changeHandler={setFrontDesignFile}
            />
          )}
          renderBack={({ showGuides }) => (
            <CardContainer
              name="back"
              fileItem={backDesignFile}
              showGuides={showGuides}
              changeHandler={setBackDesignFile}
            />
          )}
        />
      </Box>
    </Box>
  )
}

export default CustomBuildStep
