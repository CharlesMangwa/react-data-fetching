import requestToApi from "../requestToApi";

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
  const oldXMLHttpRequest = XMLHttpRequest;

  beforeEach(() => {
    (window as any).XMLHttpRequest = jest.fn(() => mockXHR);
  });

  afterEach(() => {
    (window as any).XMLHttpRequest = oldXMLHttpRequest;
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
      getAllResponseHeaders: jest.fn(),
      onload: jest.fn(),
      onreadystatechange: jest.fn(),
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
      getAllResponseHeaders: jest.fn(),
      onload: jest.fn(),
      onreadystatechange: jest.fn(),
      open: jest.fn(),
      readyState: 4,
      responseText: JSON.stringify({
        newToken: "abc123456",
      }),
      send: jest.fn(),
      setRequestHeader: jest.fn(),
      status: 201,
    };
    (window as any).XMLHttpRequest = jest.fn(() => mockFailingXHR);
    const onIntercept = jest.fn(({ currentParams, status }) => {
      if (status === 401) {
        (window as any).XMLHttpRequest = jest.fn(() => mockResetXHR);
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
        (window as any).XMLHttpRequest = jest.fn(() => mockXHR);
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
      getAllResponseHeaders: jest.fn(),
      onload: jest.fn(),
      onreadystatechange: jest.fn(),
      open: jest.fn(),
      readyState: 4,
      responseText: JSON.stringify({
        message: "Credentials are required to access this path",
      }),
      send: jest.fn(),
      setRequestHeader: jest.fn(),
      status: 401,
    };
    (window as any).XMLHttpRequest = jest.fn(() => mockFailingXHR);
    const onIntercept = jest.fn(() => undefined);
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
      "https://api.github.com/users?obj1={\"limit\":20,\"start\":0}&obj2=\"hello world\"",
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
