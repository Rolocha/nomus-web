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
  it('shows ')
})
