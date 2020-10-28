import * as React from 'react'
import { render, cleanup } from '@testing-library/react'
import { MockedProvider } from '@apollo/client/testing'
import { MemoryRouter, Route } from 'react-router-dom'

import * as Auth from 'src/utils/auth'
import ContactInfoPage from 'src/pages/ContactInfoPage'
import publicContactQuery from 'src/queries/publicContact'
import { createMockContact } from 'src/mocks/contact'
import { formatName } from 'src/utils/name'
import { Contact } from 'src/types/contact'

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

  const renderComponent = (contact: Contact) => {
    return render(
      <MemoryRouter initialEntries={[`/${contact.username}`]}>
        <MockedProvider mocks={[publicContactQueryMock]} addTypename={false}>
          <Route path="/:username" component={ContactInfoPage} />
        </MockedProvider>
      </MemoryRouter>,
    )
  }

  it('renders the loading page until the contact info is available', () => {
    const component = renderComponent(mockContact)
    expect(component.getByTestId('spinner')).toBeInTheDocument()
  })

  it('renders all the necessary information about the user', async () => {
    const component = renderComponent(mockContact)

    await new Promise((resolve) => setTimeout(resolve, 0)) // wait for response

    const expectedTextFields = [
      formatName(mockContact.name),
      mockContact.phoneNumber,
      mockContact.email,
      mockContact.bio,
      mockContact.headline,
    ]

    for (const field of expectedTextFields) {
      const fieldElement = component.queryByText(field)
      expect(fieldElement).toBeInTheDocument()
    }
  })

  describe('Save contact card button', () => {
    it('links to the VCF file download', async () => {
      const component = renderComponent(mockContact)
      await new Promise((resolve) => setTimeout(resolve, 0)) // wait for response

      const saveContactCardLink = component
        .getByText('Save contact card')
        .closest('a')

      expect(
        saveContactCardLink
          ?.getAttribute('href')
          ?.startsWith(`/api/contact-card/${mockContact.username}`),
      ).toBe(true)
      expect(saveContactCardLink?.getAttribute('download')).toBe(
        `${mockContact.username}.vcf`,
      )
    })
  })

  describe('Save to Nomus button', () => {
    const contactSaveUrl = '/dashboard/contacts/save'
    it('if logged in, links to the /dashboard/contact/save', async () => {
      const useAuthSpy = jest.spyOn(Auth, 'useAuth').mockImplementation(() => ({
        logIn: jest.fn(),
        logOut: jest.fn(),
        signUp: jest.fn(),
        refreshToken: jest.fn(),
        loggedIn: true,
        id: 'some_id',
        userRoles: [Auth.Role.User],
      }))

      const component = renderComponent(mockContact)
      await new Promise((resolve) => setTimeout(resolve, 0)) // wait for response

      const saveContactCardLink = component
        .getByText('Save to Nomus')
        .closest('a')

      expect(saveContactCardLink?.getAttribute('href')).toStartWith(
        contactSaveUrl,
      )

      useAuthSpy.mockRestore()
    })

    it('if logged out, links to the register page with the appropriate redirect_url', async () => {
      const useAuthSpy = jest.spyOn(Auth, 'useAuth').mockImplementation(() => ({
        logIn: jest.fn(),
        logOut: jest.fn(),
        signUp: jest.fn(),
        refreshToken: jest.fn(),
        loggedIn: false,
        id: null,
        userRoles: null,
      }))

      const component = renderComponent(mockContact)
      await new Promise((resolve) => setTimeout(resolve, 0)) // wait for response

      const saveContactCardLink = component
        .getByText('Save to Nomus')
        .closest('a')

      const contactSaveUrl = '/dashboard/contacts/save'

      const anchorHref = saveContactCardLink?.getAttribute('href')
      expect(anchorHref).toStartWith(
        `/register?redirect_url=${encodeURIComponent(contactSaveUrl)}`,
      )

      expect(anchorHref != null).toBe(true)
      if (anchorHref != null) {
        const searchParams = new URLSearchParams(anchorHref.split('?')[1])
        const redirectUrl = searchParams.get('redirect_url') as string
        const redirectSearchParams = new URLSearchParams(redirectUrl)
        expect(redirectSearchParams.get('username')).toBe(mockContact.username)
      }

      useAuthSpy.mockRestore()
    })
  })
})
