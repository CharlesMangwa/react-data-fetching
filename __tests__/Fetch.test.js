import React from 'react'
import TestRenderer from 'react-test-renderer'
import Fetch from '../modules/Fetch'

describe('A <Fetch>', () => {
  it('renders correctly', () => {
    const component = TestRenderer.create(
      <Fetch path="/news/featured">{() => null}</Fetch>,
    )
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
})
