import neverExit from "./";

describe("never-exit", () => {
  let result;
  let expectedTimerId;

  beforeAll(() => {
    jest.useFakeTimers();
    expectedTimerId = 0;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    expectedTimerId++;

    result = neverExit();
  });

  it("should call setInterval with a no-op function and (2^30)ms for the interval time", () => {
    expect(setInterval).toHaveBeenCalledWith(expect.any(Function), 1 << 30);
  });

  it("should return a function", () => {
    expect(result).toEqual(expect.any(Function));
  });

  describe("when the interval time passes and the no-op function executes", () => {
    let error;
    const notThrown = Symbol("not-thrown");

    beforeEach(() => {
      error = notThrown;
      try {
        setInterval.mock.calls[0][0]();
      } catch (e) {
        error = e;
      }
    });

    it("should not throw", () => {
      expect(error).toBe(notThrown);
    });
  });

  describe("when the exit function is called", () => {
    beforeEach(() => {
      result();
    });

    it("should call clearInterval with the timer id", () => {
      expect(clearInterval).toHaveBeenCalledWith(expectedTimerId);
    });
  });
});
