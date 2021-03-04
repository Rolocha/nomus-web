import * as React from 'react'
import Box from 'src/components/Box'
import * as Text from 'src/components/Text'
import Accordion from 'src/components/Accordion'
import * as Form from 'src/components/Form'
import Navbar from 'src/components/Navbar'
import Button from 'src/components/Button'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { createMailtoURL } from 'src/utils/email'
import { faqItems } from 'src/copy/faq'

interface FormData {
  name: string
  email: string
  entry: string
}

const bp = 'lg'

export default () => {
  const { register, handleSubmit, errors, formState } = useForm<FormData>({
    mode: 'onBlur',
    resolver: yupResolver(
      yup.object().shape({
        name: yup.string(),
        email: yup
          .string()
          .email('Please enter a valid email address.')
          .required('Email is required.'),
        entry: yup.string().required('Please enter your question.'),
      }),
    ),
  })

  const onSubmit = async (formData: FormData) => {
    function getRandomInt(min: number, max: number) {
      min = Math.ceil(min)
      max = Math.floor(max)
      return Math.floor(Math.random() * (max - min) + min)
    }

    const ticketId = getRandomInt(1000, 9999)

    window.location.href = createMailtoURL({
      to: 'help@nomus.me',
      subject: `Customer Support for ${formData.name} #${ticketId}`,
      body: `${formData.entry}`,
    })
  }

  return (
    <Box overflowX="hidden" position="relative" width="100vw" height="100vh">
      <Navbar />
      <Box>
        <Box
          height={{ _: '142px', [bp]: '154px' }}
          backgroundColor="ivory"
          textAlign="center"
        >
          <Text.PageHeader pt="20px"> Need a hand?</Text.PageHeader>
          <Text.Body>
            Here's ours. We're here to help whenever you need us.
          </Text.Body>
        </Box>
        <Box
          display="grid"
          gridTemplateColumns={{
            _: 'repeat(12, 1fr)',
            [bp]: 'repeat(12, 1fr)',
          }}
          mx={{ _: '24px', [bp]: '96px' }}
          pt="16px"
          pb="32px"
          gridColumnGap={{ _: 2, [bp]: 3 }}
        >
          <Box gridColumn={{ _: 'span 12', [bp]: '1/8' }} py="9px">
            <Text.SectionHeader mb="16px">
              Frequently asked questions
            </Text.SectionHeader>

            {faqItems.map(({ question, answer }) => (
              <Accordion key={question} title={question}>
                <Text.Body2>{answer}</Text.Body2>
              </Accordion>
            ))}
          </Box>
          <Box
            gridColumn={{ _: '1/12', [bp]: '9/12' }}
            boxShadow="workingWindow"
            borderRadius="16px"
            px="24px"
            py="16px"
            marginLeft="24px"
            alignSelf="start"
            mt={{ _: '32px', [bp]: '24px' }}
            width="150%"
            justifySelf="center"
          >
            <Text.SectionHeader mb="16px">
              Can't find an answer?
            </Text.SectionHeader>
            <Text.Body2 mb="16px">
              We'd love to help. Shoot us a message below.
            </Text.Body2>

            <Form.Form onSubmit={handleSubmit(onSubmit)}>
              <Form.Item mb="16px">
                <Form.Label htmlFor="name">NAME</Form.Label>
                <Form.Input
                  name="name"
                  ref={register({ required: true })}
                  type="text"
                  autoComplete="name"
                  error={errors.name}
                />
                <Form.FieldError fieldError={errors.name} />
              </Form.Item>
              <Form.Item mb="16px">
                <Form.Label htmlFor="email">EMAIL</Form.Label>
                <Form.Input
                  name="email"
                  ref={register({ required: true })}
                  type="email"
                  autoComplete="email"
                  error={errors.email}
                />
                <Form.FieldError fieldError={errors.email} />
              </Form.Item>
              <Form.Item mb="16px">
                <Form.Label htmlFor="entry">
                  WHAT DO YOU WANT TO KNOW?
                </Form.Label>
                <Form.TextArea
                  name="entry"
                  ref={register({ required: true })}
                  rows={4}
                  error={errors.entry}
                  height={{ _: '100px', [bp]: '100%' }}
                />
                <Form.FieldError fieldError={errors.entry} />
              </Form.Item>
              <Box display="flex" justifyContent="center" gridColumn="span 2">
                <Button
                  type="submit"
                  width={{ _: '45%', [bp]: '55%' }}
                  variant="secondary"
                  size="normal"
                  inProgress={formState.isSubmitting}
                  inProgressText="Submitting"
                >
                  Submit request
                </Button>
              </Box>
            </Form.Form>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
