import requestToApi from "../requestToApi";

interface IMockXHR {
  abort: jest.Mock;
  getAllResponseHeaders: jest.Mock;
  onload: jest.Mock;
  onreadystatechange: jest.Mock;
  ontimeout: jest.Mock;
  open: jest.Mock;
  readyState: number;
  responseText: string;
  send: jest.Mock;
  setRequestHeader: jest.Mock;
  status: number;
}

const XMLHttpRequestDefautlts = {
  abort: XMLHttpRequest.prototype.abort,
  getAllResponseHeaders: XMLHttpRequest.prototype.getAllResponseHeaders,
  onload: XMLHttpRequest.prototype.onload,
  onreadystatechange: XMLHttpRequest.prototype.onreadystatechange,
  ontimeout: XMLHttpRequest.prototype.ontimeout,
  open: XMLHttpRequest.prototype.open,
  send: XMLHttpRequest.prototype.send,
  setRequestHeader: XMLHttpRequest.prototype.setRequestHeader,
};

const mockXMLHttpRequest = (mockXHR: IMockXHR) => {
  XMLHttpRequest.prototype.abort = mockXHR.abort;
  XMLHttpRequest.prototype.getAllResponseHeaders = mockXHR.getAllResponseHeaders;
  XMLHttpRequest.prototype.onload = mockXHR.onload;
  XMLHttpRequest.prototype.onreadystatechange = mockXHR.onreadystatechange;
  XMLHttpRequest.prototype.ontimeout = mockXHR.ontimeout;
  XMLHttpRequest.prototype.open = mockXHR.open;
  Object.assign(XMLHttpRequest.prototype, "readyState", mockXHR.readyState);
  Object.assign(XMLHttpRequest.prototype, "responseText", mockXHR.responseText);
  XMLHttpRequest.prototype.send = mockXHR.send;
  XMLHttpRequest.prototype.setRequestHeader = mockXHR.setRequestHeader;
  Object.assign(XMLHttpRequest.prototype, "status", mockXHR.status);
};

const revertXMLHttpRequest = () => {
  XMLHttpRequest.prototype.abort = XMLHttpRequestDefautlts.abort;
  XMLHttpRequest.prototype.getAllResponseHeaders = XMLHttpRequestDefautlts.getAllResponseHeaders;
  XMLHttpRequest.prototype.onload = XMLHttpRequestDefautlts.onload;
  XMLHttpRequest.prototype.onreadystatechange = XMLHttpRequestDefautlts.onreadystatechange;
  XMLHttpRequest.prototype.ontimeout = XMLHttpRequestDefautlts.ontimeout;
  XMLHttpRequest.prototype.open = XMLHttpRequestDefautlts.open;
  Object.assign(XMLHttpRequest.prototype, "readyState", undefined);
  Object.assign(XMLHttpRequest.prototype, "responseText", undefined);
  XMLHttpRequest.prototype.send = XMLHttpRequestDefautlts.send;
  XMLHttpRequest.prototype.setRequestHeader = XMLHttpRequestDefautlts.setRequestHeader;
  Object.assign(XMLHttpRequest.prototype, "status", undefined);
};

