<div align="center">
  <a href="https://github.com/CharlesMangwa/react-data-fetching" target="\_parent">
    <img 
      alt="React Data Fetching logo"
      src="docs/images/logo.png"
      width="900"
    />
  </a>
</div>

<br />

<div align="center">
  <strong>Declarative data fetching for React 🎣</strong>
  <br />
  <br />
  <a href="https://circleci.com/gh/CharlesMangwa/react-data-fetching">
    <img
      alt="build: CircleCI"
      src="https://circleci.com/gh/CharlesMangwa/react-data-fetching.svg?style=shield&circle-token=ec4d3afecb3cd2d7fd6712b2a6b2f576b9dfb08f"
    />
  </a>
  <a href="https://coveralls.io/github/CharlesMangwa/react-data-fetching?branch=master">
    <img
      alt="coverage: Coveralls"
      src="https://coveralls.io/repos/github/CharlesMangwa/react-data-fetching/badge.svg?branch=master&t=v4mvo8"
    />
  </a>
  <a href="https://www.npmjs.com/package/react-data-fetching">
    <img
      alt="version: 0.2.4"
      src="https://img.shields.io/npm/v/react-data-fetching.svg"
    />
  </a>
  <img 
    alt="gzip size"
    src="https://img.shields.io/badge/gzip%20size-6.28%20kB-brightgreen.svg"
  />
  <a href="https://github.com/prettier/prettier">
    <img
      alt="code style"
      src="https://img.shields.io/badge/code_style-prettier-ff69b4.svg"
    />
  </a>
  <img
    alt="module formats: umd, cjs, esm"
    src="https://img.shields.io/badge/module%20formats-umd%2C%20cjs%2C%20esm-7020f5.svg"
  />
</div>

#

`react-data-fetching` provides a very intuitive way to perform any REST API call without hassle, through a single React component. It also helps you take care of timeouts, loading states, errors handling, data saving, uploading/downloading progress, etc. Fetching data while letting the user know what's going on has never been that easy!

The package is really lightweight (~6 kB gzipped) and has been built from the ground up with universal apps in mind: you can use it wherever React is rendering - meaning it works seamlessly with React (web) & React Native!

## Installation

Using [Yarn](https://yarnpkg.com/):

```shell
$ yarn add react-data-fetching
```

Then, use it as you would with anything else:

```js
// using ES6 modules
import { Fetch } from 'react-data-fetching'

// using CommonJS modules
var Fetch = require('react-data-fetching').Fetch
```

The UMD build is also available on [unpkg](https://unpkg.com):

```html
<script src="https://unpkg.com/react-data-fetching/umd/react-data-fetching.min.js"></script>
```

You can find the library on `window.ReactDataFetching`.

## Usage

The following illustrates the simplest way to use `react-data-fetching`:

```jsx
import React, { Component } from 'react'
import { Fetch } from 'react-data-fetching'

import { Loader } from './components'

export default class App extends Component {
  render() {
    return (
      <Fetch
        loader={<Loader />} // Replace this with your lovely handcrafted loader
        url="https://api.github.com/users/octocat"
        timeout={5000}
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

The package gives access to `<Fetch>`, `<FetchProvider>` and `requestToApi()`. To have an in-depth explanation of how to use them, how they work and even more, head to this post: [Introducing React Data Fetching 🎣](https://medium.com/@CharlesMangwa/introducing-react-data-fetching-2140a1d36cc8).

## Docs

The documentation is available here: https://charlesmangwa.github.io/react-data-fetching.

## Todo

Want to submit a PR but don't know where to start? Here is a list of features you could consider! This might change in the future as the API is far from being complete.

- [x] Add compatibility to React 16.3.0+ lifecycles ⚛️
- [x] Implement React 16.3.0+ new context API ⚛️
- [ ] Add an `/examples` folder for newcomers & contributors 📂
- [ ] Add the ability to run multiple fetches serially or in parallel ⛓
- [ ] Implement a caching system (through React's Suspense?) 📥
- [ ] What else?

## About

`react-data-fetching` is currently developed and maintained by yours truly, [@Charles_Mangwa](https://twitter.com/Charles_Mangwa). Feel free to get in touch if you want to contribute!
