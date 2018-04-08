import requestToApi from '../requestToApi'

describe('requestToApi', () => {
  const mockXHR = {
    getAllResponseHeaders: jest.fn(),
    onload: jest.fn(),
    open: jest.fn(),
    onreadystatechange: jest.fn(),
    readyState: 4,
    responseText: JSON.stringify([{ ok: true, username: 'Octocat' }]),
    send: jest.fn(),
    status: 200,
    setRequestHeader: jest.fn(),
  }
  const oldXMLHttpRequest = XMLHttpRequest

  beforeEach(() => {
    window.XMLHttpRequest = jest.fn(() => mockXHR)
  })

  afterEach(() => { window.XMLHttpRequest = oldXMLHttpRequest })

  it('fetches data correctly', () => {
    expect.assertions(1)
    const request = requestToApi({ url: 'https://api.github.com/users/4', method: 'GET' })
    mockXHR.onreadystatechange()
    request.then((result) => {
      const response = result.data[0]
      expect(response.username).toEqual('Octocat')
    })
  })

  it('performs correctly with FORM_DATA method', () => {
    expect.assertions(1)
    const request = requestToApi({
      url: 'https://api.github.com/users',
      method: 'FORM_DATA',
      body: {
        userName: 'Charles'
      }
    })
    mockXHR.onreadystatechange()
    request.then((result) => {
      const response = result.data[0]
      expect(response.ok).toBeTruthy()
    })
  })


  it('performs correctly with GET parameters', () => {
    expect.assertions(1)
    const request = requestToApi({
      url: 'https://api.github.com/users',
      method: 'GET',
      params: {
        start: 0,
        limit: 20
      }
    })
    mockXHR.onreadystatechange()
    request.then((result) => {
      const response = result.data[0]
      expect(response.ok).toBeTruthy()
    })
  })

  it('should run onIntercept when api call is failing with status 401', () => {
    const mockFailingXHR = {
      getAllResponseHeaders: jest.fn(),
      onload: jest.fn(),
      open: jest.fn(),
      onreadystatechange: jest.fn(),
      readyState: 4,
      responseText: JSON.stringify({message: 'Credentials are required to access this path'}),
      send: jest.fn(),
      status: 401,
      setRequestHeader: jest.fn(),
    }
    const mockResetXHR = {
      getAllResponseHeaders: jest.fn(),
      onload: jest.fn(),
      open: jest.fn(),
      onreadystatechange: jest.fn(),
      readyState: 4,
      responseText: JSON.stringify({newToken: 'abc123456'}),
      send: jest.fn(),
      status: 201,
      setRequestHeader: jest.fn(),
    }
    window.XMLHttpRequest = jest.fn(() =>mockFailingXHR);
    const onIntercept = jest.fn(({currentParams, request, status}) => {
      if (status === 401) {
        window.XMLHttpRequest = jest.fn(() => mockResetXHR);
        const resetRequest = requestToApi({
          url: 'https://api.github.com/auth/reset',
          method: 'POST',
          body: {
            resetToken: 'abcxzz'
          }
        })
        mockResetXHR.onreadystatechange();
        resetRequest.then((result) => {
          const response = result.data.newToken;
          expect(response).toBe('abc123456');
        });
        window.XMLHttpRequest = jest.fn(() => mockXHR);
        return currentParams;
      }
    });
    const request = requestToApi({
      url: 'https://api.github.com/users',
      method: 'GET',
      params: {
        start: 0,
        limit: 20
      },
      onIntercept
    })
    mockFailingXHR.onreadystatechange();
    request.then((result) => {
      const response = result.data[0]
      expect(response.ok).toBeTruthy()
    })
    expect(onIntercept).toBeCalled();
  })

  it('should reject when onIntercept return null or undefined', () => {
    const mockFailingXHR = {
      getAllResponseHeaders: jest.fn(),
      onload: jest.fn(),
      open: jest.fn(),
      onreadystatechange: jest.fn(),
      readyState: 4,
      responseText: JSON.stringify({message: 'Credentials are required to access this path'}),
      send: jest.fn(),
      status: 401,
      setRequestHeader: jest.fn(),
    }
    window.XMLHttpRequest = jest.fn(() =>mockFailingXHR);
    const onIntercept = jest.fn(({currentParams, request, status}) => {
      return null
    });
    const request = requestToApi({
      url: 'https://api.github.com/users',
      method: 'GET',
      params: {
        start: 0,
        limit: 20
      },
      onIntercept
    })
    mockFailingXHR.onreadystatechange();
    request.catch((err) => {
      const responseText = err.request.responseText;
      expect(JSON.parse(responseText).message).toBe('Credentials are required to access this path');
    })
    expect(onIntercept).toBeCalled();
  })
})
