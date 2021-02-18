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
import { css } from '@emotion/core'
import { createMailtoURL } from 'src/utils/email'
import { useBreakpoint } from 'src/styles/breakpoints'
interface FormData {
  name: string
  email: string
  entry: string
}
const bp = 'lg'

export default () => {
  const isDesktop = useBreakpoint(bp)
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
      return Math.floor(Math.random() * (max - min) + min) //The maximum is exclusive and the minimum is inclusive
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
          height={isDesktop ? '154px' : '142px'}
          backgroundColor="ivory"
          textAlign="center"
        >
          <Text.PageHeader pt="20px"> Need a hand?</Text.PageHeader>
          <Text.Body>
            Here's ours. We're here to help whenever you need us.
          </Text.Body>
        </Box>
        <Box
          // display="flex"
          // flexDirection="column"
          // justifyContent="center"
          // alignItems="center"
          // container
          display="grid"
          gridTemplateColumns={{
            _: 'repeat(12, 1fr)',
            [bp]: 'repeat(12, 1fr)',
          }}
          marginLeft={isDesktop ? '96px' : '24px'}
          marginRight={isDesktop ? '96px' : '24px'}
          pt="16px"
          pb="32px"
          gridColumnGap={{ _: 2, [bp]: 3 }}
        >
          <Box gridColumn={isDesktop ? '1/8' : 'span 12'} py="9px">
            <Text.SectionHeader mb="16px">
              Frequently asked questions
            </Text.SectionHeader>
            <Accordion title="How does Nomus work?">
              <Text.Body2>
                Build up your public profile and create your business card right
                on the Nomus Card Builder. After you've placed your order, we'll
                send you your pack of custom business cards, each with an NFC
                chip embedded inside. When you open up your package, you'll see
                instructions on how to set up your cards, or you can find set-up
                instructions right on the site. As soon as you link your card to
                your digital profile, you're ready to start tapping away,
                sharing your profile and adding contacts to Nomus. Learn more
                about Nomus and our story on our [About](https://nomus.me/about)
                page.
              </Text.Body2>
            </Accordion>

            <Accordion title="What is NFC?">
              <Text.Body2>
                Inside these business cards, there’s something that sets it
                apart from all the others – an NFC (near-field communication)
                chip. You might have used similar contactless payment through
                your credit card or technologies like Apple Pay. Nomus cards use
                the same technology, but instead of using it to pay, you can use
                it to network. With just a tap of your Nomus card to the back of
                a smartphone, you can share your digital contact page with
                anyone around you.
              </Text.Body2>
            </Accordion>
            <Accordion title="What if my phone isn't NFC-compatible?">
              <Text.Body2>
                Don't worry. We pride our Nomus cards with having three-point
                interaction. This means that NFC is only one of three ways to
                access contact information. The second way is via QR code. Scan
                that on your phone and you'll be taken to the associated public
                profile. Don't have your phone on you? Well the third way is to
                just take the card, the good old-fashioned way. You can always
                access it later! Just so you know, all devices running Android
                4.0 or later and all iPhones since the iPhone 6 are NFC-enabled.
              </Text.Body2>
            </Accordion>
            <Accordion title="How many can I order?">
              <Text.Body2>
                Nomus offers 2 tiers: 100 cards and 250 cards. The more cards
                you buy in one order, the more you save. If you'd like to buy
                more than 250 cards at once, no worries. Just contact us at
                support@nomus.me, and we'll sort it out for you.
              </Text.Body2>
            </Accordion>
            <Accordion title="What size and material are the business cards?">
              <Text.Body2>
                Nomus cards are printed on high quality 18-point cardstock and
                cut to the US standard business card size of 3.5 x 2 inches.
              </Text.Body2>
            </Accordion>
            <Accordion title="Can I print anything I want on my card?">
              <Text.Body2>
                Pretty much anything! That is, as long as there's nothing
                inappropriate on there. We reserve the right not to print your
                order if we deem the content to be inappropriate or offensive.
                If we cancel your order because of this, you'll get 100%
                refunded. Refer to our Terms of Service for more information.
              </Text.Body2>
            </Accordion>
            <Accordion title="Can I get a sample?">
              <Text.Body2>We offer sample boxes of 25 cards.</Text.Body2>
            </Accordion>
            <Accordion title="How long will my cards take to get to me?">
              <Text.Body2>
                Your Nomus order should get out to you within two weeks. If not,
                reach out to us at support@nomus.me and we'll do what we can to
                make your experience better.
              </Text.Body2>
            </Accordion>
            <Accordion title="Can I return the cards?">
              <Text.Body2>
                Since these cards are going to be printed with your personal
                information, we can't take any returns. If there's anything
                you're dissatisfied with, however, please get in contact with us
                at support@nomus.me.
              </Text.Body2>
            </Accordion>
            <Accordion title="Does Nomus have anything to do with food?">
              <Text.Body2>
                We know "Nom" in popular culture has associations with food and
                eating, but the "Nom" in Nomus refers to the Latin root word for
                "name." Nomus definitely has nothing to do with noms – unless
                you're a food business. In that case, by all means, get yourself
                a Nomus card already!
              </Text.Body2>
            </Accordion>
          </Box>
          <Box
            gridColumn={isDesktop ? '9/12' : '1/12'}
            boxShadow="workingWindow"
            borderRadius="16px"
            px="24px"
            py="16px"
            marginLeft="24px"
            alignSelf="start"
            mt={isDesktop ? '24px' : '32px'}
            width="350px"
            justifySelf="center"
          >
            <Text.SectionHeader mb="16px">
              {' '}
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
                  height={isDesktop ? '100%' : '100px'}
                />
                <Form.FieldError fieldError={errors.entry} />
              </Form.Item>
              <Box display="flex" justifyContent="center" gridColumn="span 2">
                <Button
                  type="submit"
                  width={isDesktop ? '55%' : '45%'}
                  css={css`
                    text-align: center;
                  `}
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
