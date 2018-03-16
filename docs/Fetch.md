# Fetch

A declarative way to perform network requests to REST APIs.

## Usage

The following example doesn't portray a real-world example, but rather present how to use the props exposed by the component (you'll rarely use all of them):

```jsx
import React, { Fragment, Component } from 'react'

/**
 * Only for demo purposes.
 * Let's say it's a stateful component with
 * shouldComponentUpdate implemented, for instance.
*/
import { Feed } from './components'

export default class MyComponent extends Component {
  _handleError = (error) => console.log('🔥 Error: ', error)

  _onLoadStart = () => console.log('♻️ Started loading')

  _onRequestAborted = () => console.log('⏱️ Timeout exceeded!')

  _onRequestProgression = (progress) => {
    if (progress.lengthComputable)
      console.log(`${Math.round((progress.loaded / progress.total) * 100)} %`)
  }

  /**
   * Notice: You won't have `store` if you haven't
   * implemented it through <ConnectedFetch>
  */
  _saveData = ({ data, isOK, store }) => {
    if (isOK) {
      this.setState(() => ({ users: { ...data, currentUser: store.user } }))
    }
    /**
     * You could also do something here to change isRefetchingData
     * or isLoadingMore from your state is you want to use `refetch`.
     * You can see an example here: https://goo.gl/wq8iMU.
    */
  }


  render() {
    <Fragment>
      <Fetch
        body={{ email: "deku@github.com" }}
        // component={Feed} /* replace Feed and uncomment to test */
        headers={{ Cache-Control: 'no-cache' }}
        loader={<p>Loading…</p>}
        method="POST"
        onError={this._handleError}
        onFetch={this._saveData}
        onLoad={this._onLoadStart}
        onProgress={this._onRequestProgression}
        onTimeout={this._onRequestAborted}
        params={{ start: 0, limit: 20 }}
        render={data => <p>{JSON.stringify(data)}</p>}
        timeout={200} /* modify this value to get something inside onError / onTimeout */
        url="https://reqres.in/api/register"
      />
      <Fetch resultOnly path="/api/users">
        {(data) => <p>{JSON.stringify(data)}</p>}
      </Fetch>
    </Fragment>
  }
}
```

## Props

