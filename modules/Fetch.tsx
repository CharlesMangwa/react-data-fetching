import invariant from "invariant";
import React, { Children, Component, createElement } from "react";
import { polyfill } from "react-lifecycles-compat";
// import PropTypes from "prop-types";

import { Consumer } from "./FetchProvider";
import requestToApi from "./requestToApi";
import {
  IError,
  IErrorContent,
  IProps,
  IReturnedData,
  Method,
} from "./types";
import { isEmptyChildren } from "./util";

class Fetch extends Component<IProps> {

  public static defaultProps = {
    body: {},
    cancel: false,
    children: undefined,
    component: undefined,
    context: {},
    loader: undefined,
    method: "GET" as Method,
    onError: undefined,
    onFetch: undefined,
    onLoad: undefined,
    onProgress: undefined,
    onTimeout: undefined,
    params: {},
    path: undefined,
    refetchKey: undefined,
    render: undefined,
    resultOnly: false,
    timeout: -1,
    url: undefined,
  };

  private data?: IReturnedData | IError;
  private didCallOnLoad = false;
  private isLoaded = false;
  private isUnmounted = false;

  public componentDidMount() {
    if (this.props.onLoad && !this.didCallOnLoad) {
      this.didCallOnLoad = true;
      this.props.onLoad();
    }
    if (this.props.path === "store") {
      this.handleData({
        data: this.props.context.store,
        isOK: true,
      });
    } else {
      this.fetchData(this.props);
    }
  }

  public componentDidUpdate(prevProps: IProps) {
    this.validateProps(this.props);

    if (this.props.onLoad && !this.didCallOnLoad) {
      this.didCallOnLoad = true;
      this.props.onLoad();
    }

    if (this.props.refetchKey !== prevProps.refetchKey) {
      if (this.props.path === "store") {
        this.isLoaded = true;
        this.handleData({
          data: this.props.context.store,
          isOK: true,
        });
      } else {
        this.isLoaded = false;
        this.fetchData(this.props);
      }
    }
  }

  public componentWillUnmount() {
    this.isUnmounted = true;
  }

  public shouldComponentUpdate(nextProps: IProps) {
    if (this.props.cancel !== nextProps.cancel) { return true; }
    if (this.props.children !== nextProps.children) { return true; }
    if (this.props.loader !== nextProps.loader) { return true; }
    if (this.props.onError !== nextProps.onError) { return true; }
    if (this.props.onFetch !== nextProps.onFetch) { return true; }
    if (this.props.onLoad !== nextProps.onLoad) { return true; }
    if (this.props.path !== nextProps.path) { return true; }
    if (this.props.params !== nextProps.params) { return true; }
    if (this.props.refetchKey !== nextProps.refetchKey) { return true; }
    if (this.props.render !== nextProps.render) { return true; }
    if (this.isLoaded) { return true; }
    if (this.data) { return true; }
    return false;
  }

  public render() {
    const { children, component, render } = this.props;

    if (!this.isLoaded && !this.isUnmounted) { return this.renderLoader(); }

    if (this.isLoaded && !this.isUnmounted) {
      if (component) {
        return createElement(component, this.data);
      }
      if (typeof render === "function" && this.data) {
        return render(this.data);
      }
      if (typeof children === "function" && this.data) {
        return children(this.data);
      }
      if (children && !isEmptyChildren(children)) {
        return Children.only(children);
      }
    }

    return null;
  }

  private async fetchData(props: IProps): Promise<void> {
    const {
      body,
      cancel,
      context,
      headers,
      method,
      onIntercept,
      onProgress,
      onTimeout,
      params,
      path,
      url,
      timeout,
    } = props;
    const route = path ? `${context.api || ""}${path}`  : url;
    const timeoutValue = context.timeout && timeout === -1 ?
      context.timeout :
        !context.timeout && timeout ?
        Math.max(0, timeout) :
          context.timeout && timeout ?
          timeout === -1 ? context.timeout : timeout :
            0;

    try {
      const apiResponse = await requestToApi({
        body: { ...body },
        cancel,
        headers: { ...context.headers, ...headers },
        method,
        onIntercept: onIntercept || context.onIntercept,
        onProgress,
        onTimeout,
        params: { ...params },
        timeout: timeoutValue,
        url: route || "",
      });
      if (!this.isUnmounted) {
        this.handleData({
          ...apiResponse,
          store: context.store,
        });
      }
    } catch (error) {
      if (!this.isUnmounted) {
        this.handleData({
          error: {
            content: error,
            message: "Something went wrong during the request",
            url: route,
          },
          isOK: false,
          store: context.store,
        });
        if (process.env.NODE_ENV !== "production") {
          invariant(
            !error,
            `<Fetch /> tried to call the route "${String(route)}" ` +
              `with "${String(method).toUpperCase()}" method ` +
              "but resolved with the following error: %s\n",
            this.printError(error),
          );
        }
      }
    }
  }

  private handleData(result: IReturnedData) {
    if (!this.isUnmounted) {
      this.isLoaded = true;
      this.props.resultOnly
        ? (this.data = result.error || result.data)
        : (this.data = result);
      this.returnData(result);
    }
  }

  private printError(error: IErrorContent): string {
    return error.response && JSON.stringify(error.response).length
      ? typeof error.response === "string"
        ? error.response
        : typeof error.response === "object"
          ? JSON.stringify(error.response, null, 2)
          : `${error.response}. "Check error.content to see what happened.`
      : "Check error.content to see what happened.";
  }

  private renderLoader(): React.ReactNode {
    const { context, loader } = this.props;

    if (context.loader && !loader) {
      return typeof context.loader === "function"
        ? context.loader()
        : context.loader;
    }
    if (!context.loader && loader) {
      return typeof loader === "function" ? loader() : loader;
    }
    if (context.loader && loader) {
      return typeof loader === "function" ? loader() : loader;
    }

    return null;
  }

  private returnData(result: IReturnedData) {
    const { onError, onFetch } = this.props;

    if (onFetch) { onFetch(this.data); }

    if (result.error && onError) { onError(this.data); }

    if (!this.isUnmounted) { this.forceUpdate(); }
  }

  private validateProps(props: IProps) {
    const {
      children,
      component,
      context,
      onTimeout,
      onFetch,
      path,
      render,
      timeout,
      url,
    } = props;

    invariant(path || url, "You must provide a `url` or a `path` to <Fetch />");

    if (path) {
      invariant(
        path && context.api,
        "You must implement <FetchProvider> at the root of your " +
          "app and provide a URL to `value.api` prop in order to use `path`",
      );
    }

    if (path === "store") {
      invariant(
        path && context.store,
        "You must implement <FetchProvider> at the root of your " +
          "app and provide an object to `value.store` prop " +
          "in order to use `store`",
      );
    }

    if (onTimeout) {
      invariant(
        (typeof timeout === "number" && timeout >= 0) ||
          (typeof context.timeout === "number" && context.timeout >= 0),
        "You must provide a `timeout` number in ms to <Fetch /> or " +
          "<FetchProvider> in order to use `onTimeout`",
      );
    }

    invariant(
      children || component || render || onFetch,
      "You must provide at least one of the following " +
        "to <Fetch />: children, `component`, `onFetch`, `render`",
    );
  }
}

const withContext = (
  FetchComponent: React.ComponentType<IProps>,
) => (props: IProps) => (
  <Consumer>{
    (data) => <FetchComponent {...props} context={data} />
  }</Consumer>
);

export default withContext(polyfill(Fetch));
export { Fetch };
