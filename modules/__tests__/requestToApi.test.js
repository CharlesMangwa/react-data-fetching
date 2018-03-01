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
})
