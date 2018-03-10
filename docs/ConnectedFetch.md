# ConnectedFetch

A provider which helps you share parameters among your `<Fetch>` instances.

## Usage

```jsx
import React from 'react'
import { Provider } from 'react-redux'
import { ConnectedFetch } from 'react-data-fetching'

import Root from './app'
import store from './store'

const App = () => (
  <Provider store={store}>
    <ConnectedFetch
      api="https://my-app.com/api/v1"
      headers={{ Cache-Control: 'public' }}
      loader={<p>♻️ Loading…</p>}
      timeout={5000} /* Any unresolved request will automatically be aborted after 5s */
      // store={{ networkState: 'online' }} /* Uncomment to manually set `store` value (see #Props.store) */
    >
      <Root />
    </ConnectedFetch>
  </Provider>
)

export default App

```

## Props

### api

**Type: `string`**

A mandatory prop used to create the final URL `<Fetch>` will use. By setting this prop, you can switch from using `url` inside `<Fetch>` to using `path`, with only what comes after `api` in your URL. For instance, the following URL "https://my-app.com/api/v1/users" will become `api="https://my-app.com/api/v1"` (goes inside `<ConnectedFetch>`) and `path="/users"` (goes inside `<Fetch>`).

### children

**Type: `React$Node`**

A mandatory prop used to render your app. Basically, you'll just have to wrap your whole app inside `<ConnectedFetch>` like in the example above.

### headers

**Type: `Object`**

Object used to share headers which are common to all your requests. This could be useful if you have some authentication going on at some point, and need to send a token with your calls.

### loader

**Type: `React$Node`**

A component (or a function returning one) render every time a `<Fetch>` is loading data. The typical use case for this prop would be when you have a common loader for your whole app. Instead of using `<Fetch>`'s `loader` prop, you'll just have to do it once here and that's it: you'll have the same beautiful spinner in your whole app!

### store

**Type: `Object`**

Object containing a store you want to propagate inside your [`ReturnedData`](Fetch.md#returneddata). `store` can be used if you want to get access to more data in your component than what you get from your request. This could be either a value you explicitly passed or if you've implemented `<ConnectedFetch>` by wrapping it inside `<Provider>` from Redux: React Data Fetching will automatically send your Redux's store inside `data.store` (see [`ReturnedData`](Fetch.md#returneddata) for more details). This means that you won't even have to precise `store={...}` as React Data Fetching will know that `<ConnectedFetch>` is inside Redux's `<Provider>`, and will do the job for you!

### timeout

**Type: `number`**

Value in ms after which you'll want the library to abort any request you'll send from any `<Fetch>` in your app. It's defaulted to `0`, which means there is no timeout. By using this, all your requests will have a common timeout value you can handle in `<Fetch>` through `onTimeout` prop.

## Notes

###  Duplicated props

You'll notice that `<ConnectedFetch>` and `<Fetch>` share a few props in common: `headers`, `loader`, `timeout`. You could ask then: "OK, but what if I use a `loader` in `<ConnectedFetch>`, but want a special one in a specific `<Fetch>` ?". Well, it would be a very good question! **React Data Fetching will always apply the prop coming from a `<Fetch>` over the same one coming from `<ConnectedFetch>`**. This allows you to share general parameters, but still have a fine-grained control on specific `<Fetch>` instances. The only exception is `headers` where the library will simply merge both `<ConnectedFetch>` and `<Fetch>` headers, so make sure to Don't Repeat Yourself™!

### Store propagation

As seen above, *for now*, React Data Fetching can share your Redux store all by itself. This is a feature which is nice to have, was possible to implement without spending too much time on it, but could possibly disappear/be modified in the (near?) future. However, you will always be able to at least manually pass a variable you want to be shared through `data.store`.
