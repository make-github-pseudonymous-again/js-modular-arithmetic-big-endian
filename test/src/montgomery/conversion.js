import test from 'ava';

import {parse, stringify} from '@aureooms/js-integer-big-endian';

import iter from '../../fixtures/iter.js';
import fmt from '../../fixtures/fmt.js';

import {Montgomery} from '../../../src/index.js';

function macro(t, R, D, N, A, expected) {
	const n = parse(D, R, N);
	const mont = new Montgomery(R, n);

	const a = parse(D, R, A);

	const _amodN = mont.from(a);

	const amodN = mont.out(_amodN);

	const AmodN = stringify(R, D, amodN, 0, amodN.length);

	t.is(expected, AmodN);
}

macro.title = (_, R, D, N, A, expected) =>
	`[${R}] ${fmt(A)}_${D} = ${fmt(expected)}_${D} mod ${fmt(N)}_${D}`;

test(macro, 10, 10, '13', '125', '8');
test(macro, 10, 10, '497', '4', '4');
test(macro, 10, 10, '497', '16', '16');
test(macro, 10, 10, '497', '64', '64');
test(macro, 10, 10, '497', '256', '256');
test(macro, 10, 10, '497', '1024', '30');
test(macro, 10, 10, '497', '120', '120');
test(macro, 10, 10, '497', '480', '480');
test(macro, 10, 10, '497', '1920', '429');
test(macro, 10, 10, '497', '1716', '225');
test(macro, 10, 10, '497', '900', '403');
test(macro, 10, 10, '497', '1612', '121');
test(macro, 10, 10, '497', '484', '484');
test(macro, 10, 10, '497', '1936', '445');

iter('generated/montgomery/conversion', test, macro);
