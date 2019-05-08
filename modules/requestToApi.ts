import { IRequestToApi } from "./types";

interface IResponse {
  data: any;
  isOK: boolean;
  request: XMLHttpRequest;
  status: number;
}

const requestToApi = (args: IRequestToApi): Promise<IResponse> => {
  const {
    body,
    cancel,
    headers,
    method,
    onProgress = () => null,
    onTimeout,
    params,
    onIntercept,
    url,
    timeout = 0,
  } = args;
  const defaultHeaders: { [header: string]: string } = {
    Accept: "application/json;charset=UTF-8",
    ["Content-Type"]:
      method === "FORM_DATA" ? "multipart/form-data" : "application/json",
  };
  const formData = new FormData();
  let route = url;
  let interceptedResult = null;

  // (value?: T | PromiseLike<T>) => void, reject: (reason?: any) => void) => void
  const handleError = async (
    error: Event | XMLHttpRequest,
    request: XMLHttpRequest,
    reject: (reason?: any) => void,
  ): Promise<void> => {
    reject({
      request,
      response: request.response,
    });
  };

  const handleTimeout = (request: XMLHttpRequest, reject: (message: string) => void): void => {
    request.abort();
    if (onTimeout) { onTimeout(); }
    reject(`Your request took more than ${timeout}ms to resolve.`);
  };

  const returnData = async (
    request: XMLHttpRequest,
    resolve: (value?: IResponse | PromiseLike<IResponse>) => void,
    reject: (reason?: any) => void,
    isCancel?: boolean,
  ): Promise<void> => {
    if (isCancel) {
      const response = {
        data: { cancelled: true },
        isOK: true,
        request,
        status: request.status,
      };
      resolve(response);
    }
    if (request.readyState === 4) {
      const isOK = request.status >= 200 && request.status <= 299;
      if (isOK) {
        const response = {
          data: request.responseText
            ? await JSON.parse(request.responseText)
            : undefined,
          isOK,
          request,
          status: request.status,
        };
        resolve(response);
      } else if (onIntercept) {
        interceptedResult = onIntercept({
          currentParams: args,
          request,
          status: request.status,
        });
        if (interceptedResult) {
          resolve(
            requestToApi({
              ...interceptedResult,
              onIntercept: undefined,
            }),
          );
        } else { handleError(request, request, reject); }
      } else { handleError(request, request, reject); }
    }
  };

  const setHeaders = (request: XMLHttpRequest): void => {
    Object.keys(defaultHeaders).map((defaultHeader) =>
      request.setRequestHeader(defaultHeader, String(defaultHeaders[defaultHeader])),
    );
    if (headers && Object.keys(headers).length > 0) {
      Object.keys(headers).map((header) =>
        request.setRequestHeader(header, headers[header]));
    }
  };

  if (method === "FORM_DATA" && body && Object.keys(body).length > 0) {
    Object.keys(body).map(
      (entry) => formData.append(entry, body[entry]),
    );
  }

  if (params && Object.keys(params).length > 0) {
    Object.keys(params).map(
      (param, index) =>
        index === 0
          ? (route = `${route}?${param}=${JSON.stringify(params[param])}`)
          : (route = `${route}&${param}=${JSON.stringify(params[param])}`),
    );
  }

  const sendRequest = (): Promise<IResponse> =>
    new Promise((resolve, reject) => {
      try {
        const request = new XMLHttpRequest();
        if (request.upload) {
          request.upload.onerror = (error) => handleError(error, request, resolve);
          request.upload.onload = () => returnData(request, resolve, reject);
          request.upload.onprogress = onProgress;
          request.upload.ontimeout = () => handleTimeout(request, reject);
        }

        request.onerror = (error) => handleError(error, request, resolve);
        request.onprogress = onProgress;
        request.onreadystatechange = () => returnData(request, resolve, reject);
        request.ontimeout = () => handleTimeout(request, reject);

        request.open(method === "FORM_DATA" ? "POST" : method, route);
        request.timeout = timeout;
        setHeaders(request);
        if (cancel) { returnData(request, resolve, reject, true); }
        request.send(
          method === "FORM_DATA"
            ? formData
            : method === "DELETE" ||
              method === "GET" ||
              method === "HEAD" ||
              method === "PUT"
              ? null
              : JSON.stringify({ ...body }),
        );
        if (cancel) { request.abort(); }
      } catch (request) {
        handleError(request, request, reject);
      }
    });

  return sendRequest();
};

export default requestToApi;
