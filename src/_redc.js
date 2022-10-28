import assert from 'assert';
import {
	_zeros as n_zeros,
	_copy as n_copy,
	_reset as n_reset,
	_cmp_n as n_cmp_n,
	_mul as n_mul,
	_iadd as n_iadd,
	_isub as n_isub,
} from '@arithmetic-operations-for/naturals-big-endian';

/**
 * Function REDC is
 *
 *  input: Integers R = b^k > N with gcd(R, N) = 1,
 *         Integer M in [0, R − 1] such that NM ≡ −1 mod R,
 *         Integer T in the range [0, RN − 1]
 *
 *         All numbers are given in base b (big endian order).
 *  output: Integer S in the range [0, N − 1] such that S ≡ TR−1 mod N
 *
 *  m ← ((T mod R)M) mod R // Can be implemented by discarding limbs
 *  t ← (T + mN) / R // Can be implemented with a shift
 *  // /!\ T + mN is potentially RN - 1 + (R-1) N = 2RN - N - 1 so need one
 *  // extra limb for carry ?
 *  if t ≥ N then
 *   return t − N
 *  else
 *   return t // Can add dummy - zero vector here in case we want to avoid side
 *            // channel attacks
 *  end if
 * end function
 *
 */
export default function _redc(b, k, N, Ni, Nj, M, Mi, Mj, T, Ti, Tj) {
	assert(Nj - Ni === k, '|N| !== k');
	assert(Mj - Mi === k, '|M| !== k'); // Can allow |M| <= k here.
	assert(Tj - Ti === 2 * k + 1, '|T| !== 2*k+1');
	assert(T[Ti] === 0, 'T[Ti] !== 0');

	// Reduce T mod R
	const _Ti = Tj - k;
	const _2k = k << 1; // eslint-disable-line no-bitwise

	const m = n_zeros(_2k);
	const mj = _2k;

	// M = ((T mod R) M) mod R
	n_mul(b, T, _Ti, Tj, M, Mi, Mj, m, 0, mj);
	// Could be even more efficient here
	// if we had a multiplication method that discards higher order
	// bits

	const mi = k; // M = m mod R

	// X = m * N
	const X = n_zeros(_2k); // TODO mutualize allocation with m
	const Xj = _2k;
	n_mul(b, m, mi, mj, N, Ni, Nj, X, 0, Xj);

	// T = T + X = T + mN
	n_iadd(b, T, Ti, Tj, X, 0, Xj);

	// T = T / R
	assert(T[Ti] === 0, 'T[Ti] !== 0');
	n_copy(T, Ti + 1, _Ti, T, _Ti);
	// Assert T[Ti] === 0
	const _Ti_1 = _Ti;
	// T[_Ti_1] = T[Ti];
	n_reset(T, Ti, _Ti_1);

	// If t ≥ N then
	if (n_cmp_n(T, _Ti_1, Tj, N, Ni) >= 0) {
		n_isub(b, T, _Ti_1, Tj, N, Ni, Nj); // Return t − N
		return true;
	}

	return false;
	// Else return t
}
