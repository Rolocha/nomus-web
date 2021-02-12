import 'src/test-utils/mocks/matchMedia.mock'

import { cleanup, render } from '@testing-library/react'
import * as React from 'react'
import ReactDOM from 'react-dom'
import { PageHeader, Body } from 'src/components/Text'
import Modal from 'src/components/Modal'
import { setUpModalPortal } from 'src/test-utils/modal.test'

afterEach(cleanup)

describe('<Modal />', () => {
  beforeAll(() => {
    jest.spyOn(ReactDOM, 'createPortal')
    setUpModalPortal()
  })

  afterEach(() => {
    cleanup()
  })

  it('renders a modal with the specified content in a portal', () => {
    render(
      <Modal isOpen={true} onClose={() => {}}>
        <PageHeader>Test Modal</PageHeader>
        <Body>Some content</Body>
      </Modal>,
    )
    const modalRoot = document.querySelector('div#modal-root')
    expect(modalRoot).toMatchSnapshot()
    expect(ReactDOM.createPortal).toHaveBeenCalled()
  })

  it('if confirmClose is true, show confirmation modal when trying to close', () => {
    const closeModal = jest.fn()

    const { getByText, getByLabelText } = render(
      <Modal isOpen={true} onClose={closeModal} confirmClose={() => true}>
        <PageHeader>Test Modal</PageHeader>
        <Body>Some content</Body>
      </Modal>,
    )

    getByLabelText('Close Modal').click()
    expect(getByText('Discard?')).toBeDefined()

    // Click discard button
    getByText((content, element) => {
      return (
        content === 'Yes, discard' && element.tagName.toLowerCase() === 'button'
      )
    }).click()

    expect(closeModal).toHaveBeenCalledTimes(1)
  })
})
