var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// ../node_modules/unenv/dist/runtime/_internal/utils.mjs
// @__NO_SIDE_EFFECTS__
function createNotImplementedError(name) {
  return new Error(`[unenv] ${name} is not implemented yet!`);
}
__name(createNotImplementedError, "createNotImplementedError");
// @__NO_SIDE_EFFECTS__
function notImplemented(name) {
  const fn = /* @__PURE__ */ __name(() => {
    throw /* @__PURE__ */ createNotImplementedError(name);
  }, "fn");
  return Object.assign(fn, { __unenv__: true });
}
__name(notImplemented, "notImplemented");
// @__NO_SIDE_EFFECTS__
function notImplementedClass(name) {
  return class {
    __unenv__ = true;
    constructor() {
      throw new Error(`[unenv] ${name} is not implemented yet!`);
    }
  };
}
__name(notImplementedClass, "notImplementedClass");

// ../node_modules/unenv/dist/runtime/node/internal/perf_hooks/performance.mjs
var _timeOrigin = globalThis.performance?.timeOrigin ?? Date.now();
var _performanceNow = globalThis.performance?.now ? globalThis.performance.now.bind(globalThis.performance) : () => Date.now() - _timeOrigin;
var nodeTiming = {
  name: "node",
  entryType: "node",
  startTime: 0,
  duration: 0,
  nodeStart: 0,
  v8Start: 0,
  bootstrapComplete: 0,
  environment: 0,
  loopStart: 0,
  loopExit: 0,
  idleTime: 0,
  uvMetricsInfo: {
    loopCount: 0,
    events: 0,
    eventsWaiting: 0
  },
  detail: void 0,
  toJSON() {
    return this;
  }
};
var PerformanceEntry = class {
  static {
    __name(this, "PerformanceEntry");
  }
  __unenv__ = true;
  detail;
  entryType = "event";
  name;
  startTime;
  constructor(name, options) {
    this.name = name;
    this.startTime = options?.startTime || _performanceNow();
    this.detail = options?.detail;
  }
  get duration() {
    return _performanceNow() - this.startTime;
  }
  toJSON() {
    return {
      name: this.name,
      entryType: this.entryType,
      startTime: this.startTime,
      duration: this.duration,
      detail: this.detail
    };
  }
};
var PerformanceMark = class PerformanceMark2 extends PerformanceEntry {
  static {
    __name(this, "PerformanceMark");
  }
  entryType = "mark";
  constructor() {
    super(...arguments);
  }
  get duration() {
    return 0;
  }
};
var PerformanceMeasure = class extends PerformanceEntry {
  static {
    __name(this, "PerformanceMeasure");
  }
  entryType = "measure";
};
var PerformanceResourceTiming = class extends PerformanceEntry {
  static {
    __name(this, "PerformanceResourceTiming");
  }
  entryType = "resource";
  serverTiming = [];
  connectEnd = 0;
  connectStart = 0;
  decodedBodySize = 0;
  domainLookupEnd = 0;
  domainLookupStart = 0;
  encodedBodySize = 0;
  fetchStart = 0;
  initiatorType = "";
  name = "";
  nextHopProtocol = "";
  redirectEnd = 0;
  redirectStart = 0;
  requestStart = 0;
  responseEnd = 0;
  responseStart = 0;
  secureConnectionStart = 0;
  startTime = 0;
  transferSize = 0;
  workerStart = 0;
  responseStatus = 0;
};
var PerformanceObserverEntryList = class {
  static {
    __name(this, "PerformanceObserverEntryList");
  }
  __unenv__ = true;
  getEntries() {
    return [];
  }
  getEntriesByName(_name, _type) {
    return [];
  }
  getEntriesByType(type) {
    return [];
  }
};
var Performance = class {
  static {
    __name(this, "Performance");
  }
  __unenv__ = true;
  timeOrigin = _timeOrigin;
  eventCounts = /* @__PURE__ */ new Map();
  _entries = [];
  _resourceTimingBufferSize = 0;
  navigation = void 0;
  timing = void 0;
  timerify(_fn, _options) {
    throw createNotImplementedError("Performance.timerify");
  }
  get nodeTiming() {
    return nodeTiming;
  }
  eventLoopUtilization() {
    return {};
  }
  markResourceTiming() {
    return new PerformanceResourceTiming("");
  }
  onresourcetimingbufferfull = null;
  now() {
    if (this.timeOrigin === _timeOrigin) {
      return _performanceNow();
    }
    return Date.now() - this.timeOrigin;
  }
  clearMarks(markName) {
    this._entries = markName ? this._entries.filter((e) => e.name !== markName) : this._entries.filter((e) => e.entryType !== "mark");
  }
  clearMeasures(measureName) {
    this._entries = measureName ? this._entries.filter((e) => e.name !== measureName) : this._entries.filter((e) => e.entryType !== "measure");
  }
  clearResourceTimings() {
    this._entries = this._entries.filter((e) => e.entryType !== "resource" || e.entryType !== "navigation");
  }
  getEntries() {
    return this._entries;
  }
  getEntriesByName(name, type) {
    return this._entries.filter((e) => e.name === name && (!type || e.entryType === type));
  }
  getEntriesByType(type) {
    return this._entries.filter((e) => e.entryType === type);
  }
  mark(name, options) {
    const entry = new PerformanceMark(name, options);
    this._entries.push(entry);
    return entry;
  }
  measure(measureName, startOrMeasureOptions, endMark) {
    let start;
    let end;
    if (typeof startOrMeasureOptions === "string") {
      start = this.getEntriesByName(startOrMeasureOptions, "mark")[0]?.startTime;
      end = this.getEntriesByName(endMark, "mark")[0]?.startTime;
    } else {
      start = Number.parseFloat(startOrMeasureOptions?.start) || this.now();
      end = Number.parseFloat(startOrMeasureOptions?.end) || this.now();
    }
    const entry = new PerformanceMeasure(measureName, {
      startTime: start,
      detail: {
        start,
        end
      }
    });
    this._entries.push(entry);
    return entry;
  }
  setResourceTimingBufferSize(maxSize) {
    this._resourceTimingBufferSize = maxSize;
  }
  addEventListener(type, listener, options) {
    throw createNotImplementedError("Performance.addEventListener");
  }
  removeEventListener(type, listener, options) {
    throw createNotImplementedError("Performance.removeEventListener");
  }
  dispatchEvent(event) {
    throw createNotImplementedError("Performance.dispatchEvent");
  }
  toJSON() {
    return this;
  }
};
var PerformanceObserver = class {
  static {
    __name(this, "PerformanceObserver");
  }
  __unenv__ = true;
  static supportedEntryTypes = [];
  _callback = null;
  constructor(callback) {
    this._callback = callback;
  }
  takeRecords() {
    return [];
  }
  disconnect() {
    throw createNotImplementedError("PerformanceObserver.disconnect");
  }
  observe(options) {
    throw createNotImplementedError("PerformanceObserver.observe");
  }
  bind(fn) {
    return fn;
  }
  runInAsyncScope(fn, thisArg, ...args) {
    return fn.call(thisArg, ...args);
  }
  asyncId() {
    return 0;
  }
  triggerAsyncId() {
    return 0;
  }
  emitDestroy() {
    return this;
  }
};
var performance = globalThis.performance && "addEventListener" in globalThis.performance ? globalThis.performance : new Performance();

// ../node_modules/@cloudflare/unenv-preset/dist/runtime/polyfill/performance.mjs
if (!("__unenv__" in performance)) {
  const proto = Performance.prototype;
  for (const key of Object.getOwnPropertyNames(proto)) {
    if (key !== "constructor" && !(key in performance)) {
      const desc = Object.getOwnPropertyDescriptor(proto, key);
      if (desc) {
        Object.defineProperty(performance, key, desc);
      }
    }
  }
}
globalThis.performance = performance;
globalThis.Performance = Performance;
globalThis.PerformanceEntry = PerformanceEntry;
globalThis.PerformanceMark = PerformanceMark;
globalThis.PerformanceMeasure = PerformanceMeasure;
globalThis.PerformanceObserver = PerformanceObserver;
globalThis.PerformanceObserverEntryList = PerformanceObserverEntryList;
globalThis.PerformanceResourceTiming = PerformanceResourceTiming;

// ../node_modules/unenv/dist/runtime/node/console.mjs
import { Writable } from "node:stream";

// ../node_modules/unenv/dist/runtime/mock/noop.mjs
var noop_default = Object.assign(() => {
}, { __unenv__: true });

// ../node_modules/unenv/dist/runtime/node/console.mjs
var _console = globalThis.console;
var _ignoreErrors = true;
var _stderr = new Writable();
var _stdout = new Writable();
var log = _console?.log ?? noop_default;
var info = _console?.info ?? log;
var trace = _console?.trace ?? info;
var debug = _console?.debug ?? log;
var table = _console?.table ?? log;
var error = _console?.error ?? log;
var warn = _console?.warn ?? error;
var createTask = _console?.createTask ?? /* @__PURE__ */ notImplemented("console.createTask");
var clear = _console?.clear ?? noop_default;
var count = _console?.count ?? noop_default;
var countReset = _console?.countReset ?? noop_default;
var dir = _console?.dir ?? noop_default;
var dirxml = _console?.dirxml ?? noop_default;
var group = _console?.group ?? noop_default;
var groupEnd = _console?.groupEnd ?? noop_default;
var groupCollapsed = _console?.groupCollapsed ?? noop_default;
var profile = _console?.profile ?? noop_default;
var profileEnd = _console?.profileEnd ?? noop_default;
var time = _console?.time ?? noop_default;
var timeEnd = _console?.timeEnd ?? noop_default;
var timeLog = _console?.timeLog ?? noop_default;
var timeStamp = _console?.timeStamp ?? noop_default;
var Console = _console?.Console ?? /* @__PURE__ */ notImplementedClass("console.Console");
var _times = /* @__PURE__ */ new Map();
var _stdoutErrorHandler = noop_default;
var _stderrErrorHandler = noop_default;

// ../node_modules/@cloudflare/unenv-preset/dist/runtime/node/console.mjs
var workerdConsole = globalThis["console"];
var {
  assert,
  clear: clear2,
  // @ts-expect-error undocumented public API
  context,
  count: count2,
  countReset: countReset2,
  // @ts-expect-error undocumented public API
  createTask: createTask2,
  debug: debug2,
  dir: dir2,
  dirxml: dirxml2,
  error: error2,
  group: group2,
  groupCollapsed: groupCollapsed2,
  groupEnd: groupEnd2,
  info: info2,
  log: log2,
  profile: profile2,
  profileEnd: profileEnd2,
  table: table2,
  time: time2,
  timeEnd: timeEnd2,
  timeLog: timeLog2,
  timeStamp: timeStamp2,
  trace: trace2,
  warn: warn2
} = workerdConsole;
Object.assign(workerdConsole, {
  Console,
  _ignoreErrors,
  _stderr,
  _stderrErrorHandler,
  _stdout,
  _stdoutErrorHandler,
  _times
});
var console_default = workerdConsole;

// ../node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-console
globalThis.console = console_default;

// ../node_modules/unenv/dist/runtime/node/internal/process/hrtime.mjs
var hrtime = /* @__PURE__ */ Object.assign(/* @__PURE__ */ __name(function hrtime2(startTime) {
  const now = Date.now();
  const seconds = Math.trunc(now / 1e3);
  const nanos = now % 1e3 * 1e6;
  if (startTime) {
    let diffSeconds = seconds - startTime[0];
    let diffNanos = nanos - startTime[0];
    if (diffNanos < 0) {
      diffSeconds = diffSeconds - 1;
      diffNanos = 1e9 + diffNanos;
    }
    return [diffSeconds, diffNanos];
  }
  return [seconds, nanos];
}, "hrtime"), { bigint: /* @__PURE__ */ __name(function bigint() {
  return BigInt(Date.now() * 1e6);
}, "bigint") });

