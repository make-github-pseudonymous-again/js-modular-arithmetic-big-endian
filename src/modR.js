import {
	_alloc as n_alloc,
	_copy as n_copy,
} from '@aureooms/js-integer-big-endian';

/**
 *
 * |x| >= k
 *
 */
export default function modR(k, x) {
	const xmodR = n_alloc(k); // TODO Use UintXArray ?
	n_copy(x, x.length - k, x.length, xmodR, 0);
	return xmodR;
}
