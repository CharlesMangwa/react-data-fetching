/* @flow */

import createReactContext, {
  type Context as ReactContext,
} from 'create-react-context'
import type { Context } from './types'

const { Provider, Consumer }: ReactContext<Context> = createReactContext({
  api: undefined,
  headers: {},
  loader: undefined,
  onIntercept: undefined,
  store: undefined,
  timeout: undefined,
})

export default Provider
export { Consumer }
