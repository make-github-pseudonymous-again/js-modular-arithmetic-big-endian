import test from 'ava';

import {parse, stringify} from '@aureooms/js-integer-big-endian';

import iter from '../../../fixtures/iter.js';
import fmt from '../../../fixtures/fmt.js';

import {Montgomery} from '../../../../src';

const compute = {
	'pow': (m, a, b, nonneg) => m.pow(a, b, nonneg),
};

function throws(t, R, D, o, N, A, B) {
    const n = parse(D, R, N);
    const mont = new Montgomery(R, n);

    const a = parse(D, R, A);
    const nonneg = B[0] !== '-' ;
    if (!nonneg) B = B.slice(1);
    const b = parse(D, R, B);

    const _a = mont.from(a);

    t.throws(() => compute[o](mont, _a, b, nonneg), {message: /no inverse/});
    const a_ = mont.out(_a);

    const A_ = stringify(R, D, a_, 0, a_.length);
    const B_ = stringify(R, D, b, 0, b.length);

    t.is(A, A_);
    t.is(B, B_);
}

throws.title = ( _ , R, D, o, N , A , B ) =>
	`[${R}] ${o}(${fmt(A)}_${D},${fmt(B)}_${D}) mod ${fmt(N)}_${D} is not defined (${fmt(A)}_${D} has no inverse)` ;

iter('generated/montgomery/throws/no-inverse', test, throws);
