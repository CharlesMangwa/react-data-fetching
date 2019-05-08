import React from "react";
import TestRenderer from "react-test-renderer";
import { createRenderer } from "react-test-renderer/shallow";

import { Fetch, FetchProvider } from "../index";

describe("A <FetchProvider />", () => {
  let fn;
  let renderer;

  beforeEach(() => {
    fn = jest.fn();
    renderer = createRenderer();
  });

  afterEach(() => jest.clearAllMocks());

  it("should render component children correctly", () => {
    expect.assertions(1);
    const component = TestRenderer.create(
      <FetchProvider
        value={{
          api: "https://api.github.com",
          headers: {
            "X-Nyan-Token": "superNyan",
          },
        }}
      >
        <Fetch path="/users/octocat">
          <div />
        </Fetch>
      </FetchProvider>,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  })

  it("should propagate `store` correctly", () => {
    expect.assertions(1);
    const context = { api: "https://api.github.com", store: { cats: 42 } }
    const expectedData = {
      data: { cats: 42 },
      isOK: true,
    };
    const onFetch = (data) => (receivedData = data || null);
    let receivedData;

    const component = TestRenderer.create(
      <FetchProvider value={context}>
        <Fetch path="store" onFetch={onFetch} />
      </FetchProvider>
    );

    expect(receivedData).toMatchObject(expectedData)
  })
})
