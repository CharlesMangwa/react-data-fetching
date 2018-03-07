<div align="center">
  <a href="https://github.com/CharlesMangwa/react-data-refetcher" target="\_parent">
    <img 
      alt="React Data Refetcher logo"
      src="https://raw.githubusercontent.com/CharlesMangwa/react-data-refetcher/master/docs/images/logo.png"
      width="450"
    />
  </a>
</div>

<br />

<div align="center">
  <strong>A component-driven way to fetch data in any React app 🎣 </strong>
  <br />
  <br />
  <a href="https://circleci.com/gh/CharlesMangwa/react-data-refetcher">
    <img
      alt="build: CircleCI"
      src="https://circleci.com/gh/CharlesMangwa/react-data-refetcher.svg?style=shield&circle-token=ec4d3afecb3cd2d7fd6712b2a6b2f576b9dfb08f"
    />
  </a>
  <a href="https://coveralls.io/github/CharlesMangwa/react-data-refetcher?branch=master">
    <img
      alt="coverage: Coveralls"
      src="https://coveralls.io/repos/github/CharlesMangwa/react-data-refetcher/badge.svg?branch=master&t=YCvNBr"
    />
  </a>
  <a href="https://www.npmjs.com/package/react-data-refetcher">
    <img
      alt="version: 0.1.0"
      src="https://img.shields.io/npm/v/react-data-refetcher.svg"
    />
  </a>
  <img 
    alt="gzip size"
    src="http://img.badgesize.io/https://npmcdn.com/react-data-refetcher/umd/react-data-refetcher.min.js?compression=gzip"
  />
  <img
    alt="module formats: umd, cjs, esm"
    src="https://img.shields.io/badge/module%20formats-umd%2C%20cjs%2C%20esm-green.svg"
  />
  <a href="https://github.com/CharlesMangwa/react-data-refetcher/pulls">
    <img
      alt="PRs welcome"
      src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg"
    />
  </a>
</div>

#

`react-data-refetcher` provides a very intuitive way to perform any REST API call without hassle, through a single React component. It also helps you take care of timeouts, loading states, errors handling, data saving, uploading/downloading progress, etc. Fetching data while letting the user know what's going on have never been that easy!

The package is really lightweight (~4.01 kB gzipped) and has been built from the ground up with universal apps in mind: you can use it wherever React is rendering - meaning it works seamlessly with React (web), React Native and even Preact apps!


## Installation

Using [Yarn](https://yarnpkg.com/):

```shell
$ yarn add react-data-refetcher
```

Then, use it as you would with anything else:

```js
// using ES6 modules
import { Fetch } from "react-data-refetcher"

// using CommonJS modules
var Fetch = require("react-data-refetcher").Fetch
```

The UMD build is also available on [unpkg](https://unpkg.com):

```html
<script src="https://unpkg.com/react-data-refetcher/umd/react-data-refetcher.min.js"></script>
```

You can find the library on `window.ReactDataRefetcher`.

## Usage

The following illustrates the simplest way to use `react-data-refetcher`:

```jsx
import React, { Component } from "react"
import { Fetch } from "react-data-refetcher"

import { Loader } from './components'

export default class App extends Component {
  render() {
    return (
      <Fetch
        loader={<Loader/>} // Replace this with your lovely handcrafted loader
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

The package gives  access to `<Fetch>`, `<ConnectedFetch>` and `requestToApi()`. To have an in-depth explanation about how to use them, how they work and even more, head to this post: [Introducing 🎣 React Data Refetcher](https://medium.com/p/2140a1d36cc8/).

## Docs

- [**`<Fetch>`**](https://github.com/CharlesMangwa/react-data-refetcher/blob/master/docs/Fetch.md) carries out all your network requests.
- [**`<ConnectedFetch>`**](https://github.com/CharlesMangwa/react-data-refetcher/blob/master/docs/ConnectedFetch.md) allows you to share several parameters among every `<Fetch>` instance in your app.
- [**`requestToApi()`**](https://github.com/CharlesMangwa/react-data-refetcher/blob/master/docs/requestToApi.md) lets you perform your request with a good old function.

## Todo

Want to submit a PR but don't know where to start? Here is a list of features you could consider! This might change in the future as the API is far from being complete.

- [ ] Increase code coverage 🤓
- [ ] Implement React 16.3.0 new context API & lifecycles ⚛️
- [ ] Add the ability to make several calls at once / manage a queue ⛓
- [ ] Implement a caching (and/or normalization) system (through React.Suspense?) 📥
- [ ] Add GraphQL support ✨ 
- [ ] What else?

## About

`react-data-refetcher` is currently developed and maintained by your truly, [@Charles_Mangwa](https://twitter.com/Charles_Mangwa). Feel free get in touch if you want to contribute!
