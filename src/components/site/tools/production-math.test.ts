import assert from 'node:assert/strict';
import test from 'node:test';

import {
  calculateProduction,
  parseMeasurement,
  type ProductionInputs,
} from './production-math';

const input: ProductionInputs = {
  rates: ['20', '10', '15'],
  stock: '100',
  price: '5',
  investment: '100',
  operating: '10',
};
test('observed rates set capacity, stock duration, profit and payback', () => {
  const output = calculateProduction(input);
  assert.ok(output.result);
  assert.deepEqual(output.result, {
    capacity: 10,
    bottlenecks: [2],
    duration: 10,
    revenue: 500,
    profit: 300,
    margin: 40,
    payback: 2.5,
    stock: 100,
  });
});
test('all tied bottlenecks are reported', () => {
  const output = calculateProduction({ ...input, rates: ['10', '20', '10'] });
  assert.deepEqual(output.result?.bottlenecks, [1, 3]);
});
test('empty, negative, malformed and non-finite measurements are rejected', () => {
  for (const raw of [
    '',
    ' ',
    '-1',
    'NaN',
    'Infinity',
    '1e309',
    '0x10',
    '1,5',
    '1 unit',
  ])
    assert.equal(parseMeasurement(raw), null, raw);
  assert.equal(parseMeasurement('0'), 0);
  assert.equal(parseMeasurement('.5'), 0.5);
  assert.equal(parseMeasurement('1e2'), 100);
  assert.equal(calculateProduction({ ...input, price: '' }).error, 'invalid');
  assert.equal(calculateProduction({ ...input, rates: [] }).error, 'invalid');
});
test('zero throughput cannot manufacture stock or claim payback', () => {
  const result = calculateProduction({
    ...input,
    rates: ['20', '0', '15'],
  }).result;
  assert.ok(result);
  assert.equal(result.capacity, 0);
  assert.equal(result.duration, null);
  assert.equal(result.revenue, 0);
  assert.equal(result.profit, null);
  assert.equal(result.payback, null);
});
test('zero stock takes zero time and incurs no operating cost', () => {
  const result = calculateProduction({ ...input, stock: '0' }).result;
  assert.ok(result);
  assert.equal(result.duration, 0);
  assert.equal(result.revenue, 0);
  assert.equal(result.profit, -100);
});
test('negative and zero margins never produce a payback time', () => {
  for (const operating of ['50', '60'])
    assert.equal(
      calculateProduction({ ...input, operating }).result?.payback,
      null
    );
  assert.equal(
    calculateProduction({ ...input, price: '0' }).result?.payback,
    null
  );
});
test('short batches retain finite theoretical payback beyond the available stock', () => {
  const result = calculateProduction({ ...input, stock: '10' }).result;
  assert.ok(result);
  assert.equal(result.duration, 1);
  assert.equal(result.payback, 2.5);
  assert.ok(result.payback! > result.duration!);
  assert.equal(result.profit, -60);
});
test('zero investment is recovered immediately with a positive running margin', () => {
  assert.equal(
    calculateProduction({ ...input, investment: '0' }).result?.payback,
    0
  );
});
test('finite inputs that overflow calculated values are rejected', () => {
  assert.equal(
    calculateProduction({ ...input, stock: '1e308', price: '1e308' }).error,
    'overflow'
  );
  assert.equal(
    calculateProduction({ ...input, rates: ['1e-320'] }).error,
    'overflow'
  );
});
