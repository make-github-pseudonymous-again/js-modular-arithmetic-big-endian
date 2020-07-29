import {_mul as n_mul} from '@aureooms/js-integer-big-endian';

import _redc from './_redc';

//
// mul by non montgomery ?
// abR mod N = (aR mod N)(b mod N) MODULO????

/**
 *
 * abR mod N = REDC((aR mod N)(bR mod N))
 *
 *
 * |N| >= |a| >= |b|
 * |c| = 2*|N| + 1
 * c = 0000.0000 is zero initialized
 *
 */

export default function _mul(r, N, M, a, b, c) {
	const k = N.length;
	const _2kp1 = 2 * k + 1;

	if (a.length > k) throw new Error('|a| > |N|');
	if (b.length > a.length) throw new Error('|b| > |a|');
	if (c.length !== _2kp1) throw new Error('|c| !== 2*k+1');

	// C = (aR mod N)(bR mod N)
	n_mul(
		r,
		a,
		0,
		a.length,
		b,
		0,
		b.length,
		c,
		_2kp1 - a.length - b.length,
		_2kp1
	);

	// C = REDC((aR mod N)(bR mod N))
	return _redc(r, k, N, 0, k, M, 0, k, c, 0, _2kp1);
}
