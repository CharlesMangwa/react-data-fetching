<div align="center">
  <a href="https://github.com/CharlesMangwa/react-data-fetcher" target="\_parent">
    <img 
      alt="React Data Fetcher logo"
      src="https://image.ibb.co/f6o7G6/RDF.png"
      style="width:450px;"
    />
  </a>
</div>

<br />

<div align="center">
  <strong>A component-driven way to 🎣 fetch data in any React-based app</strong>
  <br />
  <br />
  <a href="https://circleci.com/gh/CharlesMangwa/react-data-fetcher">
    <img
      alt="build: CircleCI"
      src="https://circleci.com/gh/CharlesMangwa/react-data-fetcher.svg?style=shield&circle-token=ec4d3afecb3cd2d7fd6712b2a6b2f576b9dfb08f"
    />
  </a>
  <a href="https://coveralls.io/github/CharlesMangwa/react-data-fetcher?branch=master">
    <img
      alt="coverage: Coveralls"
      src="https://coveralls.io/repos/github/CharlesMangwa/react-data-fetcher/badge.svg?branch=master&t=YCvNBr"
    />
  </a>
  <a href="https://www.npmjs.com/package/react-data-fetcher">
    <img
      alt="version: 0.1.0"
      src="https://img.shields.io/npm/v/react-data-fetcher.svg"
    />
  </a>
  <img 
    alt="gzip size"
    src="http://img.badgesize.io/https://npmcdn.com/react-data-fetcher/umd/react-data-fetcher.min.js?compression=gzip"
  />
  <img
    alt="module formats: umd, cjs, esm"
    src="https://img.shields.io/badge/module%20formats-umd%2C%20cjs%2C%20esm-green.svg"
  />
  <a href="https://github.com/CharlesMangwa/react-data-fetcher/pulls">
    <img
      alt="PRs welcome"
      src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg"
    />
  </a>
</div>

`react-data-fetcher` lets you use a single component to handle any API call without hassle, using JavaScript's Fetch API. It also helps you take care of loading states, errors handling, data saving, etc. Fetching data while letting the user know what's going on have never been that easy.

`react-data-fetcher` has been built from the ground up with universal apps in mind: you can use it with any app based on React - meaning it works with React (web), React Native, ReactVR and even Preact!


## Installation

Using [Yarn](https://yarnpkg.com/):

```shell
$ yarn add react-data-fetcher
```

Then, use as you would anything else:

```js
// using ES6 modules
import { Fetch } from "react-data-fetcher"

// using CommonJS modules
var Fetch = require("react-data-fetcher").Fetch
```

The UMD build is also available on [unpkg](https://unpkg.com):

```html
<script src="https://unpkg.com/react-data-fetcher/umd/react-data-fetcher.min.js"></script>
```

You can find the library on `window.ReactDataFetcher`.

# Usage

The following illustrates the simplest way to use `react-data-fetcher`:

```jsx
import React, { Component } from "react"
import { Fetch } from "react-data-fetcher"

export default class App extends Component {
  render() {
    return (
      <Fetch
        url="https://api.github.com/users/octocat"
      >
        {({ data }) => (
         <div>
          <h1>Username</h1>
          <p>{data.name}</p>
         </div>
        )}
      </Fetch>
    )
  }
}
```

Through `react-data-fetcher`, you have access to `<Fetch>`, `<ConnectedFetch>` and `requestToApi()`. To have an in-depth explanation about how to use them, how they work and even more, head to this post: [Introducing 🎣 React Data Fetcher](https://medium.com/p/2140a1d36cc8/).

# Todo

- [ ] Implement React 16.3.0 new context API & lifecycles  ⚛️
- [ ] Increase code coverage 🤓
- [ ] Ability to make several calls at once ⛓
- [ ] Implement caching system 📥
- [ ] What else?

# About

`react-data-fetcher` is actually developed and maintained by your truly, [@Charles_Mangwa](https://twitter.com/Charles_Mangwa). Feel free to contact me if you want to contribute to the project!
