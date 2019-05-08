/// <reference types="react" />
import { Interceptor } from "./types";
interface IReactContext {
    api?: string;
    headers?: {
        [s: string]: any;
    };
    loader?: React.ReactNode;
    onIntercept?: Interceptor;
    store?: object;
    timeout?: number;
}
declare const Provider: import("react").ComponentClass<import("create-react-context").ProviderProps<IReactContext>, any>, Consumer: import("react").ComponentClass<import("create-react-context").ConsumerProps<IReactContext>, any>;
export default Provider;
export { Consumer };
//# sourceMappingURL=FetchProvider.d.ts.map