/* eslint no-console: 0 */

// export let FOO = 1;

export const ERROR = 0,
  WARN = 1,
  INFO = 2,
  LOG = 3,
  DEBUG = 4;

let _logLevel = DEBUG;


export let log = {
  error: function(...args){ console.error(...args); },
  warn: function(...args){ (_logLevel >= WARN) && console.warn(...args); },
  info: function(...args){ (_logLevel >= INFO) && console.info(...args); },
  log: function(...args){ (_logLevel >= LOG) && console.log(...args); },
  debug: function(...args){ (_logLevel >= LOG) && console.debug(...args)}
}

export function setLevel(level){
  _logLevel = level;
}
