import * as React from 'react'
import { render, cleanup } from '@testing-library/react'
import { MockedProvider } from '@apollo/client/testing'
import { MemoryRouter, Route } from 'react-router-dom'

import ContactInfoPage from 'src/pages/ContactInfoPage'
import publicContactQuery from 'src/queries/publicContact'
import { createMockContact } from 'src/mocks/contact'

afterEach(cleanup)

describe('Contact Info Page', () => {
  let mockContact: any = null
  let publicContactQueryMock: any = null

  beforeEach(() => {
    mockContact = createMockContact()
    publicContactQueryMock = {
      request: {
        query: publicContactQuery,
        variables: { username: mockContact.username },
      },
      result: {
        data: {
          publicContact: mockContact,
        },
      },
    }
  })

  it('renders all the necessary information about the user', async () => {
    const component = render(
      <MemoryRouter initialEntries={[`/${mockContact.username}`]}>
        <MockedProvider mocks={[publicContactQueryMock]} addTypename={false}>
          <Route path="/:username" component={ContactInfoPage} />
        </MockedProvider>
      </MemoryRouter>,
    )

    await new Promise((resolve) => setTimeout(resolve, 0)) // wait for response

    const expectedTextFields = [
      mockContact.name.first,
      mockContact.name.middle,
      mockContact.name.last,
      mockContact.phoneNumber,
      mockContact.email,
      mockContact.bio,
      mockContact.headline,
      mockContact.headline,
    ].filter(Boolean)

    for (const field of expectedTextFields) {
      const fieldElement = component.queryByText(field, { exact: false })
      expect(fieldElement).toBeInTheDocument()
    }
  })
})
