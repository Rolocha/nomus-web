import * as React from 'react'
import renderer from 'react-test-renderer'
import { render, cleanup } from '@testing-library/react'

import { PageHeader, Body } from 'src/components/Text'
import Modal from 'src/components/Modal'

afterEach(cleanup)

describe('<Modal />', () => {
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

  it('if confirmClose is true, show confirmation modal when trying to close', () => {
    const closeModal = jest.fn()

    const { getByText } = render(
      <Modal isOpen={true} onClose={closeModal} confirmClose={() => true}>
        <PageHeader>Test Modal</PageHeader>
        <Body>Some content</Body>
      </Modal>,
    )

    getByText('X').click()
    expect(getByText('Discard?')).toBeDefined()

    // Click discard button
    getByText((content, element) => {
      return content === 'Discard' && element.tagName.toLowerCase() === 'button'
    }).click()

    expect(closeModal).toHaveBeenCalledTimes(1)
  })
})
