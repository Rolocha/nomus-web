import { MockedProvider, MockedResponse } from '@apollo/client/testing'
import {
  cleanup,
  fireEvent,
  render,
  RenderResult,
  waitForElementToBeRemoved,
} from '@testing-library/react'
import * as React from 'react'
import { MemoryRouter, Route } from 'react-router-dom'
import { ContactInfoInput } from 'src/apollo/types/globalTypes'
import { createMockContact } from 'src/mocks/contact'
import updateContactInfoMutation from 'src/mutations/updateContactInfoMutation'
import ContactInfoPage, { NotesFormData } from 'src/pages/ContactInfoPage'
import publicContactQuery from 'src/queries/publicContact'
import { Contact } from 'src/types/contact'
import * as Auth from 'src/utils/auth'
import {
  getDateFromDateInputString,
  getFormattedFullDate,
  getDateStringForDateInput,
} from 'src/utils/date'
import { formatName } from 'src/utils/name'

afterEach(cleanup)

const createUpdateContactInfoMock = (
  contact: Contact,
  newContactInfo: ContactInfoInput,
  resultingContact: Contact = contact,
) => {
  return {
    request: {
      query: updateContactInfoMutation,
      variables: {
        contactId: contact.id,
        contactInfo: newContactInfo,
      },
    },
    result: {
      data: {
        updateContactInfo: resultingContact,
      },
    },
  }
}

const ui = {
  openNotesModal: (renderResult: RenderResult) => {
    const editButton = renderResult
      .getByText('Edit', { exact: false })
      .closest('button')

    // Open the modal
    fireEvent(
      editButton!,
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      }),
    )
  },
  saveNotesModal: (renderResult: RenderResult) => {
    // Hit Save
    fireEvent(
      renderResult.getByText('Save'),
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
      meetingDateInput.value = getDateStringForDateInput(values.meetingDate)
    }

    const meetingPlaceInput = document.querySelector(
      'input[name=meetingPlace]',
    ) as HTMLInputElement
    if (values.meetingPlace) {
      meetingPlaceInput.value = values.meetingPlace
    }

    const tagsInput = document.querySelector(
      'input[name=tags]',
    ) as HTMLInputElement
    if (values.tags) {
      tagsInput.value = values.tags
    }

    const notesInput = document.querySelector(
      'textarea[name=notes]',
    ) as HTMLTextAreaElement
    if (values.notes) {
      notesInput.value = values.notes
    }
  },
}

