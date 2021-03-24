import {
	_alloc as n_alloc,
	_zeros as n_zeros,
	_copy as n_copy,
	_idivmod as n_idivmod,
	_trim_positive as n_trim_positive,
	_cmp_n as n_cmp_n,
} from '@aureooms/js-integer-big-endian';

import modR from './modR.js';

export default function modN(r, N, x) {
	const k = N.length;
	const xj = x.length;
	const xi = n_trim_positive(x, 0, xj);
	const xn = xj - xi;
	if (xn > k || (xn === k && n_cmp_n(x, xi, xj, N, 0) >= 0)) {
		const xmodN = n_alloc(xn); // TODO Use UintXArray ?
		n_copy(x, xi, xj, xmodN, 0);
		const _ = n_zeros(xn); // TODO use _imod once implemented
		n_idivmod(r, xmodN, 0, xn, N, 0, k, _, 0, xn);
		return modR(k, xmodN);
	}

	const xmodN = n_zeros(k); // TODO Use UintXArray ?
	n_copy(x, xi, xj, xmodN, k - xn);
	return xmodN;
}
