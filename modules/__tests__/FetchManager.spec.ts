import FetchManager from '../FetchManager'

describe('FetchManager', () => {
  let fn
  beforeAll(() => {
    fn = jest.fn()
    FetchManager.subscribe({
      inProgress: false,
      run: fn,
      cancel: fn,
      url: 'https://api.github.com/user/0',
    })
  })

  it('should add a subscription correctly', () => {
    expect.assertions(2)
    const expectedRef = 1
    expect(FetchManager.getAll()).toEqual(expect.arrayContaining([]))

    const ref = FetchManager.subscribe({
      inProgress: true,
      run: fn,
      cancel: fn,
      url: 'https://api.github.com/user/1',
    })
    expect(ref).toBe(expectedRef)
  })

  it('should update a subscription correctly', () => {
    expect.assertions(1)
    const didUpdate = FetchManager.update(1, {
      inProgress: false,
      run: fn,
      cancel: fn,
      url: 'https://api.github.com/user/1',
    })
    expect(didUpdate).toBeTruthy()
  })

  it('should return all current subscriptions correctly', () => {
    expect.assertions(1)
    const expectedInstances = [
      {
        ref: 0,
        inProgress: false,
        run: fn,
        cancel: fn,
        url: 'https://api.github.com/user/0',
      },
      {
        ref: 1,
        inProgress: false,
        run: fn,
        cancel: fn,
        url: 'https://api.github.com/user/1',
      },
    ]
    const currentInstances = FetchManager.getAll()
    expect(currentInstances).toEqual(expect.arrayContaining(expectedInstances))
  })

  it('should return a specific subscription correctly', () => {
    expect.assertions(1)
    const expectedInstance = {
      ref: 1,
      inProgress: false,
      run: fn,
      cancel: fn,
      url: 'https://api.github.com/user/1',
    }
    const specificInstance = FetchManager.get(1)
    expect(specificInstance).toMatchObject(expectedInstance)
  })

  it('should remove a subscription correctly', () => {
    expect.assertions(2)
    const expectedInstances = [
      {
        ref: 1,
        inProgress: false,
        run: fn,
        cancel: fn,
        url: 'https://api.github.com/user/1',
      },
    ]
    const didRemove = FetchManager.unsubscribe(0)
    const currentInstances = FetchManager.getAll()

    expect(didRemove).toBeTruthy()
    expect(currentInstances).toEqual(expect.arrayContaining(expectedInstances))
  })

  it("should return null to `get()` if a specific subscription doesn't exist", () => {
    expect.assertions(1)
    const specificInstance = FetchManager.get(42)
    expect(specificInstance).toBeNull()
  })

  it("should return false to `update()` if a specific subscription doesn't exist", () => {
    expect.assertions(1)
    const didNotUpdate = FetchManager.update({
      ref: 42,
      inProgress: false,
      run: fn,
      cancel: fn,
      url: 'https://api.github.com/user/404',
    })
    expect(didNotUpdate).toBeFalsy()
  })

  it("should return false to `unsubscribe()` if a specific subscription doesn't exist", () => {
    expect.assertions(1)
    const didNotRemove = FetchManager.unsubscribe(42)
    expect(didNotRemove).toBeFalsy()
  })
})
