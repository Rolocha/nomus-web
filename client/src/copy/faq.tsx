import Link from 'src/components/Link'

export const faqItems = [
  {
    question: 'How does Nomus work?',
    answer: (
      <>
        Build up your public profile and create your business card right on the
        Nomus Card Builder. After you've placed your order, we'll send you your
        pack of custom business cards, each with an NFC chip embedded inside.
        When you open up your package, you'll see instructions on how to set up
        your cards, or you can find set-up instructions right on the site. As
        soon as you link your card to your digital profile, you're ready to
        start tapping away, sharing your profile and adding contacts to Nomus.
        Learn more about Nomus and our story on our{' '}
        {<Link to="/about">About</Link>} page.
      </>
    ),
  },
  {
    question: 'What is NFC?',
    answer:
      'Inside these business cards, there’s something that sets it apart from all the others – an NFC (near-field communication) chip. You might have used similar contactless payment through your credit card or technologies like Apple Pay. Nomus cards use the same technology, but instead of using it to pay, you can use it to network. With just a tap of your Nomus card to the back of a smartphone, you can share your digital contact page with anyone around you.',
  },
  {
    question: "What if my phone isn't NFC-compatible?",
    answer:
      "Don't worry. We pride our Nomus cards with having three-point interaction. This means that NFC is only one of three ways to access contact information. The second way is via QR code. Scan that on your phone and you'll be taken to the associated public profile. Don't have your phone on you? Well the third way is to just take the card, the good old-fashioned way. You can always access it later! Just so you know, all devices running Android 4.0 or later and all iPhones since the iPhone 6 are NFC-enabled.",
  },
  {
    question: 'How many can I order?',
    answer:
      "Nomus offers 2 tiers: 100 cards and 250 cards. The more cards you buy in one order, the more you save. If you'd like to buy more than 250 cards at once, no worries. Just contact us at support@nomus.me, and we'll sort it out for you.",
  },
  {
    question: 'What size and material are the business cards?',
    answer:
      'Nomus cards are printed on high quality 18-point cardstock and cut to the US standard business card size of 3.5 x 2 inches.',
  },
  {
    question: 'Can I print anything I want on my card?',
    answer:
      "Pretty much anything! That is, as long as there's nothing inappropriate on there. We reserve the right not to print your order if we deem the content to be inappropriate or offensive. If we cancel your order because of this, you'll get 100% refunded. Refer to our Terms of Service for more information.",
  },
  {
    question: 'Can I get a sample?',
    answer: 'We offer sample boxes of 25 cards for purchase.',
  },
  {
    question: 'How long will my cards take to get to me?',
    answer:
      "Your Nomus order should get out to you within two weeks. If not, reach out to us at support@nomus.me and we'll do what we can to make your experience better.",
  },
  {
    question: 'Can I return the cards?',
    answer:
      "Since these cards are going to be printed with your personal information, we can't take any returns. If there's anything you're dissatisfied with, however, please get in contact with us at support@nomus.me.",
  },
  {
    question: 'Does Nomus have anything to do with food?',
    answer:
      'We know "Nom" in popular culture has associations with food and eating, but the "Nom" in Nomus refers to the Latin root word for "name." Nomus definitely has nothing to do with noms – unless you\'re a food business. In that case, by all means, get yourself a Nomus card already!',
  },
]
