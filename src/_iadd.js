import {
	_iadd,
	_isub,
	_cmp,
	_cmp_n,
} from '@aureooms/js-integer-big-endian' ;

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
 * a < N
 * b < N
 *
 * t = a + b mod r^k
 * if t < b or t >= N then return t - N mod r^k
 * else return t // Can subtract dummy zero vector here in case we want
 *               // to avoid side channel attacks
 *
 */
export default function ( r , N , a , b ) {

	const k = N.length ;

	if (a.length !== k) throw new Error('|a| !== k') ;
	if (b.length > k) throw new Error('|b| > k') ;

	_iadd(r, a, 0, k, b, 0, b.length) ;
	// TODO  Use overflow bit.
	//const overflow = _iadd(r, a, 0, k, b, 0, b.length) ;

	if (
		// overflow ||
		_cmp(a, 0, k, b, 0, b.length) < 0 ||
		_cmp_n(a, 0, k, N, 0, k) >= 0 ||
	) {
		_isub(a, 0, k, N, 0, k) ;
		return true;
	}
	else return false;

}
