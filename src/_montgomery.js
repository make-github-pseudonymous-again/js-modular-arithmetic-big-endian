import {
	_alloc as n_alloc,
	_zeros as n_zeros,
	_copy as n_copy,
	_mul as n_mul,
	_idivmod as n_idivmod,
	_sub as n_sub,
	_extended_euclidean_algorithm as n_extended_euclidean_algorithm,
} from '@aureooms/js-integer-big-endian';

import _redc from './_redc';

/**
 *
 * N has no leading zeroes
 *
 * @param {Number} b the radix
 * @param {Array} N number array of length k.
 *
 *
 *
 *
 */
export default function _montgomery(b, N) {
	const k = N.length;

	const _2kp1 = 2 * k + 1;
	const _R = n_zeros(_2kp1);
	_R[k] = 1; // B^k

	const [
		GCD,
		GCDi,
		// eslint-disable-next-line no-unused-vars
		_S,
		// eslint-disable-next-line no-unused-vars
		_Si,
		_M,
		// eslint-disable-next-line no-unused-vars
		_1,
		// eslint-disable-next-line no-unused-vars
		_2,
		// eslint-disable-next-line no-unused-vars
		_3,
		// eslint-disable-next-line no-unused-vars
		_4,
		// eslint-disable-next-line no-unused-vars
		_5,
		steps,
	] = n_extended_euclidean_algorithm(b, _R, k, _2kp1, N, 0, k);

	// Assert that GCD(R,N) is 1.
	if (GCD.length - GCDi !== 1 || GCD[GCDi] !== 1)
		throw new Error('Montgomery: GCD(R,N) is not 1.');

	const M = n_alloc(k); // M mod R on k words
	if (steps % 2 === 0) {
		// We use _R[0:k] because it is filled with zeros.
		n_sub(b, _R, 0, k, _M, _M.length - k, _M.length, M, 0, k); // _M.length-k is always 1 ?
	} else {
		n_copy(_M, _M.length - k, _M.length, M, 0); // _M.length-k is always 1 ?
	}

	// R^2 mod N
	const _R2 = n_zeros(_2kp1);
	_R2[0] = 1;
	n_idivmod(b, _R2, 0, _2kp1, N, 0, k, _R, 0, _2kp1); // Use mod only function once implemented
	const R2 = n_alloc(k); // R^2 mod N on k words
	n_copy(_R2, k + 1, _2kp1, R2, 0);

	// Avoid using division for the computation of the other constants.
	// From Wikipedia:
	// Performing these operations requires knowing at least N′ and R2 mod N.
	// When R is a power of a small positive integer b, N′ can be computed by
	// Hensel's lemma: The inverse of N modulo b is computed by a naive
	// algorithm (for instance, if b = 2 then the inverse is 1), and Hensel's
	// lemma is used repeatedly to find the inverse modulo higher and higher
	// powers of b, stopping when the inverse modulo R is known; N′ is the
	// negation of this inverse. The constants R mod N and R3 mod N can be
	// generated as REDC(R2 mod N) and as REDC((R2 mod N)(R2 mod N)). The
	// fundamental operation is to compute REDC of a product. When standalone
	// REDC is needed, it can be computed as REDC of a product with 1 mod N. The
	// only place where a direct reduction modulo N is necessary is in the
	// precomputation of R2 mod N.

	// R mod N = REDC(R^2 mod N)
	_redc(b, k, N, 0, k, M, 0, k, _R2, 0, _2kp1);
	const R = n_alloc(k); // R mod N on k words
	n_copy(_R2, k + 1, _2kp1, R, 0);

	// R^3 mod N = REDC((R^2 mod N)(R^2 mod N))
	const _R3 = n_zeros(_2kp1);
	n_mul(b, R2, 0, k, R2, 0, k, _R3, 1, _2kp1);
	_redc(b, k, N, 0, k, M, 0, k, _R3, 0, _2kp1);
	const R3 = n_alloc(k); // R^3 mod N on k words
	n_copy(_R3, k + 1, _2kp1, R3, 0);

	// Console.debug({b, N, k, M, R, R2, R3});
	return {k, M, R, R2, R3};
}