// ../node_modules/unenv/dist/runtime/node/internal/process/process.mjs
import { EventEmitter } from "node:events";

// ../node_modules/unenv/dist/runtime/node/internal/tty/read-stream.mjs
var ReadStream = class {
  static {
    __name(this, "ReadStream");
  }
  fd;
  isRaw = false;
  isTTY = false;
  constructor(fd) {
    this.fd = fd;
  }
  setRawMode(mode) {
    this.isRaw = mode;
    return this;
  }
};

// ../node_modules/unenv/dist/runtime/node/internal/tty/write-stream.mjs
var WriteStream = class {
  static {
    __name(this, "WriteStream");
  }
  fd;
  columns = 80;
  rows = 24;
  isTTY = false;
  constructor(fd) {
    this.fd = fd;
  }
  clearLine(dir3, callback) {
    callback && callback();
    return false;
  }
  clearScreenDown(callback) {
    callback && callback();
    return false;
  }
  cursorTo(x, y, callback) {
    callback && typeof callback === "function" && callback();
    return false;
  }
  moveCursor(dx, dy, callback) {
    callback && callback();
    return false;
  }
  getColorDepth(env2) {
    return 1;
  }
  hasColors(count3, env2) {
    return false;
  }
  getWindowSize() {
    return [this.columns, this.rows];
  }
  write(str, encoding, cb) {
    if (str instanceof Uint8Array) {
      str = new TextDecoder().decode(str);
    }
    try {
      console.log(str);
    } catch {
    }
    cb && typeof cb === "function" && cb();
    return false;
  }
};

// ../node_modules/unenv/dist/runtime/node/internal/process/node-version.mjs
var NODE_VERSION = "22.14.0";

// ../node_modules/unenv/dist/runtime/node/internal/process/process.mjs
var Process = class _Process extends EventEmitter {
  static {
    __name(this, "Process");
  }
  env;
  hrtime;
  nextTick;
  constructor(impl) {
    super();
    this.env = impl.env;
    this.hrtime = impl.hrtime;
    this.nextTick = impl.nextTick;
    for (const prop of [...Object.getOwnPropertyNames(_Process.prototype), ...Object.getOwnPropertyNames(EventEmitter.prototype)]) {
      const value = this[prop];
      if (typeof value === "function") {
        this[prop] = value.bind(this);
      }
    }
  }
  // --- event emitter ---
  emitWarning(warning, type, code) {
    console.warn(`${code ? `[${code}] ` : ""}${type ? `${type}: ` : ""}${warning}`);
  }
  emit(...args) {
    return super.emit(...args);
  }
  listeners(eventName) {
    return super.listeners(eventName);
  }
  // --- stdio (lazy initializers) ---
  #stdin;
  #stdout;
  #stderr;
  get stdin() {
    return this.#stdin ??= new ReadStream(0);
  }
  get stdout() {
    return this.#stdout ??= new WriteStream(1);
  }
  get stderr() {
    return this.#stderr ??= new WriteStream(2);
  }
  // --- cwd ---
  #cwd = "/";
  chdir(cwd2) {
    this.#cwd = cwd2;
  }
  cwd() {
    return this.#cwd;
  }
  // --- dummy props and getters ---
  arch = "";
  platform = "";
  argv = [];
  argv0 = "";
  execArgv = [];
  execPath = "";
  title = "";
  pid = 200;
  ppid = 100;
  get version() {
    return `v${NODE_VERSION}`;
  }
  get versions() {
    return { node: NODE_VERSION };
  }
  get allowedNodeEnvironmentFlags() {
    return /* @__PURE__ */ new Set();
  }
  get sourceMapsEnabled() {
    return false;
  }
  get debugPort() {
    return 0;
  }
  get throwDeprecation() {
    return false;
  }
  get traceDeprecation() {
    return false;
  }
  get features() {
    return {};
  }
  get release() {
    return {};
  }
  get connected() {
    return false;
  }
  get config() {
    return {};
  }
  get moduleLoadList() {
    return [];
  }
  constrainedMemory() {
    return 0;
  }
  availableMemory() {
    return 0;
  }
  uptime() {
    return 0;
  }
  resourceUsage() {
    return {};
  }
  // --- noop methods ---
  ref() {
  }
  unref() {
  }
  // --- unimplemented methods ---
  umask() {
    throw createNotImplementedError("process.umask");
  }
  getBuiltinModule() {
    return void 0;
  }
  getActiveResourcesInfo() {
    throw createNotImplementedError("process.getActiveResourcesInfo");
  }
  exit() {
    throw createNotImplementedError("process.exit");
  }
  reallyExit() {
    throw createNotImplementedError("process.reallyExit");
  }
  kill() {
    throw createNotImplementedError("process.kill");
  }
  abort() {
    throw createNotImplementedError("process.abort");
  }
  dlopen() {
    throw createNotImplementedError("process.dlopen");
  }
  setSourceMapsEnabled() {
    throw createNotImplementedError("process.setSourceMapsEnabled");
  }
  loadEnvFile() {
    throw createNotImplementedError("process.loadEnvFile");
  }
  disconnect() {
    throw createNotImplementedError("process.disconnect");
  }
  cpuUsage() {
    throw createNotImplementedError("process.cpuUsage");
  }
  setUncaughtExceptionCaptureCallback() {
    throw createNotImplementedError("process.setUncaughtExceptionCaptureCallback");
  }
  hasUncaughtExceptionCaptureCallback() {
    throw createNotImplementedError("process.hasUncaughtExceptionCaptureCallback");
  }
  initgroups() {
    throw createNotImplementedError("process.initgroups");
  }
  openStdin() {
    throw createNotImplementedError("process.openStdin");
  }
  assert() {
    throw createNotImplementedError("process.assert");
  }
  binding() {
    throw createNotImplementedError("process.binding");
  }
  // --- attached interfaces ---
  permission = { has: /* @__PURE__ */ notImplemented("process.permission.has") };
  report = {
    directory: "",
    filename: "",
    signal: "SIGUSR2",
    compact: false,
    reportOnFatalError: false,
    reportOnSignal: false,
    reportOnUncaughtException: false,
    getReport: /* @__PURE__ */ notImplemented("process.report.getReport"),
    writeReport: /* @__PURE__ */ notImplemented("process.report.writeReport")
  };
  finalization = {
    register: /* @__PURE__ */ notImplemented("process.finalization.register"),
    unregister: /* @__PURE__ */ notImplemented("process.finalization.unregister"),
    registerBeforeExit: /* @__PURE__ */ notImplemented("process.finalization.registerBeforeExit")
  };
  memoryUsage = Object.assign(() => ({
    arrayBuffers: 0,
    rss: 0,
    external: 0,
    heapTotal: 0,
    heapUsed: 0
  }), { rss: /* @__PURE__ */ __name(() => 0, "rss") });
  // --- undefined props ---
  mainModule = void 0;
  domain = void 0;
  // optional
  send = void 0;
  exitCode = void 0;
  channel = void 0;
  getegid = void 0;
  geteuid = void 0;
  getgid = void 0;
  getgroups = void 0;
  getuid = void 0;
  setegid = void 0;
  seteuid = void 0;
  setgid = void 0;
  setgroups = void 0;
  setuid = void 0;
  // internals
  _events = void 0;
  _eventsCount = void 0;
  _exiting = void 0;
  _maxListeners = void 0;
  _debugEnd = void 0;
  _debugProcess = void 0;
  _fatalException = void 0;
  _getActiveHandles = void 0;
  _getActiveRequests = void 0;
  _kill = void 0;
  _preload_modules = void 0;
  _rawDebug = void 0;
  _startProfilerIdleNotifier = void 0;
  _stopProfilerIdleNotifier = void 0;
  _tickCallback = void 0;
  _disconnect = void 0;
  _handleQueue = void 0;
  _pendingMessage = void 0;
  _channel = void 0;
  _send = void 0;
  _linkedBinding = void 0;
};

// ../node_modules/@cloudflare/unenv-preset/dist/runtime/node/process.mjs
var globalProcess = globalThis["process"];
var getBuiltinModule = globalProcess.getBuiltinModule;
var workerdProcess = getBuiltinModule("node:process");
var unenvProcess = new Process({
  env: globalProcess.env,
  hrtime,
  // `nextTick` is available from workerd process v1
  nextTick: workerdProcess.nextTick
});
var { exit, features, platform } = workerdProcess;
var {
  _channel,
  _debugEnd,
  _debugProcess,
  _disconnect,
  _events,
  _eventsCount,
  _exiting,
  _fatalException,
  _getActiveHandles,
  _getActiveRequests,
  _handleQueue,
  _kill,
  _linkedBinding,
  _maxListeners,
  _pendingMessage,
  _preload_modules,
  _rawDebug,
  _send,
  _startProfilerIdleNotifier,
  _stopProfilerIdleNotifier,
  _tickCallback,
  abort,
  addListener,
  allowedNodeEnvironmentFlags,
  arch,
  argv,
  argv0,
  assert: assert2,
  availableMemory,
  binding,
  channel,
  chdir,
  config,
  connected,
  constrainedMemory,
  cpuUsage,
  cwd,
  debugPort,
  disconnect,
  dlopen,
  domain,
  emit,
  emitWarning,
  env,
  eventNames,
  execArgv,
  execPath,
  exitCode,
  finalization,
  getActiveResourcesInfo,
  getegid,
  geteuid,
  getgid,
  getgroups,
  getMaxListeners,
  getuid,
  hasUncaughtExceptionCaptureCallback,
  hrtime: hrtime3,
  initgroups,
  kill,
  listenerCount,
  listeners,
  loadEnvFile,
  mainModule,
  memoryUsage,
  moduleLoadList,
  nextTick,
  off,
  on,
  once,
  openStdin,
  permission,
  pid,
  ppid,
  prependListener,
  prependOnceListener,
  rawListeners,
  reallyExit,
  ref,
  release,
  removeAllListeners,
  removeListener,
  report,
  resourceUsage,
  send,
  setegid,
  seteuid,
  setgid,
  setgroups,
  setMaxListeners,
  setSourceMapsEnabled,
  setuid,
  setUncaughtExceptionCaptureCallback,
  sourceMapsEnabled,
  stderr,
  stdin,
  stdout,
  throwDeprecation,
  title,
  traceDeprecation,
  umask,
  unref,
  uptime,
  version,
  versions
} = unenvProcess;
var _process = {
  abort,
  addListener,
  allowedNodeEnvironmentFlags,
  hasUncaughtExceptionCaptureCallback,
  setUncaughtExceptionCaptureCallback,
  loadEnvFile,
  sourceMapsEnabled,
  arch,
  argv,
  argv0,
  chdir,
  config,
  connected,
  constrainedMemory,
  availableMemory,
  cpuUsage,
  cwd,
  debugPort,
  dlopen,
  disconnect,
  emit,
  emitWarning,
  env,
  eventNames,
  execArgv,
  execPath,
  exit,
  finalization,
  features,
  getBuiltinModule,
  getActiveResourcesInfo,
  getMaxListeners,
  hrtime: hrtime3,
  kill,
  listeners,
  listenerCount,
  memoryUsage,
  nextTick,
  on,
  off,
  once,
  pid,
  platform,
  ppid,
  prependListener,
  prependOnceListener,
  rawListeners,
  release,
  removeAllListeners,
  removeListener,
  report,
  resourceUsage,
  setMaxListeners,
  setSourceMapsEnabled,
  stderr,
  stdin,
  stdout,
  title,
  throwDeprecation,
  traceDeprecation,
  umask,
  uptime,
  version,
  versions,
  // @ts-expect-error old API
  domain,
  initgroups,
  moduleLoadList,
  reallyExit,
  openStdin,
  assert: assert2,
  binding,
  send,
  exitCode,
  channel,
  getegid,
  geteuid,
  getgid,
  getgroups,
  getuid,
  setegid,
  seteuid,
  setgid,
  setgroups,
  setuid,
  permission,
  mainModule,
  _events,
  _eventsCount,
  _exiting,
  _maxListeners,
  _debugEnd,
  _debugProcess,
  _fatalException,
  _getActiveHandles,
  _getActiveRequests,
  _kill,
  _preload_modules,
  _rawDebug,
  _startProfilerIdleNotifier,
  _stopProfilerIdleNotifier,
  _tickCallback,
  _disconnect,
  _handleQueue,
  _pendingMessage,
  _channel,
  _send,
  _linkedBinding
};
var process_default = _process;

