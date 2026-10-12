import assert from 'node:assert/strict';
import test, { type TestContext } from 'node:test';

import { AD_LOAD_DELAY_MS, afterDocumentAdDelay } from './ad-delay';

function browserClock(t: TestContext, elapsed = 0) {
  let now = elapsed;
  let id = 0;
  const timers = new Map<number, { at: number; run: () => void }>();
  const originalWindow = Object.getOwnPropertyDescriptor(globalThis, 'window');
  t.mock.method(performance, 'now', () => now);
  Object.defineProperty(globalThis, 'window', {
    configurable: true,
    value: {
      setTimeout(run: () => void, delay: number) {
        timers.set(++id, { at: now + delay, run });
        return id;
      },
      clearTimeout(timer: number) {
        timers.delete(timer);
      },
    },
  });
  t.after(() => {
    if (originalWindow) {
      Object.defineProperty(globalThis, 'window', originalWindow);
    } else {
      Reflect.deleteProperty(globalThis, 'window');
    }
  });
  return {
    timers,
    advance(ms: number) {
      now += ms;
      for (const [timer, task] of timers) {
        if (task.at > now) continue;
        timers.delete(timer);
        task.run();
      }
    },
    fireEarly() {
      const [timer, task] = timers.entries().next().value!;
      timers.delete(timer);
      task.run();
    },
  };
}

test('every ad stays blocked through 29,999 ms and starts at 30 seconds', (t) => {
  const clock = browserClock(t);
  const loaded: string[] = [];
  for (const ad of ['banner', 'native', 'social-bar']) {
    afterDocumentAdDelay(() => loaded.push(ad));
  }
  clock.advance(AD_LOAD_DELAY_MS - 1);
  assert.deepEqual(loaded, []);
  clock.advance(1);
  assert.deepEqual(loaded, ['banner', 'native', 'social-bar']);
  clock.advance(30_000);
  assert.equal(loaded.length, 3);
});

test('late hydration waits only the remainder of the document delay', (t) => {
  const clock = browserClock(t, 12_000);
  let loaded = false;
  afterDocumentAdDelay(() => (loaded = true));
  clock.advance(17_999);
  assert.equal(loaded, false);
  clock.advance(1);
  assert.equal(loaded, true);
});

test('SPA remounts and Strict Mode cleanup neither bypass nor restart the delay', (t) => {
  const clock = browserClock(t);
  const loaded: string[] = [];
  const cancel = afterDocumentAdDelay(() => loaded.push('unmounted'));
  clock.advance(10_000);
  cancel();
  afterDocumentAdDelay(() => loaded.push('remounted'));
  clock.advance(19_999);
  assert.deepEqual(loaded, []);
  clock.advance(1);
  assert.deepEqual(loaded, ['remounted']);
});

test('mounts after 30 seconds do not wait another 30 seconds', (t) => {
  const clock = browserClock(t, 45_000);
  let loads = 0;
  afterDocumentAdDelay(() => loads++);
  assert.equal(loads, 1);
  assert.equal(clock.timers.size, 0);
});

test('early timer callbacks recheck the document age', (t) => {
  const clock = browserClock(t);
  let loads = 0;
  afterDocumentAdDelay(() => loads++);
  clock.advance(29_999);
  clock.fireEarly();
  assert.equal(loads, 0);
  assert.equal(clock.timers.size, 1);
  clock.advance(1);
  assert.equal(loads, 1);
});

test('a fresh document starts with the full delay', (t) => {
  const clock = browserClock(t, 0);
  let loaded = false;
  afterDocumentAdDelay(() => (loaded = true));
  clock.advance(29_999);
  assert.equal(loaded, false);
  clock.advance(1);
  assert.equal(loaded, true);
});
