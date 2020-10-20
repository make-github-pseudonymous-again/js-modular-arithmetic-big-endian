import test from 'ava';

import {Montgomery} from '../../src';

const BASE = 10;

const mont = new Montgomery(BASE, [1, 9]);

test('F_19 zero', (t) => {
	t.deepEqual(mont.out(mont.zero()), []);
});
test('F_19 one', (t) => {
	t.deepEqual(mont.out(mont.one()), [1]);
});