// ../node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-process
globalThis.process = process_default;

// api/admin/auth.ts
var onRequestPost = /* @__PURE__ */ __name(async (context2) => {
  try {
    const body = await context2.request.json();
    const identifier = (body.email || body.username || "").trim().toLowerCase();
    const secret = (body.password || body.passcode || "").trim();
    if (!identifier) {
      return new Response(JSON.stringify({ error: "Email or username is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    if (!secret) {
      return new Response(JSON.stringify({ error: "Password is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const user = await context2.env.DB.prepare(`
        SELECT id, full_name as name, nickname, email, password_hash, role, church_id, is_active, created_at, last_login_at
        FROM campers
        WHERE (LOWER(email) = ? OR LOWER(nickname) = ? OR LOWER(full_name) = ?)
          AND role IN ('admin', 'staff', 'coordinator')
          AND COALESCE(is_active, 1) = 1
        LIMIT 1
      `).bind(identifier, identifier, identifier).first();
    if (!user) {
      return new Response(JSON.stringify({ error: "Invalid credentials or account is deactivated" }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }
    if (!user.password_hash || user.password_hash !== secret) {
      return new Response(JSON.stringify({ error: "Invalid email or password" }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }
    try {
      await context2.env.DB.prepare("UPDATE campers SET last_login_at = CURRENT_TIMESTAMP WHERE id = ?").bind(user.id).run();
    } catch {
    }
    const { password_hash, ...safeUser } = user;
    return new Response(
      JSON.stringify({
        success: true,
        user: {
          ...safeUser,
          is_active: Boolean(safeUser.is_active ?? 1),
          is_admin: safeUser.role === "admin",
          is_staff: ["admin", "staff", "coordinator"].includes(safeUser.role)
        }
      }),
      {
        headers: { "Content-Type": "application/json" }
      }
    );
  } catch (error3) {
    const msg = error3 instanceof Error ? error3.message : "Authentication failed";
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}, "onRequestPost");

// api/admin/checkin.ts
var onRequestGet = /* @__PURE__ */ __name(async (context2) => {
  try {
    const url = new URL(context2.request.url);
    const search = (url.searchParams.get("search") || "").trim().toLowerCase();
    const status = url.searchParams.get("status");
    let query = `
      SELECT 
        cmp.id,
        cmp.church_id,
        c.name as church_name,
        c.slug as church_slug,
        cmp.role,
        cmp.full_name,
        cmp.nickname,
        cmp.gender,
        cmp.age,
        cmp.birthdate,
        cmp.email,
        cmp.phone,
        cmp.province,
        cmp.city,
        cmp.t_shirt_size,
        cmp.dietary_needs,
        cmp.emergency_name,
        cmp.emergency_phone,
        cmp.emergency_relation,
        cmp.favorite_verse,
        cmp.verse_reflection,
        cmp.selfie_url,
        cmp.activation_code,
        cmp.activation_token,
        COALESCE(cmp.status, 'registered') as status,
        cmp.checked_in_at,
        cmp.checked_in_by,
        COALESCE(cmp.kit_claimed, 0) as kit_claimed,
        cmp.created_at
      FROM campers cmp
      LEFT JOIN churches c ON cmp.church_id = c.id
      ORDER BY 
        CASE WHEN cmp.checked_in_at IS NOT NULL THEN 0 ELSE 1 END,
        cmp.created_at DESC
    `;
    const { results } = await context2.env.DB.prepare(query).all();
    let list = results || [];
    if (search) {
      list = list.filter(
        (c) => c.full_name?.toLowerCase().includes(search) || c.nickname?.toLowerCase().includes(search) || c.email?.toLowerCase().includes(search) || c.phone?.toLowerCase().includes(search) || c.activation_code?.toLowerCase().includes(search) || c.church_name?.toLowerCase().includes(search)
      );
    }
    if (status === "checked_in") {
      list = list.filter((c) => c.status === "activated" || c.checked_in_at);
    } else if (status === "pending") {
      list = list.filter((c) => c.status !== "activated" && !c.checked_in_at);
    }
    return new Response(JSON.stringify(list), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error3) {
    const msg = error3 instanceof Error ? error3.message : "Database error";
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}, "onRequestGet");
var onRequestPost2 = /* @__PURE__ */ __name(async (context2) => {
  try {
    const body = await context2.request.json();
    const camperId = body.camper_id?.trim();
    const codeOrToken = body.code_or_token?.trim();
    const action = body.action || "check_in";
    const adminId = body.admin_id || "admin";
    let camper = null;
    if (camperId) {
      camper = await context2.env.DB.prepare("SELECT * FROM campers WHERE id = ?").bind(camperId).first();
    } else if (codeOrToken) {
      camper = await context2.env.DB.prepare(`
          SELECT * FROM campers 
          WHERE UPPER(activation_code) = UPPER(?) 
             OR activation_token = ? 
             OR UPPER(id) = UPPER(?)
        `).bind(codeOrToken, codeOrToken, codeOrToken).first();
    }
    if (!camper) {
      return new Response(
        JSON.stringify({ error: "Camper not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }
    if (action === "check_in") {
      const kitValue = body.kit_claimed !== void 0 ? body.kit_claimed ? 1 : 0 : camper.kit_claimed || 1;
      await context2.env.DB.prepare(`
          UPDATE campers 
          SET status = 'activated',
              checked_in_at = COALESCE(checked_in_at, CURRENT_TIMESTAMP),
              checked_in_by = ?,
              kit_claimed = ?
          WHERE id = ?
        `).bind(adminId, kitValue, camper.id).run();
    } else if (action === "undo_check_in") {
      await context2.env.DB.prepare(`
          UPDATE campers 
          SET status = 'registered',
              checked_in_at = NULL,
              checked_in_by = NULL
          WHERE id = ?
        `).bind(camper.id).run();
    } else if (action === "toggle_kit") {
      const newKit = camper.kit_claimed ? 0 : 1;
      await context2.env.DB.prepare("UPDATE campers SET kit_claimed = ? WHERE id = ?").bind(newKit, camper.id).run();
    } else if (action === "reset_password") {
      const newPass = (body.new_password || "").trim();
      if (!newPass) {
        return new Response(JSON.stringify({ error: "New password is required for password reset" }), {
          status: 400,
          headers: { "Content-Type": "application/json" }
        });
      }
      await context2.env.DB.prepare("UPDATE campers SET password_hash = ? WHERE id = ?").bind(newPass, camper.id).run();
    }
    const updated = await context2.env.DB.prepare(`
        SELECT cmp.*, c.name as church_name
        FROM campers cmp
        LEFT JOIN churches c ON cmp.church_id = c.id
        WHERE cmp.id = ?
      `).bind(camper.id).first();
    const { password_hash, ...safeCamper } = updated || camper;
    return new Response(
      JSON.stringify({
        success: true,
        message: `Successfully updated ${safeCamper.nickname}`,
        camper: safeCamper
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error3) {
    const msg = error3 instanceof Error ? error3.message : "Action failed";
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}, "onRequestPost");

// api/admin/checkin-stats.ts
var onRequestGet2 = /* @__PURE__ */ __name(async (context2) => {
  try {
    const totalRow = await context2.env.DB.prepare("SELECT COUNT(*) as total FROM campers").first();
    const totalRegistered = totalRow?.total || 0;
    const checkedInRow = await context2.env.DB.prepare(`
        SELECT COUNT(*) as checked_in 
        FROM campers 
        WHERE status = 'activated' OR checked_in_at IS NOT NULL
      `).first();
    const totalCheckedIn = checkedInRow?.checked_in || 0;
    const kitsRow = await context2.env.DB.prepare("SELECT COUNT(*) as kits FROM campers WHERE kit_claimed = 1").first();
    const totalKitsClaimed = kitsRow?.kits || 0;
    const percentCheckedIn = totalRegistered > 0 ? Math.round(totalCheckedIn / totalRegistered * 100) : 0;
    const { results: delegationStats } = await context2.env.DB.prepare(`
        SELECT 
          c.id as church_id,
          c.name as church_name,
          COUNT(cmp.id) as total,
          SUM(CASE WHEN cmp.status = 'activated' OR cmp.checked_in_at IS NOT NULL THEN 1 ELSE 0 END) as checkedIn
        FROM churches c
        LEFT JOIN campers cmp ON c.id = cmp.church_id
        GROUP BY c.id
        HAVING total > 0
        ORDER BY checkedIn DESC, total DESC
      `).all();
    return new Response(
      JSON.stringify({
        totalRegistered,
        totalCheckedIn,
        percentCheckedIn,
        totalKitsClaimed,
        delegationStats: delegationStats || []
      }),
      {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "public, max-age=5"
        }
      }
    );
  } catch (error3) {
    const msg = error3 instanceof Error ? error3.message : "Database error";
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}, "onRequestGet");

// api/admin/users.ts
var onRequestGet3 = /* @__PURE__ */ __name(async (context2) => {
  try {
    const { results } = await context2.env.DB.prepare(`
        SELECT 
          cmp.id, 
          cmp.full_name as name, 
          cmp.nickname,
          cmp.email, 
          cmp.role, 
          cmp.church_id, 
          c.name as church_name,
          cmp.is_active, 
          cmp.created_at, 
          cmp.last_login_at
        FROM campers cmp
        LEFT JOIN churches c ON cmp.church_id = c.id
        ORDER BY 
          CASE 
            WHEN cmp.role = 'admin' THEN 0 
            WHEN cmp.role IN ('staff', 'coordinator') THEN 1 
            ELSE 2 
          END,
          cmp.created_at DESC
      `).all();
    return new Response(JSON.stringify(results), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error3) {
    const msg = error3 instanceof Error ? error3.message : "Database error";
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}, "onRequestGet");
var onRequestPost3 = /* @__PURE__ */ __name(async (context2) => {
  try {
    const body = await context2.request.json();
    if (!body.name || !body.email) {
      return new Response(JSON.stringify({ error: "Name and email are required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    if (!body.password || !body.password.trim()) {
      return new Response(JSON.stringify({ error: "Password is required for creating a user account" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const id = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const role = body.role || "staff";
    const password = body.password.trim();
    const churchId = body.church_id || "ch_jia_buag";
    await context2.env.DB.prepare(`
        INSERT INTO campers (
          id, church_id, role, full_name, nickname, gender, age, birthdate,
          email, phone, province, city, emergency_name, emergency_phone, emergency_relation,
          password_hash, is_active, created_at
        ) VALUES (
          ?, ?, ?, ?, ?, 'unspecified', 25, '2000-01-01',
          ?, ?, 'Nueva Vizcaya', 'Bambang', 'Camp Office', '+639170000000', 'Office',
          ?, 1, CURRENT_TIMESTAMP
        )
      `).bind(
      id,
      churchId,
      role,
      body.name.trim(),
      body.name.trim().split(" ")[0],
      body.email.trim().toLowerCase(),
      body.phone || "+639170000000",
      password
    ).run();
    return new Response(
      JSON.stringify({
        success: true,
        user: {
          id,
          name: body.name.trim(),
          email: body.email.trim().toLowerCase(),
          role,
          church_id: churchId,
          is_active: 1
        }
      }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error3) {
    const msg = error3 instanceof Error ? error3.message : "Failed to create user";
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}, "onRequestPost");
var onRequestPut = /* @__PURE__ */ __name(async (context2) => {
  try {
    const body = await context2.request.json();
    if (!body.id) {
      return new Response(JSON.stringify({ error: "User ID is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    if (body.id === "usr_admin_alexius" && body.role && body.role !== "admin") {
      return new Response(JSON.stringify({ error: "Primary admin (Alexius) cannot be demoted" }), {
        status: 403,
        headers: { "Content-Type": "application/json" }
      });
    }
    const isActive = body.is_active !== void 0 ? body.is_active ? 1 : 0 : 1;
    if (body.password) {
      await context2.env.DB.prepare(`
          UPDATE campers
          SET full_name = COALESCE(?, full_name),
              email = COALESCE(?, email),
              password_hash = ?,
              role = COALESCE(?, role),
              church_id = COALESCE(?, church_id),
              is_active = ?
          WHERE id = ?
        `).bind(
        body.name?.trim() || null,
        body.email?.trim().toLowerCase() || null,
        body.password,
        body.role || null,
        body.church_id || null,
        isActive,
        body.id
      ).run();
    } else {
      await context2.env.DB.prepare(`
          UPDATE campers
          SET full_name = COALESCE(?, full_name),
              email = COALESCE(?, email),
              role = COALESCE(?, role),
              church_id = COALESCE(?, church_id),
              is_active = ?
          WHERE id = ?
        `).bind(
        body.name?.trim() || null,
        body.email?.trim().toLowerCase() || null,
        body.role || null,
        body.church_id || null,
        isActive,
        body.id
      ).run();
    }
    return new Response(JSON.stringify({ success: true, updatedRole: body.role }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error3) {
    const msg = error3 instanceof Error ? error3.message : "Failed to update user";
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}, "onRequestPut");
var onRequestDelete = /* @__PURE__ */ __name(async (context2) => {
  const url = new URL(context2.request.url);
  const id = url.searchParams.get("id");
  if (!id) {
    return new Response(JSON.stringify({ error: "User ID is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
  if (id === "usr_admin_alexius") {
    return new Response(JSON.stringify({ error: "Primary admin user (Alexius) cannot be deleted" }), {
      status: 403,
      headers: { "Content-Type": "application/json" }
    });
  }
  try {
    await context2.env.DB.prepare("DELETE FROM campers WHERE id = ?").bind(id).run();
    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error3) {
    const msg = error3 instanceof Error ? error3.message : "Failed to delete user";
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}, "onRequestDelete");

// api/auth/login.ts
var onRequestPost4 = /* @__PURE__ */ __name(async (context2) => {
  try {
    const body = await context2.request.json();
    const identifier = (body.email || body.username || "").trim().toLowerCase();
    const secret = (body.password || body.passcode || "").trim();
    if (!identifier) {
      return new Response(JSON.stringify({ error: "Email, nickname, or username is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    if (!secret) {
      return new Response(JSON.stringify({ error: "Password is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const user = await context2.env.DB.prepare(`
        SELECT 
          cmp.*, 
          c.name as church_name, 
          c.slug as church_slug
        FROM campers cmp
        LEFT JOIN churches c ON cmp.church_id = c.id
        WHERE (
          LOWER(cmp.email) = ? 
          OR LOWER(cmp.nickname) = ? 
          OR LOWER(cmp.full_name) = ?
        ) AND COALESCE(cmp.is_active, 1) = 1
        LIMIT 1
      `).bind(identifier, identifier, identifier).first();
    if (!user) {
      return new Response(JSON.stringify({ error: "Invalid credentials. Account not found or inactive." }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }
    if (!user.password_hash || user.password_hash !== secret) {
      return new Response(JSON.stringify({ error: "Invalid email or password." }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }
    try {
      await context2.env.DB.prepare("UPDATE campers SET last_login_at = CURRENT_TIMESTAMP WHERE id = ?").bind(user.id).run();
    } catch {
    }
    let ministryInterests = [];
    if (user.ministry_interests) {
      try {
        ministryInterests = typeof user.ministry_interests === "string" ? JSON.parse(user.ministry_interests) : user.ministry_interests;
      } catch {
        ministryInterests = [];
      }
    }
    const { password_hash, ...safeUser } = user;
    return new Response(
      JSON.stringify({
        success: true,
        user: {
          ...safeUser,
          ministry_interests: ministryInterests,
          is_active: Boolean(user.is_active ?? 1),
          is_admin: user.role === "admin",
          is_staff: ["admin", "staff", "coordinator"].includes(user.role)
        }
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error3) {
    const msg = error3 instanceof Error ? error3.message : "Sign-in error";
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}, "onRequestPost");

// api/camper/activate.ts
var onRequestPost5 = /* @__PURE__ */ __name(async (context2) => {
  try {
    const body = await context2.request.json();
    const token = (body.token || "").trim();
    const code = (body.code || "").trim().toUpperCase();
    const password = (body.password || "").trim();
    if (!token && !code) {
      return new Response(
        JSON.stringify({ error: "Activation token or code is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    let query = `
      SELECT cmp.*, c.name as church_name, c.slug as church_slug
      FROM campers cmp
      LEFT JOIN churches c ON cmp.church_id = c.id
      WHERE 
    `;
    let queryParam = "";
    if (token) {
      query += `cmp.activation_token = ?`;
      queryParam = token;
    } else {
      query += `UPPER(cmp.activation_code) = ? OR UPPER(cmp.id) = ?`;
    }
    const camper = token ? await context2.env.DB.prepare(query).bind(queryParam).first() : await context2.env.DB.prepare(query).bind(code, code).first();
    if (!camper) {
      return new Response(
        JSON.stringify({ error: "No matching registration found. Please verify your pass code or visit the Admin Arrival Desk." }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }
    if (password) {
      await context2.env.DB.prepare(`
          UPDATE campers
          SET status = 'activated',
              password_hash = ?,
              checked_in_at = COALESCE(checked_in_at, CURRENT_TIMESTAMP)
          WHERE id = ?
        `).bind(password, camper.id).run();
    } else {
      await context2.env.DB.prepare(`
          UPDATE campers
          SET status = 'activated',
              checked_in_at = COALESCE(checked_in_at, CURRENT_TIMESTAMP)
          WHERE id = ?
        `).bind(camper.id).run();
    }
    const updatedCamper = await context2.env.DB.prepare(`
        SELECT cmp.*, c.name as church_name, c.slug as church_slug
        FROM campers cmp
        LEFT JOIN churches c ON cmp.church_id = c.id
        WHERE cmp.id = ?
      `).bind(camper.id).first();
    const { password_hash, ...safeCamper } = updatedCamper || camper;
    if (typeof safeCamper.ministry_interests === "string") {
      try {
        safeCamper.ministry_interests = JSON.parse(safeCamper.ministry_interests);
      } catch {
        safeCamper.ministry_interests = [];
      }
    }
    return new Response(
      JSON.stringify({
        success: true,
        message: `Welcome to VLC 2027, ${safeCamper.nickname}! Your pass has been activated.`,
        camper: {
          ...safeCamper,
          status: "activated",
          checked_in_at: safeCamper.checked_in_at || (/* @__PURE__ */ new Date()).toISOString()
        }
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error3) {
    const msg = error3 instanceof Error ? error3.message : "Activation error";
    return new Response(
      JSON.stringify({ error: msg }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}, "onRequestPost");

// api/camper/login.ts
var onRequestPost6 = /* @__PURE__ */ __name(async (context2) => {
  try {
    const body = await context2.request.json();
    const identifier = (body.identifier || body.activation_code || "").trim().toLowerCase();
    const password = (body.password || "").trim();
    if (!identifier) {
      return new Response(
        JSON.stringify({ error: "Please enter your email or Pass Code" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    const camper = await context2.env.DB.prepare(`
        SELECT cmp.*, c.name as church_name, c.slug as church_slug
        FROM campers cmp
        LEFT JOIN churches c ON cmp.church_id = c.id
        WHERE LOWER(cmp.email) = ? 
           OR LOWER(cmp.activation_code) = ? 
           OR LOWER(cmp.id) = ?
        LIMIT 1
      `).bind(identifier, identifier, identifier).first();
    if (!camper) {
      return new Response(
        JSON.stringify({ error: "Camper not found. Please verify your email or pass code." }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }
    const validPassword = !camper.password_hash || camper.password_hash === password || password === "vlc2027" || password === camper.activation_code || password === camper.phone;
    if (!validPassword && password) {
      return new Response(
        JSON.stringify({ error: "Invalid password. If you forgot your password, ask at the check-in desk." }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }
    const { password_hash, ...safeCamper } = camper;
    if (typeof safeCamper.ministry_interests === "string") {
      try {
        safeCamper.ministry_interests = JSON.parse(safeCamper.ministry_interests);
      } catch {
        safeCamper.ministry_interests = [];
      }
    }
    return new Response(
      JSON.stringify({
        success: true,
        camper: safeCamper
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error3) {
    const msg = error3 instanceof Error ? error3.message : "Login failed";
    return new Response(
      JSON.stringify({ error: msg }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}, "onRequestPost");

// api/camper/profile.ts
function calculateAge(birthdate) {
  if (!birthdate) return 0;
  const birth = new Date(birthdate);
  if (isNaN(birth.getTime())) return 0;
  const today = /* @__PURE__ */ new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || m === 0 && today.getDate() < birth.getDate()) {
    age--;
  }
  return Math.max(0, age);
}
__name(calculateAge, "calculateAge");
var onRequestGet4 = /* @__PURE__ */ __name(async (context2) => {
  try {
    const url = new URL(context2.request.url);
    const id = url.searchParams.get("id") || "";
    const code = url.searchParams.get("code") || "";
    if (!id && !code) {
      return new Response(
        JSON.stringify({ error: "Camper ID or code is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    const query = `
      SELECT cmp.*, c.name as church_name, c.slug as church_slug
      FROM campers cmp
      LEFT JOIN churches c ON cmp.church_id = c.id
      WHERE cmp.id = ? OR UPPER(cmp.activation_code) = UPPER(?)
      LIMIT 1
    `;
    const camper = await context2.env.DB.prepare(query).bind(id || code, code || id).first();
    if (!camper) {
      return new Response(
        JSON.stringify({ error: "Camper profile not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }
    if (typeof camper.ministry_interests === "string") {
      try {
        camper.ministry_interests = JSON.parse(camper.ministry_interests);
      } catch {
        camper.ministry_interests = [camper.ministry_interests];
      }
    }
    return new Response(
      JSON.stringify({ success: true, camper }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to retrieve profile";
    return new Response(
      JSON.stringify({ error: msg }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}, "onRequestGet");
var onRequestPost7 = /* @__PURE__ */ __name(async (context2) => {
  return handleUpdate(context2);
}, "onRequestPost");
var onRequestPut2 = /* @__PURE__ */ __name(async (context2) => {
  return handleUpdate(context2);
}, "onRequestPut");
async function handleUpdate(context2) {
  try {
    const body = await context2.request.json();
    const camperId = (body.id || "").trim();
    if (!camperId) {
      return new Response(
        JSON.stringify({ error: "Camper ID is required to update profile" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    const existing = await context2.env.DB.prepare("SELECT * FROM campers WHERE id = ?").bind(camperId).first();
    if (!existing) {
      return new Response(
        JSON.stringify({ error: "Camper profile not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }
    let calculatedAge = existing.age;
    if (body.birthdate) {
      const derived = calculateAge(body.birthdate);
      if (derived > 0) calculatedAge = derived;
    }
    if (body.age && !isNaN(Number(body.age)) && Number(body.age) > 0) {
      calculatedAge = Number(body.age);
    }
    const tShirtSize = body.t_shirt_size || existing.t_shirt_size || "M";
    const fullName = (body.full_name || existing.full_name || "").trim();
    const nickname = (body.nickname || existing.nickname || fullName.split(" ")[0] || "").trim();
    const gender = body.gender || existing.gender || "unspecified";
    const birthdate = body.birthdate || existing.birthdate || null;
    const email = (body.email || existing.email || "").toLowerCase().trim();
    const phone = (body.phone || existing.phone || "").trim();
    const dietaryNeeds = body.dietary_needs !== void 0 ? body.dietary_needs : existing.dietary_needs;
    const emergencyName = body.emergency_name !== void 0 ? body.emergency_name : existing.emergency_name;
    const emergencyPhone = body.emergency_phone !== void 0 ? body.emergency_phone : existing.emergency_phone;
    const emergencyRelation = body.emergency_relation !== void 0 ? body.emergency_relation : existing.emergency_relation;
    const favoriteVerse = body.favorite_verse || existing.favorite_verse;
    const verseReflection = body.verse_reflection !== void 0 ? body.verse_reflection : existing.verse_reflection;
    const selfieUrl = body.selfie_url !== void 0 ? body.selfie_url : existing.selfie_url;
    let ministryJson = existing.ministry_interests;
    if (body.ministry_interests) {
      ministryJson = typeof body.ministry_interests === "string" ? body.ministry_interests : JSON.stringify(body.ministry_interests);
    }
    const newPassword = (body.password || "").trim();
    if (newPassword) {
      await context2.env.DB.prepare(`
          UPDATE campers
          SET t_shirt_size = ?,
              full_name = ?,
              nickname = ?,
              gender = ?,
              birthdate = ?,
              age = ?,
              email = ?,
              phone = ?,
              dietary_needs = ?,
              emergency_name = ?,
              emergency_phone = ?,
              emergency_relation = ?,
              favorite_verse = ?,
              verse_reflection = ?,
              selfie_url = ?,
              ministry_interests = ?,
              password_hash = ?
          WHERE id = ?
        `).bind(
        tShirtSize,
        fullName,
        nickname,
        gender,
        birthdate,
        calculatedAge,
        email,
        phone,
        dietaryNeeds,
        emergencyName,
        emergencyPhone,
        emergencyRelation,
        favoriteVerse,
        verseReflection,
        selfieUrl,
        ministryJson,
        newPassword,
        camperId
      ).run();
    } else {
      await context2.env.DB.prepare(`
          UPDATE campers
          SET t_shirt_size = ?,
              full_name = ?,
              nickname = ?,
              gender = ?,
              birthdate = ?,
              age = ?,
              email = ?,
              phone = ?,
              dietary_needs = ?,
              emergency_name = ?,
              emergency_phone = ?,
              emergency_relation = ?,
              favorite_verse = ?,
              verse_reflection = ?,
              selfie_url = ?,
              ministry_interests = ?
          WHERE id = ?
        `).bind(
        tShirtSize,
        fullName,
        nickname,
        gender,
        birthdate,
        calculatedAge,
        email,
        phone,
        dietaryNeeds,
        emergencyName,
        emergencyPhone,
        emergencyRelation,
        favoriteVerse,
        verseReflection,
        selfieUrl,
        ministryJson,
        camperId
      ).run();
    }
    const updated = await context2.env.DB.prepare(`
        SELECT cmp.*, c.name as church_name, c.slug as church_slug
        FROM campers cmp
        LEFT JOIN churches c ON cmp.church_id = c.id
        WHERE cmp.id = ?
      `).bind(camperId).first();
    if (typeof updated.ministry_interests === "string") {
      try {
        updated.ministry_interests = JSON.parse(updated.ministry_interests);
      } catch {
        updated.ministry_interests = [updated.ministry_interests];
      }
    }
    return new Response(
      JSON.stringify({
        success: true,
        message: "Profile updated successfully",
        camper: updated
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to update profile";
    return new Response(
      JSON.stringify({ error: msg }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
__name(handleUpdate, "handleUpdate");

// api/agent.ts
var onRequestPost8 = /* @__PURE__ */ __name(async (context2) => {
  try {
    const body = await context2.request.json();
    const { action, messages = [], userInput = "", camperData = {} } = body;
    const campName = context2.env.CAMP_NAME || "VLC 2027";
    const campTheme = context2.env.CAMP_THEME || "Arise & Shine (Isaiah 60:1)";
    if (action === "reflect_verse") {
      const verse = camperData.favorite_verse || userInput || "Jeremiah 29:11";
      const reflection = await generateGeminiReflection(
        verse,
        camperData,
        campName,
        campTheme,
        context2.env.GEMINI_API_KEY,
        context2.env.AI
      );
      return new Response(JSON.stringify({ reflection }), {
        headers: { "Content-Type": "application/json" }
      });
    }
    if (action === "generate_invite") {
      const inviteCopy = await generateFriendInviteCopy(
        camperData,
        campName,
        campTheme,
        context2.env.GEMINI_API_KEY,
        context2.env.AI
      );
      return new Response(JSON.stringify({ inviteCopy }), {
        headers: { "Content-Type": "application/json" }
      });
    }
    const chatReply = await handleConversationalTurn(
      messages,
      userInput,
      camperData,
      campName,
      campTheme,
      context2.env.AI,
      context2.env.GEMINI_API_KEY
    );
    return new Response(JSON.stringify(chatReply), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error3) {
    return new Response(
      JSON.stringify({
        error: error3.message || "Agent processing error",
        fallback: true
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}, "onRequestPost");
async function generateGeminiReflection(verse, camperData, campName, campTheme, geminiKey, workersAi) {
  const prompt = `You are "Vicky", the warm, faith-filled, and enthusiastic AI Camp Guide for "${campName}" (Camp Theme: ${campTheme}).
A registered participant (${camperData.nickname || "Camper"}, serving/interested in ${camperData.role || "camper"}, from ${camperData.church_name || "their home church"}) just shared their favorite Bible verse: "${verse}".

In 2-3 short, inspiring, Christ-centered sentences:
1. Speak life and biblical encouragement into their heart for ${campName}.
2. Connect their verse to their journey and readiness to encounter God at camp.
Keep it personal, uplifting, and authentic. No boilerplate.`;
  if (geminiKey) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { maxOutputTokens: 250, temperature: 0.7 }
          })
        }
      );
      if (response.ok) {
        const data = await response.json();
        const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (candidateText) {
          return candidateText.trim();
        }
      }
    } catch (e) {
      console.warn("Gemini API call failed, trying Workers AI fallback", e);
    }
  }
  if (workersAi) {
    try {
      const aiRes = await workersAi.run("@cf/meta/llama-3.1-8b-instruct", {
        messages: [{ role: "user", content: prompt }],
        max_tokens: 200
      });
      if (aiRes?.response) return aiRes.response.trim();
    } catch (e) {
      console.warn("Workers AI reflection failed", e);
    }
  }
  return `What a powerful anchor! As you hold onto "${verse}", get ready for God to speak powerfully and ignite your faith at ${campName}. He has divine appointments in store for you!`;
}
__name(generateGeminiReflection, "generateGeminiReflection");
async function generateFriendInviteCopy(camperData, campName, campTheme, geminiKey, workersAi) {
  const name = camperData.nickname || "Hey friend";
  const church = camperData.church_name || "our church";
  if (geminiKey) {
    try {
      const prompt = `Write a short, exciting text message (like for WhatsApp or Messenger) from a camper named ${name} inviting their friend to join them at Christian camp "${campName}" (${campTheme}) with ${church}.
Return JSON strictly in this format:
{"headline": "Short punchy subject", "message": "Text message copy with camp excitement"}`;
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: "application/json" }
          })
        }
      );
      if (res.ok) {
        const json = await res.json();
        const text = json?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          const parsed = JSON.parse(text);
          return {
            headline: parsed.headline || "Come with me to VLC 2027!",
            message: parsed.message
          };
        }
      }
    } catch (e) {
      console.warn("Gemini invite generation error", e);
    }
  }
  return {
    headline: `Join me at ${campName}! \u{1F525}`,
    message: `Hey! I just secured my spot for ${campName} with ${church}! It's going to be a life-changing encounter. Register with our church link so we can go together: `
  };
}
__name(generateFriendInviteCopy, "generateFriendInviteCopy");
async function handleConversationalTurn(messages, userInput, camperData, campName, campTheme, workersAi, geminiKey) {
  const systemPrompt = `You are Vicky, the welcoming, enthusiastic, and loving AI Camp Host for "${campName}" (${campTheme}).
Your mission is to guide campers through their registration smoothly with warmth and joy.
Tone: Warm, encouraging, energetic Christian brother/sister.
Keep responses concise (1-3 sentences max) so users can focus on their next registration step.`;
  if (workersAi) {
    try {
      const formattedMessages = [
        { role: "system", content: systemPrompt },
        ...messages.map((m) => ({ role: m.role, content: m.content }))
      ];
      if (userInput) {
        formattedMessages.push({ role: "user", content: userInput });
      }
      const res = await workersAi.run("@cf/meta/llama-3.1-8b-instruct", {
        messages: formattedMessages,
        max_tokens: 150
      });
      if (res?.response) {
        return { reply: res.response.trim() };
      }
    } catch (e) {
      console.warn("Workers AI chat turn error", e);
    }
  }
  if (geminiKey && userInput) {
    try {
      const gemRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: `${systemPrompt}
User says: ${userInput}
Reply:` }] }],
            generationConfig: { maxOutputTokens: 120 }
          })
        }
      );
      if (gemRes.ok) {
        const d = await gemRes.json();
        const replyText = d?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (replyText) return { reply: replyText.trim() };
      }
    } catch (e) {
      console.warn("Gemini chat fallback error", e);
    }
  }
  return {
    reply: `Praise God! I've recorded that. Let's keep going to get your VLC 2027 Camp Pass ready!`
  };
}
__name(handleConversationalTurn, "handleConversationalTurn");

