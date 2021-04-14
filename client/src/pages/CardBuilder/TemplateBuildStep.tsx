import * as React from 'react'
import { Controller, useForm } from 'react-hook-form'
import Box from 'src/components/Box'
import FileUploadButton from 'src/components/FileUploadButton'
import * as Form from 'src/components/Form'
import TemplateCard from 'src/components/TemplateCard'
import templateLibrary from 'src/templates'
import { CustomizableLogoSizeFieldSpec } from 'src/templates/base'
import * as Text from 'src/components/Text'
import CardBuilderPreview from 'src/pages/CardBuilder/CardBuilderPreview'
import { acceptableImageFileTypes } from 'src/pages/CardBuilder/config'
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
    name: templateName,
    customizableOptions,
    customizableOptionNames,
  } = selectedTemplate

  const customizationForm = useForm<Record<string, any>>({
    defaultValues:
      templateCustomization ??
      customizableOptionNames.reduce((acc, fieldName) => {
        if (customizableOptions[fieldName].defaultValue) {
          acc[fieldName] = customizableOptions[fieldName].defaultValue
        }
        return acc
      }, {} as Record<string, any>),
  })

  const fields = customizationForm.watch()

  React.useEffect(() => {
    if (!areObjectsDeepEqual(fields, cardBuilderState.templateCustomization)) {
      updateCardBuilderState({
        templateCustomization: fields,
      })
    }
  }, [fields, updateCardBuilderState, cardBuilderState])

  const templateCardOptions = selectedTemplate.createOptionsFromFormFields(
    customizationForm.watch(),
  )

  return (
    <Box
      height="100%"
      display="grid"
      gridTemplateColumns="4fr 8fr"
      gridColumnGap={3}
    >
      <Box overflowY="scroll" pt={4}>
        <Box mb={3}>
          <Text.SectionSubheader mb={3}>
            Customize {templateName}
          </Text.SectionSubheader>
          {
            // For each customizable field for the currently selected template
            customizableOptionNames
              // Filter out hidden fields that should be customized internally
              .filter((fieldName) => {
                const fieldDetails = customizableOptions[fieldName]
                if (!fieldDetails.hidden) {
                  return true
                } else {
                  return !fieldDetails.hidden(templateCardOptions)
                }
              })
              .map((fieldName) => {
                const fieldDetails = customizableOptions[fieldName]
                return (
                  <Box key={fieldName} mb={3}>
                    <Form.Label required={fieldDetails.required}>
                      {fieldDetails.label}
                    </Form.Label>
                    {(() => {
                      switch (fieldDetails.type) {
                        case 'logoSize':
                          const rangeFieldDetails = fieldDetails as CustomizableLogoSizeFieldSpec<any>
                          return (
                            <Form.Input
                              width="100%"
                              type="range"
                              min={rangeFieldDetails.range.min}
                              max={rangeFieldDetails.range.max}
                              step={rangeFieldDetails.range.step}
                              name={fieldName}
                              placeholder={rangeFieldDetails.placeholder}
                              ref={customizationForm.register()}
                            />
                          )
                        case 'logo':
                          return (
                            <Controller
                              control={customizationForm.control}
                              name={fieldName}
                              render={(fieldProps, inputState) => (
                                <FileUploadButton
                                  name={fieldName}
                                  width="100%"
                                  accept={acceptableImageFileTypes.join(' ')}
                                  selectedFileItem={fieldProps.value}
                                  handleFileItemChange={fieldProps.onChange}
                                  showImagePreview
                                />
                              )}
                            />
                          )
                        case 'color':
                          return (
                            <input
                              name={fieldName}
                              type="color"
                              width="100%"
                              placeholder={fieldDetails.placeholder}
                              ref={customizationForm.register()}
                            />
                          )
                        case 'text':
                        default:
                          return (
                            <Form.Input
                              width="100%"
                              name={fieldName}
                              placeholder={fieldDetails.placeholder}
                              ref={customizationForm.register()}
                            />
                          )
                      }
                    })()}
                  </Box>
                )
              })
          }
        </Box>
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
