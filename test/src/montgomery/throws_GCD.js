import test from 'ava';

import {Montgomery} from '../../../src';
import {parse} from '@aureooms/js-integer-big-endian';

const DISPLAY_BASE = 10;

function throws(t, b, N) {
	const n = parse(DISPLAY_BASE, b, N);
	t.throws(() => new Montgomery(b, n), {message: /GCD/});
}

throws.title = (_, b, N) => `Montgomery(${b}, ${N}) throws because of GCD.`;

test(throws, 10, '2');
test(throws, 10, '5');
test(throws, 10, '10');
test(throws, 10, '12');
test(throws, 10, '242');
test(throws, 10, '385');
test(throws, 10, '490');

test(throws, 100, '12');

test(throws, 82733, '82733');
