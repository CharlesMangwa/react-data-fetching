# requestToApi

A function which against all odds: sends a request to an API!

## Example

```jsx
import React, { Component, Fragment } from 'react'
import { requestToApi } from 'react-data-fetching'

import { Button } from './components

export default class Auth extends Component {
  state = { accountCreated: false }

  _onSignUp = async () => {
    const apiResponse = await requestToApi({
      url: 'https://my-app.com/api/v1/users',
      body: {{ email: 'midoriya@shonen.com' },
      headers: {{ Cache-Control: 'no-cache' },
      method: 'POST',
      onTimeout: () => console.log('⏱️ Timeout!'),
      onProgress: (progression) => ('♻️ Progressing...', progression),
      // params: {{ page: 5, start: 0, limit: 20 }},
      timeout: 2500,
    })

    this.setState(() => ({ accountCreated: apiResponse.isOK }))
  }

  render() {
    const { accountCreated } = this.state
    return (
      <Fragment>
        <h1>{'Has an account? '}{accountCreated}</h1>
        <Button onPress={this._onSignUp} text="Create account" />
      </Fragment>
    )
  }
}
```

## Argument(s)

`requestToApi()` is just a simple Promise which will `resolve` your result or `reject` an error. It's actually the function `<Fetch>` uses under the hood to make all your calls. `requestToApi()` only accepts a single `object` of the following shape as an argument:

```js
type RequestToApi = {
  body?: Object,
  headers?: Object,
  method: Method,
  onProgress?: (Progress) => void,
  onTimeout?: Function,
  params?: Object,
  url: string,
  timeout?: number,
}
```

See [`<Fetch>`'s doc](Fetch.md) to have more details about specific types and [`ReturnedData`](Fetch.md#returneddata) you get from the `requestToApi()`.
