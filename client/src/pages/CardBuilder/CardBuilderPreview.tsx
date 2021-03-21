import { css } from '@emotion/react'
import * as React from 'react'
import Box from 'src/components/Box'
import Button from 'src/components/Button'
import FileUploadButton from 'src/components/FileUploadButton'
import Icon from 'src/components/Icon'
import * as Text from 'src/components/Text'
import { acceptableImageFileTypes } from 'src/pages/CardBuilder/config'
import { colors } from 'src/styles'
import { FileItem } from 'src/types/files'
import CardBuilderPreviewLegend from './CardBuilderPreviewLegend'
import CardWithGuides from './CardWithGuides'

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

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      {/* <Box width="100%" height="100%"> */}
      {imageUrl ? (
        <CardWithGuides
          cardImageUrl={imageUrl}
          showGuides={showGuides ?? false}
          css={css({
            flexBasis: 'auto',
            maxHeight: '500px',
          })}
        />
      ) : (
        <FileUploadButton
          name={`${name}DesignFile`}
          width="100%"
          height="100%"
          accept={acceptableImageFileTypes.join(' ')}
          selectedFileItem={fileItem}
          handleFileItemChange={changeHandler}
          uploadText={uploadText}
        />
      )}
      {/* </Box> */}
      <Text.Body2>{labelText}</Text.Body2>
    </Box>
  )
}

interface Props {
  selectedFrontImageFile: FileItem | null
  selectedBackImageFile: FileItem | null
  handleFrontImageFileChange: (file: FileItem | null) => void
  handleBackImageFileChange: (file: FileItem | null) => void
}

const CardBuilderPreview = ({
  selectedBackImageFile,
  selectedFrontImageFile,
  handleBackImageFileChange,
  handleFrontImageFileChange,
}: Props) => {
  const [showGuides, setShowGuides] = React.useState(false)
  const [showBack, setShowBack] = React.useState(false)
  const [showBothSides, setShowBothSides] = React.useState(false)

  // Since by default we show only the front card in the preview, if the user uploads the back image
  // we should (the first time) change the preview mode to show the image they just uploaded
  const [hasAutoShownBack, setHasAutoShownBack] = React.useState(false)
  React.useEffect(() => {
    if (selectedBackImageFile?.url != null && !hasAutoShownBack) {
      setShowBothSides(true)
      setHasAutoShownBack(true)
    }
  }, [
    hasAutoShownBack,
    selectedBackImageFile,
    selectedFrontImageFile,
    setShowBack,
    setShowBothSides,
  ])

  const missingBothImages =
    selectedBackImageFile?.url == null && selectedFrontImageFile?.url == null

  return (
    <Box display="grid" gridTemplateRows="auto 1fr auto">
      <Box
        display="grid"
        gridTemplateColumns="2fr 1fr 3fr 2fr"
        gridTemplateRows="auto"
        gridColumnGap={3}
        mb={3}
      >
        <Button
          variant="secondary"
          disabled={missingBothImages}
          onClick={() => setShowGuides(!showGuides)}
          leftIcon={<Icon of="ruler" color={colors.nomusBlue} />}
        >
          {showGuides ? 'Hide' : 'Show'} guides
        </Button>
        {/* Empty box to take up the space of the 2nd column */}
        <Box />
        <Button
          variant="secondary"
          // disabled={backImage == null && frontImage == null}
          onClick={() => setShowBothSides(!showBothSides)}
          leftIcon={<Icon of="switchSides" color={colors.nomusBlue} />}
        >
          {showBothSides ? 'Show one side' : 'Show both sides'}
        </Button>
        <Button
          variant="secondary"
          disabled={missingBothImages || showBothSides}
          onClick={() => setShowBack(!showBack)}
          leftIcon={<Icon of="sync" color={colors.nomusBlue} />}
        >
          Flip to {showBack ? 'front' : 'back'}
        </Button>
      </Box>

      <Box
        placeSelf="center center"
        width="100%"
        display="grid"
        gridTemplateColumns={showBothSides ? '1fr 1fr' : '1fr'}
        gridColumnGap={2}
        sx={{
          '& > canvas': {
            placeSelf: 'center',
          },
        }}
      >
        {(!showBack || showBothSides) && (
          <CardContainer
            name="front"
            fileItem={selectedFrontImageFile ?? null}
            showGuides={showGuides}
            changeHandler={handleFrontImageFileChange}
          />
        )}
        {(showBack || showBothSides) && (
          <CardContainer
            name="back"
            fileItem={selectedBackImageFile ?? null}
            showGuides={showGuides}
            changeHandler={handleBackImageFileChange}
          />
        )}
      </Box>

      {showGuides ? (
        <Box
          display="grid"
          gridTemplateColumns="1fr 6fr 1fr"
          mt={4}
          width="100%"
          placeSelf="end center"
        >
          <Box gridColumn="2/3">
            <CardBuilderPreviewLegend />
          </Box>
        </Box>
      ) : null}
    </Box>
  )
}

export default CardBuilderPreview
