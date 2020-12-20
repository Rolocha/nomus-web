import * as React from 'react'
import renderer from 'react-test-renderer'
import { render, cleanup } from '@testing-library/react'
import ReactDOM from 'react-dom'
import { PageHeader, Body } from 'src/components/Text'
import Modal from 'src/components/Modal'

describe('<Modal />', () => {
  beforeAll(() => {
    // Mock out ReactDOM.createPortal to just return the element directly rather than portaling
    // @ts-ignore
    ReactDOM.createPortal = jest.fn((element) => element)
  })

  afterEach(() => {
    // @ts-ignore
    ReactDOM.createPortal.mockClear()
    cleanup()
  })

  it('renders a modal with the specified content', () => {
    const component = renderer.create(
      <Modal isOpen={true} onClose={() => {}}>
        <PageHeader>Test Modal</PageHeader>
        <Body>Some content</Body>
      </Modal>,
    )
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('renders the modal to a portal', () => {
    renderer.create(
      <Modal isOpen={true} onClose={() => {}}>
        <PageHeader>Test Modal</PageHeader>
        <Body>Some content</Body>
      </Modal>,
    )
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
      return content === 'Discard' && element.tagName.toLowerCase() === 'button'
    }).click()

    expect(closeModal).toHaveBeenCalledTimes(1)
  })
})