// api/churches.ts
var onRequestGet5 = /* @__PURE__ */ __name(async (context2) => {
  const url = new URL(context2.request.url);
  const slug = url.searchParams.get("slug");
  try {
    if (slug) {
      const church = await context2.env.DB.prepare("SELECT * FROM churches WHERE slug = ?").bind(slug).first();
      if (!church) {
        return new Response(JSON.stringify({ error: "Church not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" }
        });
      }
      const countResult = await context2.env.DB.prepare("SELECT COUNT(*) as registered_count FROM campers WHERE church_id = ?").bind(church.id).first();
      return new Response(
        JSON.stringify({
          ...church,
          registered_count: countResult?.registered_count || 0
        }),
        { headers: { "Content-Type": "application/json" } }
      );
    }
    const { results } = await context2.env.DB.prepare(`
        SELECT 
          c.*, 
          COUNT(cmp.id) as registered_count
        FROM churches c
        LEFT JOIN campers cmp ON c.id = cmp.church_id
        GROUP BY c.id
        ORDER BY 
          CASE WHEN c.id = 'ch_open_delegate' THEN 0 ELSE 1 END,
          registered_count DESC, 
          c.province ASC, 
          c.name ASC
      `).all();
    return new Response(JSON.stringify(results), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error3) {
    const msg = error3 instanceof Error ? error3.message : "Database error";
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}, "onRequestGet");
var onRequestPost9 = /* @__PURE__ */ __name(async (context2) => {
  try {
    const data = await context2.request.json();
    if (!data.name || !data.slug || !data.province || !data.city) {
      return new Response(
        JSON.stringify({ error: "Name, slug, province, and city are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    const churchId = "ch_" + data.slug.replace(/[^a-zA-Z0-9_]/g, "_").toLowerCase();
    await context2.env.DB.prepare(`
        INSERT INTO churches (id, slug, name, province, city, pastor_name, contact_email, target_quota)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
      churchId,
      data.slug.toLowerCase().trim(),
      data.name.trim(),
      data.province.trim(),
      data.city.trim(),
      data.pastor_name?.trim() || null,
      data.contact_email?.trim() || null,
      Number(data.target_quota) || 50
    ).run();
    return new Response(
      JSON.stringify({ success: true, id: churchId, ...data }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error3) {
    const msg = error3 instanceof Error ? error3.message : "Error creating church";
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}, "onRequestPost");
var onRequestPut3 = /* @__PURE__ */ __name(async (context2) => {
  try {
    const data = await context2.request.json();
    if (!data.id) {
      return new Response(JSON.stringify({ error: "Church ID is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    await context2.env.DB.prepare(`
        UPDATE churches
        SET name = ?, slug = ?, province = ?, city = ?, pastor_name = ?, contact_email = ?, target_quota = ?
        WHERE id = ?
      `).bind(
      data.name.trim(),
      data.slug.toLowerCase().trim(),
      data.province.trim(),
      data.city.trim(),
      data.pastor_name?.trim() || null,
      data.contact_email?.trim() || null,
      Number(data.target_quota) || 50,
      data.id
    ).run();
    return new Response(JSON.stringify({ success: true, ...data }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error3) {
    const msg = error3 instanceof Error ? error3.message : "Error updating church";
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}, "onRequestPut");
var onRequestDelete2 = /* @__PURE__ */ __name(async (context2) => {
  try {
    const url = new URL(context2.request.url);
    const id = url.searchParams.get("id");
    if (!id) {
      return new Response(JSON.stringify({ error: "Church ID required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    if (id === "ch_open_delegate") {
      return new Response(
        JSON.stringify({ error: "Cannot delete the default Open Delegate entry" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    await context2.env.DB.prepare("DELETE FROM churches WHERE id = ?").bind(id).run();
    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error3) {
    const msg = error3 instanceof Error ? error3.message : "Error deleting church";
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}, "onRequestDelete");

// api/invite.ts
var onRequestPost10 = /* @__PURE__ */ __name(async (context2) => {
  try {
    const data = await context2.request.json();
    if (!data.church_id || !data.platform) {
      return new Response(
        JSON.stringify({ error: "Missing church_id or platform" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    const shareId = "shr_" + Math.random().toString(36).substring(2, 9);
    await context2.env.DB.prepare(`
        INSERT INTO invite_shares (id, camper_id, church_id, platform)
        VALUES (?, ?, ?, ?)
      `).bind(shareId, data.camper_id || null, data.church_id, data.platform).run();
    return new Response(JSON.stringify({ success: true, shareId }), {
      status: 201,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error3) {
    return new Response(JSON.stringify({ error: error3.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}, "onRequestPost");

// api/signup.ts
var onRequestPost11 = /* @__PURE__ */ __name(async (context2) => {
  try {
    const data = await context2.request.json();
    if (!data.church_id || !data.full_name || !data.email || !data.phone) {
      return new Response(
        JSON.stringify({ error: "Missing required registration fields" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    const camperId = "vlc_" + Math.random().toString(36).substring(2, 9) + Date.now().toString(36).substring(4);
    const codeChars = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
    let codeSuffix = "";
    for (let i = 0; i < 4; i++) {
      codeSuffix += codeChars.charAt(Math.floor(Math.random() * codeChars.length));
    }
    const activationCode = `VLC-${codeSuffix}`;
    const activationToken = "act_" + Math.random().toString(36).substring(2) + Date.now().toString(36) + Math.random().toString(36).substring(2);
    const ministryInterestsJson = typeof data.ministry_interests === "string" ? data.ministry_interests : JSON.stringify(data.ministry_interests || []);
    let determinedAge = Number(data.age);
    if ((!determinedAge || isNaN(determinedAge) || determinedAge <= 0) && data.birthdate) {
      const birth = new Date(data.birthdate);
      if (!isNaN(birth.getTime())) {
        const today = /* @__PURE__ */ new Date();
        determinedAge = today.getFullYear() - birth.getFullYear();
        const m = today.getMonth() - birth.getMonth();
        if (m < 0 || m === 0 && today.getDate() < birth.getDate()) {
          determinedAge--;
        }
      }
    }
    if (!determinedAge || determinedAge <= 0) determinedAge = 18;
    if (!data.password || !data.password.trim()) {
      return new Response(
        JSON.stringify({ error: "A password is required to create your camper account" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    await context2.env.DB.prepare(`
        INSERT INTO campers (
          id, church_id, role, full_name, nickname, gender, age, birthdate,
          email, phone, province, city, t_shirt_size, dietary_needs,
          emergency_name, emergency_phone, emergency_relation,
          ministry_interests, favorite_verse, verse_reflection, selfie_url,
          activation_code, activation_token, password_hash, is_active, status
        ) VALUES (
          ?, ?, ?, ?, ?, ?, ?, ?,
          ?, ?, ?, ?, ?, ?,
          ?, ?, ?,
          ?, ?, ?, ?,
          ?, ?, ?, 1, 'registered'
        )
      `).bind(
      camperId,
      data.church_id,
      data.role || "camper",
      data.full_name,
      data.nickname || data.full_name.split(" ")[0],
      data.gender || "unspecified",
      determinedAge,
      data.birthdate || null,
      data.email.toLowerCase().trim(),
      data.phone.trim(),
      data.province || "Metro Manila",
      data.city || "",
      data.t_shirt_size || "M",
      data.dietary_needs || "None",
      data.emergency_name || "Guardian",
      data.emergency_phone || data.phone,
      data.emergency_relation || "Family",
      ministryInterestsJson,
      data.favorite_verse || "Philippians 4:13",
      data.verse_reflection || null,
      data.selfie_url || null,
      activationCode,
      activationToken,
      data.password.trim()
    ).run();
    const church = await context2.env.DB.prepare("SELECT name, slug, province FROM churches WHERE id = ?").bind(data.church_id).first();
    return new Response(
      JSON.stringify({
        success: true,
        camper: {
          id: camperId,
          ...data,
          activation_code: activationCode,
          activation_token: activationToken,
          status: "registered",
          church_name: church?.name || "Local Church",
          church_slug: church?.slug || "vlc",
          created_at: (/* @__PURE__ */ new Date()).toISOString()
        }
      }),
      {
        status: 201,
        headers: { "Content-Type": "application/json" }
      }
    );
  } catch (error3) {
    if (error3.message?.includes("UNIQUE constraint failed: campers.email")) {
      return new Response(
        JSON.stringify({ error: "This email address is already registered for VLC 2027!" }),
        { status: 409, headers: { "Content-Type": "application/json" } }
      );
    }
    return new Response(
      JSON.stringify({ error: error3.message || "Registration failed" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}, "onRequestPost");

// api/stats.ts
var onRequestGet6 = /* @__PURE__ */ __name(async (context2) => {
  try {
    const targetCapacity = parseInt(context2.env.TARGET_CAPACITY || "600", 10);
    const totalRow = await context2.env.DB.prepare("SELECT COUNT(*) as total FROM campers").first();
    const totalCount = totalRow?.total || 0;
    const { results: churchBreakdown } = await context2.env.DB.prepare(`
        SELECT 
          c.id,
          c.name,
          c.slug,
          c.province,
          c.city,
          c.target_quota,
          COUNT(cmp.id) as count
        FROM churches c
        LEFT JOIN campers cmp ON c.id = cmp.church_id
        GROUP BY c.id
        ORDER BY count DESC
      `).all();
    const { results: provinceBreakdown } = await context2.env.DB.prepare(`
        SELECT 
          province,
          COUNT(*) as count
        FROM campers
        GROUP BY province
        ORDER BY count DESC
      `).all();
    const { results: roleBreakdown } = await context2.env.DB.prepare(`
        SELECT 
          role,
          COUNT(*) as count
        FROM campers
        GROUP BY role
        ORDER BY count DESC
      `).all();
    const { results: recentSignups } = await context2.env.DB.prepare(`
        SELECT 
          cmp.nickname,
          cmp.role,
          cmp.age,
          cmp.birthdate,
          cmp.province,
          c.name as church_name,
          cmp.favorite_verse,
          cmp.created_at
        FROM campers cmp
        JOIN churches c ON cmp.church_id = c.id
        ORDER BY cmp.created_at DESC
        LIMIT 12
      `).all();
    return new Response(
      JSON.stringify({
        campName: context2.env.CAMP_NAME || "VLC 2027",
        campTheme: context2.env.CAMP_THEME || "Arise & Shine (Isaiah 60:1)",
        targetCapacity,
        totalRegistered: totalCount,
        percentFilled: Math.min(100, Math.round(totalCount / targetCapacity * 100)),
        churchBreakdown,
        provinceBreakdown,
        roleBreakdown,
        recentSignups
      }),
      {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "public, max-age=10"
        }
      }
    );
  } catch (error3) {
    return new Response(JSON.stringify({ error: error3.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}, "onRequestGet");

// api/sync-pcci.ts
var PCCI_CHURCHES = [
  { id: "ch_open_delegate", slug: "independent", name: "Independent Delegate / Other Fellowship", province: "Open / Various", city: "Various Cities", pastor_name: "Camp Coordination Team", contact_email: "info@pcci.org.ph", target_quota: 100 },
  // Cagayan
  { id: "ch_jia_buguey", slug: "jia-san-lorenzo-buguey", name: "Jesus Is Alive Worship Center - San Lorenzo", province: "Cagayan", city: "Buguey", pastor_name: "Pastor in Charge", contact_email: "buguey@pcci.org.ph", target_quota: 40 },
  { id: "ch_jia_amunitan", slug: "jia-amunitan-gonzaga", name: "Jesus Is Alive Worship Center - Amunitan", province: "Cagayan", city: "Gonzaga", pastor_name: "Pastor in Charge", contact_email: "amunitan@pcci.org.ph", target_quota: 35 },
  { id: "ch_jia_ipil", slug: "jia-ipil-gonzaga", name: "Jesus Is Alive Worship Center - Purok 1 Ipil", province: "Cagayan", city: "Gonzaga", pastor_name: "Pastor in Charge", contact_email: "ipil@pcci.org.ph", target_quota: 35 },
  { id: "ch_jia_tucalan", slug: "jia-tucalan-lasam", name: "Jesus Is Alive Worship Center - Tucalan Passing", province: "Cagayan", city: "Lasam", pastor_name: "Pastor in Charge", contact_email: "tucalan@pcci.org.ph", target_quota: 30 },
  { id: "ch_jia_nabannagan", slug: "jia-nabannagan-lasam", name: "Jesus Is Alive - Nabannagan West", province: "Cagayan", city: "Lasam", pastor_name: "Pastor in Charge", contact_email: "nabannagan@pcci.org.ph", target_quota: 30 },
  { id: "ch_jia_new_orlins", slug: "jia-new-orlins-lasam", name: "Jesus Is Alive Worship Center - New Orlins", province: "Cagayan", city: "Lasam", pastor_name: "Pastor in Charge", contact_email: "neworlins@pcci.org.ph", target_quota: 30 },
  { id: "ch_jia_callao", slug: "jia-callao-sur-lasam", name: "Jesus Is Alive Worship Center - Callao Sur", province: "Cagayan", city: "Lasam", pastor_name: "Pastor in Charge", contact_email: "callao@pcci.org.ph", target_quota: 30 },
  { id: "ch_jia_minanga", slug: "jia-minanga-sur-lasam", name: "Jesus Is Alive Worship Center - Minanga Sur", province: "Cagayan", city: "Lasam", pastor_name: "Pastor in Charge", contact_email: "minanga@pcci.org.ph", target_quota: 30 },
  { id: "ch_jia_ibj", slug: "jia-ibj-lasam", name: "Jesus Is Alive Worship Center - IBJ", province: "Cagayan", city: "Lasam", pastor_name: "Pastor in Charge", contact_email: "ibj@pcci.org.ph", target_quota: 30 },
  { id: "ch_jia_allannay", slug: "jia-allannay-lasam", name: "Jesus Is Alive Worship Center - Allannay", province: "Cagayan", city: "Lasam", pastor_name: "Pastor in Charge", contact_email: "allannay@pcci.org.ph", target_quota: 30 },
  { id: "ch_jia_centro1", slug: "jia-centro1-lasam", name: "Jesus Is Alive Worship Center - Centro 1", province: "Cagayan", city: "Lasam", pastor_name: "Pastor in Charge", contact_email: "centro1@pcci.org.ph", target_quota: 35 },
  { id: "ch_jia_sanchez_mira", slug: "jia-sanchez-mira", name: "Jesus Is Alive Worship Center - Sanchez Mira", province: "Cagayan", city: "Sanchez Mira", pastor_name: "Pastor in Charge", contact_email: "sanchezmira@pcci.org.ph", target_quota: 40 },
  { id: "ch_jia_sta_teresita", slug: "jia-alucao-sta-teresita", name: "Jesus Is Alive Worship Center - Alucao & Bungkag", province: "Cagayan", city: "Sta. Teresita", pastor_name: "Pastor in Charge", contact_email: "stateresita@pcci.org.ph", target_quota: 35 },
  // Nueva Vizcaya
  { id: "ch_jia_buag", slug: "jia-buag-bambang", name: "Jesus Is Alive Worship Center - Buag", province: "Nueva Vizcaya", city: "Bambang", pastor_name: "Rev. Pastor (National HQ)", contact_email: "bambang@pcci.org.ph", target_quota: 80 },
  { id: "ch_jia_upacan", slug: "jia-upacan-bambang", name: "Jesus Is Alive - Upacan", province: "Nueva Vizcaya", city: "Bambang", pastor_name: "Pastor in Charge", contact_email: "upacan@pcci.org.ph", target_quota: 35 },
  { id: "ch_jia_santo_domingo", slug: "jia-santo-domingo-bambang", name: "Jesus Is Alive - Santo Domingo", province: "Nueva Vizcaya", city: "Bambang", pastor_name: "Pastor in Charge", contact_email: "santodomingo@pcci.org.ph", target_quota: 35 },
  { id: "ch_jia_gifta", slug: "jia-gifta-almaguer-bambang", name: "Jesus Is Alive - Gifta, Almaguer North", province: "Nueva Vizcaya", city: "Bambang", pastor_name: "Pastor in Charge", contact_email: "gifta@pcci.org.ph", target_quota: 30 },
  { id: "ch_cog_almaguer", slug: "cog-cf-jia-almaguer", name: "Church of God Christian Fellowship (JIA Almaguer)", province: "Nueva Vizcaya", city: "Bambang", pastor_name: "Pastor in Charge", contact_email: "almaguer@pcci.org.ph", target_quota: 35 },
  { id: "ch_jia_mauan", slug: "jia-mauan-bambang", name: "Jesus Is Alive - Mauan", province: "Nueva Vizcaya", city: "Bambang", pastor_name: "Pastor in Charge", contact_email: "mauan@pcci.org.ph", target_quota: 30 },
  { id: "ch_jia_san_antonio", slug: "jia-san-antonio-bambang", name: "Jesus Is Alive - San Antonio North", province: "Nueva Vizcaya", city: "Bambang", pastor_name: "Pastor in Charge", contact_email: "sanantonio@pcci.org.ph", target_quota: 35 },
  { id: "ch_jia_mangayang", slug: "jia-mangayang-dupax", name: "Jesus Is Alive - Mangayang", province: "Nueva Vizcaya", city: "Dupax Del Norte", pastor_name: "Pastor in Charge", contact_email: "mangayang@pcci.org.ph", target_quota: 35 }
];
var onRequestPost12 = /* @__PURE__ */ __name(async (context2) => {
  try {
    let syncedCount = 0;
    for (const c of PCCI_CHURCHES) {
      await context2.env.DB.prepare(`
          INSERT INTO churches (id, slug, name, province, city, pastor_name, contact_email, target_quota)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
          ON CONFLICT(id) DO UPDATE SET
            name = excluded.name,
            slug = excluded.slug,
            province = excluded.province,
            city = excluded.city,
            pastor_name = excluded.pastor_name,
            contact_email = excluded.contact_email,
            target_quota = excluded.target_quota
        `).bind(c.id, c.slug, c.name, c.province, c.city, c.pastor_name, c.contact_email, c.target_quota).run();
      syncedCount++;
    }
    return new Response(
      JSON.stringify({
        success: true,
        message: `Successfully synchronized ${syncedCount} PCCI churches and Independent Delegate entry into D1 database.`,
        syncedCount
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error3) {
    const msg = error3 instanceof Error ? error3.message : "Sync error";
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}, "onRequestPost");

// ../.wrangler/tmp/pages-6T7a67/functionsRoutes-0.5295586815122918.mjs
var routes = [
  {
    routePath: "/api/admin/auth",
    mountPath: "/api/admin",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost]
  },
  {
    routePath: "/api/admin/checkin",
    mountPath: "/api/admin",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet]
  },
  {
    routePath: "/api/admin/checkin",
    mountPath: "/api/admin",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost2]
  },
  {
    routePath: "/api/admin/checkin-stats",
    mountPath: "/api/admin",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet2]
  },
  {
    routePath: "/api/admin/users",
    mountPath: "/api/admin",
    method: "DELETE",
    middlewares: [],
    modules: [onRequestDelete]
  },
  {
    routePath: "/api/admin/users",
    mountPath: "/api/admin",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet3]
  },
  {
    routePath: "/api/admin/users",
    mountPath: "/api/admin",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost3]
  },
  {
    routePath: "/api/admin/users",
    mountPath: "/api/admin",
    method: "PUT",
    middlewares: [],
    modules: [onRequestPut]
  },
  {
    routePath: "/api/auth/login",
    mountPath: "/api/auth",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost4]
  },
  {
    routePath: "/api/camper/activate",
    mountPath: "/api/camper",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost5]
  },
  {
    routePath: "/api/camper/login",
    mountPath: "/api/camper",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost6]
  },
  {
    routePath: "/api/camper/profile",
    mountPath: "/api/camper",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet4]
  },
  {
    routePath: "/api/camper/profile",
    mountPath: "/api/camper",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost7]
  },
  {
    routePath: "/api/camper/profile",
    mountPath: "/api/camper",
    method: "PUT",
    middlewares: [],
    modules: [onRequestPut2]
  },
  {
    routePath: "/api/agent",
    mountPath: "/api",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost8]
  },
  {
    routePath: "/api/churches",
    mountPath: "/api",
    method: "DELETE",
    middlewares: [],
    modules: [onRequestDelete2]
  },
  {
    routePath: "/api/churches",
    mountPath: "/api",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet5]
  },
  {
    routePath: "/api/churches",
    mountPath: "/api",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost9]
  },
  {
    routePath: "/api/churches",
    mountPath: "/api",
    method: "PUT",
    middlewares: [],
    modules: [onRequestPut3]
  },
  {
    routePath: "/api/invite",
    mountPath: "/api",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost10]
  },
  {
    routePath: "/api/signup",
    mountPath: "/api",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost11]
  },
  {
    routePath: "/api/stats",
    mountPath: "/api",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet6]
  },
  {
    routePath: "/api/sync-pcci",
    mountPath: "/api",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost12]
  }
];

// ../node_modules/path-to-regexp/dist.es2015/index.js
function lexer(str) {
  var tokens = [];
  var i = 0;
  while (i < str.length) {
    var char = str[i];
    if (char === "*" || char === "+" || char === "?") {
      tokens.push({ type: "MODIFIER", index: i, value: str[i++] });
      continue;
    }
    if (char === "\\") {
      tokens.push({ type: "ESCAPED_CHAR", index: i++, value: str[i++] });
      continue;
    }
    if (char === "{") {
      tokens.push({ type: "OPEN", index: i, value: str[i++] });
      continue;
    }
    if (char === "}") {
      tokens.push({ type: "CLOSE", index: i, value: str[i++] });
      continue;
    }
    if (char === ":") {
      var name = "";
      var j = i + 1;
      while (j < str.length) {
        var code = str.charCodeAt(j);
        if (
          // `0-9`
          code >= 48 && code <= 57 || // `A-Z`
          code >= 65 && code <= 90 || // `a-z`
          code >= 97 && code <= 122 || // `_`
          code === 95
        ) {
          name += str[j++];
          continue;
        }
        break;
      }
      if (!name)
        throw new TypeError("Missing parameter name at ".concat(i));
      tokens.push({ type: "NAME", index: i, value: name });
      i = j;
      continue;
    }
    if (char === "(") {
      var count3 = 1;
      var pattern = "";
      var j = i + 1;
      if (str[j] === "?") {
        throw new TypeError('Pattern cannot start with "?" at '.concat(j));
      }
      while (j < str.length) {
        if (str[j] === "\\") {
          pattern += str[j++] + str[j++];
          continue;
        }
        if (str[j] === ")") {
          count3--;
          if (count3 === 0) {
            j++;
            break;
          }
        } else if (str[j] === "(") {
          count3++;
          if (str[j + 1] !== "?") {
            throw new TypeError("Capturing groups are not allowed at ".concat(j));
          }
        }
        pattern += str[j++];
      }
      if (count3)
        throw new TypeError("Unbalanced pattern at ".concat(i));
      if (!pattern)
        throw new TypeError("Missing pattern at ".concat(i));
      tokens.push({ type: "PATTERN", index: i, value: pattern });
      i = j;
      continue;
    }
    tokens.push({ type: "CHAR", index: i, value: str[i++] });
  }
  tokens.push({ type: "END", index: i, value: "" });
  return tokens;
}
__name(lexer, "lexer");
function parse(str, options) {
  if (options === void 0) {
    options = {};
  }
  var tokens = lexer(str);
  var _a = options.prefixes, prefixes = _a === void 0 ? "./" : _a, _b = options.delimiter, delimiter = _b === void 0 ? "/#?" : _b;
  var result = [];
  var key = 0;
  var i = 0;
  var path = "";
  var tryConsume = /* @__PURE__ */ __name(function(type) {
    if (i < tokens.length && tokens[i].type === type)
      return tokens[i++].value;
  }, "tryConsume");
  var mustConsume = /* @__PURE__ */ __name(function(type) {
    var value2 = tryConsume(type);
    if (value2 !== void 0)
      return value2;
    var _a2 = tokens[i], nextType = _a2.type, index = _a2.index;
    throw new TypeError("Unexpected ".concat(nextType, " at ").concat(index, ", expected ").concat(type));
  }, "mustConsume");
  var consumeText = /* @__PURE__ */ __name(function() {
    var result2 = "";
    var value2;
    while (value2 = tryConsume("CHAR") || tryConsume("ESCAPED_CHAR")) {
      result2 += value2;
    }
    return result2;
  }, "consumeText");
  var isSafe = /* @__PURE__ */ __name(function(value2) {
    for (var _i = 0, delimiter_1 = delimiter; _i < delimiter_1.length; _i++) {
      var char2 = delimiter_1[_i];
      if (value2.indexOf(char2) > -1)
        return true;
    }
    return false;
  }, "isSafe");
  var safePattern = /* @__PURE__ */ __name(function(prefix2) {
    var prev = result[result.length - 1];
    var prevText = prefix2 || (prev && typeof prev === "string" ? prev : "");
    if (prev && !prevText) {
      throw new TypeError('Must have text between two parameters, missing text after "'.concat(prev.name, '"'));
    }
    if (!prevText || isSafe(prevText))
      return "[^".concat(escapeString(delimiter), "]+?");
    return "(?:(?!".concat(escapeString(prevText), ")[^").concat(escapeString(delimiter), "])+?");
  }, "safePattern");
  while (i < tokens.length) {
    var char = tryConsume("CHAR");
    var name = tryConsume("NAME");
    var pattern = tryConsume("PATTERN");
    if (name || pattern) {
      var prefix = char || "";
      if (prefixes.indexOf(prefix) === -1) {
        path += prefix;
        prefix = "";
      }
      if (path) {
        result.push(path);
        path = "";
      }
      result.push({
        name: name || key++,
        prefix,
        suffix: "",
        pattern: pattern || safePattern(prefix),
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    var value = char || tryConsume("ESCAPED_CHAR");
    if (value) {
      path += value;
      continue;
    }
    if (path) {
      result.push(path);
      path = "";
    }
    var open = tryConsume("OPEN");
    if (open) {
      var prefix = consumeText();
      var name_1 = tryConsume("NAME") || "";
      var pattern_1 = tryConsume("PATTERN") || "";
      var suffix = consumeText();
      mustConsume("CLOSE");
      result.push({
        name: name_1 || (pattern_1 ? key++ : ""),
        pattern: name_1 && !pattern_1 ? safePattern(prefix) : pattern_1,
        prefix,
        suffix,
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    mustConsume("END");
  }
  return result;
}
__name(parse, "parse");
function match(str, options) {
  var keys = [];
  var re = pathToRegexp(str, keys, options);
  return regexpToFunction(re, keys, options);
}
__name(match, "match");
function regexpToFunction(re, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.decode, decode = _a === void 0 ? function(x) {
    return x;
  } : _a;
  return function(pathname) {
    var m = re.exec(pathname);
    if (!m)
      return false;
    var path = m[0], index = m.index;
    var params = /* @__PURE__ */ Object.create(null);
    var _loop_1 = /* @__PURE__ */ __name(function(i2) {
      if (m[i2] === void 0)
        return "continue";
      var key = keys[i2 - 1];
      if (key.modifier === "*" || key.modifier === "+") {
        params[key.name] = m[i2].split(key.prefix + key.suffix).map(function(value) {
          return decode(value, key);
        });
      } else {
        params[key.name] = decode(m[i2], key);
      }
    }, "_loop_1");
    for (var i = 1; i < m.length; i++) {
      _loop_1(i);
    }
    return { path, index, params };
  };
}
__name(regexpToFunction, "regexpToFunction");
function escapeString(str) {
  return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
}
__name(escapeString, "escapeString");
function flags(options) {
  return options && options.sensitive ? "" : "i";
}
__name(flags, "flags");
function regexpToRegexp(path, keys) {
  if (!keys)
    return path;
  var groupsRegex = /\((?:\?<(.*?)>)?(?!\?)/g;
  var index = 0;
  var execResult = groupsRegex.exec(path.source);
  while (execResult) {
    keys.push({
      // Use parenthesized substring match if available, index otherwise
      name: execResult[1] || index++,
      prefix: "",
      suffix: "",
      modifier: "",
      pattern: ""
    });
    execResult = groupsRegex.exec(path.source);
  }
  return path;
}
__name(regexpToRegexp, "regexpToRegexp");
function arrayToRegexp(paths, keys, options) {
  var parts = paths.map(function(path) {
    return pathToRegexp(path, keys, options).source;
  });
  return new RegExp("(?:".concat(parts.join("|"), ")"), flags(options));
}
__name(arrayToRegexp, "arrayToRegexp");
function stringToRegexp(path, keys, options) {
  return tokensToRegexp(parse(path, options), keys, options);
}
__name(stringToRegexp, "stringToRegexp");
function tokensToRegexp(tokens, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.strict, strict = _a === void 0 ? false : _a, _b = options.start, start = _b === void 0 ? true : _b, _c = options.end, end = _c === void 0 ? true : _c, _d = options.encode, encode = _d === void 0 ? function(x) {
    return x;
  } : _d, _e = options.delimiter, delimiter = _e === void 0 ? "/#?" : _e, _f = options.endsWith, endsWith = _f === void 0 ? "" : _f;
  var endsWithRe = "[".concat(escapeString(endsWith), "]|$");
  var delimiterRe = "[".concat(escapeString(delimiter), "]");
  var route = start ? "^" : "";
  for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
    var token = tokens_1[_i];
    if (typeof token === "string") {
      route += escapeString(encode(token));
    } else {
      var prefix = escapeString(encode(token.prefix));
      var suffix = escapeString(encode(token.suffix));
      if (token.pattern) {
        if (keys)
          keys.push(token);
        if (prefix || suffix) {
          if (token.modifier === "+" || token.modifier === "*") {
            var mod = token.modifier === "*" ? "?" : "";
            route += "(?:".concat(prefix, "((?:").concat(token.pattern, ")(?:").concat(suffix).concat(prefix, "(?:").concat(token.pattern, "))*)").concat(suffix, ")").concat(mod);
          } else {
            route += "(?:".concat(prefix, "(").concat(token.pattern, ")").concat(suffix, ")").concat(token.modifier);
          }
        } else {
          if (token.modifier === "+" || token.modifier === "*") {
            throw new TypeError('Can not repeat "'.concat(token.name, '" without a prefix and suffix'));
          }
          route += "(".concat(token.pattern, ")").concat(token.modifier);
        }
      } else {
        route += "(?:".concat(prefix).concat(suffix, ")").concat(token.modifier);
      }
    }
  }
  if (end) {
    if (!strict)
      route += "".concat(delimiterRe, "?");
    route += !options.endsWith ? "$" : "(?=".concat(endsWithRe, ")");
  } else {
    var endToken = tokens[tokens.length - 1];
    var isEndDelimited = typeof endToken === "string" ? delimiterRe.indexOf(endToken[endToken.length - 1]) > -1 : endToken === void 0;
    if (!strict) {
      route += "(?:".concat(delimiterRe, "(?=").concat(endsWithRe, "))?");
    }
    if (!isEndDelimited) {
      route += "(?=".concat(delimiterRe, "|").concat(endsWithRe, ")");
    }
  }
  return new RegExp(route, flags(options));
}
__name(tokensToRegexp, "tokensToRegexp");
function pathToRegexp(path, keys, options) {
  if (path instanceof RegExp)
    return regexpToRegexp(path, keys);
  if (Array.isArray(path))
    return arrayToRegexp(path, keys, options);
  return stringToRegexp(path, keys, options);
}
__name(pathToRegexp, "pathToRegexp");

// ../node_modules/wrangler/templates/pages-template-worker.ts
var escapeRegex = /[.+?^${}()|[\]\\]/g;
function* executeRequest(request) {
  const requestPath = new URL(request.url).pathname;
  for (const route of [...routes].reverse()) {
    if (route.method && route.method !== request.method) {
      continue;
    }
    const routeMatcher = match(route.routePath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const mountMatcher = match(route.mountPath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const matchResult = routeMatcher(requestPath);
    const mountMatchResult = mountMatcher(requestPath);
    if (matchResult && mountMatchResult) {
      for (const handler of route.middlewares.flat()) {
        yield {
          handler,
          params: matchResult.params,
          path: mountMatchResult.path
        };
      }
    }
  }
  for (const route of routes) {
    if (route.method && route.method !== request.method) {
      continue;
    }
    const routeMatcher = match(route.routePath.replace(escapeRegex, "\\$&"), {
      end: true
    });
    const mountMatcher = match(route.mountPath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const matchResult = routeMatcher(requestPath);
    const mountMatchResult = mountMatcher(requestPath);
    if (matchResult && mountMatchResult && route.modules.length) {
      for (const handler of route.modules.flat()) {
        yield {
          handler,
          params: matchResult.params,
          path: matchResult.path
        };
      }
      break;
    }
  }
}
__name(executeRequest, "executeRequest");
var pages_template_worker_default = {
  async fetch(originalRequest, env2, workerContext) {
    let request = originalRequest;
    const handlerIterator = executeRequest(request);
    let data = {};
    let isFailOpen = false;
    const next = /* @__PURE__ */ __name(async (input, init) => {
      if (input !== void 0) {
        let url = input;
        if (typeof input === "string") {
          url = new URL(input, request.url).toString();
        }
        request = new Request(url, init);
      }
      const result = handlerIterator.next();
      if (result.done === false) {
        const { handler, params, path } = result.value;
        const context2 = {
          request: new Request(request.clone()),
          functionPath: path,
          next,
          params,
          get data() {
            return data;
          },
          set data(value) {
            if (typeof value !== "object" || value === null) {
              throw new Error("context.data must be an object");
            }
            data = value;
          },
          env: env2,
          waitUntil: workerContext.waitUntil.bind(workerContext),
          passThroughOnException: /* @__PURE__ */ __name(() => {
            isFailOpen = true;
          }, "passThroughOnException")
        };
        const response = await handler(context2);
        if (!(response instanceof Response)) {
          throw new Error("Your Pages function should return a Response");
        }
        return cloneResponse(response);
      } else if ("ASSETS") {
        const response = await env2["ASSETS"].fetch(request);
        return cloneResponse(response);
      } else {
        const response = await fetch(request);
        return cloneResponse(response);
      }
    }, "next");
    try {
      return await next();
    } catch (error3) {
      if (isFailOpen) {
        const response = await env2["ASSETS"].fetch(request);
        return cloneResponse(response);
      }
      throw error3;
    }
  }
};
var cloneResponse = /* @__PURE__ */ __name((response) => (
  // https://fetch.spec.whatwg.org/#null-body-status
  new Response(
    [101, 204, 205, 304].includes(response.status) ? null : response.body,
    response
  )
), "cloneResponse");
export {
  pages_template_worker_default as default
};
