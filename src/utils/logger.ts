type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

/**
 * A simple structured logger that writes to the browser/Node console.
 *
 * Every message is prefixed with an ISO timestamp, the log level, and a
 * caller-supplied context label so log output is easy to filter:
 *
 *   [2026-03-04T05:46:54.329Z] [INFO] [MyComponent] Hello world
 *
 * Only messages at or above `minLevel` are emitted (default: `'info'`).
 * Pass `'debug'` to see verbose output during development.
 */
export class Logger {
  private readonly prefix: string;
  private readonly minLevel: LogLevel;

  constructor(prefix: string, minLevel: LogLevel = 'info') {
    this.prefix = prefix;
    this.minLevel = minLevel;
  }

  private shouldLog(level: LogLevel): boolean {
    return LOG_LEVELS[level] >= LOG_LEVELS[this.minLevel];
  }

  private format(level: LogLevel, message: string): string {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level.toUpperCase()}] [${this.prefix}] ${message}`;
  }

  debug(message: string, ...args: unknown[]): void {
    if (this.shouldLog('debug')) {
      console.debug(this.format('debug', message), ...args);
    }
  }

  info(message: string, ...args: unknown[]): void {
    if (this.shouldLog('info')) {
      console.info(this.format('info', message), ...args);
    }
  }

  warn(message: string, ...args: unknown[]): void {
    if (this.shouldLog('warn')) {
      console.warn(this.format('warn', message), ...args);
    }
  }

  error(message: string, ...args: unknown[]): void {
    if (this.shouldLog('error')) {
      console.error(this.format('error', message), ...args);
    }
  }
}

export function createLogger(prefix: string, minLevel: LogLevel = 'info'): Logger {
  return new Logger(prefix, minLevel);
}
