import requestToApi from '../requestToApi'

describe('requestToApi', () => {
  beforeAll(() => {
    global.fetch = jest.fn().mockImplementation(() => {
      const p = new Promise((resolve, reject) => {
        resolve({
          ok: true,
          userName: 'Octocat',
          json: function () {
            return { userName: 'Octocat' }
          }
        })
      })
      return p
    })
  })

  it('fetches data correctly', async () => {
    expect.assertions(1)
    const request = await requestToApi({ url: 'https://api.github.com/users/4', method: 'GET' })
    const response = request.result
    expect(response.userName).toEqual('Octocat')
  })

  it('performs correctly with FORM_DATA method', async () => {
    expect.assertions(1)
    const request = await requestToApi({
      url: 'https://api.github.com/users',
      method: 'FORM_DATA',
      body: {
        userName: 'Charles'
      }
    })
    const response = request.isOK
    expect(response).toBeTruthy()
  })


  it('performs correctly with GET parameters', async () => {
    expect.assertions(1)
    const request = await requestToApi({
      url: 'https://api.github.com/users',
      method: 'GET',
      params: {
        start: 0,
        limit: 20
      }
    })
    const response = request.isOK
    expect(response).toBeTruthy()
  })
})
