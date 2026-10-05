import assert from 'node:assert/strict';
import test from 'node:test';

import { readChecklist, saveChecklist } from './checklist-storage';

function store(initial: string | null = null) {
  let data = initial;
  return {
    getItem: () => data,
    setItem: (_key: string, value: string) => {
      data = value;
    },
    removeItem: () => {
      data = null;
    },
  };
}
test('checks survive a fresh read and reset removes them', () => {
  const storage = store();
  assert.equal(
    saveChecklist(() => storage, ['material', 'scan']),
    true
  );
  assert.deepEqual(
    readChecklist(() => storage),
    { checks: ['material', 'scan'], error: false }
  );
  assert.equal(
    saveChecklist(() => storage, [], true),
    true
  );
  assert.deepEqual(
    readChecklist(() => storage),
    { checks: [], error: false }
  );
});
test('corrupt JSON and unrecognized data cannot mark work completed', () => {
  for (const raw of ['{', 'null', '{}', '[true]', '["unknown"]'])
    assert.deepEqual(
      readChecklist(() => store(raw)),
      { checks: [], error: true }
    );
  assert.deepEqual(
    readChecklist(() => store('["scan","scan"]')),
    { checks: ['scan'], error: false }
  );
});
test('storage access denied or write quota failures return visible error state', () => {
  const denied = () => {
    throw new Error('Storage denied');
  };
  assert.deepEqual(readChecklist(denied), { checks: [], error: true });
  assert.equal(saveChecklist(denied, ['scan']), false);
  assert.equal(saveChecklist(denied, [], true), false);
  const storage = {
    getItem: () => null,
    setItem: () => {
      throw new Error('Quota exceeded');
    },
    removeItem: () => {},
  };
  assert.equal(
    saveChecklist(() => storage, ['scan']),
    false
  );
});
