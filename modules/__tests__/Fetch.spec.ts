import React from 'react'
import TestRenderer from 'react-test-renderer'
import ShallowRenderer from 'react-test-renderer/shallow'

import { Fetch, FetchProvider } from '../index'
import { Fetch as TestFetch } from '../Fetch'

describe('A <Fetch />', () => {
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

  it('should render component `children` correctly', () => {
    expect.assertions(1)
    const component = TestRenderer.create(
      <Fetch url="https://api.github.com/users/octocat">
        <div />
      </Fetch>
    )
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('should render component `children` correctly', () => {
    expect.assertions(1)
    const component = TestRenderer.create(
      <Fetch url="https://api.github.com/users/octocat">
        <div />
      </Fetch>
    )
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('should render & call function children correctly', () => {
    expect.assertions(1)
    const component = TestRenderer.create(
      <Fetch url="https://api.github.com/users/octocat">
        {() => fn() || null}
      </Fetch>
    )

    const instance = component.root
    instance.props.children()

    expect(fn).toHaveBeenCalled()
  })

  it('should re-render only when necessary', () => {
    expect.assertions(4)
    const render = () => null
    const params = { page: 1 }

    const component = TestRenderer.create(
      <TestFetch
        url="https://api.github.com/users/octocat"
        cancel={false}
        loader={render}
        onError={fn}
        onFetch={fn}
        onLoad={fn}
        path={undefined}
        params={params}
        refetchKey={false}
        render={undefined}
      >
        {render}
      </TestFetch>
    )

    const instance = component.getInstance()
    const spy1 = jest.spyOn(instance, '_fetchData')
    const spy2 = jest.spyOn(instance, 'shouldComponentUpdate')

    component.update(
      <TestFetch
        url="https://api.github.com/users/octocat"
        cancel={false}
        loader={render}
        onError={fn}
        onFetch={fn}
        onLoad={fn}
        path={undefined}
        params={params}
        refetchKey={false}
        render={undefined}
      >
        {render}
      </TestFetch>
    )

    expect(spy1).not.toHaveBeenCalled()
    expect(spy2).toHaveReturnedWith(false)

    component.update(
      <TestFetch url="https://api.github.com/users/octocat" refetchKey>
        <div />
      </TestFetch>
    )

    expect(spy1).toHaveBeenCalled()
    expect(spy2).toHaveReturnedWith(true)
  })

  it('should call `onLoad` when passed', () => {
    expect.assertions(1)
    renderer.render(
      <TestFetch
        onLoad={fn}
        url="https://api.github.com/users/octocat"
        render={() => null}
      />
    )

    expect(fn).toHaveBeenCalled()
  })

  it('should call `loader` when passed', () => {
    expect.assertions(1)
    renderer.render(
      <TestFetch
        loader={fn}
        url="https://api.github.com/users/octocat"
        render={() => null}
      />
    )

    expect(fn).toHaveBeenCalled()
  })

  it('should propagate `store` correctly', () => {
    expect.assertions(1)
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

  it('should throw when it is not rendered in the context of a <FetchProvider>', () => {
    expect.assertions(1)
    expect(() =>
      renderer.render(<TestFetch path="store">{() => null}</TestFetch>)
    ).toThrow()
  })

  it('should throw when no `url` nor `path` is passed', () => {
    expect.assertions(1)
    expect(() => renderer.render(<TestFetch>{() => null}</TestFetch>)).toThrow()
  })

  it('should throw when `onTimeout` is passed, but no `timeout`', () => {
    expect.assertions(1)
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

  it('should throw when no `children`, `component`, `onFetch`, `render` prop is passed', () => {
    expect.assertions(1)
    expect(() =>
      renderer.render(<TestFetch url="https://api.github.com/users/octocat" />)
    ).toThrow()
  })
})
