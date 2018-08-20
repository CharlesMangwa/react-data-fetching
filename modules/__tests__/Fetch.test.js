import React from 'react'
import TestRenderer from 'react-test-renderer'
import ShallowRenderer from 'react-test-renderer/shallow'

import { Fetch, FetchProvider } from '../index'
import { Fetch as TestFetch } from '../Fetch'

describe('A <Fetch>', () => {
  let fn
  let renderer

  beforeEach(() => {
    fn = jest.fn()
    renderer = new ShallowRenderer()
    global.fetch = jest.fn().mockImplementation(() => {
      const p = new Promise((resolve, reject) => {
        resolve({
          ok: true,
          json: () => ({ ok: true }),
        })
      })
      return p
    })
  })

  afterEach(() => jest.clearAllMocks())

  it('throws when it is not rendered in the context of a <FetchProvider>', () => {
    expect(() =>
      renderer.render(<TestFetch path="store">{() => null}</TestFetch>)
    ).toThrow()
  })

  it('throws when no url nor path is passed', () => {
    expect(() => renderer.render(<TestFetch>{() => null}</TestFetch>)).toThrow()
  })

  it('throws when onTimeout is passed, but no timeout', () => {
    expect(() =>
      renderer.render(
        <TestFetch
          url="https://api.github.com/users/octocat"
          onTimeout={() => fn()}
        >
          {() => null}
        </TestFetch>
      )
    ).toThrow()
  })

  it('throws when no children, component, onFetch, render prop is passed', () => {
    expect(() =>
      renderer.render(<TestFetch url="https://api.github.com/users/octocat" />)
    ).toThrow()
  })

  it('renders component children correctly', () => {
    const component = TestRenderer.create(
      <Fetch url="https://api.github.com/users/octocat">
        <div />
      </Fetch>
    )
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('renders & calls function children correctly', () => {
    const component = TestRenderer.create(
      <Fetch url="https://api.github.com/users/octocat">
        {() => fn() || null}
      </Fetch>
    )

    const instance = component.root
    instance.props.children()

    expect(fn).toHaveBeenCalled()
  })

  it('re-renders only when necessary', () => {
    const component = TestRenderer.create(
      <TestFetch url="https://api.github.com/users/octocat">
        <div />
      </TestFetch>
    )

    const instance = component.getInstance()
    const spy = jest.spyOn(instance, '_fetchData')

    component.update(
      <TestFetch url="https://api.github.com/users/octocat">
        <div />
      </TestFetch>
    )
    expect(spy).not.toHaveBeenCalled()

    component.update(
      <TestFetch url="https://api.github.com/users/octocat" refetchKey>
        <div />
      </TestFetch>
    )

    expect(spy).toHaveBeenCalled()
  })

  it('calls onLoad when passed', () => {
    renderer.render(
      <TestFetch
        onLoad={fn}
        url="https://api.github.com/users/octocat"
        render={() => null}
      />
    )

    expect(fn).toHaveBeenCalled()
  })

  it('calls loader when passed', () => {
    renderer.render(
      <TestFetch
        loader={fn}
        url="https://api.github.com/users/octocat"
        render={() => null}
      />
    )

    expect(fn).toHaveBeenCalled()
  })

  it('propagates `store` correctly', () => {
    const context = { api: 'https://api.github.com', store: { cats: 42 } }
    const expectedData = {
      cats: 42,
    }
    const onFetch = data => (receivedData = data || null)
    let receivedData

    const component = TestRenderer.create(
      <FetchProvider value={context}>
        <Fetch
          resultOnly
          path="store"
          onFetch={data => (receivedData = data || null)}
        />
      </FetchProvider>
    )

    expect(receivedData).toMatchObject(expectedData)
  })
})