describe("requestToApi", () => {
  const mockXHR = {
    abort: jest.fn(),
    getAllResponseHeaders: jest.fn(),
    onload: jest.fn(),
    onreadystatechange: jest.fn(),
    ontimeout: jest.fn(),
    open: jest.fn(),
    readyState: 4,
    responseText: JSON.stringify([{ ok: true, username: "Octocat" }]),
    send: jest.fn(),
    setRequestHeader: jest.fn(),
    status: 200,
  };

  beforeEach(() => {
    mockXMLHttpRequest(mockXHR);
  });

  afterEach(() => {
    revertXMLHttpRequest();
    jest.clearAllMocks();
  });

  it("should fetch data correctly", () => {
    expect.assertions(1);
    const request = requestToApi({
      method: "GET",
      url: "https://api.github.com/users/4",
    });
    mockXHR.onreadystatechange();
    request.then((result) => {
      const response = result.data[0];
      expect(response.username).toEqual("Octocat");
    });
  });

  it("should perform correctly with FORM_DATA method", () => {
    expect.assertions(1);
    const request = requestToApi({
      body: {
        userName: "Charles",
      },
      method: "FORM_DATA",
      url: "https://api.github.com/users",
    });
    mockXHR.onreadystatechange();
    request.then((result) => {
      const response = result.data[0];
      expect(response.ok).toBeTruthy();
    });
  });

  it("should perform correctly with GET parameters", () => {
    expect.assertions(1);
    const request = requestToApi({
      method: "GET",
      params: {
        limit: 20,
        start: 0,
      },
      url: "https://api.github.com/users",
    });
    mockXHR.onreadystatechange();
    request.then((result) => {
      const response = result.data[0];
      expect(response.ok).toBeTruthy();
    });
  });

  it("should call `onIntercept` when the request failed with a status 401 & retrieve successfully", () => {
    expect.assertions(2);
    const mockFailingXHR = {
      abort: jest.fn(),
      getAllResponseHeaders: jest.fn(),
      onload: jest.fn(),
      onreadystatechange: jest.fn(),
      ontimeout: jest.fn(),
      open: jest.fn(),
      readyState: 4,
      responseText: JSON.stringify({
        message: "Credentials are required to access this path",
      }),
      send: jest.fn(),
      setRequestHeader: jest.fn(),
      status: 401,
    };
    const mockResetXHR = {
      abort: jest.fn(),
      getAllResponseHeaders: jest.fn(),
      onload: jest.fn(),
      onreadystatechange: jest.fn(),
      ontimeout: jest.fn(),
      open: jest.fn(),
      readyState: 4,
      responseText: JSON.stringify({
        newToken: "abc123456",
      }),
      send: jest.fn(),
      setRequestHeader: jest.fn(),
      status: 201,
    };
    mockXMLHttpRequest(mockFailingXHR);
    const onIntercept = jest.fn(({ currentParams, status }) => {
      if (status === 401) {
        mockXMLHttpRequest(mockResetXHR);
        const resetRequest = requestToApi({
          body: {
            resetToken: "abcxzz",
          },
          method: "POST",
          url: "https://api.github.com/auth/reset",
        });
        mockResetXHR.onreadystatechange();
        resetRequest.then((result) => {
          const response = result.data.newToken;
          expect(response).toBe("abc123456");
        });
        mockXMLHttpRequest(mockXHR);
        return currentParams;
      }
    });
    const request = requestToApi({
      method: "GET",
      onIntercept,
      params: {
        limit: 20,
        start: 0,
      },
      url: "https://api.github.com/users",
    });
    mockFailingXHR.onreadystatechange();
    request.then((result) => {
      const response = result.data[0];
      expect(response.ok).toBeTruthy();
    });
    expect(onIntercept).toBeCalled();
  });

  it("should reject when `onIntercept` is `undefined` or returns `null`", () => {
    expect.assertions(2);
    const mockFailingXHR = {
      abort: jest.fn(),
      getAllResponseHeaders: jest.fn(),
      onload: jest.fn(),
      onreadystatechange: jest.fn(),
      ontimeout: jest.fn(),
      open: jest.fn(),
      readyState: 4,
      responseText: JSON.stringify({
        message: "Credentials are required to access this path",
      }),
      send: jest.fn(),
      setRequestHeader: jest.fn(),
      status: 401,
    };
    mockXMLHttpRequest(mockFailingXHR);
    const onIntercept = jest.fn();
    const request = requestToApi({
      method: "GET",
      onIntercept,
      params: {
        limit: 20,
        start: 0,
      },
      url: "https://api.github.com/users",
    });
    mockFailingXHR.onreadystatechange();
    request.catch((err) => {
      const responseText = err.request.responseText;
      expect(JSON.parse(responseText).message).toBe(
        "Credentials are required to access this path",
      );
    });
    expect(onIntercept).toBeCalled();
  });

  it("should call `onTimeout` when it's provided & the threshold have been reached", () => {
    expect.assertions(1);
    const fn = jest.fn();
    const request = requestToApi({
      method: "GET",
      onTimeout: fn,
      timeout: 0.1,
      url: "https://api.github.com/users/4",
    });

    mockXHR.onreadystatechange();
    mockXHR.ontimeout();

    expect(fn).toHaveBeenCalled();
  });

  it("should build final URL from nested `params` objects", () => {
    expect.assertions(2);
    const request = requestToApi({
      method: "GET",
      params: {
        obj1: {
          limit: 20,
          start: 0,
        },
        obj2: "hello world",
      },
      url: "https://api.github.com/users",
    });
    mockXHR.onreadystatechange();
    expect(mockXHR.open).toHaveBeenCalledWith(
      "GET",
      "https://api.github.com/users?obj1={\"start\":0,\"limit\":20}&obj2=\"hello world\"",
    );
    request.then((result) => {
      const response = result.data[0];
      expect(response.ok).toBeTruthy();
    });
  });

  it("should perform correctly with GET parameters", () => {
    expect.assertions(1);
    const request = requestToApi({
      method: "GET",
      params: {
        limit: 20,
        start: 0,
      },
      url: "https://api.github.com/users",
    });
    mockXHR.onreadystatechange();
    request.then((result) => {
      const response = result.data[0];
      expect(response.ok).toBeTruthy();
    });
  });
});
