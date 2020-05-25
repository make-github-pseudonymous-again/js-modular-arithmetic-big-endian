import {
	_alloc,
	_zeros,
	_reset,
	_copy,
	jz,
	_extended_euclidean_algorithm,
	_trim_positive,
	_sub,
	convert
} from '@aureooms/js-integer-big-endian';

import _mul from './_mul';
import _iadd from './_iadd';
import _isub from './_isub';
import _redc from './_redc';
import _montgomery from './_montgomery';
import modR from './modR';
import modN from './modN';

export default class Montgomery {
	constructor(b, N) {
		const {k, M, R, R2, R3} = _montgomery(b, N);
		this.b = b;
		this.N = N;
		this.k = k;
		this.M = M;
		this.R = R;
		this.R2 = R2;
		this.R3 = R3;
		// Use shared/pooled memory ?
	}

	one() {
		return this.R;
	}

	zero() {
		return _zeros(this.k);
	}

	from(x) {
		// Conversion into Montgomery form is done by computing .
		// aR mod N = REDC((a mod N)(R^2 mod N))
		const _2kp1 = 2 * this.k + 1;
		const red = _zeros(_2kp1); // TODO Use UintXArray ?
		const amodN = modN(this.b, this.N, x);
		_mul(this.b, this.N, this.M, this.R2, amodN, red);
		// TODO many unnecessary copies/alloc can be avoided by
		// allowing array offsets in methods.
		return modR(this.k, red);
	}

	out(aRmodN) {
		// Conversion out of Montgomery form is done by computing.
		// a mod N = REDC(aR mod N)
		const _2kp1 = 2 * this.k + 1;
		const _red = _zeros(_2kp1); // TODO Use UintXArray ?
		_copy(aRmodN, 0, this.k, _red, _2kp1 - this.k);
		_redc(this.b, this.k, this.N, 0, this.k, this.M, 0, this.k, _red, 0, _2kp1);
		const i = _trim_positive(_red, this.k + 1, _2kp1);
		const red = _alloc(_2kp1 - i); // TODO Use UintXArray ?
		_copy(_red, i, _2kp1, red, 0);
		return red;
	}

	mul(aRmodN, bRmodN) {
		const _2kp1 = 2 * this.k + 1;
		const abRmodN = _zeros(_2kp1);

		_mul(this.b, this.N, this.M, aRmodN, bRmodN, abRmodN);

		return modR(this.k, abRmodN);
	}

	add(aRmodN, bRmodN) {
		const aRpbRmodN = _alloc(this.k);
		_copy(aRmodN, 0, this.k, aRpbRmodN, 0);
		_iadd(this.b, this.N, aRpbRmodN, bRmodN);
		return aRpbRmodN;
	}

	sub(aRmodN, bRmodN) {
		const aRpbRmodN = _alloc(this.k);
		_copy(aRmodN, 0, this.k, aRpbRmodN, 0);
		_isub(this.b, this.N, aRpbRmodN, bRmodN);
		return aRpbRmodN;
	}

	inv(aRmodN) {
		// The modular inverse
		// Compute (aR mod N)^-1 using Euclidean algo
		const ai = _trim_positive(aRmodN, 0, this.k);

		let [
			GCD,
			GCDi,
			// eslint-disable-next-line no-unused-vars
			_S,
			// eslint-disable-next-line no-unused-vars
			_Si,
			aRmodNi,
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
			steps
		] = _extended_euclidean_algorithm(
			this.b,
			this.N,
			0,
			this.k,
			aRmodN,
			ai,
			this.k
		);

		// Assert that GCD(N,aRmodN) is 1.
		if (GCD.length - GCDi !== 1 || GCD[GCDi] !== 1)
			throw new Error('aRmodN has no inverse modulo N');

		const _2kp1 = 2 * this.k + 1;
		const red = _zeros(_2kp1); // TODO Use UintXArray ?

		if (steps % 2 === 1) {
			// We compute N - aRmodNi
			const temporary = _zeros(this.k);
			_sub(this.b, this.N, 0, this.k, aRmodNi, 0, this.k, temporary, 0, this.k);
			aRmodNi = temporary;
		}

		// A^-1 R mod N = REDC((aR mod N)^-1(R^3 mod N)).
		_mul(this.b, this.N, this.M, this.R3, aRmodNi, red);

		return modR(this.k, red);
	}

	pown(aRmodN, x) {
		// Modular
		// exponentiation can be done using exponentiation by squaring by initializing the
		// initial product to the Montgomery representation of 1, that is, to R mod N, and
		// by replacing the multiply and square steps by Montgomery multiplies.

		const nonneg = x >= 0;

		if (!nonneg) x = -x;

		if (x === 0) return this.R;
		if (x === 1) return nonneg ? aRmodN : this.inv(aRmodN);

		const xbits = [];

		do {
			xbits.push(x & 1);
			x >>= 1;
		} while (x !== 1);

		return this._powb(aRmodN, xbits, nonneg);
	}

	_powb(aRmodN, xbits, nonneg) {
		// The binary expansion of the exponent is 1 concatenanted with xbits
		// reversed. Must have xbits.length >= 1.
		const aRmodNpown = _alloc(this.k);
		_copy(aRmodN, 0, this.k, aRmodNpown, 0);

		const _2kp1 = 2 * this.k + 1;
		const temporary = _alloc(_2kp1);

		do {
			_reset(temporary, 0, _2kp1);
			_mul(this.b, this.N, this.M, aRmodNpown, aRmodNpown, temporary);
			_copy(temporary, _2kp1 - this.k, _2kp1, aRmodNpown, 0);
			if (xbits.pop() === 1) {
				_reset(temporary, 0, _2kp1);
				_mul(this.b, this.N, this.M, aRmodNpown, aRmodN, temporary);
				_copy(temporary, _2kp1 - this.k, _2kp1, aRmodNpown, 0);
			}
		} while (xbits.length);

		return nonneg ? aRmodNpown : this.inv(aRmodNpown);
	}

	pow(aRmodN, b, nonneg = true) {
		if (jz(b, 0, b.length - 1)) {
			// B consists of a single limb
			return this.pown(aRmodN, nonneg ? b[b.length - 1] : -b[b.length - 1]);
		}

		const xbits = convert(this.b, 2, b, 0, b.length);
		xbits.reverse();
		xbits.pop();

		return this._powb(aRmodN, xbits, nonneg);
	}
}
