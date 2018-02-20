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
})
