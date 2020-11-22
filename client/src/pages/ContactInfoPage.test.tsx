import { MockedProvider, MockedResponse } from '@apollo/client/testing'
import {
  cleanup,
  createEvent,
  fireEvent,
  render,
  RenderResult,
  waitForElementToBeRemoved,
} from '@testing-library/react'
import * as React from 'react'
import { MemoryRouter, Route, Switch, useLocation } from 'react-router-dom'
import { ContactInfoInput } from 'src/apollo/types/globalTypes'
import { createMockContact } from 'src/mocks/contact'
import saveContactMutation from 'src/mutations/saveContactMutation'
import ContactInfoPage, { NotesFormData } from 'src/pages/ContactInfoPage'
import publicContactQuery from 'src/queries/publicContact'
import { validateUrl } from 'src/test-utils/url.test'
import { Contact } from 'src/types/contact'
import * as Auth from 'src/utils/auth'
import {
  getFormattedFullDate,
  getFormattedFullDateFromDateInputString,
} from 'src/utils/date'
import { formatName } from 'src/utils/name'
import LoginPage from './LoginPage'

afterEach(cleanup)

const createSaveContactMutationMock = (
  contact: Contact,
  newContactInfo: ContactInfoInput,
  resultingContact: Contact = contact,
) => {
  return {
    request: {
      query: saveContactMutation,
      variables: {
        username: contact.username,
        contactInfo: newContactInfo,
      },
    },
    result: {
      data: {
        saveContact: resultingContact,
      },
    },
  }
}

const ui = {
  openNotesModal: (renderResult: RenderResult) => {
    // Open the modal
    fireEvent(
      renderResult.getByText('Edit', { exact: false }).closest('button')!,
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      }),
    )
  },
  saveNotesModal: (renderResult: RenderResult) => {
    // Hit Save
    fireEvent(
      renderResult.getByRole('button', { name: 'Save' }).closest('button')!,
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      }),
    )
  },
  cancelNotesModal: (renderResult: RenderResult) => {
    // Hit Cancel
    fireEvent(
      renderResult.getByRole('button', { name: 'Cancel' }).closest('button')!,
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      }),
    )
  },
  confirmDiscardNotes: (renderResult: RenderResult) => {
    // Hit Discard
    fireEvent(
      renderResult
        .getByRole('button', {
          name: 'Discard',
        })
        .closest('button')!,
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      }),
    )
  },
  setNotesModalFormValues: (values: Partial<NotesFormData>) => {
    // Set the values
    const meetingDateInput = document.querySelector(
      'input[name=meetingDate]',
    ) as HTMLInputElement
    if (values.meetingDate) {
      fireEvent.input(
        meetingDateInput,
        createEvent.change(meetingDateInput, {
          target: { value: values.meetingDate },
        }),
      )
    }

    const meetingPlaceInput = document.querySelector(
      'input[name=meetingPlace]',
    ) as HTMLInputElement
    if (values.meetingPlace) {
      fireEvent.input(
        meetingPlaceInput,
        createEvent.change(meetingPlaceInput, {
          target: { value: values.meetingPlace },
        }),
      )
    }

    const tagsInput = document.querySelector(
      'input[name=tags]',
    ) as HTMLInputElement
    if (values.tags) {
      fireEvent.input(
        tagsInput,
        createEvent.change(tagsInput, {
          target: { value: values.tags },
        }),
      )
    }

    const notesInput = document.querySelector(
      'textarea[name=notes]',
    ) as HTMLTextAreaElement
    if (values.notes) {
      fireEvent.input(
        notesInput,
        createEvent.change(notesInput, {
          target: { value: values.notes },
        }),
      )
    }
  },
}

