import createReactContext from "create-react-context";
import { Interceptor } from "./types";

interface IReactContext {
  api?: string;
  headers?: {[s: string]: any};
  loader?: React.ReactNode;
  onIntercept?: Interceptor;
  store?: object;
  timeout?: number;
}

const ctx: IReactContext = {
  api: undefined,
  headers: {},
  loader: undefined,
  onIntercept: undefined,
  store: undefined,
  timeout: undefined,
};

const { Provider, Consumer } = createReactContext(ctx);

export default Provider;
export { Consumer };
