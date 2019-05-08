import FetchManager from "../FetchManager";

describe("FetchManager", () => {
  let fn: jest.Mock;
  beforeAll(() => {
    fn = jest.fn();
    FetchManager.subscribe({
      cancel: fn,
      inProgress: false,
      run: fn,
      url: "https://api.github.com/user/0",
    });
  });

  it("should add a subscription correctly", () => {
    expect.assertions(2);
    const expectedRef = 1;
    expect(FetchManager.getAll()).toEqual(expect.arrayContaining([]));

    const ref = FetchManager.subscribe({
      cancel: fn,
      inProgress: true,
      run: fn,
      url: "https://api.github.com/user/1",
    });
    expect(ref).toBe(expectedRef);
  });

  it("should update a subscription correctly", () => {
    expect.assertions(1);
    const didUpdate = FetchManager.update(1, {
      cancel: fn,
      inProgress: false,
      run: fn,
      url: "https://api.github.com/user/1",
    });
    expect(didUpdate).toBeTruthy();
  });

  it("should return all current subscriptions correctly", () => {
    expect.assertions(1);
    const expectedInstances = [
      {
        cancel: fn,
        inProgress: false,
        ref: 0,
        run: fn,
        url: "https://api.github.com/user/0",
      },
      {
        cancel: fn,
        inProgress: false,
        ref: 1,
        run: fn,
        url: "https://api.github.com/user/1",
      },
    ];
    const currentInstances = FetchManager.getAll();
    expect(currentInstances).toEqual(expect.arrayContaining(expectedInstances));
  });

  it("should return a specific subscription correctly", () => {
    expect.assertions(1);
    const expectedInstance = {
      cancel: fn,
      inProgress: false,
      ref: 1,
      run: fn,
      url: "https://api.github.com/user/1",
    };
    const specificInstance = FetchManager.get(1);
    expect(specificInstance).toMatchObject(expectedInstance);
  });

  it("should remove a subscription correctly", () => {
    expect.assertions(2);
    const expectedInstances = [
      {
        cancel: fn,
        inProgress: false,
        ref: 1,
        run: fn,
        url: "https://api.github.com/user/1",
      },
    ];
    const didRemove = FetchManager.unsubscribe(0);
    const currentInstances = FetchManager.getAll();

    expect(didRemove).toBeTruthy();
    expect(currentInstances).toEqual(expect.arrayContaining(expectedInstances));
  });

  it("should return null to `get()` if a specific subscription doesn't exist", () => {
    expect.assertions(1);
    const specificInstance = FetchManager.get(42);
    expect(specificInstance).toBeNull();
  });

  it("should return false to `update()` if a specific subscription doesn't exist", () => {
    expect.assertions(1);
    const didNotUpdate = FetchManager.update(42, {
      cancel: fn,
      inProgress: false,
      run: fn,
      url: "https://api.github.com/user/404",
    });
    expect(didNotUpdate).toBeFalsy();
  });

  it("should return false to `unsubscribe()` if a specific subscription doesn't exist", () => {
    expect.assertions(1);
    const didNotRemove = FetchManager.unsubscribe(42);
    expect(didNotRemove).toBeFalsy();
  });
});
