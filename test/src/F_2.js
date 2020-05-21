import test from 'ava';

import {Montgomery} from '../../src';

const BASE = 3;

const mont = new Montgomery(BASE, [2]);

test('F_2 zero', (t) => {
	t.deepEqual([], mont.out(mont.zero()));
});
test('F_2 one', (t) => {
	t.deepEqual([1], mont.out(mont.one()));
});

test('F_2 base 10 throws', (t) => {
	t.throws(() => new Montgomery(10, [2]), {message: /GCD/});
});
