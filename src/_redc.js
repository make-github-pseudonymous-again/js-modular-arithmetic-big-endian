import {
	_zeros,
	_copy,
	_reset,
	_cmp_n,
	_mul,
	_iadd,
	_isub
} from '@aureooms/js-integer-big-endian';

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
	if (Nj - Ni !== k) throw new Error('|N| !== k');
	if (Mj - Mi !== k) throw new Error('|M| !== k'); // Can allow <= k here.
	if (Tj - Ti !== 2 * k + 1) throw new Error('|T| !== 2*k+1');
	if (T[Ti] !== 0) throw new Error('T[Ti] !== 0');

	// Reduce T mod R
	const _Ti = Tj - k;
	const _2k = k << 1;

	const m = _zeros(_2k);
	const mj = _2k;

	// M = ((T mod R) M) mod R
	_mul(b, T, _Ti, Tj, M, Mi, Mj, m, 0, mj);
	// Could be even more efficient here
	// if we had a multiplication method that discards higher order
	// bits

	const mi = k; // M = m mod R

	// X = m * N
	const X = _zeros(_2k); // TODO mutualize allocation with m
	const Xj = _2k;
	_mul(b, m, mi, mj, N, Ni, Nj, X, 0, Xj);

	// T = T + X = T + mN
	_iadd(b, T, Ti, Tj, X, 0, Xj);

	// T = T / R
	_copy(T, Ti + 1, _Ti, T, _Ti);
	const _Ti_1 = _Ti - 1;
	T[_Ti_1] = T[Ti];
	_reset(T, Ti, _Ti_1);

	// If t ≥ N then
	if (_cmp_n(T, _Ti_1, Tj, N, Ni) >= 0) {
		_isub(b, T, _Ti_1, Tj, N, Ni, Nj); // Return t − N
		return true;
	}

	return false;
	// Else return t
}
