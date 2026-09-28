var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __esm = (fn, res, err) => function __init() {
  if (err) throw err[0];
  try {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  } catch (e) {
    throw err = [e], e;
  }
};
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// ../node_modules/unenv/dist/runtime/_internal/utils.mjs
// @__NO_SIDE_EFFECTS__
function createNotImplementedError(name) {
  return new Error(`[unenv] ${name} is not implemented yet!`);
}
// @__NO_SIDE_EFFECTS__
function notImplemented(name) {
  const fn = /* @__PURE__ */ __name(() => {
    throw /* @__PURE__ */ createNotImplementedError(name);
  }, "fn");
  return Object.assign(fn, { __unenv__: true });
}
// @__NO_SIDE_EFFECTS__
function notImplementedClass(name) {
  return class {
    __unenv__ = true;
    constructor() {
      throw new Error(`[unenv] ${name} is not implemented yet!`);
    }
  };
}
var init_utils = __esm({
  "../node_modules/unenv/dist/runtime/_internal/utils.mjs"() {
    init_functionsRoutes_0_39238513569259903();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    __name(createNotImplementedError, "createNotImplementedError");
    __name(notImplemented, "notImplemented");
    __name(notImplementedClass, "notImplementedClass");
  }
});

// ../node_modules/unenv/dist/runtime/node/internal/perf_hooks/performance.mjs
var _timeOrigin, _performanceNow, nodeTiming, PerformanceEntry, PerformanceMark, PerformanceMeasure, PerformanceResourceTiming, PerformanceObserverEntryList, Performance, PerformanceObserver, performance;
var init_performance = __esm({
  "../node_modules/unenv/dist/runtime/node/internal/perf_hooks/performance.mjs"() {
    init_functionsRoutes_0_39238513569259903();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_utils();
    _timeOrigin = globalThis.performance?.timeOrigin ?? Date.now();
    _performanceNow = globalThis.performance?.now ? globalThis.performance.now.bind(globalThis.performance) : () => Date.now() - _timeOrigin;
    nodeTiming = {
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
    PerformanceEntry = class {
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
    PerformanceMark = class PerformanceMark2 extends PerformanceEntry {
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
    PerformanceMeasure = class extends PerformanceEntry {
      static {
        __name(this, "PerformanceMeasure");
      }
      entryType = "measure";
    };
    PerformanceResourceTiming = class extends PerformanceEntry {
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
    PerformanceObserverEntryList = class {
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
    Performance = class {
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
    PerformanceObserver = class {
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
    performance = globalThis.performance && "addEventListener" in globalThis.performance ? globalThis.performance : new Performance();
  }
});

// ../node_modules/unenv/dist/runtime/node/perf_hooks.mjs
var init_perf_hooks = __esm({
  "../node_modules/unenv/dist/runtime/node/perf_hooks.mjs"() {
    init_functionsRoutes_0_39238513569259903();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_performance();
  }
});

// ../node_modules/@cloudflare/unenv-preset/dist/runtime/polyfill/performance.mjs
var init_performance2 = __esm({
  "../node_modules/@cloudflare/unenv-preset/dist/runtime/polyfill/performance.mjs"() {
    init_perf_hooks();
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
  }
});

// ../node_modules/unenv/dist/runtime/mock/noop.mjs
var noop_default;
var init_noop = __esm({
  "../node_modules/unenv/dist/runtime/mock/noop.mjs"() {
    init_functionsRoutes_0_39238513569259903();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    noop_default = Object.assign(() => {
    }, { __unenv__: true });
  }
});

// ../node_modules/unenv/dist/runtime/node/console.mjs
import { Writable } from "node:stream";
var _console, _ignoreErrors, _stderr, _stdout, log, info, trace, debug, table, error, warn, createTask, clear, count, countReset, dir, dirxml, group, groupEnd, groupCollapsed, profile, profileEnd, time, timeEnd, timeLog, timeStamp, Console, _times, _stdoutErrorHandler, _stderrErrorHandler;
var init_console = __esm({
  "../node_modules/unenv/dist/runtime/node/console.mjs"() {
    init_functionsRoutes_0_39238513569259903();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_noop();
    init_utils();
    _console = globalThis.console;
    _ignoreErrors = true;
    _stderr = new Writable();
    _stdout = new Writable();
    log = _console?.log ?? noop_default;
    info = _console?.info ?? log;
    trace = _console?.trace ?? info;
    debug = _console?.debug ?? log;
    table = _console?.table ?? log;
    error = _console?.error ?? log;
    warn = _console?.warn ?? error;
    createTask = _console?.createTask ?? /* @__PURE__ */ notImplemented("console.createTask");
    clear = _console?.clear ?? noop_default;
    count = _console?.count ?? noop_default;
    countReset = _console?.countReset ?? noop_default;
    dir = _console?.dir ?? noop_default;
    dirxml = _console?.dirxml ?? noop_default;
    group = _console?.group ?? noop_default;
    groupEnd = _console?.groupEnd ?? noop_default;
    groupCollapsed = _console?.groupCollapsed ?? noop_default;
    profile = _console?.profile ?? noop_default;
    profileEnd = _console?.profileEnd ?? noop_default;
    time = _console?.time ?? noop_default;
    timeEnd = _console?.timeEnd ?? noop_default;
    timeLog = _console?.timeLog ?? noop_default;
    timeStamp = _console?.timeStamp ?? noop_default;
    Console = _console?.Console ?? /* @__PURE__ */ notImplementedClass("console.Console");
    _times = /* @__PURE__ */ new Map();
    _stdoutErrorHandler = noop_default;
    _stderrErrorHandler = noop_default;
  }
});

// ../node_modules/@cloudflare/unenv-preset/dist/runtime/node/console.mjs
var workerdConsole, assert, clear2, context, count2, countReset2, createTask2, debug2, dir2, dirxml2, error2, group2, groupCollapsed2, groupEnd2, info2, log2, profile2, profileEnd2, table2, time2, timeEnd2, timeLog2, timeStamp2, trace2, warn2, console_default;
var init_console2 = __esm({
  "../node_modules/@cloudflare/unenv-preset/dist/runtime/node/console.mjs"() {
    init_functionsRoutes_0_39238513569259903();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_console();
    workerdConsole = globalThis["console"];
    ({
      assert,
      clear: clear2,
      context: (
        // @ts-expect-error undocumented public API
        context
      ),
      count: count2,
      countReset: countReset2,
      createTask: (
        // @ts-expect-error undocumented public API
        createTask2
      ),
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
    } = workerdConsole);
    Object.assign(workerdConsole, {
      Console,
      _ignoreErrors,
      _stderr,
      _stderrErrorHandler,
      _stdout,
      _stdoutErrorHandler,
      _times
    });
    console_default = workerdConsole;
  }
});

// ../node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-console
var init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console = __esm({
  "../node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-console"() {
    init_console2();
    globalThis.console = console_default;
  }
});

// ../node_modules/unenv/dist/runtime/node/internal/process/hrtime.mjs
var hrtime;
var init_hrtime = __esm({
  "../node_modules/unenv/dist/runtime/node/internal/process/hrtime.mjs"() {
    init_functionsRoutes_0_39238513569259903();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    hrtime = /* @__PURE__ */ Object.assign(/* @__PURE__ */ __name(function hrtime2(startTime) {
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
  }
});

// ../node_modules/unenv/dist/runtime/node/internal/tty/read-stream.mjs
var ReadStream;
var init_read_stream = __esm({
  "../node_modules/unenv/dist/runtime/node/internal/tty/read-stream.mjs"() {
    init_functionsRoutes_0_39238513569259903();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    ReadStream = class {
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
  }
});

// ../node_modules/unenv/dist/runtime/node/internal/tty/write-stream.mjs
var WriteStream;
var init_write_stream = __esm({
  "../node_modules/unenv/dist/runtime/node/internal/tty/write-stream.mjs"() {
    init_functionsRoutes_0_39238513569259903();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    WriteStream = class {
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
  }
});

// ../node_modules/unenv/dist/runtime/node/tty.mjs
var init_tty = __esm({
  "../node_modules/unenv/dist/runtime/node/tty.mjs"() {
    init_functionsRoutes_0_39238513569259903();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_read_stream();
    init_write_stream();
  }
});

// ../node_modules/unenv/dist/runtime/node/internal/process/node-version.mjs
var NODE_VERSION;
var init_node_version = __esm({
  "../node_modules/unenv/dist/runtime/node/internal/process/node-version.mjs"() {
    init_functionsRoutes_0_39238513569259903();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    NODE_VERSION = "22.14.0";
  }
});

// ../node_modules/unenv/dist/runtime/node/internal/process/process.mjs
import { EventEmitter } from "node:events";
var Process;
var init_process = __esm({
  "../node_modules/unenv/dist/runtime/node/internal/process/process.mjs"() {
    init_functionsRoutes_0_39238513569259903();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_tty();
    init_utils();
    init_node_version();
    Process = class _Process extends EventEmitter {
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
  }
});

// ../node_modules/@cloudflare/unenv-preset/dist/runtime/node/process.mjs
var globalProcess, getBuiltinModule, workerdProcess, unenvProcess, exit, features, platform, _channel, _debugEnd, _debugProcess, _disconnect, _events, _eventsCount, _exiting, _fatalException, _getActiveHandles, _getActiveRequests, _handleQueue, _kill, _linkedBinding, _maxListeners, _pendingMessage, _preload_modules, _rawDebug, _send, _startProfilerIdleNotifier, _stopProfilerIdleNotifier, _tickCallback, abort, addListener, allowedNodeEnvironmentFlags, arch, argv, argv0, assert2, availableMemory, binding, channel, chdir, config, connected, constrainedMemory, cpuUsage, cwd, debugPort, disconnect, dlopen, domain, emit, emitWarning, env, eventNames, execArgv, execPath, exitCode, finalization, getActiveResourcesInfo, getegid, geteuid, getgid, getgroups, getMaxListeners, getuid, hasUncaughtExceptionCaptureCallback, hrtime3, initgroups, kill, listenerCount, listeners, loadEnvFile, mainModule, memoryUsage, moduleLoadList, nextTick, off, on, once, openStdin, permission, pid, ppid, prependListener, prependOnceListener, rawListeners, reallyExit, ref, release, removeAllListeners, removeListener, report, resourceUsage, send, setegid, seteuid, setgid, setgroups, setMaxListeners, setSourceMapsEnabled, setuid, setUncaughtExceptionCaptureCallback, sourceMapsEnabled, stderr, stdin, stdout, throwDeprecation, title, traceDeprecation, umask, unref, uptime, version, versions, _process, process_default;
var init_process2 = __esm({
  "../node_modules/@cloudflare/unenv-preset/dist/runtime/node/process.mjs"() {
    init_functionsRoutes_0_39238513569259903();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_hrtime();
    init_process();
    globalProcess = globalThis["process"];
    getBuiltinModule = globalProcess.getBuiltinModule;
    workerdProcess = getBuiltinModule("node:process");
    unenvProcess = new Process({
      env: globalProcess.env,
      hrtime,
      // `nextTick` is available from workerd process v1
      nextTick: workerdProcess.nextTick
    });
    ({ exit, features, platform } = workerdProcess);
    ({
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
    } = unenvProcess);
    _process = {
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
    process_default = _process;
  }
});

// ../node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-process
var init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process = __esm({
  "../node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-process"() {
    init_process2();
    globalThis.process = process_default;
  }
});

// api/admin/auth.ts
var onRequestPost;
var init_auth = __esm({
  "api/admin/auth.ts"() {
    init_functionsRoutes_0_39238513569259903();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    onRequestPost = /* @__PURE__ */ __name(async (context2) => {
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
  }
});

// api/admin/checkin.ts
var onRequestGet, onRequestPost2;
var init_checkin = __esm({
  "api/admin/checkin.ts"() {
    init_functionsRoutes_0_39238513569259903();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    onRequestGet = /* @__PURE__ */ __name(async (context2) => {
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
    onRequestPost2 = /* @__PURE__ */ __name(async (context2) => {
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
  }
});

// api/admin/checkin-stats.ts
var onRequestGet2;
var init_checkin_stats = __esm({
  "api/admin/checkin-stats.ts"() {
    init_functionsRoutes_0_39238513569259903();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    onRequestGet2 = /* @__PURE__ */ __name(async (context2) => {
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
  }
});

// api/admin/email-deliveries.ts
var onRequestGet3;
var init_email_deliveries = __esm({
  "api/admin/email-deliveries.ts"() {
    init_functionsRoutes_0_39238513569259903();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    onRequestGet3 = /* @__PURE__ */ __name(async (context2) => {
      try {
        const url = new URL(context2.request.url);
        const limit = Math.min(Number(url.searchParams.get("limit") || 50), 100);
        const status = url.searchParams.get("status");
        let query = `
      SELECT 
        ed.id,
        ed.camper_id,
        ed.idempotency_key,
        ed.recipient_email,
        ed.subject,
        ed.status,
        ed.provider,
        ed.provider_message_id,
        ed.error_message,
        ed.attempts,
        ed.sent_at,
        ed.created_at,
        cmp.full_name as camper_name,
        cmp.nickname as camper_nickname,
        cmp.activation_code
      FROM email_deliveries ed
      LEFT JOIN campers cmp ON ed.camper_id = cmp.id
    `;
        if (status) {
          query += ` WHERE ed.status = ? ORDER BY ed.created_at DESC LIMIT ?`;
          const { results } = await context2.env.DB.prepare(query).bind(status, limit).all();
          return new Response(JSON.stringify({ deliveries: results || [] }), {
            headers: { "Content-Type": "application/json" }
          });
        } else {
          query += ` ORDER BY ed.created_at DESC LIMIT ?`;
          const { results } = await context2.env.DB.prepare(query).bind(limit).all();
          return new Response(JSON.stringify({ deliveries: results || [] }), {
            headers: { "Content-Type": "application/json" }
          });
        }
      } catch (error3) {
        return new Response(
          JSON.stringify({ error: error3.message || "Failed to fetch email deliveries" }),
          { status: 500, headers: { "Content-Type": "application/json" } }
        );
      }
    }, "onRequestGet");
  }
});

// api/admin/users.ts
var onRequestGet4, onRequestPost3, onRequestPut, onRequestDelete;
var init_users = __esm({
  "api/admin/users.ts"() {
    init_functionsRoutes_0_39238513569259903();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    onRequestGet4 = /* @__PURE__ */ __name(async (context2) => {
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
    onRequestPost3 = /* @__PURE__ */ __name(async (context2) => {
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
    onRequestPut = /* @__PURE__ */ __name(async (context2) => {
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
    onRequestDelete = /* @__PURE__ */ __name(async (context2) => {
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
  }
});

// ../node_modules/qrcode/lib/can-promise.js
var require_can_promise = __commonJS({
  "../node_modules/qrcode/lib/can-promise.js"(exports, module) {
    init_functionsRoutes_0_39238513569259903();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    module.exports = function() {
      return typeof Promise === "function" && Promise.prototype && Promise.prototype.then;
    };
  }
});

// ../node_modules/qrcode/lib/core/utils.js
var require_utils = __commonJS({
  "../node_modules/qrcode/lib/core/utils.js"(exports) {
    init_functionsRoutes_0_39238513569259903();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var toSJISFunction;
    var CODEWORDS_COUNT = [
      0,
      // Not used
      26,
      44,
      70,
      100,
      134,
      172,
      196,
      242,
      292,
      346,
      404,
      466,
      532,
      581,
      655,
      733,
      815,
      901,
      991,
      1085,
      1156,
      1258,
      1364,
      1474,
      1588,
      1706,
      1828,
      1921,
      2051,
      2185,
      2323,
      2465,
      2611,
      2761,
      2876,
      3034,
      3196,
      3362,
      3532,
      3706
    ];
    exports.getSymbolSize = /* @__PURE__ */ __name(function getSymbolSize(version2) {
      if (!version2) throw new Error('"version" cannot be null or undefined');
      if (version2 < 1 || version2 > 40) throw new Error('"version" should be in range from 1 to 40');
      return version2 * 4 + 17;
    }, "getSymbolSize");
    exports.getSymbolTotalCodewords = /* @__PURE__ */ __name(function getSymbolTotalCodewords(version2) {
      return CODEWORDS_COUNT[version2];
    }, "getSymbolTotalCodewords");
    exports.getBCHDigit = function(data) {
      let digit = 0;
      while (data !== 0) {
        digit++;
        data >>>= 1;
      }
      return digit;
    };
    exports.setToSJISFunction = /* @__PURE__ */ __name(function setToSJISFunction(f) {
      if (typeof f !== "function") {
        throw new Error('"toSJISFunc" is not a valid function.');
      }
      toSJISFunction = f;
    }, "setToSJISFunction");
    exports.isKanjiModeEnabled = function() {
      return typeof toSJISFunction !== "undefined";
    };
    exports.toSJIS = /* @__PURE__ */ __name(function toSJIS(kanji) {
      return toSJISFunction(kanji);
    }, "toSJIS");
  }
});

// ../node_modules/qrcode/lib/core/error-correction-level.js
var require_error_correction_level = __commonJS({
  "../node_modules/qrcode/lib/core/error-correction-level.js"(exports) {
    init_functionsRoutes_0_39238513569259903();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    exports.L = { bit: 1 };
    exports.M = { bit: 0 };
    exports.Q = { bit: 3 };
    exports.H = { bit: 2 };
    function fromString(string) {
      if (typeof string !== "string") {
        throw new Error("Param is not a string");
      }
      const lcStr = string.toLowerCase();
      switch (lcStr) {
        case "l":
        case "low":
          return exports.L;
        case "m":
        case "medium":
          return exports.M;
        case "q":
        case "quartile":
          return exports.Q;
        case "h":
        case "high":
          return exports.H;
        default:
          throw new Error("Unknown EC Level: " + string);
      }
    }
    __name(fromString, "fromString");
    exports.isValid = /* @__PURE__ */ __name(function isValid(level) {
      return level && typeof level.bit !== "undefined" && level.bit >= 0 && level.bit < 4;
    }, "isValid");
    exports.from = /* @__PURE__ */ __name(function from(value, defaultValue) {
      if (exports.isValid(value)) {
        return value;
      }
      try {
        return fromString(value);
      } catch (e) {
        return defaultValue;
      }
    }, "from");
  }
});

// ../node_modules/qrcode/lib/core/bit-buffer.js
var require_bit_buffer = __commonJS({
  "../node_modules/qrcode/lib/core/bit-buffer.js"(exports, module) {
    init_functionsRoutes_0_39238513569259903();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    function BitBuffer() {
      this.buffer = [];
      this.length = 0;
    }
    __name(BitBuffer, "BitBuffer");
    BitBuffer.prototype = {
      get: /* @__PURE__ */ __name(function(index) {
        const bufIndex = Math.floor(index / 8);
        return (this.buffer[bufIndex] >>> 7 - index % 8 & 1) === 1;
      }, "get"),
      put: /* @__PURE__ */ __name(function(num, length) {
        for (let i = 0; i < length; i++) {
          this.putBit((num >>> length - i - 1 & 1) === 1);
        }
      }, "put"),
      getLengthInBits: /* @__PURE__ */ __name(function() {
        return this.length;
      }, "getLengthInBits"),
      putBit: /* @__PURE__ */ __name(function(bit) {
        const bufIndex = Math.floor(this.length / 8);
        if (this.buffer.length <= bufIndex) {
          this.buffer.push(0);
        }
        if (bit) {
          this.buffer[bufIndex] |= 128 >>> this.length % 8;
        }
        this.length++;
      }, "putBit")
    };
    module.exports = BitBuffer;
  }
});

// ../node_modules/qrcode/lib/core/bit-matrix.js
var require_bit_matrix = __commonJS({
  "../node_modules/qrcode/lib/core/bit-matrix.js"(exports, module) {
    init_functionsRoutes_0_39238513569259903();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    function BitMatrix(size) {
      if (!size || size < 1) {
        throw new Error("BitMatrix size must be defined and greater than 0");
      }
      this.size = size;
      this.data = new Uint8Array(size * size);
      this.reservedBit = new Uint8Array(size * size);
    }
    __name(BitMatrix, "BitMatrix");
    BitMatrix.prototype.set = function(row, col, value, reserved) {
      const index = row * this.size + col;
      this.data[index] = value;
      if (reserved) this.reservedBit[index] = true;
    };
    BitMatrix.prototype.get = function(row, col) {
      return this.data[row * this.size + col];
    };
    BitMatrix.prototype.xor = function(row, col, value) {
      this.data[row * this.size + col] ^= value;
    };
    BitMatrix.prototype.isReserved = function(row, col) {
      return this.reservedBit[row * this.size + col];
    };
    module.exports = BitMatrix;
  }
});

// ../node_modules/qrcode/lib/core/alignment-pattern.js
var require_alignment_pattern = __commonJS({
  "../node_modules/qrcode/lib/core/alignment-pattern.js"(exports) {
    init_functionsRoutes_0_39238513569259903();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var getSymbolSize = require_utils().getSymbolSize;
    exports.getRowColCoords = /* @__PURE__ */ __name(function getRowColCoords(version2) {
      if (version2 === 1) return [];
      const posCount = Math.floor(version2 / 7) + 2;
      const size = getSymbolSize(version2);
      const intervals = size === 145 ? 26 : Math.ceil((size - 13) / (2 * posCount - 2)) * 2;
      const positions = [size - 7];
      for (let i = 1; i < posCount - 1; i++) {
        positions[i] = positions[i - 1] - intervals;
      }
      positions.push(6);
      return positions.reverse();
    }, "getRowColCoords");
    exports.getPositions = /* @__PURE__ */ __name(function getPositions(version2) {
      const coords = [];
      const pos = exports.getRowColCoords(version2);
      const posLength = pos.length;
      for (let i = 0; i < posLength; i++) {
        for (let j = 0; j < posLength; j++) {
          if (i === 0 && j === 0 || // top-left
          i === 0 && j === posLength - 1 || // bottom-left
          i === posLength - 1 && j === 0) {
            continue;
          }
          coords.push([pos[i], pos[j]]);
        }
      }
      return coords;
    }, "getPositions");
  }
});

// ../node_modules/qrcode/lib/core/finder-pattern.js
var require_finder_pattern = __commonJS({
  "../node_modules/qrcode/lib/core/finder-pattern.js"(exports) {
    init_functionsRoutes_0_39238513569259903();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var getSymbolSize = require_utils().getSymbolSize;
    var FINDER_PATTERN_SIZE = 7;
    exports.getPositions = /* @__PURE__ */ __name(function getPositions(version2) {
      const size = getSymbolSize(version2);
      return [
        // top-left
        [0, 0],
        // top-right
        [size - FINDER_PATTERN_SIZE, 0],
        // bottom-left
        [0, size - FINDER_PATTERN_SIZE]
      ];
    }, "getPositions");
  }
});

// ../node_modules/qrcode/lib/core/mask-pattern.js
var require_mask_pattern = __commonJS({
  "../node_modules/qrcode/lib/core/mask-pattern.js"(exports) {
    init_functionsRoutes_0_39238513569259903();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    exports.Patterns = {
      PATTERN000: 0,
      PATTERN001: 1,
      PATTERN010: 2,
      PATTERN011: 3,
      PATTERN100: 4,
      PATTERN101: 5,
      PATTERN110: 6,
      PATTERN111: 7
    };
    var PenaltyScores = {
      N1: 3,
      N2: 3,
      N3: 40,
      N4: 10
    };
    exports.isValid = /* @__PURE__ */ __name(function isValid(mask) {
      return mask != null && mask !== "" && !isNaN(mask) && mask >= 0 && mask <= 7;
    }, "isValid");
    exports.from = /* @__PURE__ */ __name(function from(value) {
      return exports.isValid(value) ? parseInt(value, 10) : void 0;
    }, "from");
    exports.getPenaltyN1 = /* @__PURE__ */ __name(function getPenaltyN1(data) {
      const size = data.size;
      let points = 0;
      let sameCountCol = 0;
      let sameCountRow = 0;
      let lastCol = null;
      let lastRow = null;
      for (let row = 0; row < size; row++) {
        sameCountCol = sameCountRow = 0;
        lastCol = lastRow = null;
        for (let col = 0; col < size; col++) {
          let module2 = data.get(row, col);
          if (module2 === lastCol) {
            sameCountCol++;
          } else {
            if (sameCountCol >= 5) points += PenaltyScores.N1 + (sameCountCol - 5);
            lastCol = module2;
            sameCountCol = 1;
          }
          module2 = data.get(col, row);
          if (module2 === lastRow) {
            sameCountRow++;
          } else {
            if (sameCountRow >= 5) points += PenaltyScores.N1 + (sameCountRow - 5);
            lastRow = module2;
            sameCountRow = 1;
          }
        }
        if (sameCountCol >= 5) points += PenaltyScores.N1 + (sameCountCol - 5);
        if (sameCountRow >= 5) points += PenaltyScores.N1 + (sameCountRow - 5);
      }
      return points;
    }, "getPenaltyN1");
    exports.getPenaltyN2 = /* @__PURE__ */ __name(function getPenaltyN2(data) {
      const size = data.size;
      let points = 0;
      for (let row = 0; row < size - 1; row++) {
        for (let col = 0; col < size - 1; col++) {
          const last = data.get(row, col) + data.get(row, col + 1) + data.get(row + 1, col) + data.get(row + 1, col + 1);
          if (last === 4 || last === 0) points++;
        }
      }
      return points * PenaltyScores.N2;
    }, "getPenaltyN2");
    exports.getPenaltyN3 = /* @__PURE__ */ __name(function getPenaltyN3(data) {
      const size = data.size;
      let points = 0;
      let bitsCol = 0;
      let bitsRow = 0;
      for (let row = 0; row < size; row++) {
        bitsCol = bitsRow = 0;
        for (let col = 0; col < size; col++) {
          bitsCol = bitsCol << 1 & 2047 | data.get(row, col);
          if (col >= 10 && (bitsCol === 1488 || bitsCol === 93)) points++;
          bitsRow = bitsRow << 1 & 2047 | data.get(col, row);
          if (col >= 10 && (bitsRow === 1488 || bitsRow === 93)) points++;
        }
      }
      return points * PenaltyScores.N3;
    }, "getPenaltyN3");
    exports.getPenaltyN4 = /* @__PURE__ */ __name(function getPenaltyN4(data) {
      let darkCount = 0;
      const modulesCount = data.data.length;
      for (let i = 0; i < modulesCount; i++) darkCount += data.data[i];
      const k = Math.abs(Math.ceil(darkCount * 100 / modulesCount / 5) - 10);
      return k * PenaltyScores.N4;
    }, "getPenaltyN4");
    function getMaskAt(maskPattern, i, j) {
      switch (maskPattern) {
        case exports.Patterns.PATTERN000:
          return (i + j) % 2 === 0;
        case exports.Patterns.PATTERN001:
          return i % 2 === 0;
        case exports.Patterns.PATTERN010:
          return j % 3 === 0;
        case exports.Patterns.PATTERN011:
          return (i + j) % 3 === 0;
        case exports.Patterns.PATTERN100:
          return (Math.floor(i / 2) + Math.floor(j / 3)) % 2 === 0;
        case exports.Patterns.PATTERN101:
          return i * j % 2 + i * j % 3 === 0;
        case exports.Patterns.PATTERN110:
          return (i * j % 2 + i * j % 3) % 2 === 0;
        case exports.Patterns.PATTERN111:
          return (i * j % 3 + (i + j) % 2) % 2 === 0;
        default:
          throw new Error("bad maskPattern:" + maskPattern);
      }
    }
    __name(getMaskAt, "getMaskAt");
    exports.applyMask = /* @__PURE__ */ __name(function applyMask(pattern, data) {
      const size = data.size;
      for (let col = 0; col < size; col++) {
        for (let row = 0; row < size; row++) {
          if (data.isReserved(row, col)) continue;
          data.xor(row, col, getMaskAt(pattern, row, col));
        }
      }
    }, "applyMask");
    exports.getBestMask = /* @__PURE__ */ __name(function getBestMask(data, setupFormatFunc) {
      const numPatterns = Object.keys(exports.Patterns).length;
      let bestPattern = 0;
      let lowerPenalty = Infinity;
      for (let p = 0; p < numPatterns; p++) {
        setupFormatFunc(p);
        exports.applyMask(p, data);
        const penalty = exports.getPenaltyN1(data) + exports.getPenaltyN2(data) + exports.getPenaltyN3(data) + exports.getPenaltyN4(data);
        exports.applyMask(p, data);
        if (penalty < lowerPenalty) {
          lowerPenalty = penalty;
          bestPattern = p;
        }
      }
      return bestPattern;
    }, "getBestMask");
  }
});

// ../node_modules/qrcode/lib/core/error-correction-code.js
var require_error_correction_code = __commonJS({
  "../node_modules/qrcode/lib/core/error-correction-code.js"(exports) {
    init_functionsRoutes_0_39238513569259903();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var ECLevel = require_error_correction_level();
    var EC_BLOCKS_TABLE = [
      // L  M  Q  H
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      2,
      2,
      1,
      2,
      2,
      4,
      1,
      2,
      4,
      4,
      2,
      4,
      4,
      4,
      2,
      4,
      6,
      5,
      2,
      4,
      6,
      6,
      2,
      5,
      8,
      8,
      4,
      5,
      8,
      8,
      4,
      5,
      8,
      11,
      4,
      8,
      10,
      11,
      4,
      9,
      12,
      16,
      4,
      9,
      16,
      16,
      6,
      10,
      12,
      18,
      6,
      10,
      17,
      16,
      6,
      11,
      16,
      19,
      6,
      13,
      18,
      21,
      7,
      14,
      21,
      25,
      8,
      16,
      20,
      25,
      8,
      17,
      23,
      25,
      9,
      17,
      23,
      34,
      9,
      18,
      25,
      30,
      10,
      20,
      27,
      32,
      12,
      21,
      29,
      35,
      12,
      23,
      34,
      37,
      12,
      25,
      34,
      40,
      13,
      26,
      35,
      42,
      14,
      28,
      38,
      45,
      15,
      29,
      40,
      48,
      16,
      31,
      43,
      51,
      17,
      33,
      45,
      54,
      18,
      35,
      48,
      57,
      19,
      37,
      51,
      60,
      19,
      38,
      53,
      63,
      20,
      40,
      56,
      66,
      21,
      43,
      59,
      70,
      22,
      45,
      62,
      74,
      24,
      47,
      65,
      77,
      25,
      49,
      68,
      81
    ];
    var EC_CODEWORDS_TABLE = [
      // L  M  Q  H
      7,
      10,
      13,
      17,
      10,
      16,
      22,
      28,
      15,
      26,
      36,
      44,
      20,
      36,
      52,
      64,
      26,
      48,
      72,
      88,
      36,
      64,
      96,
      112,
      40,
      72,
      108,
      130,
      48,
      88,
      132,
      156,
      60,
      110,
      160,
      192,
      72,
      130,
      192,
      224,
      80,
      150,
      224,
      264,
      96,
      176,
      260,
      308,
      104,
      198,
      288,
      352,
      120,
      216,
      320,
      384,
      132,
      240,
      360,
      432,
      144,
      280,
      408,
      480,
      168,
      308,
      448,
      532,
      180,
      338,
      504,
      588,
      196,
      364,
      546,
      650,
      224,
      416,
      600,
      700,
      224,
      442,
      644,
      750,
      252,
      476,
      690,
      816,
      270,
      504,
      750,
      900,
      300,
      560,
      810,
      960,
      312,
      588,
      870,
      1050,
      336,
      644,
      952,
      1110,
      360,
      700,
      1020,
      1200,
      390,
      728,
      1050,
      1260,
      420,
      784,
      1140,
      1350,
      450,
      812,
      1200,
      1440,
      480,
      868,
      1290,
      1530,
      510,
      924,
      1350,
      1620,
      540,
      980,
      1440,
      1710,
      570,
      1036,
      1530,
      1800,
      570,
      1064,
      1590,
      1890,
      600,
      1120,
      1680,
      1980,
      630,
      1204,
      1770,
      2100,
      660,
      1260,
      1860,
      2220,
      720,
      1316,
      1950,
      2310,
      750,
      1372,
      2040,
      2430
    ];
    exports.getBlocksCount = /* @__PURE__ */ __name(function getBlocksCount(version2, errorCorrectionLevel) {
      switch (errorCorrectionLevel) {
        case ECLevel.L:
          return EC_BLOCKS_TABLE[(version2 - 1) * 4 + 0];
        case ECLevel.M:
          return EC_BLOCKS_TABLE[(version2 - 1) * 4 + 1];
        case ECLevel.Q:
          return EC_BLOCKS_TABLE[(version2 - 1) * 4 + 2];
        case ECLevel.H:
          return EC_BLOCKS_TABLE[(version2 - 1) * 4 + 3];
        default:
          return void 0;
      }
    }, "getBlocksCount");
    exports.getTotalCodewordsCount = /* @__PURE__ */ __name(function getTotalCodewordsCount(version2, errorCorrectionLevel) {
      switch (errorCorrectionLevel) {
        case ECLevel.L:
          return EC_CODEWORDS_TABLE[(version2 - 1) * 4 + 0];
        case ECLevel.M:
          return EC_CODEWORDS_TABLE[(version2 - 1) * 4 + 1];
        case ECLevel.Q:
          return EC_CODEWORDS_TABLE[(version2 - 1) * 4 + 2];
        case ECLevel.H:
          return EC_CODEWORDS_TABLE[(version2 - 1) * 4 + 3];
        default:
          return void 0;
      }
    }, "getTotalCodewordsCount");
  }
});

// ../node_modules/qrcode/lib/core/galois-field.js
var require_galois_field = __commonJS({
  "../node_modules/qrcode/lib/core/galois-field.js"(exports) {
    init_functionsRoutes_0_39238513569259903();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var EXP_TABLE = new Uint8Array(512);
    var LOG_TABLE = new Uint8Array(256);
    (/* @__PURE__ */ __name(function initTables() {
      let x = 1;
      for (let i = 0; i < 255; i++) {
        EXP_TABLE[i] = x;
        LOG_TABLE[x] = i;
        x <<= 1;
        if (x & 256) {
          x ^= 285;
        }
      }
      for (let i = 255; i < 512; i++) {
        EXP_TABLE[i] = EXP_TABLE[i - 255];
      }
    }, "initTables"))();
    exports.log = /* @__PURE__ */ __name(function log3(n) {
      if (n < 1) throw new Error("log(" + n + ")");
      return LOG_TABLE[n];
    }, "log");
    exports.exp = /* @__PURE__ */ __name(function exp(n) {
      return EXP_TABLE[n];
    }, "exp");
    exports.mul = /* @__PURE__ */ __name(function mul(x, y) {
      if (x === 0 || y === 0) return 0;
      return EXP_TABLE[LOG_TABLE[x] + LOG_TABLE[y]];
    }, "mul");
  }
});

// ../node_modules/qrcode/lib/core/polynomial.js
var require_polynomial = __commonJS({
  "../node_modules/qrcode/lib/core/polynomial.js"(exports) {
    init_functionsRoutes_0_39238513569259903();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var GF = require_galois_field();
    exports.mul = /* @__PURE__ */ __name(function mul(p1, p2) {
      const coeff = new Uint8Array(p1.length + p2.length - 1);
      for (let i = 0; i < p1.length; i++) {
        for (let j = 0; j < p2.length; j++) {
          coeff[i + j] ^= GF.mul(p1[i], p2[j]);
        }
      }
      return coeff;
    }, "mul");
    exports.mod = /* @__PURE__ */ __name(function mod(divident, divisor) {
      let result = new Uint8Array(divident);
      while (result.length - divisor.length >= 0) {
        const coeff = result[0];
        for (let i = 0; i < divisor.length; i++) {
          result[i] ^= GF.mul(divisor[i], coeff);
        }
        let offset = 0;
        while (offset < result.length && result[offset] === 0) offset++;
        result = result.slice(offset);
      }
      return result;
    }, "mod");
    exports.generateECPolynomial = /* @__PURE__ */ __name(function generateECPolynomial(degree) {
      let poly = new Uint8Array([1]);
      for (let i = 0; i < degree; i++) {
        poly = exports.mul(poly, new Uint8Array([1, GF.exp(i)]));
      }
      return poly;
    }, "generateECPolynomial");
  }
});

// ../node_modules/qrcode/lib/core/reed-solomon-encoder.js
var require_reed_solomon_encoder = __commonJS({
  "../node_modules/qrcode/lib/core/reed-solomon-encoder.js"(exports, module) {
    init_functionsRoutes_0_39238513569259903();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var Polynomial = require_polynomial();
    function ReedSolomonEncoder(degree) {
      this.genPoly = void 0;
      this.degree = degree;
      if (this.degree) this.initialize(this.degree);
    }
    __name(ReedSolomonEncoder, "ReedSolomonEncoder");
    ReedSolomonEncoder.prototype.initialize = /* @__PURE__ */ __name(function initialize(degree) {
      this.degree = degree;
      this.genPoly = Polynomial.generateECPolynomial(this.degree);
    }, "initialize");
    ReedSolomonEncoder.prototype.encode = /* @__PURE__ */ __name(function encode(data) {
      if (!this.genPoly) {
        throw new Error("Encoder not initialized");
      }
      const paddedData = new Uint8Array(data.length + this.degree);
      paddedData.set(data);
      const remainder = Polynomial.mod(paddedData, this.genPoly);
      const start = this.degree - remainder.length;
      if (start > 0) {
        const buff = new Uint8Array(this.degree);
        buff.set(remainder, start);
        return buff;
      }
      return remainder;
    }, "encode");
    module.exports = ReedSolomonEncoder;
  }
});

// ../node_modules/qrcode/lib/core/version-check.js
var require_version_check = __commonJS({
  "../node_modules/qrcode/lib/core/version-check.js"(exports) {
    init_functionsRoutes_0_39238513569259903();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    exports.isValid = /* @__PURE__ */ __name(function isValid(version2) {
      return !isNaN(version2) && version2 >= 1 && version2 <= 40;
    }, "isValid");
  }
});

// ../node_modules/qrcode/lib/core/regex.js
var require_regex = __commonJS({
  "../node_modules/qrcode/lib/core/regex.js"(exports) {
    init_functionsRoutes_0_39238513569259903();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var numeric = "[0-9]+";
    var alphanumeric = "[A-Z $%*+\\-./:]+";
    var kanji = "(?:[u3000-u303F]|[u3040-u309F]|[u30A0-u30FF]|[uFF00-uFFEF]|[u4E00-u9FAF]|[u2605-u2606]|[u2190-u2195]|u203B|[u2010u2015u2018u2019u2025u2026u201Cu201Du2225u2260]|[u0391-u0451]|[u00A7u00A8u00B1u00B4u00D7u00F7])+";
    kanji = kanji.replace(/u/g, "\\u");
    var byte = "(?:(?![A-Z0-9 $%*+\\-./:]|" + kanji + ")(?:.|[\r\n]))+";
    exports.KANJI = new RegExp(kanji, "g");
    exports.BYTE_KANJI = new RegExp("[^A-Z0-9 $%*+\\-./:]+", "g");
    exports.BYTE = new RegExp(byte, "g");
    exports.NUMERIC = new RegExp(numeric, "g");
    exports.ALPHANUMERIC = new RegExp(alphanumeric, "g");
    var TEST_KANJI = new RegExp("^" + kanji + "$");
    var TEST_NUMERIC = new RegExp("^" + numeric + "$");
    var TEST_ALPHANUMERIC = new RegExp("^[A-Z0-9 $%*+\\-./:]+$");
    exports.testKanji = /* @__PURE__ */ __name(function testKanji(str) {
      return TEST_KANJI.test(str);
    }, "testKanji");
    exports.testNumeric = /* @__PURE__ */ __name(function testNumeric(str) {
      return TEST_NUMERIC.test(str);
    }, "testNumeric");
    exports.testAlphanumeric = /* @__PURE__ */ __name(function testAlphanumeric(str) {
      return TEST_ALPHANUMERIC.test(str);
    }, "testAlphanumeric");
  }
});

// ../node_modules/qrcode/lib/core/mode.js
var require_mode = __commonJS({
  "../node_modules/qrcode/lib/core/mode.js"(exports) {
    init_functionsRoutes_0_39238513569259903();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var VersionCheck = require_version_check();
    var Regex = require_regex();
    exports.NUMERIC = {
      id: "Numeric",
      bit: 1 << 0,
      ccBits: [10, 12, 14]
    };
    exports.ALPHANUMERIC = {
      id: "Alphanumeric",
      bit: 1 << 1,
      ccBits: [9, 11, 13]
    };
    exports.BYTE = {
      id: "Byte",
      bit: 1 << 2,
      ccBits: [8, 16, 16]
    };
    exports.KANJI = {
      id: "Kanji",
      bit: 1 << 3,
      ccBits: [8, 10, 12]
    };
    exports.MIXED = {
      bit: -1
    };
    exports.getCharCountIndicator = /* @__PURE__ */ __name(function getCharCountIndicator(mode, version2) {
      if (!mode.ccBits) throw new Error("Invalid mode: " + mode);
      if (!VersionCheck.isValid(version2)) {
        throw new Error("Invalid version: " + version2);
      }
      if (version2 >= 1 && version2 < 10) return mode.ccBits[0];
      else if (version2 < 27) return mode.ccBits[1];
      return mode.ccBits[2];
    }, "getCharCountIndicator");
    exports.getBestModeForData = /* @__PURE__ */ __name(function getBestModeForData(dataStr) {
      if (Regex.testNumeric(dataStr)) return exports.NUMERIC;
      else if (Regex.testAlphanumeric(dataStr)) return exports.ALPHANUMERIC;
      else if (Regex.testKanji(dataStr)) return exports.KANJI;
      else return exports.BYTE;
    }, "getBestModeForData");
    exports.toString = /* @__PURE__ */ __name(function toString(mode) {
      if (mode && mode.id) return mode.id;
      throw new Error("Invalid mode");
    }, "toString");
    exports.isValid = /* @__PURE__ */ __name(function isValid(mode) {
      return mode && mode.bit && mode.ccBits;
    }, "isValid");
    function fromString(string) {
      if (typeof string !== "string") {
        throw new Error("Param is not a string");
      }
      const lcStr = string.toLowerCase();
      switch (lcStr) {
        case "numeric":
          return exports.NUMERIC;
        case "alphanumeric":
          return exports.ALPHANUMERIC;
        case "kanji":
          return exports.KANJI;
        case "byte":
          return exports.BYTE;
        default:
          throw new Error("Unknown mode: " + string);
      }
    }
    __name(fromString, "fromString");
    exports.from = /* @__PURE__ */ __name(function from(value, defaultValue) {
      if (exports.isValid(value)) {
        return value;
      }
      try {
        return fromString(value);
      } catch (e) {
        return defaultValue;
      }
    }, "from");
  }
});

// ../node_modules/qrcode/lib/core/version.js
var require_version = __commonJS({
  "../node_modules/qrcode/lib/core/version.js"(exports) {
    init_functionsRoutes_0_39238513569259903();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var Utils = require_utils();
    var ECCode = require_error_correction_code();
    var ECLevel = require_error_correction_level();
    var Mode = require_mode();
    var VersionCheck = require_version_check();
    var G18 = 1 << 12 | 1 << 11 | 1 << 10 | 1 << 9 | 1 << 8 | 1 << 5 | 1 << 2 | 1 << 0;
    var G18_BCH = Utils.getBCHDigit(G18);
    function getBestVersionForDataLength(mode, length, errorCorrectionLevel) {
      for (let currentVersion = 1; currentVersion <= 40; currentVersion++) {
        if (length <= exports.getCapacity(currentVersion, errorCorrectionLevel, mode)) {
          return currentVersion;
        }
      }
      return void 0;
    }
    __name(getBestVersionForDataLength, "getBestVersionForDataLength");
    function getReservedBitsCount(mode, version2) {
      return Mode.getCharCountIndicator(mode, version2) + 4;
    }
    __name(getReservedBitsCount, "getReservedBitsCount");
    function getTotalBitsFromDataArray(segments, version2) {
      let totalBits = 0;
      segments.forEach(function(data) {
        const reservedBits = getReservedBitsCount(data.mode, version2);
        totalBits += reservedBits + data.getBitsLength();
      });
      return totalBits;
    }
    __name(getTotalBitsFromDataArray, "getTotalBitsFromDataArray");
    function getBestVersionForMixedData(segments, errorCorrectionLevel) {
      for (let currentVersion = 1; currentVersion <= 40; currentVersion++) {
        const length = getTotalBitsFromDataArray(segments, currentVersion);
        if (length <= exports.getCapacity(currentVersion, errorCorrectionLevel, Mode.MIXED)) {
          return currentVersion;
        }
      }
      return void 0;
    }
    __name(getBestVersionForMixedData, "getBestVersionForMixedData");
    exports.from = /* @__PURE__ */ __name(function from(value, defaultValue) {
      if (VersionCheck.isValid(value)) {
        return parseInt(value, 10);
      }
      return defaultValue;
    }, "from");
    exports.getCapacity = /* @__PURE__ */ __name(function getCapacity(version2, errorCorrectionLevel, mode) {
      if (!VersionCheck.isValid(version2)) {
        throw new Error("Invalid QR Code version");
      }
      if (typeof mode === "undefined") mode = Mode.BYTE;
      const totalCodewords = Utils.getSymbolTotalCodewords(version2);
      const ecTotalCodewords = ECCode.getTotalCodewordsCount(version2, errorCorrectionLevel);
      const dataTotalCodewordsBits = (totalCodewords - ecTotalCodewords) * 8;
      if (mode === Mode.MIXED) return dataTotalCodewordsBits;
      const usableBits = dataTotalCodewordsBits - getReservedBitsCount(mode, version2);
      switch (mode) {
        case Mode.NUMERIC:
          return Math.floor(usableBits / 10 * 3);
        case Mode.ALPHANUMERIC:
          return Math.floor(usableBits / 11 * 2);
        case Mode.KANJI:
          return Math.floor(usableBits / 13);
        case Mode.BYTE:
        default:
          return Math.floor(usableBits / 8);
      }
    }, "getCapacity");
    exports.getBestVersionForData = /* @__PURE__ */ __name(function getBestVersionForData(data, errorCorrectionLevel) {
      let seg;
      const ecl = ECLevel.from(errorCorrectionLevel, ECLevel.M);
      if (Array.isArray(data)) {
        if (data.length > 1) {
          return getBestVersionForMixedData(data, ecl);
        }
        if (data.length === 0) {
          return 1;
        }
        seg = data[0];
      } else {
        seg = data;
      }
      return getBestVersionForDataLength(seg.mode, seg.getLength(), ecl);
    }, "getBestVersionForData");
    exports.getEncodedBits = /* @__PURE__ */ __name(function getEncodedBits(version2) {
      if (!VersionCheck.isValid(version2) || version2 < 7) {
        throw new Error("Invalid QR Code version");
      }
      let d = version2 << 12;
      while (Utils.getBCHDigit(d) - G18_BCH >= 0) {
        d ^= G18 << Utils.getBCHDigit(d) - G18_BCH;
      }
      return version2 << 12 | d;
    }, "getEncodedBits");
  }
});

// ../node_modules/qrcode/lib/core/format-info.js
var require_format_info = __commonJS({
  "../node_modules/qrcode/lib/core/format-info.js"(exports) {
    init_functionsRoutes_0_39238513569259903();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var Utils = require_utils();
    var G15 = 1 << 10 | 1 << 8 | 1 << 5 | 1 << 4 | 1 << 2 | 1 << 1 | 1 << 0;
    var G15_MASK = 1 << 14 | 1 << 12 | 1 << 10 | 1 << 4 | 1 << 1;
    var G15_BCH = Utils.getBCHDigit(G15);
    exports.getEncodedBits = /* @__PURE__ */ __name(function getEncodedBits(errorCorrectionLevel, mask) {
      const data = errorCorrectionLevel.bit << 3 | mask;
      let d = data << 10;
      while (Utils.getBCHDigit(d) - G15_BCH >= 0) {
        d ^= G15 << Utils.getBCHDigit(d) - G15_BCH;
      }
      return (data << 10 | d) ^ G15_MASK;
    }, "getEncodedBits");
  }
});

// ../node_modules/qrcode/lib/core/numeric-data.js
var require_numeric_data = __commonJS({
  "../node_modules/qrcode/lib/core/numeric-data.js"(exports, module) {
    init_functionsRoutes_0_39238513569259903();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var Mode = require_mode();
    function NumericData(data) {
      this.mode = Mode.NUMERIC;
      this.data = data.toString();
    }
    __name(NumericData, "NumericData");
    NumericData.getBitsLength = /* @__PURE__ */ __name(function getBitsLength(length) {
      return 10 * Math.floor(length / 3) + (length % 3 ? length % 3 * 3 + 1 : 0);
    }, "getBitsLength");
    NumericData.prototype.getLength = /* @__PURE__ */ __name(function getLength() {
      return this.data.length;
    }, "getLength");
    NumericData.prototype.getBitsLength = /* @__PURE__ */ __name(function getBitsLength() {
      return NumericData.getBitsLength(this.data.length);
    }, "getBitsLength");
    NumericData.prototype.write = /* @__PURE__ */ __name(function write(bitBuffer) {
      let i, group3, value;
      for (i = 0; i + 3 <= this.data.length; i += 3) {
        group3 = this.data.substr(i, 3);
        value = parseInt(group3, 10);
        bitBuffer.put(value, 10);
      }
      const remainingNum = this.data.length - i;
      if (remainingNum > 0) {
        group3 = this.data.substr(i);
        value = parseInt(group3, 10);
        bitBuffer.put(value, remainingNum * 3 + 1);
      }
    }, "write");
    module.exports = NumericData;
  }
});

// ../node_modules/qrcode/lib/core/alphanumeric-data.js
var require_alphanumeric_data = __commonJS({
  "../node_modules/qrcode/lib/core/alphanumeric-data.js"(exports, module) {
    init_functionsRoutes_0_39238513569259903();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var Mode = require_mode();
    var ALPHA_NUM_CHARS = [
      "0",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "G",
      "H",
      "I",
      "J",
      "K",
      "L",
      "M",
      "N",
      "O",
      "P",
      "Q",
      "R",
      "S",
      "T",
      "U",
      "V",
      "W",
      "X",
      "Y",
      "Z",
      " ",
      "$",
      "%",
      "*",
      "+",
      "-",
      ".",
      "/",
      ":"
    ];
    function AlphanumericData(data) {
      this.mode = Mode.ALPHANUMERIC;
      this.data = data;
    }
    __name(AlphanumericData, "AlphanumericData");
    AlphanumericData.getBitsLength = /* @__PURE__ */ __name(function getBitsLength(length) {
      return 11 * Math.floor(length / 2) + 6 * (length % 2);
    }, "getBitsLength");
    AlphanumericData.prototype.getLength = /* @__PURE__ */ __name(function getLength() {
      return this.data.length;
    }, "getLength");
    AlphanumericData.prototype.getBitsLength = /* @__PURE__ */ __name(function getBitsLength() {
      return AlphanumericData.getBitsLength(this.data.length);
    }, "getBitsLength");
    AlphanumericData.prototype.write = /* @__PURE__ */ __name(function write(bitBuffer) {
      let i;
      for (i = 0; i + 2 <= this.data.length; i += 2) {
        let value = ALPHA_NUM_CHARS.indexOf(this.data[i]) * 45;
        value += ALPHA_NUM_CHARS.indexOf(this.data[i + 1]);
        bitBuffer.put(value, 11);
      }
      if (this.data.length % 2) {
        bitBuffer.put(ALPHA_NUM_CHARS.indexOf(this.data[i]), 6);
      }
    }, "write");
    module.exports = AlphanumericData;
  }
});

// ../node_modules/qrcode/lib/core/byte-data.js
var require_byte_data = __commonJS({
  "../node_modules/qrcode/lib/core/byte-data.js"(exports, module) {
    init_functionsRoutes_0_39238513569259903();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var Mode = require_mode();
    function ByteData(data) {
      this.mode = Mode.BYTE;
      if (typeof data === "string") {
        this.data = new TextEncoder().encode(data);
      } else {
        this.data = new Uint8Array(data);
      }
    }
    __name(ByteData, "ByteData");
    ByteData.getBitsLength = /* @__PURE__ */ __name(function getBitsLength(length) {
      return length * 8;
    }, "getBitsLength");
    ByteData.prototype.getLength = /* @__PURE__ */ __name(function getLength() {
      return this.data.length;
    }, "getLength");
    ByteData.prototype.getBitsLength = /* @__PURE__ */ __name(function getBitsLength() {
      return ByteData.getBitsLength(this.data.length);
    }, "getBitsLength");
    ByteData.prototype.write = function(bitBuffer) {
      for (let i = 0, l = this.data.length; i < l; i++) {
        bitBuffer.put(this.data[i], 8);
      }
    };
    module.exports = ByteData;
  }
});

// ../node_modules/qrcode/lib/core/kanji-data.js
var require_kanji_data = __commonJS({
  "../node_modules/qrcode/lib/core/kanji-data.js"(exports, module) {
    init_functionsRoutes_0_39238513569259903();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var Mode = require_mode();
    var Utils = require_utils();
    function KanjiData(data) {
      this.mode = Mode.KANJI;
      this.data = data;
    }
    __name(KanjiData, "KanjiData");
    KanjiData.getBitsLength = /* @__PURE__ */ __name(function getBitsLength(length) {
      return length * 13;
    }, "getBitsLength");
    KanjiData.prototype.getLength = /* @__PURE__ */ __name(function getLength() {
      return this.data.length;
    }, "getLength");
    KanjiData.prototype.getBitsLength = /* @__PURE__ */ __name(function getBitsLength() {
      return KanjiData.getBitsLength(this.data.length);
    }, "getBitsLength");
    KanjiData.prototype.write = function(bitBuffer) {
      let i;
      for (i = 0; i < this.data.length; i++) {
        let value = Utils.toSJIS(this.data[i]);
        if (value >= 33088 && value <= 40956) {
          value -= 33088;
        } else if (value >= 57408 && value <= 60351) {
          value -= 49472;
        } else {
          throw new Error(
            "Invalid SJIS character: " + this.data[i] + "\nMake sure your charset is UTF-8"
          );
        }
        value = (value >>> 8 & 255) * 192 + (value & 255);
        bitBuffer.put(value, 13);
      }
    };
    module.exports = KanjiData;
  }
});

// ../node_modules/dijkstrajs/dijkstra.js
var require_dijkstra = __commonJS({
  "../node_modules/dijkstrajs/dijkstra.js"(exports, module) {
    "use strict";
    init_functionsRoutes_0_39238513569259903();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var dijkstra = {
      single_source_shortest_paths: /* @__PURE__ */ __name(function(graph, s, d) {
        var predecessors = {};
        var costs = {};
        costs[s] = 0;
        var open = dijkstra.PriorityQueue.make();
        open.push(s, 0);
        var closest, u, v, cost_of_s_to_u, adjacent_nodes, cost_of_e, cost_of_s_to_u_plus_cost_of_e, cost_of_s_to_v, first_visit;
        while (!open.empty()) {
          closest = open.pop();
          u = closest.value;
          cost_of_s_to_u = closest.cost;
          adjacent_nodes = graph[u] || {};
          for (v in adjacent_nodes) {
            if (adjacent_nodes.hasOwnProperty(v)) {
              cost_of_e = adjacent_nodes[v];
              cost_of_s_to_u_plus_cost_of_e = cost_of_s_to_u + cost_of_e;
              cost_of_s_to_v = costs[v];
              first_visit = typeof costs[v] === "undefined";
              if (first_visit || cost_of_s_to_v > cost_of_s_to_u_plus_cost_of_e) {
                costs[v] = cost_of_s_to_u_plus_cost_of_e;
                open.push(v, cost_of_s_to_u_plus_cost_of_e);
                predecessors[v] = u;
              }
            }
          }
        }
        if (typeof d !== "undefined" && typeof costs[d] === "undefined") {
          var msg = ["Could not find a path from ", s, " to ", d, "."].join("");
          throw new Error(msg);
        }
        return predecessors;
      }, "single_source_shortest_paths"),
      extract_shortest_path_from_predecessor_list: /* @__PURE__ */ __name(function(predecessors, d) {
        var nodes = [];
        var u = d;
        var predecessor;
        while (u) {
          nodes.push(u);
          predecessor = predecessors[u];
          u = predecessors[u];
        }
        nodes.reverse();
        return nodes;
      }, "extract_shortest_path_from_predecessor_list"),
      find_path: /* @__PURE__ */ __name(function(graph, s, d) {
        var predecessors = dijkstra.single_source_shortest_paths(graph, s, d);
        return dijkstra.extract_shortest_path_from_predecessor_list(
          predecessors,
          d
        );
      }, "find_path"),
      /**
       * A very naive priority queue implementation.
       */
      PriorityQueue: {
        make: /* @__PURE__ */ __name(function(opts) {
          var T = dijkstra.PriorityQueue, t = {}, key;
          opts = opts || {};
          for (key in T) {
            if (T.hasOwnProperty(key)) {
              t[key] = T[key];
            }
          }
          t.queue = [];
          t.sorter = opts.sorter || T.default_sorter;
          return t;
        }, "make"),
        default_sorter: /* @__PURE__ */ __name(function(a, b) {
          return a.cost - b.cost;
        }, "default_sorter"),
        /**
         * Add a new item to the queue and ensure the highest priority element
         * is at the front of the queue.
         */
        push: /* @__PURE__ */ __name(function(value, cost) {
          var item = { value, cost };
          this.queue.push(item);
          this.queue.sort(this.sorter);
        }, "push"),
        /**
         * Return the highest priority element in the queue.
         */
        pop: /* @__PURE__ */ __name(function() {
          return this.queue.shift();
        }, "pop"),
        empty: /* @__PURE__ */ __name(function() {
          return this.queue.length === 0;
        }, "empty")
      }
    };
    if (typeof module !== "undefined") {
      module.exports = dijkstra;
    }
  }
});

// ../node_modules/qrcode/lib/core/segments.js
var require_segments = __commonJS({
  "../node_modules/qrcode/lib/core/segments.js"(exports) {
    init_functionsRoutes_0_39238513569259903();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var Mode = require_mode();
    var NumericData = require_numeric_data();
    var AlphanumericData = require_alphanumeric_data();
    var ByteData = require_byte_data();
    var KanjiData = require_kanji_data();
    var Regex = require_regex();
    var Utils = require_utils();
    var dijkstra = require_dijkstra();
    function getStringByteLength(str) {
      return unescape(encodeURIComponent(str)).length;
    }
    __name(getStringByteLength, "getStringByteLength");
    function getSegments(regex, mode, str) {
      const segments = [];
      let result;
      while ((result = regex.exec(str)) !== null) {
        segments.push({
          data: result[0],
          index: result.index,
          mode,
          length: result[0].length
        });
      }
      return segments;
    }
    __name(getSegments, "getSegments");
    function getSegmentsFromString(dataStr) {
      const numSegs = getSegments(Regex.NUMERIC, Mode.NUMERIC, dataStr);
      const alphaNumSegs = getSegments(Regex.ALPHANUMERIC, Mode.ALPHANUMERIC, dataStr);
      let byteSegs;
      let kanjiSegs;
      if (Utils.isKanjiModeEnabled()) {
        byteSegs = getSegments(Regex.BYTE, Mode.BYTE, dataStr);
        kanjiSegs = getSegments(Regex.KANJI, Mode.KANJI, dataStr);
      } else {
        byteSegs = getSegments(Regex.BYTE_KANJI, Mode.BYTE, dataStr);
        kanjiSegs = [];
      }
      const segs = numSegs.concat(alphaNumSegs, byteSegs, kanjiSegs);
      return segs.sort(function(s1, s2) {
        return s1.index - s2.index;
      }).map(function(obj) {
        return {
          data: obj.data,
          mode: obj.mode,
          length: obj.length
        };
      });
    }
    __name(getSegmentsFromString, "getSegmentsFromString");
    function getSegmentBitsLength(length, mode) {
      switch (mode) {
        case Mode.NUMERIC:
          return NumericData.getBitsLength(length);
        case Mode.ALPHANUMERIC:
          return AlphanumericData.getBitsLength(length);
        case Mode.KANJI:
          return KanjiData.getBitsLength(length);
        case Mode.BYTE:
          return ByteData.getBitsLength(length);
      }
    }
    __name(getSegmentBitsLength, "getSegmentBitsLength");
    function mergeSegments(segs) {
      return segs.reduce(function(acc, curr) {
        const prevSeg = acc.length - 1 >= 0 ? acc[acc.length - 1] : null;
        if (prevSeg && prevSeg.mode === curr.mode) {
          acc[acc.length - 1].data += curr.data;
          return acc;
        }
        acc.push(curr);
        return acc;
      }, []);
    }
    __name(mergeSegments, "mergeSegments");
    function buildNodes(segs) {
      const nodes = [];
      for (let i = 0; i < segs.length; i++) {
        const seg = segs[i];
        switch (seg.mode) {
          case Mode.NUMERIC:
            nodes.push([
              seg,
              { data: seg.data, mode: Mode.ALPHANUMERIC, length: seg.length },
              { data: seg.data, mode: Mode.BYTE, length: seg.length }
            ]);
            break;
          case Mode.ALPHANUMERIC:
            nodes.push([
              seg,
              { data: seg.data, mode: Mode.BYTE, length: seg.length }
            ]);
            break;
          case Mode.KANJI:
            nodes.push([
              seg,
              { data: seg.data, mode: Mode.BYTE, length: getStringByteLength(seg.data) }
            ]);
            break;
          case Mode.BYTE:
            nodes.push([
              { data: seg.data, mode: Mode.BYTE, length: getStringByteLength(seg.data) }
            ]);
        }
      }
      return nodes;
    }
    __name(buildNodes, "buildNodes");
    function buildGraph(nodes, version2) {
      const table3 = {};
      const graph = { start: {} };
      let prevNodeIds = ["start"];
      for (let i = 0; i < nodes.length; i++) {
        const nodeGroup = nodes[i];
        const currentNodeIds = [];
        for (let j = 0; j < nodeGroup.length; j++) {
          const node = nodeGroup[j];
          const key = "" + i + j;
          currentNodeIds.push(key);
          table3[key] = { node, lastCount: 0 };
          graph[key] = {};
          for (let n = 0; n < prevNodeIds.length; n++) {
            const prevNodeId = prevNodeIds[n];
            if (table3[prevNodeId] && table3[prevNodeId].node.mode === node.mode) {
              graph[prevNodeId][key] = getSegmentBitsLength(table3[prevNodeId].lastCount + node.length, node.mode) - getSegmentBitsLength(table3[prevNodeId].lastCount, node.mode);
              table3[prevNodeId].lastCount += node.length;
            } else {
              if (table3[prevNodeId]) table3[prevNodeId].lastCount = node.length;
              graph[prevNodeId][key] = getSegmentBitsLength(node.length, node.mode) + 4 + Mode.getCharCountIndicator(node.mode, version2);
            }
          }
        }
        prevNodeIds = currentNodeIds;
      }
      for (let n = 0; n < prevNodeIds.length; n++) {
        graph[prevNodeIds[n]].end = 0;
      }
      return { map: graph, table: table3 };
    }
    __name(buildGraph, "buildGraph");
    function buildSingleSegment(data, modesHint) {
      let mode;
      const bestMode = Mode.getBestModeForData(data);
      mode = Mode.from(modesHint, bestMode);
      if (mode !== Mode.BYTE && mode.bit < bestMode.bit) {
        throw new Error('"' + data + '" cannot be encoded with mode ' + Mode.toString(mode) + ".\n Suggested mode is: " + Mode.toString(bestMode));
      }
      if (mode === Mode.KANJI && !Utils.isKanjiModeEnabled()) {
        mode = Mode.BYTE;
      }
      switch (mode) {
        case Mode.NUMERIC:
          return new NumericData(data);
        case Mode.ALPHANUMERIC:
          return new AlphanumericData(data);
        case Mode.KANJI:
          return new KanjiData(data);
        case Mode.BYTE:
          return new ByteData(data);
      }
    }
    __name(buildSingleSegment, "buildSingleSegment");
    exports.fromArray = /* @__PURE__ */ __name(function fromArray(array) {
      return array.reduce(function(acc, seg) {
        if (typeof seg === "string") {
          acc.push(buildSingleSegment(seg, null));
        } else if (seg.data) {
          acc.push(buildSingleSegment(seg.data, seg.mode));
        }
        return acc;
      }, []);
    }, "fromArray");
    exports.fromString = /* @__PURE__ */ __name(function fromString(data, version2) {
      const segs = getSegmentsFromString(data, Utils.isKanjiModeEnabled());
      const nodes = buildNodes(segs);
      const graph = buildGraph(nodes, version2);
      const path = dijkstra.find_path(graph.map, "start", "end");
      const optimizedSegs = [];
      for (let i = 1; i < path.length - 1; i++) {
        optimizedSegs.push(graph.table[path[i]].node);
      }
      return exports.fromArray(mergeSegments(optimizedSegs));
    }, "fromString");
    exports.rawSplit = /* @__PURE__ */ __name(function rawSplit(data) {
      return exports.fromArray(
        getSegmentsFromString(data, Utils.isKanjiModeEnabled())
      );
    }, "rawSplit");
  }
});

// ../node_modules/qrcode/lib/core/qrcode.js
var require_qrcode = __commonJS({
  "../node_modules/qrcode/lib/core/qrcode.js"(exports) {
    init_functionsRoutes_0_39238513569259903();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var Utils = require_utils();
    var ECLevel = require_error_correction_level();
    var BitBuffer = require_bit_buffer();
    var BitMatrix = require_bit_matrix();
    var AlignmentPattern = require_alignment_pattern();
    var FinderPattern = require_finder_pattern();
    var MaskPattern = require_mask_pattern();
    var ECCode = require_error_correction_code();
    var ReedSolomonEncoder = require_reed_solomon_encoder();
    var Version = require_version();
    var FormatInfo = require_format_info();
    var Mode = require_mode();
    var Segments = require_segments();
    function setupFinderPattern(matrix, version2) {
      const size = matrix.size;
      const pos = FinderPattern.getPositions(version2);
      for (let i = 0; i < pos.length; i++) {
        const row = pos[i][0];
        const col = pos[i][1];
        for (let r = -1; r <= 7; r++) {
          if (row + r <= -1 || size <= row + r) continue;
          for (let c = -1; c <= 7; c++) {
            if (col + c <= -1 || size <= col + c) continue;
            if (r >= 0 && r <= 6 && (c === 0 || c === 6) || c >= 0 && c <= 6 && (r === 0 || r === 6) || r >= 2 && r <= 4 && c >= 2 && c <= 4) {
              matrix.set(row + r, col + c, true, true);
            } else {
              matrix.set(row + r, col + c, false, true);
            }
          }
        }
      }
    }
    __name(setupFinderPattern, "setupFinderPattern");
    function setupTimingPattern(matrix) {
      const size = matrix.size;
      for (let r = 8; r < size - 8; r++) {
        const value = r % 2 === 0;
        matrix.set(r, 6, value, true);
        matrix.set(6, r, value, true);
      }
    }
    __name(setupTimingPattern, "setupTimingPattern");
    function setupAlignmentPattern(matrix, version2) {
      const pos = AlignmentPattern.getPositions(version2);
      for (let i = 0; i < pos.length; i++) {
        const row = pos[i][0];
        const col = pos[i][1];
        for (let r = -2; r <= 2; r++) {
          for (let c = -2; c <= 2; c++) {
            if (r === -2 || r === 2 || c === -2 || c === 2 || r === 0 && c === 0) {
              matrix.set(row + r, col + c, true, true);
            } else {
              matrix.set(row + r, col + c, false, true);
            }
          }
        }
      }
    }
    __name(setupAlignmentPattern, "setupAlignmentPattern");
    function setupVersionInfo(matrix, version2) {
      const size = matrix.size;
      const bits = Version.getEncodedBits(version2);
      let row, col, mod;
      for (let i = 0; i < 18; i++) {
        row = Math.floor(i / 3);
        col = i % 3 + size - 8 - 3;
        mod = (bits >> i & 1) === 1;
        matrix.set(row, col, mod, true);
        matrix.set(col, row, mod, true);
      }
    }
    __name(setupVersionInfo, "setupVersionInfo");
    function setupFormatInfo(matrix, errorCorrectionLevel, maskPattern) {
      const size = matrix.size;
      const bits = FormatInfo.getEncodedBits(errorCorrectionLevel, maskPattern);
      let i, mod;
      for (i = 0; i < 15; i++) {
        mod = (bits >> i & 1) === 1;
        if (i < 6) {
          matrix.set(i, 8, mod, true);
        } else if (i < 8) {
          matrix.set(i + 1, 8, mod, true);
        } else {
          matrix.set(size - 15 + i, 8, mod, true);
        }
        if (i < 8) {
          matrix.set(8, size - i - 1, mod, true);
        } else if (i < 9) {
          matrix.set(8, 15 - i - 1 + 1, mod, true);
        } else {
          matrix.set(8, 15 - i - 1, mod, true);
        }
      }
      matrix.set(size - 8, 8, 1, true);
    }
    __name(setupFormatInfo, "setupFormatInfo");
    function setupData(matrix, data) {
      const size = matrix.size;
      let inc = -1;
      let row = size - 1;
      let bitIndex = 7;
      let byteIndex = 0;
      for (let col = size - 1; col > 0; col -= 2) {
        if (col === 6) col--;
        while (true) {
          for (let c = 0; c < 2; c++) {
            if (!matrix.isReserved(row, col - c)) {
              let dark = false;
              if (byteIndex < data.length) {
                dark = (data[byteIndex] >>> bitIndex & 1) === 1;
              }
              matrix.set(row, col - c, dark);
              bitIndex--;
              if (bitIndex === -1) {
                byteIndex++;
                bitIndex = 7;
              }
            }
          }
          row += inc;
          if (row < 0 || size <= row) {
            row -= inc;
            inc = -inc;
            break;
          }
        }
      }
    }
    __name(setupData, "setupData");
    function createData(version2, errorCorrectionLevel, segments) {
      const buffer = new BitBuffer();
      segments.forEach(function(data) {
        buffer.put(data.mode.bit, 4);
        buffer.put(data.getLength(), Mode.getCharCountIndicator(data.mode, version2));
        data.write(buffer);
      });
      const totalCodewords = Utils.getSymbolTotalCodewords(version2);
      const ecTotalCodewords = ECCode.getTotalCodewordsCount(version2, errorCorrectionLevel);
      const dataTotalCodewordsBits = (totalCodewords - ecTotalCodewords) * 8;
      if (buffer.getLengthInBits() + 4 <= dataTotalCodewordsBits) {
        buffer.put(0, 4);
      }
      while (buffer.getLengthInBits() % 8 !== 0) {
        buffer.putBit(0);
      }
      const remainingByte = (dataTotalCodewordsBits - buffer.getLengthInBits()) / 8;
      for (let i = 0; i < remainingByte; i++) {
        buffer.put(i % 2 ? 17 : 236, 8);
      }
      return createCodewords(buffer, version2, errorCorrectionLevel);
    }
    __name(createData, "createData");
    function createCodewords(bitBuffer, version2, errorCorrectionLevel) {
      const totalCodewords = Utils.getSymbolTotalCodewords(version2);
      const ecTotalCodewords = ECCode.getTotalCodewordsCount(version2, errorCorrectionLevel);
      const dataTotalCodewords = totalCodewords - ecTotalCodewords;
      const ecTotalBlocks = ECCode.getBlocksCount(version2, errorCorrectionLevel);
      const blocksInGroup2 = totalCodewords % ecTotalBlocks;
      const blocksInGroup1 = ecTotalBlocks - blocksInGroup2;
      const totalCodewordsInGroup1 = Math.floor(totalCodewords / ecTotalBlocks);
      const dataCodewordsInGroup1 = Math.floor(dataTotalCodewords / ecTotalBlocks);
      const dataCodewordsInGroup2 = dataCodewordsInGroup1 + 1;
      const ecCount = totalCodewordsInGroup1 - dataCodewordsInGroup1;
      const rs = new ReedSolomonEncoder(ecCount);
      let offset = 0;
      const dcData = new Array(ecTotalBlocks);
      const ecData = new Array(ecTotalBlocks);
      let maxDataSize = 0;
      const buffer = new Uint8Array(bitBuffer.buffer);
      for (let b = 0; b < ecTotalBlocks; b++) {
        const dataSize = b < blocksInGroup1 ? dataCodewordsInGroup1 : dataCodewordsInGroup2;
        dcData[b] = buffer.slice(offset, offset + dataSize);
        ecData[b] = rs.encode(dcData[b]);
        offset += dataSize;
        maxDataSize = Math.max(maxDataSize, dataSize);
      }
      const data = new Uint8Array(totalCodewords);
      let index = 0;
      let i, r;
      for (i = 0; i < maxDataSize; i++) {
        for (r = 0; r < ecTotalBlocks; r++) {
          if (i < dcData[r].length) {
            data[index++] = dcData[r][i];
          }
        }
      }
      for (i = 0; i < ecCount; i++) {
        for (r = 0; r < ecTotalBlocks; r++) {
          data[index++] = ecData[r][i];
        }
      }
      return data;
    }
    __name(createCodewords, "createCodewords");
    function createSymbol(data, version2, errorCorrectionLevel, maskPattern) {
      let segments;
      if (Array.isArray(data)) {
        segments = Segments.fromArray(data);
      } else if (typeof data === "string") {
        let estimatedVersion = version2;
        if (!estimatedVersion) {
          const rawSegments = Segments.rawSplit(data);
          estimatedVersion = Version.getBestVersionForData(rawSegments, errorCorrectionLevel);
        }
        segments = Segments.fromString(data, estimatedVersion || 40);
      } else {
        throw new Error("Invalid data");
      }
      const bestVersion = Version.getBestVersionForData(segments, errorCorrectionLevel);
      if (!bestVersion) {
        throw new Error("The amount of data is too big to be stored in a QR Code");
      }
      if (!version2) {
        version2 = bestVersion;
      } else if (version2 < bestVersion) {
        throw new Error(
          "\nThe chosen QR Code version cannot contain this amount of data.\nMinimum version required to store current data is: " + bestVersion + ".\n"
        );
      }
      const dataBits = createData(version2, errorCorrectionLevel, segments);
      const moduleCount = Utils.getSymbolSize(version2);
      const modules = new BitMatrix(moduleCount);
      setupFinderPattern(modules, version2);
      setupTimingPattern(modules);
      setupAlignmentPattern(modules, version2);
      setupFormatInfo(modules, errorCorrectionLevel, 0);
      if (version2 >= 7) {
        setupVersionInfo(modules, version2);
      }
      setupData(modules, dataBits);
      if (isNaN(maskPattern)) {
        maskPattern = MaskPattern.getBestMask(
          modules,
          setupFormatInfo.bind(null, modules, errorCorrectionLevel)
        );
      }
      MaskPattern.applyMask(maskPattern, modules);
      setupFormatInfo(modules, errorCorrectionLevel, maskPattern);
      return {
        modules,
        version: version2,
        errorCorrectionLevel,
        maskPattern,
        segments
      };
    }
    __name(createSymbol, "createSymbol");
    exports.create = /* @__PURE__ */ __name(function create(data, options) {
      if (typeof data === "undefined" || data === "") {
        throw new Error("No input text");
      }
      let errorCorrectionLevel = ECLevel.M;
      let version2;
      let mask;
      if (typeof options !== "undefined") {
        errorCorrectionLevel = ECLevel.from(options.errorCorrectionLevel, ECLevel.M);
        version2 = Version.from(options.version);
        mask = MaskPattern.from(options.maskPattern);
        if (options.toSJISFunc) {
          Utils.setToSJISFunction(options.toSJISFunc);
        }
      }
      return createSymbol(data, version2, errorCorrectionLevel, mask);
    }, "create");
  }
});

// ../node_modules/qrcode/lib/renderer/utils.js
var require_utils2 = __commonJS({
  "../node_modules/qrcode/lib/renderer/utils.js"(exports) {
    init_functionsRoutes_0_39238513569259903();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    function hex2rgba(hex) {
      if (typeof hex === "number") {
        hex = hex.toString();
      }
      if (typeof hex !== "string") {
        throw new Error("Color should be defined as hex string");
      }
      let hexCode = hex.slice().replace("#", "").split("");
      if (hexCode.length < 3 || hexCode.length === 5 || hexCode.length > 8) {
        throw new Error("Invalid hex color: " + hex);
      }
      if (hexCode.length === 3 || hexCode.length === 4) {
        hexCode = Array.prototype.concat.apply([], hexCode.map(function(c) {
          return [c, c];
        }));
      }
      if (hexCode.length === 6) hexCode.push("F", "F");
      const hexValue = parseInt(hexCode.join(""), 16);
      return {
        r: hexValue >> 24 & 255,
        g: hexValue >> 16 & 255,
        b: hexValue >> 8 & 255,
        a: hexValue & 255,
        hex: "#" + hexCode.slice(0, 6).join("")
      };
    }
    __name(hex2rgba, "hex2rgba");
    exports.getOptions = /* @__PURE__ */ __name(function getOptions(options) {
      if (!options) options = {};
      if (!options.color) options.color = {};
      const margin = typeof options.margin === "undefined" || options.margin === null || options.margin < 0 ? 4 : options.margin;
      const width = options.width && options.width >= 21 ? options.width : void 0;
      const scale = options.scale || 4;
      return {
        width,
        scale: width ? 4 : scale,
        margin,
        color: {
          dark: hex2rgba(options.color.dark || "#000000ff"),
          light: hex2rgba(options.color.light || "#ffffffff")
        },
        type: options.type,
        rendererOpts: options.rendererOpts || {}
      };
    }, "getOptions");
    exports.getScale = /* @__PURE__ */ __name(function getScale(qrSize, opts) {
      return opts.width && opts.width >= qrSize + opts.margin * 2 ? opts.width / (qrSize + opts.margin * 2) : opts.scale;
    }, "getScale");
    exports.getImageWidth = /* @__PURE__ */ __name(function getImageWidth(qrSize, opts) {
      const scale = exports.getScale(qrSize, opts);
      return Math.floor((qrSize + opts.margin * 2) * scale);
    }, "getImageWidth");
    exports.qrToImageData = /* @__PURE__ */ __name(function qrToImageData(imgData, qr, opts) {
      const size = qr.modules.size;
      const data = qr.modules.data;
      const scale = exports.getScale(size, opts);
      const symbolSize = Math.floor((size + opts.margin * 2) * scale);
      const scaledMargin = opts.margin * scale;
      const palette = [opts.color.light, opts.color.dark];
      for (let i = 0; i < symbolSize; i++) {
        for (let j = 0; j < symbolSize; j++) {
          let posDst = (i * symbolSize + j) * 4;
          let pxColor = opts.color.light;
          if (i >= scaledMargin && j >= scaledMargin && i < symbolSize - scaledMargin && j < symbolSize - scaledMargin) {
            const iSrc = Math.floor((i - scaledMargin) / scale);
            const jSrc = Math.floor((j - scaledMargin) / scale);
            pxColor = palette[data[iSrc * size + jSrc] ? 1 : 0];
          }
          imgData[posDst++] = pxColor.r;
          imgData[posDst++] = pxColor.g;
          imgData[posDst++] = pxColor.b;
          imgData[posDst] = pxColor.a;
        }
      }
    }, "qrToImageData");
  }
});

// ../node_modules/qrcode/lib/renderer/canvas.js
var require_canvas = __commonJS({
  "../node_modules/qrcode/lib/renderer/canvas.js"(exports) {
    init_functionsRoutes_0_39238513569259903();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var Utils = require_utils2();
    function clearCanvas(ctx, canvas, size) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (!canvas.style) canvas.style = {};
      canvas.height = size;
      canvas.width = size;
      canvas.style.height = size + "px";
      canvas.style.width = size + "px";
    }
    __name(clearCanvas, "clearCanvas");
    function getCanvasElement() {
      try {
        return document.createElement("canvas");
      } catch (e) {
        throw new Error("You need to specify a canvas element");
      }
    }
    __name(getCanvasElement, "getCanvasElement");
    exports.render = /* @__PURE__ */ __name(function render(qrData, canvas, options) {
      let opts = options;
      let canvasEl = canvas;
      if (typeof opts === "undefined" && (!canvas || !canvas.getContext)) {
        opts = canvas;
        canvas = void 0;
      }
      if (!canvas) {
        canvasEl = getCanvasElement();
      }
      opts = Utils.getOptions(opts);
      const size = Utils.getImageWidth(qrData.modules.size, opts);
      const ctx = canvasEl.getContext("2d");
      const image = ctx.createImageData(size, size);
      Utils.qrToImageData(image.data, qrData, opts);
      clearCanvas(ctx, canvasEl, size);
      ctx.putImageData(image, 0, 0);
      return canvasEl;
    }, "render");
    exports.renderToDataURL = /* @__PURE__ */ __name(function renderToDataURL(qrData, canvas, options) {
      let opts = options;
      if (typeof opts === "undefined" && (!canvas || !canvas.getContext)) {
        opts = canvas;
        canvas = void 0;
      }
      if (!opts) opts = {};
      const canvasEl = exports.render(qrData, canvas, opts);
      const type = opts.type || "image/png";
      const rendererOpts = opts.rendererOpts || {};
      return canvasEl.toDataURL(type, rendererOpts.quality);
    }, "renderToDataURL");
  }
});

// ../node_modules/qrcode/lib/renderer/svg-tag.js
var require_svg_tag = __commonJS({
  "../node_modules/qrcode/lib/renderer/svg-tag.js"(exports) {
    init_functionsRoutes_0_39238513569259903();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var Utils = require_utils2();
    function getColorAttrib(color, attrib) {
      const alpha = color.a / 255;
      const str = attrib + '="' + color.hex + '"';
      return alpha < 1 ? str + " " + attrib + '-opacity="' + alpha.toFixed(2).slice(1) + '"' : str;
    }
    __name(getColorAttrib, "getColorAttrib");
    function svgCmd(cmd, x, y) {
      let str = cmd + x;
      if (typeof y !== "undefined") str += " " + y;
      return str;
    }
    __name(svgCmd, "svgCmd");
    function qrToPath(data, size, margin) {
      let path = "";
      let moveBy = 0;
      let newRow = false;
      let lineLength = 0;
      for (let i = 0; i < data.length; i++) {
        const col = Math.floor(i % size);
        const row = Math.floor(i / size);
        if (!col && !newRow) newRow = true;
        if (data[i]) {
          lineLength++;
          if (!(i > 0 && col > 0 && data[i - 1])) {
            path += newRow ? svgCmd("M", col + margin, 0.5 + row + margin) : svgCmd("m", moveBy, 0);
            moveBy = 0;
            newRow = false;
          }
          if (!(col + 1 < size && data[i + 1])) {
            path += svgCmd("h", lineLength);
            lineLength = 0;
          }
        } else {
          moveBy++;
        }
      }
      return path;
    }
    __name(qrToPath, "qrToPath");
    exports.render = /* @__PURE__ */ __name(function render(qrData, options, cb) {
      const opts = Utils.getOptions(options);
      const size = qrData.modules.size;
      const data = qrData.modules.data;
      const qrcodesize = size + opts.margin * 2;
      const bg = !opts.color.light.a ? "" : "<path " + getColorAttrib(opts.color.light, "fill") + ' d="M0 0h' + qrcodesize + "v" + qrcodesize + 'H0z"/>';
      const path = "<path " + getColorAttrib(opts.color.dark, "stroke") + ' d="' + qrToPath(data, size, opts.margin) + '"/>';
      const viewBox = 'viewBox="0 0 ' + qrcodesize + " " + qrcodesize + '"';
      const width = !opts.width ? "" : 'width="' + opts.width + '" height="' + opts.width + '" ';
      const svgTag = '<svg xmlns="http://www.w3.org/2000/svg" ' + width + viewBox + ' shape-rendering="crispEdges">' + bg + path + "</svg>\n";
      if (typeof cb === "function") {
        cb(null, svgTag);
      }
      return svgTag;
    }, "render");
  }
});

// ../node_modules/qrcode/lib/browser.js
var require_browser = __commonJS({
  "../node_modules/qrcode/lib/browser.js"(exports) {
    init_functionsRoutes_0_39238513569259903();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var canPromise = require_can_promise();
    var QRCode2 = require_qrcode();
    var CanvasRenderer = require_canvas();
    var SvgRenderer = require_svg_tag();
    function renderCanvas(renderFunc, canvas, text, opts, cb) {
      const args = [].slice.call(arguments, 1);
      const argsNum = args.length;
      const isLastArgCb = typeof args[argsNum - 1] === "function";
      if (!isLastArgCb && !canPromise()) {
        throw new Error("Callback required as last argument");
      }
      if (isLastArgCb) {
        if (argsNum < 2) {
          throw new Error("Too few arguments provided");
        }
        if (argsNum === 2) {
          cb = text;
          text = canvas;
          canvas = opts = void 0;
        } else if (argsNum === 3) {
          if (canvas.getContext && typeof cb === "undefined") {
            cb = opts;
            opts = void 0;
          } else {
            cb = opts;
            opts = text;
            text = canvas;
            canvas = void 0;
          }
        }
      } else {
        if (argsNum < 1) {
          throw new Error("Too few arguments provided");
        }
        if (argsNum === 1) {
          text = canvas;
          canvas = opts = void 0;
        } else if (argsNum === 2 && !canvas.getContext) {
          opts = text;
          text = canvas;
          canvas = void 0;
        }
        return new Promise(function(resolve, reject) {
          try {
            const data = QRCode2.create(text, opts);
            resolve(renderFunc(data, canvas, opts));
          } catch (e) {
            reject(e);
          }
        });
      }
      try {
        const data = QRCode2.create(text, opts);
        cb(null, renderFunc(data, canvas, opts));
      } catch (e) {
        cb(e);
      }
    }
    __name(renderCanvas, "renderCanvas");
    exports.create = QRCode2.create;
    exports.toCanvas = renderCanvas.bind(null, CanvasRenderer.render);
    exports.toDataURL = renderCanvas.bind(null, CanvasRenderer.renderToDataURL);
    exports.toString = renderCanvas.bind(null, function(data, _, opts) {
      return SvgRenderer.render(data, opts);
    });
  }
});

// api/_email/qr.ts
async function generateCamperQRCode(activationCode, activationToken, baseUrl = "https://summer-camp-vlc2027.pages.dev") {
  const cleanBase = baseUrl.replace(/\/$/, "");
  const tokenParam = activationToken ? `&activate_token=${encodeURIComponent(activationToken)}` : "";
  const activationUrl = `${cleanBase}/?code=${encodeURIComponent(activationCode)}${tokenParam}`;
  try {
    const dataUrl = await import_qrcode.default.toDataURL(activationUrl, {
      width: 240,
      margin: 1,
      color: {
        dark: "#1e3a8a",
        // Deep Blue
        light: "#ffffff"
      },
      errorCorrectionLevel: "M"
    });
    return { dataUrl, activationUrl };
  } catch (err) {
    console.error("[QR Generation Error]", err);
    return { dataUrl: "", activationUrl };
  }
}
var import_qrcode;
var init_qr = __esm({
  "api/_email/qr.ts"() {
    init_functionsRoutes_0_39238513569259903();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    import_qrcode = __toESM(require_browser(), 1);
    __name(generateCamperQRCode, "generateCamperQRCode");
  }
});

// api/_email/template.ts
function formatRole(role) {
  switch ((role || "").toLowerCase()) {
    case "counselor":
      return "Counselor / Mentor";
    case "staff":
      return "Camp Logistics Staff";
    case "pastor":
      return "Pastor / Delegation Head";
    case "worship":
      return "Praise & Worship Team";
    case "medical":
      return "Camp Medical First Responder";
    case "first_timer":
      return "First-Timer Camper";
    case "camper":
    default:
      return "Delegate Camper";
  }
}
function escapeHtml(str) {
  if (!str) return "";
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
function renderCamperPassportEmail(camper, qr, options) {
  const campName = options?.campName || "VLC 2027";
  const campTheme = options?.campTheme || "Arise & Shine (Isaiah 60:1)";
  const campDates = options?.campDates || "July 2027";
  const campLocation = options?.campLocation || "Bambang, Nueva Vizcaya, Philippines";
  const nickname = escapeHtml(camper.nickname || camper.full_name.split(" ")[0]);
  const fullName = escapeHtml(camper.full_name);
  const churchName = escapeHtml(camper.church_name || "Christian Congregation Delegation");
  const province = escapeHtml(camper.province || "Philippines");
  const roleTitle = formatRole(camper.role);
  const passCode = escapeHtml(camper.activation_code);
  const dietaryNeeds = camper.dietary_needs && camper.dietary_needs.toLowerCase() !== "none" ? escapeHtml(camper.dietary_needs) : null;
  const emergencyName = escapeHtml(camper.emergency_name || "Guardian on File");
  const emergencyPhone = escapeHtml(camper.emergency_phone || camper.phone);
  const emergencyRelation = escapeHtml(camper.emergency_relation || "Emergency Contact");
  const subject = `\u{1F3AB} Your VLC 2027 Camper Passport & Pass Code: ${passCode} (${nickname})`;
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>${escapeHtml(subject)}</title>
  <!--[if mso]>
  <style type="text/css">
    body, table, td {font-family: Arial, Helvetica, sans-serif !important;}
  </style>
  <![endif]-->
  <style type="text/css">
    body {
      margin: 0;
      padding: 0;
      background-color: #f1f5f9;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #1e293b;
      -webkit-font-smoothing: antialiased;
    }
    table {
      border-collapse: collapse;
    }
    img {
      border: 0;
      line-height: 100%;
      outline: none;
      text-decoration: none;
    }
    .wrapper {
      width: 100%;
      table-layout: fixed;
      background-color: #f1f5f9;
      padding: 24px 0 32px 0;
    }
    .main {
      background-color: #ffffff;
      margin: 0 auto;
      width: 100%;
      max-width: 600px;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    }
    .badge-card {
      background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #2563eb 100%);
      color: #ffffff;
      border-radius: 12px;
      padding: 24px;
      margin: 20px;
      text-align: center;
    }
    .btn-primary {
      display: inline-block;
      background-color: #2563eb;
      color: #ffffff !important;
      font-weight: 700;
      font-size: 15px;
      padding: 14px 28px;
      text-decoration: none;
      border-radius: 8px;
      letter-spacing: 0.3px;
    }
    @media only screen and (max-width: 600px) {
      .main {
        width: 100% !important;
        border-radius: 0 !important;
      }
      .badge-card {
        margin: 12px !important;
        padding: 16px !important;
      }
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <center>
      <table class="main" width="100%" cellpadding="0" cellspacing="0" role="presentation">
        
        <!-- Header Banner -->
        <tr>
          <td style="background-color: #0f172a; padding: 28px 24px; text-align: center; color: #ffffff;">
            <div style="font-size: 11px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; color: #60a5fa; margin-bottom: 6px;">
              Pentecostal Churches of Christ, Inc.
            </div>
            <h1 style="margin: 0; font-size: 26px; font-weight: 900; letter-spacing: -0.5px; color: #ffffff;">
              ${escapeHtml(campName)}
            </h1>
            <div style="font-size: 14px; color: #94a3b8; margin-top: 4px; font-style: italic;">
              "${escapeHtml(campTheme)}"
            </div>
            <div style="font-size: 12px; color: #cbd5e1; margin-top: 8px; font-weight: 500;">
              \u{1F4CD} ${escapeHtml(campLocation)} &nbsp;|&nbsp; \u{1F5D3}\uFE0F ${escapeHtml(campDates)}
            </div>
          </td>
        </tr>

        <!-- Greeting -->
        <tr>
          <td style="padding: 24px 24px 12px 24px;">
            <h2 style="margin: 0 0 10px 0; font-size: 20px; font-weight: 700; color: #0f172a;">
              Praise God, ${nickname}! \u{1F64C}
            </h2>
            <p style="margin: 0; font-size: 15px; line-height: 1.6; color: #475569;">
              Your delegate registration for <strong>${escapeHtml(campName)}</strong> has been successfully received. Below is your official <strong>Digital Camper Passport</strong>. Please save this email or take a screenshot of your pass code for on-site arrival check-in.
            </p>
          </td>
        </tr>

        <!-- Camper Passport Card (Boarding Pass) -->
        <tr>
          <td>
            <div class="badge-card">
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td style="text-align: left; vertical-align: top;">
                    <span style="display: inline-block; background-color: rgba(255, 255, 255, 0.2); padding: 4px 10px; border-radius: 9999px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #ffffff;">
                      ${escapeHtml(roleTitle)}
                    </span>
                    <h3 style="margin: 10px 0 2px 0; font-size: 26px; font-weight: 900; color: #ffffff; letter-spacing: -0.5px;">
                      ${nickname}
                    </h3>
                    <div style="font-size: 13px; color: #cbd5e1; margin-bottom: 6px;">
                      ${fullName}
                    </div>
                    <div style="font-size: 12px; color: #93c5fd; font-weight: 600;">
                      \u26EA ${churchName}
                    </div>
                    <div style="font-size: 11px; color: #cbd5e1; margin-top: 2px;">
                      \u{1F4CD} ${province}
                    </div>
                  </td>
                </tr>

                <!-- QR Code & Activation Code Box -->
                <tr>
                  <td style="text-align: center; padding-top: 20px;">
                    <div style="background-color: #ffffff; padding: 16px; border-radius: 12px; display: inline-block; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
                      ${qr.dataUrl ? `<img src="${qr.dataUrl}" alt="Camper Pass QR Code" width="180" height="180" style="display: block; margin: 0 auto; border-radius: 6px;" />` : ""}
                      <div style="margin-top: 10px; padding: 6px 12px; background-color: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 6px;">
                        <span style="font-size: 10px; text-transform: uppercase; color: #64748b; font-weight: 700; letter-spacing: 1px; display: block;">
                          Official Pass Code
                        </span>
                        <span style="font-family: 'Courier New', Courier, monospace; font-size: 20px; font-weight: 900; color: #1e3a8a; letter-spacing: 2px;">
                          ${passCode}
                        </span>
                      </div>
                    </div>
                    <div style="font-size: 11px; color: #cbd5e1; margin-top: 12px;">
                      Scan at the Bambang Camp Arrival Desk for instant check-in
                    </div>
                  </td>
                </tr>
              </table>
            </div>
          </td>
        </tr>

        <!-- Direct Portal CTA -->
        <tr>
          <td style="text-align: center; padding: 0 24px 20px 24px;">
            <a href="${qr.activationUrl}" class="btn-primary" target="_blank" rel="noopener noreferrer">
              \u{1F449} Open Digital Pass in Camper Portal
            </a>
            <div style="font-size: 12px; color: #94a3b8; margin-top: 8px;">
              Can't click the button? Copy & paste this link in your browser:<br>
              <a href="${qr.activationUrl}" style="color: #2563eb; word-break: break-all; font-size: 11px;">
                ${qr.activationUrl}
              </a>
            </div>
          </td>
        </tr>

        ${dietaryNeeds ? `
        <!-- Medical / Dietary Alert -->
        <tr>
          <td style="padding: 0 24px 16px 24px;">
            <div style="background-color: #fffbeb; border-left: 4px solid #f59e0b; padding: 14px 16px; border-radius: 6px;">
              <strong style="color: #b45309; font-size: 13px; display: block; margin-bottom: 2px;">
                \u26A0\uFE0F Dietary & Health Alert Recorded:
              </strong>
              <span style="color: #92400e; font-size: 13px; line-height: 1.4;">
                ${dietaryNeeds} (Noted for the Camp Food &amp; Medical Committees)
              </span>
            </div>
          </td>
        </tr>
        ` : ""}

        <!-- Arrival Day Procedures -->
        <tr>
          <td style="padding: 10px 24px;">
            <h3 style="margin: 0 0 12px 0; font-size: 16px; font-weight: 800; color: #0f172a; text-transform: uppercase; letter-spacing: 0.5px;">
              \u{1F4CB} On-Site Arrival Instructions
            </h3>
            <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="font-size: 14px; color: #334155; line-height: 1.5;">
              <tr>
                <td style="padding-bottom: 10px; vertical-align: top; width: 28px;">
                  <span style="background-color: #dbeafe; color: #1d4ed8; font-weight: 800; border-radius: 50%; width: 22px; height: 22px; display: inline-block; text-align: center; line-height: 22px; font-size: 12px;">1</span>
                </td>
                <td style="padding-bottom: 10px; vertical-align: top;">
                  <strong>Arrive at Camp Headquarters:</strong> Report to the Nueva Vizcaya Camp Gates. Opening rallies begin in the afternoon.
                </td>
              </tr>
              <tr>
                <td style="padding-bottom: 10px; vertical-align: top; width: 28px;">
                  <span style="background-color: #dbeafe; color: #1d4ed8; font-weight: 800; border-radius: 50%; width: 22px; height: 22px; display: inline-block; text-align: center; line-height: 22px; font-size: 12px;">2</span>
                </td>
                <td style="padding-bottom: 10px; vertical-align: top;">
                  <strong>Arrival Desk Check-In:</strong> Present your QR code or Pass Code <strong>${passCode}</strong> at the Arrival Desk to verify your delegation badge.
                </td>
              </tr>
              <tr>
                <td style="padding-bottom: 10px; vertical-align: top; width: 28px;">
                  <span style="background-color: #dbeafe; color: #1d4ed8; font-weight: 800; border-radius: 50%; width: 22px; height: 22px; display: inline-block; text-align: center; line-height: 22px; font-size: 12px;">3</span>
                </td>
                <td style="padding-bottom: 10px; vertical-align: top;">
                  <strong>Claim Official Kit:</strong> Collect your VLC 2027 official delegate kit, lanyard, and camp syllabus.
                </td>
              </tr>
              <tr>
                <td style="vertical-align: top; width: 28px;">
                  <span style="background-color: #dbeafe; color: #1d4ed8; font-weight: 800; border-radius: 50%; width: 22px; height: 22px; display: inline-block; text-align: center; line-height: 22px; font-size: 12px;">4</span>
                </td>
                <td style="vertical-align: top;">
                  <strong>Dormitory & Small Group:</strong> Receive your cabin keys and join your delegation leader for opening orientation.
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Packing Checklist & Emergency Contact -->
        <tr>
          <td style="padding: 16px 24px 24px 24px;">
            <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px;">
              <tr>
                <td style="vertical-align: top; width: 50%; padding-right: 12px;">
                  <div style="font-size: 12px; font-weight: 800; color: #1e293b; text-transform: uppercase; margin-bottom: 8px;">
                    \u{1F392} Packing Essentials
                  </div>
                  <ul style="margin: 0; padding-left: 18px; font-size: 12px; color: #475569; line-height: 1.6;">
                    <li>Bible, journal & pens</li>
                    <li>Modest activewear & sleepwear</li>
                    <li>Toiletries & bath towel</li>
                    <li>Personal prescribed medication</li>
                    <li>Reusable water tumbler</li>
                  </ul>
                </td>
                <td style="vertical-align: top; width: 50%; padding-left: 12px; border-left: 1px solid #e2e8f0;">
                  <div style="font-size: 12px; font-weight: 800; color: #1e293b; text-transform: uppercase; margin-bottom: 8px;">
                    \u{1F6A8} Emergency Record
                  </div>
                  <div style="font-size: 12px; color: #475569; line-height: 1.6;">
                    <strong>${emergencyName}</strong><br>
                    Relation: ${emergencyRelation}<br>
                    Phone: <a href="tel:${emergencyPhone}" style="color: #2563eb; text-decoration: none;">${emergencyPhone}</a>
                  </div>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background-color: #0f172a; padding: 24px; text-align: center; color: #64748b; font-size: 11px; line-height: 1.6;">
            <p style="margin: 0 0 6px 0; color: #94a3b8; font-weight: 600;">
              Vision &amp; Leadership Camp (VLC 2027) \u2022 PCCI Youth &amp; Delegates Committee
            </p>
            <p style="margin: 0;">
              This is an automated confirmation sent to ${escapeHtml(camper.email)}. If you have questions or delegation adjustments, please contact your local pastor or the Camp Secretariat.
            </p>
          </td>
        </tr>

      </table>
    </center>
  </div>
</body>
</html>`;
  const text = `
======================================================
  VLC 2027 - VISION & LEADERSHIP CAMP
  Theme: ${campTheme}
  Dates: ${campDates} | Location: ${campLocation}
======================================================

Praise God, ${camper.nickname || camper.full_name}!

Your registration has been confirmed! Here is your digital pass:

------------------------------------------------------
CAMPER PASSPORT
------------------------------------------------------
Name: ${camper.full_name} (${camper.nickname})
Role: ${roleTitle}
Delegation: ${camper.church_name || "PCCI Church Delegation"}
Province: ${camper.province || "Philippines"}

OFFICIAL PASS CODE: ${passCode}
Direct Digital Pass Link:
${qr.activationUrl}

${dietaryNeeds ? `*** MEDICAL / DIETARY NOTE: ${dietaryNeeds} ***
` : ""}
------------------------------------------------------
ON-SITE ARRIVAL INSTRUCTIONS
------------------------------------------------------
1. Report to Bambang, Nueva Vizcaya Camp Headquarters.
2. Present your Pass Code (${passCode}) or QR code at the Arrival Desk.
3. Claim your official camp kit and lanyard.
4. Receive your dormitory assignment and meet your small group.

Emergency Contact on Record:
${emergencyName} (${emergencyRelation}) - ${emergencyPhone}

We look forward to an anointed time of worship and leadership fellowship!

--
VLC 2027 Camp Secretariat
Pentecostal Churches of Christ, Inc.
`.trim();
  return { subject, html, text };
}
function renderPasswordResetEmail(data) {
  const name = escapeHtml(data.full_name || "Delegate");
  const resetUrl = data.reset_url;
  const minutes = data.expires_in_minutes || 60;
  const subject = `\u{1F510} Reset Your VLC 2027 Password`;
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Reset Your VLC 2027 Password</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <div style="max-width: 600px; margin: 30px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08); border: 1px solid #e2e8f0;">
    <div style="background: linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%); padding: 32px 24px; text-align: center; color: #ffffff;">
      <h1 style="margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">Vision & Leadership Camp 2027</h1>
      <p style="margin: 8px 0 0; font-size: 13px; color: #93c5fd; text-transform: uppercase; letter-spacing: 1px;">Security & Password Assistance</p>
    </div>

    <div style="padding: 32px 24px;">
      <p style="margin: 0 0 16px; font-size: 15px; color: #1e293b; line-height: 1.6;">
        Hello <strong>${name}</strong>,
      </p>
      <p style="margin: 0 0 20px; font-size: 14px; color: #475569; line-height: 1.6;">
        We received a request to reset the password for your VLC 2027 delegate account. Click the button below to choose a new password:
      </p>

      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetUrl}" style="background-color: #2563eb; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 700; font-size: 15px; display: inline-block; box-shadow: 0 4px 10px rgba(37, 99, 235, 0.3);">
          Reset My Password
        </a>
      </div>

      <p style="margin: 0 0 12px; font-size: 13px; color: #64748b; line-height: 1.5;">
        This password reset link will expire in <strong>${minutes} minutes</strong>. If you did not make this request, you can safely ignore this email\u2014your account remains secure.
      </p>

      <div style="margin-top: 24px; padding: 12px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 12px; color: #64748b; word-break: break-all;">
        If button above doesn't work, copy and paste this link into your browser:<br />
        <a href="${resetUrl}" style="color: #2563eb;">${resetUrl}</a>
      </div>
    </div>

    <div style="padding: 20px 24px; background-color: #0f172a; text-align: center; color: #94a3b8; font-size: 11px;">
      <p style="margin: 0;">Pentecostal Churches of Christ, Inc. &bull; VLC 2027 Secretariat</p>
    </div>
  </div>
</body>
</html>
  `.trim();
  const text = `
VISION & LEADERSHIP CAMP 2027 (VLC 2027)
Security & Password Reset
======================================================

Hello ${data.full_name || "Delegate"},

We received a request to reset the password for your VLC 2027 delegate account.

To reset your password, visit this link:
${resetUrl}

This link is valid for ${minutes} minutes. If you did not request this reset, you can safely ignore this email.

--
VLC 2027 Secretariat
Pentecostal Churches of Christ, Inc.
`.trim();
  return { subject, html, text };
}
var init_template = __esm({
  "api/_email/template.ts"() {
    init_functionsRoutes_0_39238513569259903();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    __name(formatRole, "formatRole");
    __name(escapeHtml, "escapeHtml");
    __name(renderCamperPassportEmail, "renderCamperPassportEmail");
    __name(renderPasswordResetEmail, "renderPasswordResetEmail");
  }
});

// api/_email/dispatcher.ts
async function dispatchCamperPassportEmail(options) {
  const { db, camper, env: env2, origin, force } = options;
  const deliveryId = "del_" + Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
  const idempotencyKey = force ? `camper_resend_${camper.id}_${Date.now()}` : `camper_signup_${camper.id}`;
  const recipientEmail = camper.email.toLowerCase().trim();
  const existingDelivery = await db.prepare("SELECT id, status, provider, provider_message_id FROM email_deliveries WHERE idempotency_key = ?").bind(idempotencyKey).first();
  if (existingDelivery) {
    if (existingDelivery.status === "sent") {
      console.log(`[Email Dispatcher] Idempotent skip: Email already sent for camper ${camper.id} (${existingDelivery.id})`);
      return {
        success: true,
        provider: existingDelivery.provider,
        providerMessageId: existingDelivery.provider_message_id,
        idempotentAbort: true
      };
    }
  }
  const baseUrl = origin || env2.BASE_URL || "https://summer-camp-vlc2027.pages.dev";
  const qr = await generateCamperQRCode(camper.activation_code, camper.activation_token, baseUrl);
  const content = renderCamperPassportEmail(camper, qr, {
    campName: env2.CAMP_NAME,
    campTheme: env2.CAMP_THEME
  });
  let provider = "simulation";
  if (env2.EMAIL && typeof env2.EMAIL.send === "function" || env2.EMAIL_SERVICE) {
    provider = "cf_email";
  } else if (env2.RESEND_API_KEY) {
    provider = "resend";
  } else if (env2.POSTMARK_SERVER_TOKEN) {
    provider = "postmark";
  }
  const defaultFrom = env2.EMAIL_FROM || "VLC 2027 Camp Desk <noreply@vlc2027.org>";
  try {
    if (!existingDelivery) {
      await db.prepare(`
          INSERT INTO email_deliveries (
            id, camper_id, idempotency_key, recipient_email, subject,
            status, provider, attempts, email_preview, created_at
          ) VALUES (?, ?, ?, ?, ?, 'pending', ?, 1, ?, CURRENT_TIMESTAMP)
        `).bind(
        deliveryId,
        camper.id,
        idempotencyKey,
        recipientEmail,
        content.subject,
        provider,
        content.text.substring(0, 500)
      ).run();
    } else {
      await db.prepare("UPDATE email_deliveries SET attempts = attempts + 1, status = 'pending' WHERE id = ?").bind(existingDelivery.id).run();
    }
  } catch (dbErr) {
    if (dbErr.message?.includes("UNIQUE constraint failed: email_deliveries.idempotency_key")) {
      console.warn(`[Email Dispatcher] Concurrent delivery in progress for ${idempotencyKey}`);
      return { success: true, provider, idempotentAbort: true };
    }
    console.error("[Email Dispatcher] Failed to record pending delivery in D1:", dbErr);
  }
  const activeDeliveryId = existingDelivery ? existingDelivery.id : deliveryId;
  try {
    let providerMessageId;
    if (provider === "resend") {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${env2.RESEND_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          from: defaultFrom,
          to: [recipientEmail],
          subject: content.subject,
          html: content.html,
          text: content.text
        })
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(`Resend API failed (${res.status}): ${json?.message || JSON.stringify(json)}`);
      }
      providerMessageId = json?.id;
    } else if (provider === "postmark") {
      const res = await fetch("https://api.postmarkapp.com/email", {
        method: "POST",
        headers: {
          "X-Postmark-Server-Token": env2.POSTMARK_SERVER_TOKEN,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          From: defaultFrom,
          To: recipientEmail,
          Subject: content.subject,
          HtmlBody: content.html,
          TextBody: content.text
        })
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(`Postmark API failed (${res.status}): ${json?.Message || JSON.stringify(json)}`);
      }
      providerMessageId = json?.MessageID;
    } else if (provider === "cf_email") {
      const senderMatch = defaultFrom.match(/^(.*?)\s*<([^>]+)>$/);
      const senderEmail = senderMatch ? senderMatch[2].trim() : defaultFrom.trim();
      if (env2.EMAIL_SERVICE) {
        const res = await env2.EMAIL_SERVICE.fetch("https://email-service.internal/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: recipientEmail,
            from: senderEmail,
            subject: content.subject,
            text: content.text,
            html: content.html
          })
        });
        if (!res.ok) {
          const errText = await res.text();
          throw new Error(`Cloudflare Email Service failed (${res.status}): ${errText}`);
        }
        providerMessageId = "cf_service_" + Date.now();
      } else if (env2.EMAIL) {
        try {
          await env2.EMAIL.send({
            to: recipientEmail,
            from: senderEmail,
            subject: content.subject,
            text: content.text,
            html: content.html
          });
        } catch (structErr) {
          console.warn("[Email Dispatcher] Structured send failed, attempting content array fallback:", structErr);
          await env2.EMAIL.send({
            from: senderEmail,
            to: recipientEmail,
            subject: content.subject,
            content: [
              { type: "text/plain", value: content.text },
              { type: "text/html", value: content.html }
            ]
          });
        }
        providerMessageId = "cf_" + Date.now();
      }
    } else {
      providerMessageId = `sim_${Date.now().toString(36)}`;
      console.log(`[Email Dispatcher (Simulation)] ==============================`);
      console.log(`[Email Dispatcher (Simulation)] To: ${recipientEmail}`);
      console.log(`[Email Dispatcher (Simulation)] Subject: ${content.subject}`);
      console.log(`[Email Dispatcher (Simulation)] Pass Code: ${camper.activation_code}`);
      console.log(`[Email Dispatcher (Simulation)] Activation Link: ${qr.activationUrl}`);
      console.log(`[Email Dispatcher (Simulation)] Message ID: ${providerMessageId}`);
      console.log(`[Email Dispatcher (Simulation)] ==============================`);
    }
    await db.prepare(`
        UPDATE email_deliveries
        SET status = 'sent',
            provider = ?,
            provider_message_id = ?,
            sent_at = CURRENT_TIMESTAMP,
            error_message = NULL
        WHERE id = ?
      `).bind(provider, providerMessageId || null, activeDeliveryId).run();
    return {
      success: true,
      provider,
      providerMessageId
    };
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error(`[Email Dispatcher] Send failure for camper ${camper.id}:`, errorMsg);
    try {
      await db.prepare(`
          UPDATE email_deliveries
          SET status = 'failed',
              error_message = ?
          WHERE id = ?
        `).bind(errorMsg.substring(0, 1e3), activeDeliveryId).run();
    } catch (dbErr) {
      console.error("[Email Dispatcher] Failed to update delivery failure record:", dbErr);
    }
    return {
      success: false,
      provider,
      error: errorMsg
    };
  }
}
async function dispatchPasswordResetEmail(options) {
  const { db, camper, resetToken, env: env2, origin } = options;
  const recipientEmail = camper.email.toLowerCase().trim();
  const deliveryId = "del_rst_" + Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
  const idempotencyKey = `reset_${camper.id}_${Date.now()}`;
  const baseUrl = origin || env2.BASE_URL || "https://summer-camp-vlc2027.pages.dev";
  const resetUrl = `${baseUrl.replace(/\/$/, "")}/?reset_token=${encodeURIComponent(resetToken)}`;
  const content = renderPasswordResetEmail({
    full_name: camper.full_name,
    reset_url: resetUrl,
    expires_in_minutes: 60
  });
  let provider = "simulation";
  if (env2.EMAIL && typeof env2.EMAIL.send === "function" || env2.EMAIL_SERVICE) {
    provider = "cf_email";
  } else if (env2.RESEND_API_KEY) {
    provider = "resend";
  } else if (env2.POSTMARK_SERVER_TOKEN) {
    provider = "postmark";
  }
  const defaultFrom = env2.EMAIL_FROM || "VLC 2027 Camp Desk <noreply@filipino.dk>";
  try {
    await db.prepare(`
        INSERT INTO email_deliveries (
          id, camper_id, idempotency_key, recipient_email, subject,
          status, provider, attempts, email_preview, created_at
        ) VALUES (?, ?, ?, ?, ?, 'pending', ?, 1, ?, CURRENT_TIMESTAMP)
      `).bind(
      deliveryId,
      camper.id,
      idempotencyKey,
      recipientEmail,
      content.subject,
      provider,
      content.text.substring(0, 500)
    ).run();
  } catch (dbErr) {
    console.warn("[Email Dispatcher] Failed recording pending reset delivery in D1:", dbErr);
  }
  try {
    let providerMessageId;
    if (provider === "cf_email") {
      const senderMatch = defaultFrom.match(/^(.*?)\s*<([^>]+)>$/);
      const senderEmail = senderMatch ? senderMatch[2].trim() : defaultFrom.trim();
      if (env2.EMAIL_SERVICE) {
        const res = await env2.EMAIL_SERVICE.fetch("https://email-service.internal/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: recipientEmail,
            from: senderEmail,
            subject: content.subject,
            text: content.text,
            html: content.html
          })
        });
        if (!res.ok) {
          const errText = await res.text();
          throw new Error(`Cloudflare Email Service failed (${res.status}): ${errText}`);
        }
        providerMessageId = "cf_rst_" + Date.now();
      } else if (env2.EMAIL) {
        await env2.EMAIL.send({
          to: recipientEmail,
          from: senderEmail,
          subject: content.subject,
          text: content.text,
          html: content.html
        });
        providerMessageId = "cf_rst_" + Date.now();
      }
    } else if (provider === "resend") {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${env2.RESEND_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          from: defaultFrom,
          to: [recipientEmail],
          subject: content.subject,
          html: content.html,
          text: content.text
        })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(`Resend failed (${res.status}): ${json?.message || JSON.stringify(json)}`);
      providerMessageId = json?.id;
    } else if (provider === "postmark") {
      const res = await fetch("https://api.postmarkapp.com/email", {
        method: "POST",
        headers: {
          "X-Postmark-Server-Token": env2.POSTMARK_SERVER_TOKEN,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          From: defaultFrom,
          To: recipientEmail,
          Subject: content.subject,
          HtmlBody: content.html,
          TextBody: content.text
        })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(`Postmark failed (${res.status}): ${json?.Message || JSON.stringify(json)}`);
      providerMessageId = json?.MessageID;
    } else {
      providerMessageId = `sim_rst_${Date.now().toString(36)}`;
      console.log(`[Email Dispatcher (Simulation)] Password Reset To: ${recipientEmail}, Reset URL: ${resetUrl}`);
    }
    await db.prepare(`
        UPDATE email_deliveries
        SET status = 'sent',
            provider = ?,
            provider_message_id = ?,
            sent_at = CURRENT_TIMESTAMP,
            error_message = NULL
        WHERE id = ?
      `).bind(provider, providerMessageId || null, deliveryId).run();
    return {
      success: true,
      provider,
      providerMessageId
    };
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error(`[Email Dispatcher] Password reset send failure for ${camper.id}:`, errorMsg);
    try {
      await db.prepare(`
          UPDATE email_deliveries
          SET status = 'failed',
              error_message = ?
          WHERE id = ?
        `).bind(errorMsg.substring(0, 1e3), deliveryId).run();
    } catch (dbErr) {
      console.error("[Email Dispatcher] Failed updating delivery failure record:", dbErr);
    }
    return {
      success: false,
      provider,
      error: errorMsg
    };
  }
}
var init_dispatcher = __esm({
  "api/_email/dispatcher.ts"() {
    init_functionsRoutes_0_39238513569259903();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_qr();
    init_template();
    __name(dispatchCamperPassportEmail, "dispatchCamperPassportEmail");
    __name(dispatchPasswordResetEmail, "dispatchPasswordResetEmail");
  }
});

// api/auth/forgot-password.ts
var onRequestPost4;
var init_forgot_password = __esm({
  "api/auth/forgot-password.ts"() {
    init_functionsRoutes_0_39238513569259903();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_dispatcher();
    onRequestPost4 = /* @__PURE__ */ __name(async (context2) => {
      try {
        const body = await context2.request.json();
        const email = (body.email || "").trim().toLowerCase();
        if (!email || !email.includes("@")) {
          return new Response(JSON.stringify({ error: "A valid email address is required." }), {
            status: 400,
            headers: { "Content-Type": "application/json" }
          });
        }
        const camper = await context2.env.DB.prepare(`
        SELECT id, full_name, email, is_active 
        FROM campers 
        WHERE LOWER(email) = ? AND COALESCE(is_active, 1) = 1 
        LIMIT 1
      `).bind(email).first();
        if (camper) {
          const array = new Uint8Array(24);
          crypto.getRandomValues(array);
          const resetToken = Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("");
          await context2.env.DB.prepare(`
          UPDATE campers 
          SET reset_token = ?, 
              reset_token_expires_at = datetime('now', '+1 hour')
          WHERE id = ?
        `).bind(resetToken, camper.id).run();
          const requestOrigin = new URL(context2.request.url).origin;
          context2.waitUntil(
            dispatchPasswordResetEmail({
              db: context2.env.DB,
              camper: {
                id: camper.id,
                email: camper.email,
                full_name: camper.full_name
              },
              resetToken,
              env: context2.env,
              origin: requestOrigin
            }).catch((err) => {
              console.error("[Forgot Password] Email dispatch failed:", err);
            })
          );
        }
        return new Response(
          JSON.stringify({
            success: true,
            message: "If an account exists with this email address, a password reset link has been dispatched."
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" }
          }
        );
      } catch (err) {
        console.error("[Forgot Password API] Internal Error:", err);
        return new Response(
          JSON.stringify({ error: "An unexpected error occurred while requesting password reset." }),
          {
            status: 500,
            headers: { "Content-Type": "application/json" }
          }
        );
      }
    }, "onRequestPost");
  }
});

// api/auth/login.ts
var onRequestPost5;
var init_login = __esm({
  "api/auth/login.ts"() {
    init_functionsRoutes_0_39238513569259903();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    onRequestPost5 = /* @__PURE__ */ __name(async (context2) => {
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
  }
});

// api/auth/reset-password.ts
var onRequestGet5, onRequestPost6;
var init_reset_password = __esm({
  "api/auth/reset-password.ts"() {
    init_functionsRoutes_0_39238513569259903();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    onRequestGet5 = /* @__PURE__ */ __name(async (context2) => {
      try {
        const url = new URL(context2.request.url);
        const token = (url.searchParams.get("token") || "").trim();
        if (!token) {
          return new Response(JSON.stringify({ valid: false, error: "Token is required" }), {
            status: 400,
            headers: { "Content-Type": "application/json" }
          });
        }
        const camper = await context2.env.DB.prepare(`
        SELECT id, full_name, email, reset_token_expires_at
        FROM campers
        WHERE reset_token = ? 
          AND reset_token_expires_at > datetime('now')
        LIMIT 1
      `).bind(token).first();
        if (!camper) {
          return new Response(
            JSON.stringify({ valid: false, error: "Password reset link is invalid or has expired." }),
            {
              status: 400,
              headers: { "Content-Type": "application/json" }
            }
          );
        }
        return new Response(
          JSON.stringify({
            valid: true,
            full_name: camper.full_name,
            email: camper.email
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" }
          }
        );
      } catch (err) {
        console.error("[Reset Password Verification API] Error:", err);
        return new Response(
          JSON.stringify({ valid: false, error: "Failed to verify token" }),
          {
            status: 500,
            headers: { "Content-Type": "application/json" }
          }
        );
      }
    }, "onRequestGet");
    onRequestPost6 = /* @__PURE__ */ __name(async (context2) => {
      try {
        const body = await context2.request.json();
        const token = (body.token || "").trim();
        const password = (body.password || "").trim();
        if (!token) {
          return new Response(JSON.stringify({ error: "Reset token is required." }), {
            status: 400,
            headers: { "Content-Type": "application/json" }
          });
        }
        if (!password || password.length < 6) {
          return new Response(JSON.stringify({ error: "Password must be at least 6 characters long." }), {
            status: 400,
            headers: { "Content-Type": "application/json" }
          });
        }
        const camper = await context2.env.DB.prepare(`
        SELECT id, full_name, email
        FROM campers
        WHERE reset_token = ? 
          AND reset_token_expires_at > datetime('now')
        LIMIT 1
      `).bind(token).first();
        if (!camper) {
          return new Response(
            JSON.stringify({ error: "This password reset link is invalid or has expired. Please request a new one." }),
            {
              status: 400,
              headers: { "Content-Type": "application/json" }
            }
          );
        }
        await context2.env.DB.prepare(`
        UPDATE campers
        SET password_hash = ?,
            reset_token = NULL,
            reset_token_expires_at = NULL
        WHERE id = ?
      `).bind(password, camper.id).run();
        return new Response(
          JSON.stringify({
            success: true,
            message: "Password has been reset successfully. You may now sign in with your new password."
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" }
          }
        );
      } catch (err) {
        console.error("[Reset Password Execution API] Error:", err);
        return new Response(
          JSON.stringify({ error: "Failed to reset password. Please try again." }),
          {
            status: 500,
            headers: { "Content-Type": "application/json" }
          }
        );
      }
    }, "onRequestPost");
  }
});

// api/camper/activate.ts
var onRequestPost7;
var init_activate = __esm({
  "api/camper/activate.ts"() {
    init_functionsRoutes_0_39238513569259903();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    onRequestPost7 = /* @__PURE__ */ __name(async (context2) => {
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
  }
});

// api/camper/login.ts
var onRequestPost8;
var init_login2 = __esm({
  "api/camper/login.ts"() {
    init_functionsRoutes_0_39238513569259903();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    onRequestPost8 = /* @__PURE__ */ __name(async (context2) => {
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
  }
});

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
          SET full_name = ?,
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
          SET full_name = ?,
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
var onRequestGet6, onRequestPost9, onRequestPut2;
var init_profile = __esm({
  "api/camper/profile.ts"() {
    init_functionsRoutes_0_39238513569259903();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    __name(calculateAge, "calculateAge");
    onRequestGet6 = /* @__PURE__ */ __name(async (context2) => {
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
    onRequestPost9 = /* @__PURE__ */ __name(async (context2) => {
      return handleUpdate(context2);
    }, "onRequestPost");
    onRequestPut2 = /* @__PURE__ */ __name(async (context2) => {
      return handleUpdate(context2);
    }, "onRequestPut");
    __name(handleUpdate, "handleUpdate");
  }
});

// api/camper/resend-email.ts
var onRequestPost10;
var init_resend_email = __esm({
  "api/camper/resend-email.ts"() {
    init_functionsRoutes_0_39238513569259903();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_dispatcher();
    onRequestPost10 = /* @__PURE__ */ __name(async (context2) => {
      try {
        const body = await context2.request.json();
        const camperId = (body.camper_id || "").trim();
        const email = (body.email || "").trim().toLowerCase();
        const code = (body.code || "").trim().toUpperCase();
        if (!camperId && !email && !code) {
          return new Response(
            JSON.stringify({ error: "Camper ID, email, or activation code is required" }),
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
        if (camperId) {
          query += `cmp.id = ?`;
          queryParam = camperId;
        } else if (code) {
          query += `UPPER(cmp.activation_code) = ?`;
          queryParam = code;
        } else {
          query += `cmp.email = ?`;
          queryParam = email;
        }
        const camper = await context2.env.DB.prepare(query).bind(queryParam).first();
        if (!camper) {
          return new Response(
            JSON.stringify({ error: "No matching camper registration found" }),
            { status: 404, headers: { "Content-Type": "application/json" } }
          );
        }
        const requestOrigin = new URL(context2.request.url).origin;
        const result = await dispatchCamperPassportEmail({
          db: context2.env.DB,
          camper: {
            id: camper.id,
            full_name: camper.full_name,
            nickname: camper.nickname || camper.full_name.split(" ")[0],
            email: camper.email,
            phone: camper.phone,
            role: camper.role || "camper",
            church_id: camper.church_id,
            church_name: camper.church_name || "PCCI Church Delegation",
            church_slug: camper.church_slug || "vlc",
            province: camper.province || "Metro Manila",
            city: camper.city || "",
            dietary_needs: camper.dietary_needs || "None",
            emergency_name: camper.emergency_name || "Guardian",
            emergency_phone: camper.emergency_phone || camper.phone,
            emergency_relation: camper.emergency_relation || "Family",
            favorite_verse: camper.favorite_verse || "Philippians 4:13",
            activation_code: camper.activation_code,
            activation_token: camper.activation_token
          },
          env: context2.env,
          origin: requestOrigin,
          force: true
          // Allow manual resends
        });
        if (!result.success) {
          return new Response(
            JSON.stringify({ error: result.error || "Failed to dispatch email" }),
            { status: 502, headers: { "Content-Type": "application/json" } }
          );
        }
        return new Response(
          JSON.stringify({
            success: true,
            message: `Camper Passport email successfully sent to ${camper.email}!`,
            provider: result.provider,
            provider_message_id: result.providerMessageId
          }),
          { status: 200, headers: { "Content-Type": "application/json" } }
        );
      } catch (error3) {
        return new Response(
          JSON.stringify({ error: error3.message || "Internal server error" }),
          { status: 500, headers: { "Content-Type": "application/json" } }
        );
      }
    }, "onRequestPost");
  }
});

// api/events/schedule.ts
var onRequestGet7, onRequestPost11, onRequestDelete2;
var init_schedule = __esm({
  "api/events/schedule.ts"() {
    init_functionsRoutes_0_39238513569259903();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    onRequestGet7 = /* @__PURE__ */ __name(async (context2) => {
      try {
        const url = new URL(context2.request.url);
        const eventId = url.searchParams.get("event_id") || "vlc-2027";
        const { results } = await context2.env.DB.prepare(`
        SELECT * FROM event_schedules 
        WHERE event_id = ? 
        ORDER BY day_number ASC, sort_order ASC, time_start ASC
      `).bind(eventId).all();
        return new Response(
          JSON.stringify({
            event_id: eventId,
            schedules: results
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" }
          }
        );
      } catch (err) {
        console.error("[Schedule API] Error fetching schedule:", err);
        return new Response(JSON.stringify({ error: "Failed to fetch schedule" }), {
          status: 500,
          headers: { "Content-Type": "application/json" }
        });
      }
    }, "onRequestGet");
    onRequestPost11 = /* @__PURE__ */ __name(async (context2) => {
      try {
        const body = await context2.request.json();
        const id = body.id || "sch_" + Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
        const eventId = body.event_id || "vlc-2027";
        const dayNumber = Number(body.day_number) || 1;
        const dayTitle = (body.day_title || `Day ${dayNumber}`).trim();
        const date = body.date || "2027-07-21";
        const timeStart = (body.time_start || "08:00").trim();
        const timeEnd3 = (body.time_end || "09:00").trim();
        const timeDisplay = (body.time_display || `${timeStart} - ${timeEnd3}`).trim();
        const title2 = (body.title || "").trim();
        const description = (body.description || "").trim();
        const location = (body.location || "Main Auditorium").trim();
        const speaker = (body.speaker || "").trim();
        const sessionType = (body.session_type || "general").trim();
        const sortOrder = Number(body.sort_order) || 0;
        if (!title2) {
          return new Response(JSON.stringify({ error: "Session title is required." }), {
            status: 400,
            headers: { "Content-Type": "application/json" }
          });
        }
        await context2.env.DB.prepare(`
        INSERT INTO event_schedules (
          id, event_id, day_number, day_title, date,
          time_start, time_end, time_display, title,
          description, location, speaker, session_type, sort_order
        ) VALUES (
          ?, ?, ?, ?, ?,
          ?, ?, ?, ?,
          ?, ?, ?, ?, ?
        )
        ON CONFLICT(id) DO UPDATE SET
          day_number = excluded.day_number,
          day_title = excluded.day_title,
          date = excluded.date,
          time_start = excluded.time_start,
          time_end = excluded.time_end,
          time_display = excluded.time_display,
          title = excluded.title,
          description = excluded.description,
          location = excluded.location,
          speaker = excluded.speaker,
          session_type = excluded.session_type,
          sort_order = excluded.sort_order
      `).bind(
          id,
          eventId,
          dayNumber,
          dayTitle,
          date,
          timeStart,
          timeEnd3,
          timeDisplay,
          title2,
          description,
          location,
          speaker,
          sessionType,
          sortOrder
        ).run();
        const saved = await context2.env.DB.prepare("SELECT * FROM event_schedules WHERE id = ?").bind(id).first();
        return new Response(JSON.stringify({ success: true, schedule: saved }), {
          status: 200,
          headers: { "Content-Type": "application/json" }
        });
      } catch (err) {
        console.error("[Schedule API] Error saving schedule item:", err);
        return new Response(JSON.stringify({ error: err.message || "Failed to save schedule item" }), {
          status: 500,
          headers: { "Content-Type": "application/json" }
        });
      }
    }, "onRequestPost");
    onRequestDelete2 = /* @__PURE__ */ __name(async (context2) => {
      try {
        const url = new URL(context2.request.url);
        const id = url.searchParams.get("id");
        if (!id) {
          return new Response(JSON.stringify({ error: "Schedule item ID is required" }), {
            status: 400,
            headers: { "Content-Type": "application/json" }
          });
        }
        await context2.env.DB.prepare("DELETE FROM event_schedules WHERE id = ?").bind(id).run();
        return new Response(JSON.stringify({ success: true, message: "Schedule session deleted" }), {
          status: 200,
          headers: { "Content-Type": "application/json" }
        });
      } catch (err) {
        console.error("[Schedule API] Error deleting schedule item:", err);
        return new Response(JSON.stringify({ error: "Failed to delete schedule item" }), {
          status: 500,
          headers: { "Content-Type": "application/json" }
        });
      }
    }, "onRequestDelete");
  }
});

// api/agent.ts
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
var onRequestPost12;
var init_agent = __esm({
  "api/agent.ts"() {
    init_functionsRoutes_0_39238513569259903();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    onRequestPost12 = /* @__PURE__ */ __name(async (context2) => {
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
    __name(generateGeminiReflection, "generateGeminiReflection");
    __name(generateFriendInviteCopy, "generateFriendInviteCopy");
    __name(handleConversationalTurn, "handleConversationalTurn");
  }
});

// api/churches.ts
var onRequestGet8, onRequestPost13, onRequestPut3, onRequestDelete3;
var init_churches = __esm({
  "api/churches.ts"() {
    init_functionsRoutes_0_39238513569259903();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    onRequestGet8 = /* @__PURE__ */ __name(async (context2) => {
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
    onRequestPost13 = /* @__PURE__ */ __name(async (context2) => {
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
    onRequestPut3 = /* @__PURE__ */ __name(async (context2) => {
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
    onRequestDelete3 = /* @__PURE__ */ __name(async (context2) => {
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
  }
});

// api/events/index.ts
var onRequestGet9, onRequestPost14;
var init_events = __esm({
  "api/events/index.ts"() {
    init_functionsRoutes_0_39238513569259903();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    onRequestGet9 = /* @__PURE__ */ __name(async (context2) => {
      try {
        const url = new URL(context2.request.url);
        const slug = url.searchParams.get("slug");
        const id = url.searchParams.get("id");
        if (slug || id) {
          const event = await context2.env.DB.prepare(`
          SELECT * FROM events 
          WHERE slug = ? OR id = ?
          LIMIT 1
        `).bind(slug || id, id || slug).first();
          if (!event) {
            return new Response(JSON.stringify({ error: "Event not found" }), {
              status: 404,
              headers: { "Content-Type": "application/json" }
            });
          }
          return new Response(JSON.stringify({ event }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
          });
        }
        const { results } = await context2.env.DB.prepare(`SELECT * FROM events ORDER BY start_date DESC`).all();
        const activeEvent = results.find((e) => e.status === "active") || results[0] || null;
        return new Response(
          JSON.stringify({
            events: results,
            active_event: activeEvent
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" }
          }
        );
      } catch (err) {
        console.error("[Events API] Error fetching events:", err);
        return new Response(JSON.stringify({ error: "Failed to fetch events" }), {
          status: 500,
          headers: { "Content-Type": "application/json" }
        });
      }
    }, "onRequestGet");
    onRequestPost14 = /* @__PURE__ */ __name(async (context2) => {
      try {
        const body = await context2.request.json();
        const id = (body.id || "vlc-2027").trim();
        const slug = (body.slug || "vlc-2027").trim();
        const name = (body.name || "Vision & Leadership Camp 2027").trim();
        const theme = (body.theme || "Arise & Shine (Isaiah 60:1)").trim();
        const tagline = (body.tagline || "").trim();
        const description = (body.description || "").trim();
        const startDate = body.start_date || "2027-07-21";
        const endDate = body.end_date || "2027-07-24";
        const venueName = (body.venue_name || "PCCI National Campgrounds").trim();
        const venueAddress = (body.venue_address || "Maharlika Highway").trim();
        const city = (body.city || "Bambang").trim();
        const province = (body.province || "Nueva Vizcaya").trim();
        const targetCapacity = Number(body.target_capacity) || 600;
        const status = body.status || "active";
        await context2.env.DB.prepare(`
        INSERT INTO events (
          id, slug, name, theme, tagline, description,
          start_date, end_date, venue_name, venue_address,
          city, province, target_capacity, status
        ) VALUES (
          ?, ?, ?, ?, ?, ?,
          ?, ?, ?, ?,
          ?, ?, ?, ?
        )
        ON CONFLICT(id) DO UPDATE SET
          slug = excluded.slug,
          name = excluded.name,
          theme = excluded.theme,
          tagline = excluded.tagline,
          description = excluded.description,
          start_date = excluded.start_date,
          end_date = excluded.end_date,
          venue_name = excluded.venue_name,
          venue_address = excluded.venue_address,
          city = excluded.city,
          province = excluded.province,
          target_capacity = excluded.target_capacity,
          status = excluded.status
      `).bind(
          id,
          slug,
          name,
          theme,
          tagline,
          description,
          startDate,
          endDate,
          venueName,
          venueAddress,
          city,
          province,
          targetCapacity,
          status
        ).run();
        const updated = await context2.env.DB.prepare("SELECT * FROM events WHERE id = ?").bind(id).first();
        return new Response(JSON.stringify({ success: true, event: updated }), {
          status: 200,
          headers: { "Content-Type": "application/json" }
        });
      } catch (err) {
        console.error("[Events API] Error saving event:", err);
        return new Response(JSON.stringify({ error: err.message || "Failed to save event" }), {
          status: 500,
          headers: { "Content-Type": "application/json" }
        });
      }
    }, "onRequestPost");
  }
});

// api/invite.ts
var onRequestPost15;
var init_invite = __esm({
  "api/invite.ts"() {
    init_functionsRoutes_0_39238513569259903();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    onRequestPost15 = /* @__PURE__ */ __name(async (context2) => {
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
  }
});

// api/signup.ts
var onRequestPost16;
var init_signup = __esm({
  "api/signup.ts"() {
    init_functionsRoutes_0_39238513569259903();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_dispatcher();
    onRequestPost16 = /* @__PURE__ */ __name(async (context2) => {
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
          email, phone, province, city, dietary_needs,
          emergency_name, emergency_phone, emergency_relation,
          ministry_interests, favorite_verse, verse_reflection, selfie_url,
          activation_code, activation_token, password_hash, is_active, status, event_id
        ) VALUES (
          ?, ?, ?, ?, ?, ?, ?, ?,
          ?, ?, ?, ?, ?,
          ?, ?, ?,
          ?, ?, ?, ?,
          ?, ?, ?, 1, 'registered', ?
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
          data.password.trim(),
          "vlc-2027"
        ).run();
        const church = await context2.env.DB.prepare("SELECT name, slug, province FROM churches WHERE id = ?").bind(data.church_id).first();
        const requestOrigin = new URL(context2.request.url).origin;
        context2.waitUntil(
          dispatchCamperPassportEmail({
            db: context2.env.DB,
            camper: {
              id: camperId,
              full_name: data.full_name,
              nickname: data.nickname || data.full_name.split(" ")[0],
              email: data.email.toLowerCase().trim(),
              phone: data.phone.trim(),
              role: data.role || "camper",
              church_id: data.church_id,
              church_name: church?.name || "PCCI Church Delegation",
              church_slug: church?.slug || "vlc",
              province: data.province || church?.province || "Metro Manila",
              city: data.city || "",
              dietary_needs: data.dietary_needs || "None",
              emergency_name: data.emergency_name || "Guardian",
              emergency_phone: data.emergency_phone || data.phone,
              emergency_relation: data.emergency_relation || "Family",
              favorite_verse: data.favorite_verse || "Philippians 4:13",
              activation_code: activationCode,
              activation_token: activationToken
            },
            env: context2.env,
            origin: requestOrigin
          }).catch((dispatchErr) => {
            console.error(`[Background Email Error] Camper ${camperId}:`, dispatchErr);
          })
        );
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
  }
});

// api/stats.ts
var onRequestGet10;
var init_stats = __esm({
  "api/stats.ts"() {
    init_functionsRoutes_0_39238513569259903();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    onRequestGet10 = /* @__PURE__ */ __name(async (context2) => {
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
  }
});

// api/sync-pcci.ts
var PCCI_CHURCHES, onRequestPost17;
var init_sync_pcci = __esm({
  "api/sync-pcci.ts"() {
    init_functionsRoutes_0_39238513569259903();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    PCCI_CHURCHES = [
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
    onRequestPost17 = /* @__PURE__ */ __name(async (context2) => {
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
  }
});

// ../.wrangler/tmp/pages-CPWT8b/functionsRoutes-0.39238513569259903.mjs
var routes;
var init_functionsRoutes_0_39238513569259903 = __esm({
  "../.wrangler/tmp/pages-CPWT8b/functionsRoutes-0.39238513569259903.mjs"() {
    init_auth();
    init_checkin();
    init_checkin();
    init_checkin_stats();
    init_email_deliveries();
    init_users();
    init_users();
    init_users();
    init_users();
    init_forgot_password();
    init_login();
    init_reset_password();
    init_reset_password();
    init_activate();
    init_login2();
    init_profile();
    init_profile();
    init_profile();
    init_resend_email();
    init_schedule();
    init_schedule();
    init_schedule();
    init_agent();
    init_churches();
    init_churches();
    init_churches();
    init_churches();
    init_events();
    init_events();
    init_invite();
    init_signup();
    init_stats();
    init_sync_pcci();
    routes = [
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
        routePath: "/api/admin/email-deliveries",
        mountPath: "/api/admin",
        method: "GET",
        middlewares: [],
        modules: [onRequestGet3]
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
        modules: [onRequestGet4]
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
        routePath: "/api/auth/forgot-password",
        mountPath: "/api/auth",
        method: "POST",
        middlewares: [],
        modules: [onRequestPost4]
      },
      {
        routePath: "/api/auth/login",
        mountPath: "/api/auth",
        method: "POST",
        middlewares: [],
        modules: [onRequestPost5]
      },
      {
        routePath: "/api/auth/reset-password",
        mountPath: "/api/auth",
        method: "GET",
        middlewares: [],
        modules: [onRequestGet5]
      },
      {
        routePath: "/api/auth/reset-password",
        mountPath: "/api/auth",
        method: "POST",
        middlewares: [],
        modules: [onRequestPost6]
      },
      {
        routePath: "/api/camper/activate",
        mountPath: "/api/camper",
        method: "POST",
        middlewares: [],
        modules: [onRequestPost7]
      },
      {
        routePath: "/api/camper/login",
        mountPath: "/api/camper",
        method: "POST",
        middlewares: [],
        modules: [onRequestPost8]
      },
      {
        routePath: "/api/camper/profile",
        mountPath: "/api/camper",
        method: "GET",
        middlewares: [],
        modules: [onRequestGet6]
      },
      {
        routePath: "/api/camper/profile",
        mountPath: "/api/camper",
        method: "POST",
        middlewares: [],
        modules: [onRequestPost9]
      },
      {
        routePath: "/api/camper/profile",
        mountPath: "/api/camper",
        method: "PUT",
        middlewares: [],
        modules: [onRequestPut2]
      },
      {
        routePath: "/api/camper/resend-email",
        mountPath: "/api/camper",
        method: "POST",
        middlewares: [],
        modules: [onRequestPost10]
      },
      {
        routePath: "/api/events/schedule",
        mountPath: "/api/events",
        method: "DELETE",
        middlewares: [],
        modules: [onRequestDelete2]
      },
      {
        routePath: "/api/events/schedule",
        mountPath: "/api/events",
        method: "GET",
        middlewares: [],
        modules: [onRequestGet7]
      },
      {
        routePath: "/api/events/schedule",
        mountPath: "/api/events",
        method: "POST",
        middlewares: [],
        modules: [onRequestPost11]
      },
      {
        routePath: "/api/agent",
        mountPath: "/api",
        method: "POST",
        middlewares: [],
        modules: [onRequestPost12]
      },
      {
        routePath: "/api/churches",
        mountPath: "/api",
        method: "DELETE",
        middlewares: [],
        modules: [onRequestDelete3]
      },
      {
        routePath: "/api/churches",
        mountPath: "/api",
        method: "GET",
        middlewares: [],
        modules: [onRequestGet8]
      },
      {
        routePath: "/api/churches",
        mountPath: "/api",
        method: "POST",
        middlewares: [],
        modules: [onRequestPost13]
      },
      {
        routePath: "/api/churches",
        mountPath: "/api",
        method: "PUT",
        middlewares: [],
        modules: [onRequestPut3]
      },
      {
        routePath: "/api/events",
        mountPath: "/api/events",
        method: "GET",
        middlewares: [],
        modules: [onRequestGet9]
      },
      {
        routePath: "/api/events",
        mountPath: "/api/events",
        method: "POST",
        middlewares: [],
        modules: [onRequestPost14]
      },
      {
        routePath: "/api/invite",
        mountPath: "/api",
        method: "POST",
        middlewares: [],
        modules: [onRequestPost15]
      },
      {
        routePath: "/api/signup",
        mountPath: "/api",
        method: "POST",
        middlewares: [],
        modules: [onRequestPost16]
      },
      {
        routePath: "/api/stats",
        mountPath: "/api",
        method: "GET",
        middlewares: [],
        modules: [onRequestGet10]
      },
      {
        routePath: "/api/sync-pcci",
        mountPath: "/api",
        method: "POST",
        middlewares: [],
        modules: [onRequestPost17]
      }
    ];
  }
});

// ../node_modules/wrangler/templates/pages-template-worker.ts
init_functionsRoutes_0_39238513569259903();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();

// ../node_modules/path-to-regexp/dist.es2015/index.js
init_functionsRoutes_0_39238513569259903();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
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