describe('Contact Info Page', () => {
  let mockContact: Contact | null = null

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
          <Route path="/:username" component={ContactInfoPage} />
        </MockedProvider>
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
      renderResult.queryByAltText(`front of ${formattedName}'s business card`),
    ).toBeInTheDocument()
    expect(
      renderResult.queryByAltText(`back of ${formattedName}'s business card`),
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
        meetingDate: getDateFromDateInputString('2021-01-01'),
        meetingPlace: 'a new place',
        tags: ['some', 'new', 'tags'],
        notes: 'some new notes',
      }
      const { renderResult } = renderComponent({
        partialContact: contact,
        mocks: [createUpdateContactInfoMock(contact, userEnteredNotes)],
      })

      // Wait for first render
      await new Promise((resolve) => setTimeout(resolve, 0))

      ui.openNotesModal(renderResult)

      ui.setNotesModalFormValues({
        ...userEnteredNotes,
        tags: userEnteredNotes.tags.join(','),
        meetingDate: getDateStringForDateInput(userEnteredNotes.meetingDate),
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
      expect(urlParams.get('meetingDate')).toBe(
        getDateStringForDateInput(userEnteredNotes.meetingDate),
      )
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
      const savedButton = renderResult.queryByText('Saved')?.closest('button')
      expect(savedButton).toBeInTheDocument()
      expect(savedButton?.disabled).toBe(true)

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

      const contact = createMockContact()
      const userEnteredNotes = {
        meetingDate: getDateFromDateInputString('2021-01-01'),
        meetingPlace: 'a new place',
        tags: ['some', 'new', 'tags'],
        notes: 'some new notes',
      }
      const { renderResult } = renderComponent({
        partialContact: contact,
        mocks: [createUpdateContactInfoMock(contact, userEnteredNotes)],
      })

      // Wait for first render
      await new Promise((resolve) => setTimeout(resolve, 0))

      ui.openNotesModal(renderResult)

      ui.setNotesModalFormValues({
        ...userEnteredNotes,
        tags: userEnteredNotes.tags.join(','),
        meetingDate: getDateStringForDateInput(userEnteredNotes.meetingDate),
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

      expect(saveContactCardLink).toStartWith('/register')

      // Pull out the /register search params, then the search params of the redirect_uri
      const registerURLParams = new URLSearchParams(
        saveContactCardLink.split('register')[1],
      )
      const redirectURL = registerURLParams.get('redirect_url')
      const urlParams = new URLSearchParams(redirectURL?.split('?')[1])

      expect(urlParams.get('username')).toBe(contact.username)
      expect(urlParams.get('meetingDate')).toBe(
        getDateStringForDateInput(userEnteredNotes.meetingDate),
      )
      expect(urlParams.get('meetingPlace')).toBe(userEnteredNotes.meetingPlace)
      expect(urlParams.get('tags')).toBe(userEnteredNotes.tags.join(','))
      expect(urlParams.get('notes')).toBe(userEnteredNotes.notes)

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

    it.each([true, false])(
      'updates the rendered notes if the user saves the notes modal when loggedIn is %s',
      async (loggedIn) => {
        const useAuthSpy = jest
          .spyOn(Auth, 'useAuth')
          .mockImplementation(() => ({
            logIn: jest.fn(),
            logOut: jest.fn(),
            signUp: jest.fn(),
            refreshToken: jest.fn(),
            loggedIn,
            id: null,
            userRoles: null,
          }))

        const contact = createMockContact()
        const newContactInfo = {
          meetingDate: getDateFromDateInputString('2020-10-26'),
          meetingPlace: 'UCLA',
          tags: ['go', 'bruins', '8clap'],
          notes: 'some more stuff',
        }
        const { renderResult } = renderComponent({
          partialContact: contact,
          mocks: [createUpdateContactInfoMock(contact, newContactInfo)],
        })
        await new Promise((resolve) => setTimeout(resolve, 0)) // wait for response

        expect(renderResult.queryByTestId('modal')).toBeNull()

        ui.openNotesModal(renderResult)

        ui.setNotesModalFormValues({
          ...newContactInfo,
          tags: newContactInfo.tags.join(','),
          meetingDate: getDateStringForDateInput(newContactInfo.meetingDate),
        })

        ui.saveNotesModal(renderResult)

        // Wait for modal to close
        waitForElementToBeRemoved(renderResult.getByTestId('modal'))
        // and for mutation to complete
        await new Promise((resolve) => setTimeout(resolve, 0))

        // Ensure that the field values have changed properly
        expect(renderResult.getByTestId('meetingDate').textContent).toBe(
          getFormattedFullDate(newContactInfo.meetingDate),
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
      },
    )

    it('shows the unsaved notes banner if the user saves the notes modal when logged out', async () => {
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
        meetingDate: getDateFromDateInputString('2020-10-26'),
        meetingPlace: 'UCLA',
        tags: ['go', 'bruins', '8clap'],
        notes: 'some more stuff',
      }
      const { renderResult } = renderComponent({
        partialContact: contact,
        mocks: [createUpdateContactInfoMock(contact, newContactInfo)],
      })
      await new Promise((resolve) => setTimeout(resolve, 0)) // wait for response

      expect(renderResult.queryByTestId('modal')).toBeNull()

      ui.openNotesModal(renderResult)

      ui.setNotesModalFormValues({
        ...newContactInfo,
        tags: newContactInfo.tags.join(','),
        meetingDate: getDateStringForDateInput(newContactInfo.meetingDate),
      })

      ui.saveNotesModal(renderResult)

      // Wait for modal to close
      waitForElementToBeRemoved(renderResult.getByTestId('modal'))
      // and for mutation to complete
      await new Promise((resolve) => setTimeout(resolve, 0))

      // Ensure that the "Unsaved notes" banner shows up
      expect(
        renderResult.getByText('Unsaved notes', { exact: false }),
      ).toBeInTheDocument()

      useAuthSpy.mockRestore()
    })
  })
})
