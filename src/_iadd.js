import assert from 'assert';
import {
	_iadd as n_iadd,
	_isub as n_isub,
	_cmp as n_cmp,
	_cmp_n as n_cmp_n,
} from '@arithmetic-operations-for/naturals-big-endian';

/**
 *
 * @param {Number} r the radix
 * @param {Array} N number array of length k.
 * @param {Array} a
 * @param {Array} b
 *
 * (a+b)R mod N = aR mod N + bR mod N - ( 0/1 * N )
 *
 * R = r^k
 * N has no leading zeroes
 * N has length k
 * |N| = |a| >= |b|
 * |a| = |b| if you want to avoid side channel attacks
 * a < N
 * b < N
 *
 * t = a + b mod r^k
 * if t < b or t >= N then return t - N mod r^k
 * else return t // Can subtract dummy zero vector here in case we want
 *               // to avoid side channel attacks
 *
 */
export default function _iadd(r, N, a, b) {
	const k = N.length;

	assert(k >= 1);
	assert(N[0] !== 0);
	assert(a.length === k, '|a| !== k');
	assert(b.length <= k, '|b| > k');

	n_iadd(r, a, 0, k, b, 0, b.length);
	// TODO  Use overflow bit.
	// const overflow = _iadd(r, a, 0, k, b, 0, b.length) ;

	if (
		// Overflow
		n_cmp(a, 0, k, b, 0, b.length) < 0 ||
		n_cmp_n(a, 0, k, N, 0) >= 0
	) {
		n_isub(r, a, 0, k, N, 0, k); // Exploits wrapping
		return true;
	}

	return false;
}