describe('Contact Info Page', () => {
  let mockContact: Contact | null = null
  let testLocation: ReturnType<typeof useLocation> | null = null

  interface RenderComponentProps {
    partialContact?: Partial<Contact> | null
    mocks?: Array<MockedResponse<any>>
  }

  const renderComponent = ({
    partialContact,
    mocks: extraMocks = [],
  }: RenderComponentProps = {}) => {
    mockContact = createMockContact(partialContact ?? undefined)
    const mocks = [
      {
        request: {
          query: publicContactQuery,
          variables: { username: mockContact.username },
        },
        result: {
          data: {
            publicContact: mockContact,
          },
        },
      },
      ...extraMocks,
    ]

    const renderResult = render(
      <MemoryRouter initialEntries={[`/${mockContact.username}`]}>
        <MockedProvider mocks={mocks} addTypename={false}>
          <Switch>
            <Route path="/register" component={LoginPage} />
            <Route path="/:username" component={ContactInfoPage} />
          </Switch>
        </MockedProvider>
        <Route
          path="*"
          render={({ location }) => {
            testLocation = location
            return null
          }}
        />
      </MemoryRouter>,
    )

    return { contact: mockContact, renderResult }
  }

  it('renders the loading page until the contact info is available', () => {
    const { renderResult } = renderComponent({ partialContact: mockContact })
    expect(renderResult.getByTestId('spinner')).toBeInTheDocument()
  })

  it('renders all the necessary information about the user', async () => {
    const { renderResult } = renderComponent({ partialContact: mockContact })

    await new Promise((resolve) => setTimeout(resolve, 0)) // wait for response

    const formattedName = formatName(mockContact?.name!)
    const expectedTextFields = [
      formattedName,
      mockContact?.phoneNumber,
      mockContact?.email,
      mockContact?.bio,
      mockContact?.headline,
    ]

    for (const field of expectedTextFields) {
      const fieldElement = renderResult.queryByText(field!)
      expect(fieldElement).toBeInTheDocument()
    }

    // Profile picture
    expect(
      renderResult.queryByAltText(`profile picture of ${formattedName}`),
    ).toBeInTheDocument()

    expect(
      renderResult.queryByAltText(`front of ${formattedName}'s Nomus card`),
    ).toBeInTheDocument()
    expect(
      renderResult.queryByAltText(`back of ${formattedName}'s Nomus card`),
    ).toBeInTheDocument()
  })

  describe('Save contact card button', () => {
    it('links to the VCF file download', async () => {
      const { renderResult } = renderComponent({ partialContact: mockContact })
      await new Promise((resolve) => setTimeout(resolve, 0)) // wait for response

      const saveContactCardLink = renderResult
        .getByText('Save contact card')
        .closest('a')

      expect(
        saveContactCardLink
          ?.getAttribute('href')
          ?.startsWith(`/api/contact-card/${mockContact?.username}`),
      ).toBe(true)
      expect(saveContactCardLink?.getAttribute('download')).toBe(
        `${mockContact?.username}.vcf`,
      )
    })
  })

  describe('Save to Nomus button', () => {
    const contactSaveUrl = '/dashboard/contacts/save'
    it('if logged in, links to the /dashboard/contact/save with appropriate URL params', async () => {
      const useAuthSpy = jest.spyOn(Auth, 'useAuth').mockImplementation(() => ({
        logIn: jest.fn(),
        logOut: jest.fn(),
        signUp: jest.fn(),
        refreshToken: jest.fn(),
        loggedIn: true,
        id: 'some_id',
        userRoles: [Auth.Role.User],
      }))

      const contact = createMockContact()
      const userEnteredNotes = {
        meetingDate: '2021-01-01',
        meetingPlace: 'a new place',
        tags: ['some', 'new', 'tags'],
        notes: 'some new notes',
      }
      const { renderResult } = renderComponent({
        partialContact: contact,
        mocks: [createSaveContactMutationMock(contact, userEnteredNotes)],
      })

      // Wait for first render
      await new Promise((resolve) => setTimeout(resolve, 0))

      ui.openNotesModal(renderResult)

      ui.setNotesModalFormValues({
        ...userEnteredNotes,
        tags: userEnteredNotes.tags.join(','),
        meetingDate: userEnteredNotes.meetingDate,
      })

      ui.saveNotesModal(renderResult)

      // Wait for modal to close
      waitForElementToBeRemoved(renderResult.getByTestId('modal'))
      // and for mutation to complete
      await new Promise((resolve) => setTimeout(resolve, 0))

      const saveContactCardLink = renderResult
        .getByText('Save to Nomus')
        .closest('a')
        ?.getAttribute('href')!

      expect(saveContactCardLink).toStartWith(contactSaveUrl)
      const urlParams = new URLSearchParams(saveContactCardLink.split('?')[1])
      expect(urlParams.get('username')).toBe(contact.username)
      expect(urlParams.get('meetingDate')).toBe(userEnteredNotes.meetingDate)
      expect(urlParams.get('meetingPlace')).toBe(userEnteredNotes.meetingPlace)
      expect(urlParams.get('tags')).toBe(userEnteredNotes.tags.join(','))
      expect(urlParams.get('notes')).toBe(userEnteredNotes.notes)

      useAuthSpy.mockRestore()
    })

    it('if logged in and contact already saved, the button is disabled and says "Saved" instead', async () => {
      const useAuthSpy = jest.spyOn(Auth, 'useAuth').mockImplementation(() => ({
        logIn: jest.fn(),
        logOut: jest.fn(),
        signUp: jest.fn(),
        refreshToken: jest.fn(),
        loggedIn: true,
        id: 'some_id',
        userRoles: [Auth.Role.User],
      }))

      const { renderResult } = renderComponent({
        partialContact: { ...mockContact, connected: true },
      })
      await new Promise((resolve) => setTimeout(resolve, 0)) // wait for response

      expect(renderResult.queryByText('Save to Nomus')).toBe(null)
      const savedButton = renderResult
        .queryByText('Saved to Nomus')
        ?.closest('button')
      expect(savedButton).toBeInTheDocument()
      expect(savedButton?.disabled).toBe(true)

      useAuthSpy.mockRestore()
    })
  })

  describe('Notes section', () => {
    it('presets meeting date to today', async () => {
      const { renderResult, contact } = renderComponent()
      await new Promise((resolve) => setTimeout(resolve, 0)) // wait for response

      renderResult.getByTestId(
        'meetingDate',
      ).textContent = getFormattedFullDate(contact.meetingDate!)
    })

    it('opens the modal when you click the Edit button', async () => {
      const { renderResult } = renderComponent()
      await new Promise((resolve) => setTimeout(resolve, 0)) // wait for response

      expect(renderResult.queryByTestId('modal')).toBeNull()

      const editButton = renderResult
        .getByText('Edit', { exact: false })
        .closest('button')

      fireEvent(
        editButton!,
        new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
        }),
      )

      expect(renderResult.getByTestId('modal')).toBeInTheDocument()
    })

    it('updates the rendered notes if the user saves the notes modal when logged in', async () => {
      const useAuthSpy = jest.spyOn(Auth, 'useAuth').mockImplementation(() => ({
        logIn: jest.fn(),
        logOut: jest.fn(),
        signUp: jest.fn(),
        refreshToken: jest.fn(),
        loggedIn: true,
        id: null,
        userRoles: null,
      }))

      const contact = createMockContact()
      const newContactInfo = {
        meetingDate: '2020-10-26',
        meetingPlace: 'UCLA',
        tags: ['go', 'bruins', '8clap'],
        notes: 'some more stuff',
      }
      const { renderResult } = renderComponent({
        partialContact: contact,
        mocks: [createSaveContactMutationMock(contact, newContactInfo)],
      })
      await new Promise((resolve) => setTimeout(resolve, 0)) // wait for response

      expect(renderResult.queryByTestId('modal')).toBeNull()

      ui.openNotesModal(renderResult)

      ui.setNotesModalFormValues({
        ...newContactInfo,
        tags: newContactInfo.tags.join(','),
        meetingDate: newContactInfo.meetingDate,
      })

      ui.saveNotesModal(renderResult)

      // Wait for modal to close
      await waitForElementToBeRemoved(renderResult.getByTestId('modal'))
      // and for mutation to complete
      await new Promise((resolve) => setTimeout(resolve, 0))

      // Ensure that the field values have changed properly
      expect(renderResult.getByTestId('meetingDate').textContent).toBe(
        getFormattedFullDateFromDateInputString(newContactInfo.meetingDate),
      )
      expect(renderResult.getByTestId('meetingPlace').textContent).toBe(
        newContactInfo.meetingPlace,
      )
      newContactInfo.tags.forEach((tag) => {
        expect(renderResult.getByTestId('tags').textContent).toContain(tag)
      })
      expect(renderResult.getByTestId('notes').textContent).toBe(
        newContactInfo.notes,
      )

      useAuthSpy.mockRestore()
    })

    it('shows a confirmation dialog then restores values to pre-editted copy if the user hits Cancel after making edits', async () => {
      const useAuthSpy = jest.spyOn(Auth, 'useAuth').mockImplementation(() => ({
        logIn: jest.fn(),
        logOut: jest.fn(),
        signUp: jest.fn(),
        refreshToken: jest.fn(),
        loggedIn: false,
        id: null,
        userRoles: null,
      }))

      const contact = createMockContact()
      const newContactInfo = {
        meetingDate: '2020-11-10',
        meetingPlace: 'UCLA',
        tags: ['go', 'bruins', '8clap'],
        notes: 'some more stuff',
      }
      const { renderResult } = renderComponent({
        partialContact: contact,
        mocks: [createSaveContactMutationMock(contact, newContactInfo)],
      })
      await new Promise((resolve) => setTimeout(resolve, 0)) // wait for response

      ui.openNotesModal(renderResult)

      const newFormValues = {
        ...newContactInfo,
        tags: newContactInfo.tags.join(','),
        meetingDate: newContactInfo.meetingDate,
      }
      ui.setNotesModalFormValues(newFormValues)

      // Ensure discard confirmation dialog pops up
      ui.cancelNotesModal(renderResult)
      expect(await renderResult.findByText('Discard?')).toBeInTheDocument()

      // Ensure discarding restores the notes state back to pre-edit version
      ui.confirmDiscardNotes(renderResult)

      expect(renderResult.getByTestId('meetingDate').textContent).toBe(
        getFormattedFullDateFromDateInputString(contact.meetingDate!),
      )
      expect(renderResult.getByTestId('meetingPlace').textContent).toBe(
        contact.meetingPlace,
      )
      contact.tags!.forEach((tag) => {
        expect(renderResult.getByTestId('tags').textContent).toContain(tag)
      })
      expect(renderResult.getByTestId('notes').textContent).toBe(contact.notes)

      useAuthSpy.mockRestore()
    })

    it('redirects the user to /register if the user saves the notes modal when logged out', async () => {
      const useAuthSpy = jest.spyOn(Auth, 'useAuth').mockImplementation(() => ({
        logIn: jest.fn(),
        logOut: jest.fn(),
        signUp: jest.fn(),
        refreshToken: jest.fn(),
        loggedIn: false,
        id: null,
        userRoles: null,
      }))

      const contact = createMockContact()
      const newContactInfo = {
        meetingDate: '2020-10-26',
        meetingPlace: 'UCLA',
        tags: ['go', 'bruins', '8clap'],
        notes: 'some more stuff',
      }
      const { renderResult } = renderComponent({
        partialContact: contact,
        mocks: [createSaveContactMutationMock(contact, newContactInfo)],
      })
      await new Promise((resolve) => setTimeout(resolve, 0)) // wait for response

      ui.openNotesModal(renderResult)

      const newFormValues = {
        ...newContactInfo,
        tags: newContactInfo.tags.join(','),
        meetingDate: newContactInfo.meetingDate,
      }
      ui.setNotesModalFormValues(newFormValues)

      ui.saveNotesModal(renderResult)

      // Wait for page to redirect away
      await new Promise((resolve) => setTimeout(resolve, 0)) // wait for response

      expect(testLocation?.pathname).toBe('/register')
      const params = new URLSearchParams(testLocation?.search)
      validateUrl(params.get('redirect_url')!, {
        pathname: '/dashboard/contacts/save',
        searchParams: {
          ...newFormValues,
        },
      })

      useAuthSpy.mockRestore()
    })
  })
})
