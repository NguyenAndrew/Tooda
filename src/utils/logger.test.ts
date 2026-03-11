import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Logger, createLogger } from './logger';

describe('Logger', () => {
  let debugSpy: ReturnType<typeof vi.spyOn>;
  let infoSpy: ReturnType<typeof vi.spyOn>;
  let warnSpy: ReturnType<typeof vi.spyOn>;
  let errorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    debugSpy = vi.spyOn(console, 'debug').mockImplementation(() => {});
    infoSpy = vi.spyOn(console, 'info').mockImplementation(() => {});
    warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('default minLevel (info)', () => {
    it('emits info messages', () => {
      const logger = new Logger('Test');
      logger.info('hello');
      expect(infoSpy).toHaveBeenCalledOnce();
      expect(infoSpy.mock.calls[0][0]).toMatch(/\[INFO\] \[Test\] hello/);
    });

    it('emits warn messages', () => {
      const logger = new Logger('Test');
      logger.warn('warning');
      expect(warnSpy).toHaveBeenCalledOnce();
      expect(warnSpy.mock.calls[0][0]).toMatch(/\[WARN\] \[Test\] warning/);
    });

    it('emits error messages', () => {
      const logger = new Logger('Test');
      logger.error('oops');
      expect(errorSpy).toHaveBeenCalledOnce();
      expect(errorSpy.mock.calls[0][0]).toMatch(/\[ERROR\] \[Test\] oops/);
    });

    it('suppresses debug messages', () => {
      const logger = new Logger('Test');
      logger.debug('verbose');
      expect(debugSpy).not.toHaveBeenCalled();
    });

    it('passes extra args to the console method', () => {
      const logger = new Logger('Test');
      const extra = { key: 'value' };
      logger.info('msg', extra);
      expect(infoSpy).toHaveBeenCalledOnce();
      expect(infoSpy.mock.calls[0][1]).toBe(extra);
    });
  });

  describe('minLevel debug', () => {
    it('emits debug messages when minLevel is debug', () => {
      const logger = new Logger('App', 'debug');
      logger.debug('trace');
      expect(debugSpy).toHaveBeenCalledOnce();
      expect(debugSpy.mock.calls[0][0]).toMatch(/\[DEBUG\] \[App\] trace/);
    });

    it('still emits info, warn and error', () => {
      const logger = new Logger('App', 'debug');
      logger.info('i');
      logger.warn('w');
      logger.error('e');
      expect(infoSpy).toHaveBeenCalledOnce();
      expect(warnSpy).toHaveBeenCalledOnce();
      expect(errorSpy).toHaveBeenCalledOnce();
    });
  });

  describe('minLevel warn', () => {
    it('suppresses info messages', () => {
      const logger = new Logger('App', 'warn');
      logger.info('quiet');
      expect(infoSpy).not.toHaveBeenCalled();
    });

    it('suppresses debug messages', () => {
      const logger = new Logger('App', 'warn');
      logger.debug('quiet');
      expect(debugSpy).not.toHaveBeenCalled();
    });

    it('emits warn messages', () => {
      const logger = new Logger('App', 'warn');
      logger.warn('loud');
      expect(warnSpy).toHaveBeenCalledOnce();
    });

    it('emits error messages', () => {
      const logger = new Logger('App', 'warn');
      logger.error('loud');
      expect(errorSpy).toHaveBeenCalledOnce();
    });
  });

  describe('minLevel error', () => {
    it('suppresses warn messages', () => {
      const logger = new Logger('App', 'error');
      logger.warn('quiet');
      expect(warnSpy).not.toHaveBeenCalled();
    });

    it('emits error messages', () => {
      const logger = new Logger('App', 'error');
      logger.error('loud');
      expect(errorSpy).toHaveBeenCalledOnce();
    });

    it('suppresses error messages when an unknown minLevel makes shouldLog return false', () => {
      // shouldLog('error') is normally always true because 'error' is the highest
      // valid log level. This test forces the false branch by injecting an invalid
      // minLevel at runtime (bypassing TypeScript's type system).
      const logger = new Logger('App', 'error');
      (logger as unknown as Record<string, unknown>)['minLevel'] = 'fatal';
      logger.error('suppressed');
      expect(errorSpy).not.toHaveBeenCalled();
    });
  });

  describe('format', () => {
    it('includes an ISO timestamp', () => {
      const logger = new Logger('Ctx');
      logger.info('test');
      const msg = infoSpy.mock.calls[0][0] as string;
      expect(msg).toMatch(/^\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d+Z\]/);
    });
  });
});

describe('createLogger', () => {
  it('returns a Logger with the given prefix (default info level)', () => {
    const infoSpy = vi.spyOn(console, 'info').mockImplementation(() => {});
    const logger = createLogger('Factory');
    logger.info('hi');
    expect(infoSpy.mock.calls[0][0]).toMatch(/\[INFO\] \[Factory\] hi/);
    infoSpy.mockRestore();
  });

  it('returns a Logger that respects an explicit minLevel', () => {
    const debugSpy = vi.spyOn(console, 'debug').mockImplementation(() => {});
    const logger = createLogger('Factory', 'debug');
    logger.debug('verbose');
    expect(debugSpy).toHaveBeenCalledOnce();
    debugSpy.mockRestore();
  });
});
