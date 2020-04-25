function neverExit() {
  const intervalId = setInterval(() => {}, 1 << 30);

  function actuallyChangedMyMind() {
    clearInterval(intervalId);
  }

  return actuallyChangedMyMind;
}

export default neverExit;
