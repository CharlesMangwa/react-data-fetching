import React from 'react'
import TestRenderer from 'react-test-renderer'
import ShallowRenderer from 'react-test-renderer/shallow'
import Fetch from '../Fetch'

describe('A <Fetch>', () => {
  it('throws an invariant when it is not rendered in the context of a <ConnectedFetch>', () => {
    const renderer = new ShallowRenderer()
    expect(() =>
      renderer.render(<Fetch path="/users/octocat">{() => null}</Fetch>),
    ).toThrow()
  })

  it('throws an invariant when no url nor path is passed', () => {
    const renderer = new ShallowRenderer()
    expect(() => renderer.render(<Fetch>{() => null}</Fetch>)).toThrow()
  })

  it('throws an invariant when no children, onSuccess, render prop is passed', () => {
    const renderer = new ShallowRenderer()
    expect(() =>
      renderer.render(<Fetch url="https://api.github.com/users/octocat" />),
    ).toThrow()
  })

  it('renders component children correctly', () => {
    const component = TestRenderer.create(
      <Fetch url="https://api.github.com/users/octocat">
        <div />
      </Fetch>,
    )
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })

  // it('renders function children correctly', () => {
  //   const renderer = new ShallowRenderer()
  //   const fn = jest.fn()

  //   renderer.render(
  //     <Fetch url="https://api.github.com/users/octocat">
  //       {fn} 
  //     </Fetch>,
  //   )

  //   const output = renderer.getRenderOutput()
  //   output.props.children()
    
  //   expect(fn).toBeCalled()
  // })
})
