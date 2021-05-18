import * as React from 'react'
import { Switch } from '@chakra-ui/react'
import { Controller, useForm } from 'react-hook-form'
import Box from 'src/components/Box'
import FileUploadButton from 'src/components/FileUploadButton'
import * as Form from 'src/components/Form'
import TemplateCard from 'src/components/TemplateCard'
import * as Text from 'src/components/Text'
import CardBuilderPreview from 'src/pages/CardBuilder/CardBuilderPreview'
import { acceptableImageFileTypes } from 'src/pages/CardBuilder/config'
import templateLibrary from 'src/templates'
import { areObjectsDeepEqual } from 'src/utils/object'
import { CardBuilderAction, CardBuilderState } from './card-builder-state'

interface Props {
  cardBuilderState: CardBuilderState
  updateCardBuilderState: React.Dispatch<CardBuilderAction>
}

const TemplateBuildStep = ({
  cardBuilderState,
  updateCardBuilderState,
}: Props) => {
  const { templateId, templateCustomization } = cardBuilderState

  if (templateId == null) {
    throw new Error(
      '<TemplateBuildStep /> rendered but templateId was not defined',
    )
  }

  const selectedTemplate = templateLibrary[templateId]

  const {
    colorKeys,
    contactInfoSpec: contactInfo,
    contactInfoFieldNames,
    defaultOptions,
  } = selectedTemplate

  const customizationForm = useForm<Record<string, any>>({
    defaultValues: {
      ...(templateCustomization ?? defaultOptions),
      qrCodeUrl: cardBuilderState.cardVersionId
        ? `${window.location.host}/d/${cardBuilderState.cardVersionId}`
        : `${window.location.host}`,
    },
  })

  const fields = customizationForm.watch()

  const setOptionalFieldOmission = React.useCallback(
    (fieldFormKey, shouldOmit) => {
      if (shouldOmit) {
        updateCardBuilderState({
          omittedOptionalFields: [
            ...cardBuilderState.omittedOptionalFields,
            fieldFormKey,
          ],
        })
      } else {
        updateCardBuilderState({
          omittedOptionalFields: cardBuilderState.omittedOptionalFields.filter(
            (key) => key !== fieldFormKey,
          ),
        })
      }
    },
    [updateCardBuilderState, cardBuilderState],
  )

  React.useEffect(() => {
    if (!areObjectsDeepEqual(fields, cardBuilderState.templateCustomization)) {
      updateCardBuilderState({
        templateCustomization: fields,
      })
    }
  }, [fields, updateCardBuilderState, cardBuilderState])

  const templateCardOptions = selectedTemplate.createOptionsFromFormFields(
    fields,
    cardBuilderState.omittedOptionalFields as Array<any>,
  )

  return (
    <Box
      height="100%"
      display="grid"
      gridTemplateColumns="4fr 8fr"
      gridColumnGap={3}
    >
      {/* Left-hand side: customizable fields */}
      <Box
        overflowY="scroll"
        display="grid"
        gridTemplateColumns="1fr"
        gridRowGap={4}
      >
        {/* Color scheme */}
        <Box>
          <Text.SectionSubheader mb={3}>Color scheme</Text.SectionSubheader>
          <Box
            display="grid"
            gridTemplateColumns={`repeat(${colorKeys.length}, 1fr)`}
            gridColumnGap={3}
          >
            {colorKeys.map((colorKey) => (
              <Box display="flex" flexDirection="column" alignItems="center">
                <Form.Input
                  type="color"
                  name={'colorScheme.' + colorKey}
                  height="40px"
                  width="100%"
                  ref={customizationForm.register()}
                />
                <Text.Body3 textTransform="capitalize">{colorKey}</Text.Body3>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Graphic element */}
        <Box>
          <Text.SectionSubheader mb={3}>
            Upload graphic element
          </Text.SectionSubheader>
          <Text.Body3 mb={4}>
            Each template has a space for you to add a personal or company logo.
            Feel free to upload one, as long as it’s 300 dpi and under 5mb. We
            accept .jpg and .png files.
          </Text.Body3>
          <Box mb={4}>
            <Controller
              control={customizationForm.control}
              name="graphic.file"
              render={(fieldProps, inputState) => (
                <FileUploadButton
                  name="graphic.file"
                  width="100%"
                  accept={acceptableImageFileTypes.join(' ')}
                  selectedFileItem={fieldProps.value}
                  handleFileItemChange={fieldProps.onChange}
                  showImagePreview
                />
              )}
            />
          </Box>
          {templateCardOptions.graphic?.url && (
            <Form.Input
              name="graphic.size"
              type="range"
              width="100%"
              min={0.1}
              max={1}
              step={0.05}
              ref={customizationForm.register()}
            />
          )}
        </Box>

        {/* Contact information */}
        <Box>
          <Text.SectionSubheader mb={3}>
            Contact information
          </Text.SectionSubheader>
          {contactInfoFieldNames.map((fieldName) => {
            const fieldDetails = contactInfo[fieldName]
            const fieldFormKey = `contactInfo.${fieldName}`
            const fieldRequired = fieldDetails.required
            const userWantsToOmitThisField = cardBuilderState.omittedOptionalFields.includes(
              fieldFormKey,
            )
            const inputDisabled = !fieldRequired && userWantsToOmitThisField

            const label = (
              <Form.Label required={fieldDetails.required}>
                {fieldDetails.label}
              </Form.Label>
            )

            return (
              <Box key={fieldName} mb={4}>
                {fieldDetails.required ? (
                  label
                ) : (
                  <Box
                    display="grid"
                    gridTemplateColumns="1fr auto"
                    gridColumnGap={2}
                  >
                    {label}
                    <Switch
                      colorScheme="blue"
                      isChecked={!fieldRequired && !userWantsToOmitThisField}
                      onChange={(event) => {
                        const shouldOmit = !event.target.checked
                        setOptionalFieldOmission(fieldFormKey, shouldOmit)
                      }}
                    />
                  </Box>
                )}

                <Box
                  // We need to set this onClick handler on a box wrapping the Form.Input
                  // because inputs that are disabled won't pick up (or bubble up) click
                  // events so the only option is to have the input ignore pointerEvents altogher
                  // and handle the click event on a wrapper component
                  onClick={() => {
                    // If user clicks on the field that's disabled, they probably want to include it
                    // so automatically remove it from the omitted fields list
                    if (inputDisabled) {
                      setOptionalFieldOmission(fieldFormKey, false)
                    }
                  }}
                >
                  <Form.Input
                    width="100%"
                    name={fieldFormKey}
                    placeholder={fieldDetails.placeholder}
                    ref={customizationForm.register()}
                    disabled={inputDisabled}
                    sx={{ pointerEvents: inputDisabled ? 'none' : undefined }}
                  />
                </Box>
              </Box>
            )
          })}
        </Box>
        <Form.Input
          hidden
          name="qrCodeUrl"
          ref={customizationForm.register()}
          value={
            cardBuilderState.cardVersionId
              ? `https://nomus.me/d/${cardBuilderState.cardVersionId}`
              : 'https://nomus.me'
          }
        />
      </Box>
      <Box
        overflow="visible"
        sx={{
          '& > canvas': {
            width: '100%',
            marginBottom: '8px',
          },
        }}
      >
        <CardBuilderPreview
          cardOrientation={
            templateLibrary[templateId].height >
            templateLibrary[templateId].width
              ? 'vertical'
              : 'horizontal'
          }
          renderFront={({ showGuides }) => (
            <TemplateCard
              showGuides={showGuides}
              templateId={templateId}
              side="front"
              options={templateCardOptions}
            />
          )}
          renderBack={({ showGuides }) => (
            <TemplateCard
              showGuides={showGuides}
              templateId={templateId}
              side="back"
              options={templateCardOptions}
            />
          )}
        />
      </Box>
    </Box>
  )
}

export default TemplateBuildStep
