/* eslint-disable no-console */
/* eslint-disable no-empty */
import { spawn } from "child_process";

try {
  require("../lib/index.es5");
} catch (_) {
  console.error(
    "These integration tests rely on the built `never-end` assets. Ensure you have first run a `yarn build` before executing these tests."
  );
  process.exit(1);
}

function promiseWithState(promise) {
  if (promise.isResolved) {
    return promise;
  }

  let isPending = true;
  let isRejected = false;
  let isResolved = false;

  const result = promise.then(
    function (v) {
      isResolved = true;
      isPending = false;
      return v;
    },
    function (e) {
      isRejected = true;
      isPending = false;
      throw e;
    }
  );

  result.isResolved = function () {
    return isResolved;
  };
  result.isPending = function () {
    return isPending;
  };
  result.isRejected = function () {
    return isRejected;
  };

  return result;
}

function wait(time) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), time);
  });
}

describe("Integration: never-exit", () => {
  let nodeProcess;
  let exitPromise;

  beforeEach(async () => {
    jest.clearAllMocks();

    nodeProcess = spawn(process.argv[0], ["./test/mockScript.js"], {
      stdio: [0, 1, 2],
    });

    exitPromise = promiseWithState(
      new Promise((resolve) => nodeProcess.on("exit", resolve))
    );

    /**
     * Slight hack, but enough time to ensure the Node Process has
     * actually started (and would have finished had `never-exit`
     * not been used).
     */
    await wait(100);
  });

  afterEach(async () => {
    try {
      process.kill(nodeProcess.pid, "SIGKILL");
    } catch (_) {}

    try {
      await exitPromise;
    } catch (_) {}
  });

  it("should prevent the Node process from exiting immediately", () => {
    expect(exitPromise.isPending()).toBeTruthy();
  });

  describe("and after some amount of time", () => {
    beforeEach(async () => {
      /**
       * Not sure if / how to easily fake time in such a test, so chosen
       * sacrifice 2s for the cause.
       */
      await wait(2000);
    });

    it("should still have prevented the Node process from exiting", () => {
      expect(exitPromise.isPending()).toBeTruthy();
    });
  });

  describe.each`
    signal
    ${"SIGINT"}
    ${"SIGKILL"}
    ${"SIGTERM"}
    ${"SIGHUP"}
  `("when a '$signal' is sent to the Node process", ({ signal }) => {
    beforeEach(async () => {
      process.kill(nodeProcess.pid, signal);

      await exitPromise;
    });

    it("should let the Node process exit", () => {
      expect(exitPromise.isResolved()).toBeTruthy();
    });
  });
});
