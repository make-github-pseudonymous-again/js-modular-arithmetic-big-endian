import test from 'ava';

import {parse} from '@arithmetic-operations-for/naturals-big-endian';

import iter from '../../../fixtures/iter.js';

import {Montgomery} from '#module';

function throws(t, b, D, N) {
	const n = parse(D, b, N);
	t.throws(() => new Montgomery(b, n), {message: /GCD/});
}

throws.title = (_, b, D, N) =>
	`Montgomery(${b}, ${N}_${D}) throws because of GCD.`;

test(throws, 10, 10, '10');
test(throws, 10, 10, '12');
test(throws, 10, 10, '242');
test(throws, 10, 10, '385');
test(throws, 10, 10, '490');

test(throws, 100, 10, '12');

test(throws, 82_733, 10, '82733');

iter('generated/montgomery/throws/gcd', test, throws);
