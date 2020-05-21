import {_alloc, _copy} from '@aureooms/js-integer-big-endian';

/**
 *
 * |x| >= k
 *
 */
export default function (k, x) {
	const xmodR = _alloc(k); // TODO Use UintXArray ?
	_copy(x, x.length - k, x.length, xmodR, 0);
	return xmodR;
}
