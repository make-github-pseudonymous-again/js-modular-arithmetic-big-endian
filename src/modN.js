import {
	_alloc,
	_zeros,
	_copy,
	_idivmod,
	_trim_positive,
	_cmp_n
} from '@aureooms/js-integer-big-endian';

import modR from './modR';

export default function (r, N, x) {
	const k = N.length;
	const xj = x.length;
	const xi = _trim_positive(x, 0, xj);
	const xn = xj - xi;
	if (xn > k || (xn === k && _cmp_n(x, xi, xj, N, 0) >= 0)) {
		const xmodN = _alloc(xn); // TODO Use UintXArray ?
		_copy(x, xi, xj, xmodN, 0);
		const _ = _zeros(xn); // TODO use _imod once implemented
		_idivmod(r, xmodN, 0, xn, N, 0, k, _, 0, xn);
		return modR(k, xmodN);
	}

	const xmodN = _zeros(k); // TODO Use UintXArray ?
	_copy(x, xi, xj, xmodN, k - xn);
	return xmodN;
}
