import test from 'ava';

import {parse, stringify} from '@aureooms/js-integer-big-endian';

import {Montgomery} from '../../../../src';

const REPRESENTATION_BASE = 10;
const DISPLAY_BASE = 10;

function mul(t, N, A, B, expected) {
	const n = parse(DISPLAY_BASE, REPRESENTATION_BASE, N);
	const mont = new Montgomery(REPRESENTATION_BASE, n);

	const a = parse(DISPLAY_BASE, REPRESENTATION_BASE, A);
	const b = parse(DISPLAY_BASE, REPRESENTATION_BASE, B);

	const _a = mont.from(a);
	const _b = mont.from(b);

	const _c = mont.mul(_a, _b);
	const c = mont.out(_c);

	const C = stringify(REPRESENTATION_BASE, DISPLAY_BASE, c, 0, c.length);

	t.is(expected, C);
}

mul.title = (_, N, A, B, expected) => `${A} * ${B} = ${expected} mod ${N}`;

// Test(mul, '2', '0', '0', '0');
// test(mul, '2', '0', '1', '0');
// test(mul, '2', '1', '0', '0');
// test(mul, '2', '1', '1', '1');

// test(mul, '2', '10', '51', '0');
// test(mul, '2', '13', '51', '1');

test(mul, '3', '2', '2', '1');

test(mul, '19', '0', '9', '0');
test(mul, '19', '7', '9', '6');
