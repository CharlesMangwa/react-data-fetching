import React from 'react'
import TestRenderer from 'react-test-renderer'
import ShallowRenderer from 'react-test-renderer/shallow'

import {  ConnectedFetch, Fetch } from '../index'
import getElementWithContent from './__helpers__'

describe('A <Fetch>', () => {
  let fn, renderer

  beforeEach(() => {
    fn = jest.fn()
    renderer = new ShallowRenderer()
    global.fetch = jest.fn().mockImplementation(() => {
      const p = new Promise((resolve, reject) => {
        resolve({
          ok: true,
          json: () => {
            return { ok: true }
          }
        })
      })
      return p
    })
  })

  afterEach(() => jest.clearAllMocks())

  it('throws an invariant when it is not rendered in the context of a <ConnectedFetch>', () => {
    expect(() =>
      renderer.render(<Fetch path="/users/octocat">{() => null}</Fetch>),
    ).toThrow()
  })

  it('throws an invariant when no url nor path is passed', () => {
    expect(() => renderer.render(<Fetch>{() => null}</Fetch>)).toThrow()
  })

  it('throws an invariant when no children, onSuccess, render prop is passed', () => {
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

  it('renders & calls function children correctly', () => {
    const component = TestRenderer.create(
      <Fetch url="https://api.github.com/users/octocat">
        {() => fn() || null}
      </Fetch>,
    )

    const instance = component.root
    instance.props.children()

    expect(fn).toHaveBeenCalled()
  })

  it("re-renders only when necessary", () => {
    const component = TestRenderer.create(
      <Fetch url="https://api.github.com/users/octocat">
        <div />
      </Fetch>,
    )

    const instance = component.getInstance()
    const spy = jest.spyOn(instance, '_fetchData')

    component.update(
      <Fetch url="https://api.github.com/users/octocat">
        <div />
      </Fetch>,
    )
    expect(spy).not.toHaveBeenCalled()

    component.update(
      <Fetch url="https://api.github.com/users/octocat" refetch>
        <div />
      </Fetch>,
    )
    expect(spy).toHaveBeenCalled()
  })

  it('calls onLoad when passed', () => {
    renderer.render(
      <Fetch
        onLoad={fn}
        url="https://api.github.com/users/octocat"
        render={() => null}
      />
    )

    expect(fn).toHaveBeenCalled()
  })

  it('calls loader when passed', () => {
    renderer.render(
      <Fetch
        loader={fn}
        url="https://api.github.com/users/octocat"
        render={() => null}
      />
    )

    expect(fn).toHaveBeenCalled()
  })

  it('returns data only if `resultOnly` is passed', () => {
    let receivedData
    const expectedData = {
      cats: 42,
    }
    const expectedContext = {
      rdfStore: { cats: 42 },
    }

    const wrapper = getElementWithContent(
      expectedContext,
      <Fetch
        resultOnly
        path="redux"
        onSuccess={data => (receivedData = data || null)}
      />,
    )

    const component = TestRenderer.create(
      <ConnectedFetch
        api="https://api.github.com"
        store={{ cats: 42 }}
      >
        {wrapper}
      </ConnectedFetch>,
    )

    expect(receivedData).toMatchObject(expectedData)
  })
})
