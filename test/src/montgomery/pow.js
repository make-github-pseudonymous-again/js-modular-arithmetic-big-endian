import test from 'ava';

import {parse, stringify} from '@aureooms/js-integer-big-endian';

import iter from '../../fixtures/iter.js';
import fmt from '../../fixtures/fmt.js';

import {Montgomery} from '../../../src/index.js';

const compute = {
	pow: (m, a, b, nonneg) => m.pow(a, b, nonneg),
};

function macro(t, R, D, o, N, A, B, expected) {
	const n = parse(D, R, N);
	const mont = new Montgomery(R, n);

	const a = parse(D, R, A);
	const nonneg = B[0] !== '-';
	if (!nonneg) B = B.slice(1);
	const b = parse(D, R, B);

	const _a = mont.from(a);

	const _c = compute[o](mont, _a, b, nonneg);
	const a_ = mont.out(_a);
	const c = mont.out(_c);

	const A_ = stringify(R, D, a_, 0, a_.length);
	const B_ = stringify(R, D, b, 0, b.length);
	const C = stringify(R, D, c, 0, c.length);

	t.is(A, A_);
	t.is(B, B_);
	t.is(expected, C);
}

macro.title = (_, R, D, o, N, A, B, expected) =>
	`[${R}] ${o}(${fmt(A)}_${D},${fmt(B)}_${D}) = ${fmt(expected)}_${D} mod ${fmt(
		N,
	)}_${D}`;

iter('generated/montgomery/pow', test, macro);
