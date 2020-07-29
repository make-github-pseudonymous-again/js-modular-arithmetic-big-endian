import test from 'ava';

import {parse, stringify} from '@aureooms/js-integer-big-endian';

import {Montgomery} from '../../../../src';

const REPRESENTATION_BASE = 10;
const DISPLAY_BASE = 10;

function mod(t, N, A, expected) {
	const n = parse(DISPLAY_BASE, REPRESENTATION_BASE, N);
	const mont = new Montgomery(REPRESENTATION_BASE, n);

	const a = parse(DISPLAY_BASE, REPRESENTATION_BASE, A);

	const _amodN = mont.from(a);

	const amodN = mont.out(_amodN);

	const AmodN = stringify(
		REPRESENTATION_BASE,
		DISPLAY_BASE,
		amodN,
		0,
		amodN.length,
	);

	t.is(expected, AmodN);
}

mod.title = (_, N, A, expected) => `${A} = ${expected} mod ${N}`;

test(mod, '13', '125', '8');
test(mod, '497', '4', '4');
test(mod, '497', '16', '16');
test(mod, '497', '64', '64');
test(mod, '497', '256', '256');
test(mod, '497', '1024', '30');
test(mod, '497', '120', '120');
test(mod, '497', '480', '480');
test(mod, '497', '1920', '429');
test(mod, '497', '1716', '225');
test(mod, '497', '900', '403');
test(mod, '497', '1612', '121');
test(mod, '497', '484', '484');
test(mod, '497', '1936', '445');
