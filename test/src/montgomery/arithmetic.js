import test from 'ava';

import {parse, stringify} from '@aureooms/js-integer-big-endian';

import iter from '../../fixtures/iter.js';

import {Montgomery} from '../../../src/index.js';

const compute = {
	mul: (m, a, b) => m.mul(a, b),
	add: (m, a, b) => m.add(a, b),
	sub: (m, a, b) => m.sub(a, b),
};

function macro(t, REPRESENTATION_BASE, DISPLAY_BASE, o, N, A, B, expected) {
	const n = parse(DISPLAY_BASE, REPRESENTATION_BASE, N);
	const mont = new Montgomery(REPRESENTATION_BASE, n);

	const a = parse(DISPLAY_BASE, REPRESENTATION_BASE, A);
	const b = parse(DISPLAY_BASE, REPRESENTATION_BASE, B);

	const _a = mont.from(a);
	const _b = mont.from(b);

	const _c = compute[o](mont, _a, _b);
	const c = mont.out(_c);

	const C = stringify(REPRESENTATION_BASE, DISPLAY_BASE, c, 0, c.length);

	t.is(expected, C);
}

macro.title = (_, R, D, o, N, A, B, expected) =>
	`[${R}] ${o}(${A}_${D}, ${B}_${D}) = ${expected}_${D} mod ${N}_${D}`;

iter('generated/montgomery/arithmetic', test, macro);
