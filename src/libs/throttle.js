export default function throttle (action, delay, context, iselapsed) {
  let timeout = null
  let lastRun = 0
  return function () {
    if (timeout) {
      if (iselapsed) {
        return
      } else {
        clearTimeout(timeout)
        timeout = null
      }
    }
    const elapsed = Date.now() - lastRun
    const args = arguments
    if (iselapsed && elapsed >= delay) {
      runCallback()
    } else {
      timeout = setTimeout(runCallback, delay)
    }

    function runCallback () {
      lastRun = Date.now()
      timeout = false
      action.apply(context, args)
    }
  }
}
