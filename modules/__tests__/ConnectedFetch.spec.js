import React, { Fragment } from 'react'
import TestRenderer from 'react-test-renderer'
import ShallowRenderer from 'react-test-renderer/shallow'

import { ConnectedFetch, Fetch } from '../index'
import getElementWithContent from './__helpers__'

describe('A <ConnectedFetch>', () => {
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

  it('renders component children correctly', () => {
    const component = TestRenderer.create(
      <ConnectedFetch
        api="https://api.github.com"
        headers={{
          'X-Nyan-Token': 'superNyan',
        }}
      >
        <Fetch path="/users/octocat">
          <div />
        </Fetch>
      </ConnectedFetch>
    )
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('constructs URL correctly through `api`', () => {
    const expectedContext = {
      rdfApi: 'https://api.nyan.com',
    }
    const expectedUrl = 'https://api.nyan.com/cats/meowssages'

    const wrapper = getElementWithContent(
      expectedContext,
      <Fetch resultOnly path="/cats/meowssages" render={() => null} />
    )

    const component = TestRenderer.create(
      <ConnectedFetch api="https://api.nyan.com">{wrapper}</ConnectedFetch>
    )

    const instance = component.getInstance()
    const children = component.root.props.children
    const receivedUrl = instance.rdfApi + children.props.path

    expect(receivedUrl).toEqual(expectedUrl)
  })

  it('propagates `store` correctly', () => {
    let receivedData
    const expectedData = {
      data: { cats: 42 },
      isOK: true,
    }
    const expectedContext = {
      rdfStore: { cats: 42 },
    }

    const wrapper = getElementWithContent(
      expectedContext,
      <Fetch path="store" onFetch={data => (receivedData = data || null)} />
    )

    const component = TestRenderer.create(
      <ConnectedFetch api="https://api.github.com" store={{ cats: 42 }}>
        {wrapper}
      </ConnectedFetch>
    )

    expect(receivedData).toMatchObject(expectedData)
  })
})
