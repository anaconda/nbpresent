/* eslint no-console: 0 */
export const ERROR = 0,
  WARN = 1,
  INFO = 2,
  LOG = 3,
  DEBUG = 4;

let _logLevel = ERROR;

export function error(...args){ console.error(...args); }
export function warn(...args){ (_logLevel >= WARN) && console.warn(...args); }
export function info(...args){ (_logLevel >= INFO) && console.info(...args); }
export function log(...args){ (_logLevel >= LOG) && console.log(...args); }
export function debug(...args){ (_logLevel >= LOG) && console.debug(...args); }

export function setLevel(level){
  _logLevel = level;
}
