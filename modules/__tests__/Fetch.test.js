import React from 'react'
import TestRenderer from 'react-test-renderer'
import Fetch from '../Fetch'

describe('A <Fetch>', () => {
  it('renders correctly', () => {
    const component = TestRenderer.create(
      <Fetch path="https://api.github.com/users/octocat">{() => null}</Fetch>,
    )
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
})
