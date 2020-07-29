import {
	_iadd as n_iadd,
	_isub as n_isub,
	_cmp as n_cmp,
} from '@aureooms/js-integer-big-endian';

/**
 *
 * @param {Number} r the radix
 * @param {Array} N number array of length k.
 * @param {Array} a
 * @param {Array} b
 *
 * (a+b)R mod N = aR mod N - bR mod N + ( 0/1 * N )
 *
 * R = r^k
 * N has no leading zeroes
 * N has length k
 * |N| = |a| >= |b|
 * |a| = |b| if you want to avoid side channel attacks
 * a < N
 * b < N
 *
 * t = a - b mod r^k
 * if a < b then return t + N mod r^k
 * else return t // Can add dummy zero vector here in case we want
 *               // to avoid side channel attacks
 *
 */
export default function _isub(r, N, a, b) {
	const k = N.length;

	if (a.length !== k) throw new Error('|a| !== k');
	if (b.length > k) throw new Error('|b| > k');

	const underflow = n_cmp(a, 0, k, b, 0, b.length) < 0;
	n_isub(r, a, 0, k, b, 0, b.length);
	// TODO  Use underflow bit.
	// const underflow = n_isub(r, a, 0, k, b, 0, b.length) ;
	if (underflow) {
		n_iadd(r, a, 0, k, N, 0, k); // Exploits wrapping
		return true;
	}

	return false;
}