This library is fully typed with [Flow](https://flow.org). Some of these types are detailed in the [Related types](Fetch.md#related-types) section below for better understanding of how `<Fetch>` works.

### body

**Type: `Object`**

`Object` used whenever you're using an appropriated method which accepts a body (`'FORM_DATA' | 'PATCH' | 'POST' | 'PUT'`), and need to pass one to your request.

### children

**Type: `React$StatelessFunctionalComponent<?ReturnedData | Error>`**

Called when the response has been received. This could be a regular React component, or a [Function as Child Component (FaCC)](https://medium.com/merrickchristensen/function-as-child-components-5f3920a9ace9). Only the former will received [`ReturnedData`](Fetch.md#returneddata) or ([`Error`](Fetch.md#error)) as an argument.

!> **On another note: _never_ call `setState` from here**

as this will cause an infinite loop: you start rendering, call `setState`, that starts rendering again, you call `setState` again, etc. Simply use a FaCC to render your data, or see [`onFetch`](Fetch.md#onfetch) if you still want to use `setState`.

### headers

**Type: `Object`**

Useful when you need to pass headers to your request. See [`<ConnectedFetch>`](ConnectedFetch.md#headers) if you have `headers` you want to share among all your `<Fetch>` instances.

### component

**Type: `React$ComponentType<?ReturnedData | Error>`**

Rendered when the response has been received. When you use `component` over `children` or `render`, `<Fetch>` uses `React.createElement` to create a new React element from the given component, and automatically passes [`ReturnedData`](Fetch.md#returneddata) as props.

> That means if you provide an inline function to the `component` prop, you would create a new component every render. This results in the existing component unmounting and the new component mounting instead of just updating the existing component. When using an inline function for inline rendering, use the render or the children prop (below).

\- as explained by the folks at [ReactTraining](https://reacttraining.com/react-router/web/api/Route/component).

The common use case for `component` would be to render a custom component that needs [`ReturnedData`](Fetch.md#returneddata) in its props, while `children` & `render` can be used to directly exploit the data inside HTML tags or React Native's components (`<View>`, `<Text>`, `<Image>`, etc). Make sure to implement `shouldComponentUpdate` where (and when!) needed to avoid any unnecessary re-rerender.

### loader

**Type: `React$Node`**

Called as soon as `<Fetch>` is rendering and starts fetching data. Just like `children`, it could be a component or a FaCC, but no argument is passed to the former this time. See [`<ConnectedFetch>` docs](ConnectedFetch.md#loader) if you have a `loader` you want to display in all your `<Fetch>` instances.

### method

**Type: `Method`**

Defaulted to `'GET'`, it defines the method you want to be used for your request. See [`Method`](Fetch.md#method-1) to get the list of all the methods supported by React Data Fetching.

### onError

**Type: `(?ReturnedData | Error) => void`**

Called whenever the request couldn't be sent or your API responds with a status code < 200 or > 299. See the [Error](Fetch.md#error) section below for more details.

### onFetch

**Type: `(?ReturnedData | Error) => void`**

Called when the response has been received. But beware: seeing this function being called doesn't mean the request has succeeded, you should check the field `isOK` from [`ReturnedData`](Fetch.md#returneddata) to make sure of that.

!> If you want to call `setState` with your freshly fetched data inside a stateful component, **this is the recommended place to do so**.

The tradeoff is that you can't use `onFetch` to render a component, see `children`, `component` or `render` to do so. Nothing stops you from using `component`, `render` or `children` to render your component, plus `onFetch` to save your data in the same `<Fetch>` for instance.

### onLoad

**Type: `Function`**

Called as soon as `<Fetch>` starts rendering & gets prepare to send your request.

### onProgress

**Type: `(Progress) => void`**

Called when the request is being processed, useful when you're uploading data for instance. See the [Progress](Fetch.md#progress) section below for more details.

### onTimeout

**Type: `Function`**

Called when your request exceeds the `timeout` you defined (no argument is passed). The request will automatically be aborted before this function is called.

### params

**Type: `Object`**

Works exactly like `body`, but is used whenever you need to pass parameters to your request to construct your final URL (i.e.: `https://my-app.com/api/v1/users?limit=100&age=18`).

### path

**Type: `string`**

Only available if you've configured `<ConnectedFetch>` in your app, and provided an `api` (see [`<ConnectedFetch>` docs](ConnectedFetch.md#path) for more details). Then, `path` allows you to write your URL in a more convenient way. Instead of writing `url="https://my-app.com/api/v1/news/latest"`, given that `<ConnectedFetch>` propagates your `api` URL `https://my-app.com/api/v1` inside every `<Fetch>` instances, you can just write `path="/news/latest"`, and React Data Fetching will automatically construct the corresponding URL.

### refetch

**Type: `any`**

Follows the same principle as [`extraData`](https://facebook.github.io/react-native/docs/flatlist.html#extradata) from React Native's FlatList component. This prop tells `<Fetch>` to re-render. This can be used inside a pull-to-refresh function, or to implement a pagination system for instance. You can pass `any` value here, the only requirement for it to operate as expected is to make sure that the value you passed will change over time. Otherwise, there will be no re-render.

### render

**Type: `React$StatelessFunctionalComponent<?ReturnedData | Error>`**

`Function` similar to `children`, but instead of writing it inside the component (`<Fetch>{...}</Fetch>`), you use a prop to do so (`<Fetch render={...} />`). These are the 2 main approaches when it comes to [**render props**](https://reactjs.org/docs/render-props.html). React Data Fetching supports both, so just use the one that works best for you!

!> **Like `children`: _never_ call `setState` from here**

as this will cause an infinite loop: you start rendering, call `setState`, that starts rendering again, you call `setState` again, etc. Simply use a FaCC to render your data, or see [`onFetch`](Fetch.md#onfetch) if you still want to use `setState`. If you just want to render a component, see [`component`](Fetch.md#component) instead.

### resultOnly

**Type: `boolean`**

Defines if you want to received the whole [`ReturnedData`](Fetch.md#returneddata) `object` inside `children`, `onError`, `onFetch` & `render`, or just the result of your call. See [`ReturnedData`](Fetch.md#returneddata) for more details.

### timeout

**Type: `number`**

Value in ms after which you'll want the library to abort the request. It's defaulted to `0`, which means there is no timeout. See [`<ConnectedFetch>` docs](ConnectedFetch.md#timeout) if you have a `timeout` value you want to share among all your `<Fetch>` instances.

### url

**Type: `string`**

String used to make your request. Here you passed the complete string of the URL you're trying to call. See [`<ConnectedFetch>` docs](ConnectedFetch.md#url) and `path` if you have an `api` you want to dispatch in all your `<Fetch>` instances, in order to have a cleaner way to write your URLs.

## Related types

### Error

```js
type ErrorContent = {
  request: XMLHttpRequest,
  response: String | Object
};

type Error = {
  content: ErrorContent,
  message: "Something went wrong during the request",
  url?: string
};
```

`Object` provided to `children`, `component`, `onError`, `onFetch` & `render` prop when an error occurred while sending the request. It could be part of another `object` (corresponding to [ReturnedData](Fetch.md#returneddata)) or the only argument sent to these functions if you set `resultOnly` to `true`.

`Error` could exist if your API responded with a non-successful status code (`statusCode < 200 || statusCode > 299`) or if the URL you provided couldn't be used. In either way, if you're in `__DEV__` environment, a descriptive error of what could have gone wrong will be printed in your console:

<img 
  alt="React Data Fetching error printing example"
  src="images/error.png"
  width="900"
/>

### Method

```js
type Method =
  | "DELETE"
  | "FORM_DATA"
  | "GET"
  | "HEAD"
  | "PATCH"
  | "POST"
  | "PUT"
  | "TRACE";
```

`String` enumerating all the HTTP methods currently supported by the library. If you use one which is not listed in the type above, your request will still be sent, but there is no guarantee that `<Fetch>` will work exactly as expected.

### Progress

```js
type Progress = {
  bubbles: boolean,
  cancelable: boolean,
  lengthComputable: boolean,
  loaded: number,
  target: EventTarget,
  total: number,
  type: string
};
```

`Object` provided to `onProgress` when you're making a request. This is particularly handy if you're uploading files through the `"FORM_DATA"` method seen above, and want to keep your user update of the progression. You could use it as so:

```jsx
import React, { Component,  Fragment } from 'react'
import { ProgressionBar } from './components'

export default class Inscription extends Component {
  state = { uploadProgression: 0 }

  onUploadProgression = (progress) => {
    if (progress.lengthComputable) {
      this.setState(() => ({
        // Will go from 0 --> 100
        uploadProgression: Math.round((progress.loaded / progress.total) * 100),
      }))
    }
  }

  render() {
    return (
      <Fragment>
        <Fetch
          url="https://my-app.com/api/v1/users"
          method="FORM_DATA"
          body={{
            email: "deku@github.com",
            password: "plusultra",
            picture: /* PICTURE_FILE */,
          }}
          onProgress={this.onUploadProgression}
          render={null}
        />
        <ProgressionBar value={this.state.uploadProgression} />
      </Fragment>
    )
  }
}
```

### ReturnedData

```js
type ReturnedData = {
  data?: Object,
  error?: Error,
  isOK?: boolean,
  request?: XMLHttpRequest,
  status?: number,
  store?: Object
};
```

`Object` provided to `children`, `component`, `onError`, `onFetch` & `render`. As you can see, you won't necessarily get every field. For instance: if your API responds with a `200 'OK'` status, there's no reason to get an `error` field. However, if you set `resultOnly` to `true`, the above-mentioned props won't received this `object`, but rather:

* **data**, if everything went well and you're inside `children` (FaCC not a component), `component`, `onFetch` & `render`
* **error**, if you caught an error and are inside `children` (FaCC not a component), `component`, `onFetch` & `render`
* **store**, if you've configured `ConnectedFetch` and call `path="redux"` inside `<Fetch>`: everywhere (`children`, `component`, `onError`, `onFetch` & `render`)
