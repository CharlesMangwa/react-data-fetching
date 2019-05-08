"use strict"
var __importDefault =
  (this && this.__importDefault) ||
  function(mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, "__esModule", { value: true })
var FetchManager_1 = __importDefault(require("../FetchManager"))
describe("FetchManager", function() {
  var fn
  beforeAll(function() {
    fn = jest.fn()
    FetchManager_1.default.subscribe({
      cancel: fn,
      inProgress: false,
      run: fn,
      url: "https://api.github.com/user/0",
    })
  })
  it("should add a subscription correctly", function() {
    expect.assertions(2)
    var expectedRef = 1
    expect(FetchManager_1.default.getAll()).toEqual(expect.arrayContaining([]))
    var ref = FetchManager_1.default.subscribe({
      cancel: fn,
      inProgress: true,
      run: fn,
      url: "https://api.github.com/user/1",
    })
    expect(ref).toBe(expectedRef)
  })
  it("should update a subscription correctly", function() {
    expect.assertions(1)
    var didUpdate = FetchManager_1.default.update(1, {
      cancel: fn,
      inProgress: false,
      run: fn,
      url: "https://api.github.com/user/1",
    })
    expect(didUpdate).toBeTruthy()
  })
  it("should return all current subscriptions correctly", function() {
    expect.assertions(1)
    var expectedInstances = [
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
    ]
    var currentInstances = FetchManager_1.default.getAll()
    expect(currentInstances).toEqual(expect.arrayContaining(expectedInstances))
  })
  it("should return a specific subscription correctly", function() {
    expect.assertions(1)
    var expectedInstance = {
      cancel: fn,
      inProgress: false,
      ref: 1,
      run: fn,
      url: "https://api.github.com/user/1",
    }
    var specificInstance = FetchManager_1.default.get(1)
    expect(specificInstance).toMatchObject(expectedInstance)
  })
  it("should remove a subscription correctly", function() {
    expect.assertions(2)
    var expectedInstances = [
      {
        cancel: fn,
        inProgress: false,
        ref: 1,
        run: fn,
        url: "https://api.github.com/user/1",
      },
    ]
    var didRemove = FetchManager_1.default.unsubscribe(0)
    var currentInstances = FetchManager_1.default.getAll()
    expect(didRemove).toBeTruthy()
    expect(currentInstances).toEqual(expect.arrayContaining(expectedInstances))
  })
  it("should return null to `get()` if a specific subscription doesn't exist", function() {
    expect.assertions(1)
    var specificInstance = FetchManager_1.default.get(42)
    expect(specificInstance).toBeNull()
  })
  it("should return false to `update()` if a specific subscription doesn't exist", function() {
    expect.assertions(1)
    var didNotUpdate = FetchManager_1.default.update(42, {
      cancel: fn,
      inProgress: false,
      run: fn,
      url: "https://api.github.com/user/404",
    })
    expect(didNotUpdate).toBeFalsy()
  })
  it("should return false to `unsubscribe()` if a specific subscription doesn't exist", function() {
    expect.assertions(1)
    var didNotRemove = FetchManager_1.default.unsubscribe(42)
    expect(didNotRemove).toBeFalsy()
  })
})
