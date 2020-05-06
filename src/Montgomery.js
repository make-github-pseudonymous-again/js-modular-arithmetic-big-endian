import {
	_alloc,
	_zeros,
	_reset,
	_copy,

	_extended_euclidean_algorithm,
} from '@aureooms/js-integer-big-endian' ;

import _mul from './_mul' ;
import _iadd from './_iadd' ;
import _isub from './_isub' ;
import _redc from './redc' ;
import modR from './modR' ;
import modN from './modN' ;

export default class Montgomery {

	constructor ( b , N ) {
		const { k , M , R , R2 , R3 } = _montgomery ( b , N ) ;
		this.b = b;
		this.N = N;
		this.k = k;
		this.M = M;
		this.R = R;
		this.R2 = R2;
		this.R3 = R3;
		// Use shared/pooled memory ?
	}

	from ( x ) {
		// Conversion into Montgomery form is done by computing .
		// aR mod N = REDC((a mod N)(R^2 mod N))
		const _2kp1 = 2 * this.k + 1 ;
		const red = _zeros(_2kp1) ; // TODO Use UintXArray ?
		const amodN = modN(this.N, a) ;
		_mul(this.b, this.N, this.M, this.R2, amodN, red) ;
		// TODO many unnecessary copies/alloc can be avoided by
		// allowing array offsets in methods.
		return modR(this.k, red) ;
	}

	out ( aRmodN ) {
		// Conversion out of Montgomery form is done by computing.
		// a mod N = REDC(aR mod N)
		const _2kp1 = 2 * this.k + 1 ;
		const _red = _zeros(_2kp1) ; // TODO Use UintXArray ?
		_copy(aRmodN, 0, k, _red, _2kp1-k)
		_redc(this.b, this.k, this.N, 0, this.k, this.M, 0, this.k, _red, 0, _2kp1) ;
		const i = _trim_positive(_red, 0, _2kp1) ;
		const red = _alloc(_2kp1-i) ; // TODO Use UintXArray ?
		_copy(_red, i, _2kp1, red, 0) ;
		return red;
	}

	mul ( aRmodN , bRmodN ) {

		const _2kp1 = 2 * this.k + 1 ;
		const abRmodN = _zeros(_2kp1) ;

		_mul( this.b , this.N , this.M , aRmodN , bRmodN , abRmodN ) ;

		return modR(this.k, abRmodN);

	}

	add ( aRmodN , bRmodN ) {
		const aRpbRmodN = _alloc(this.k) ;
		_copy(aRmodN, 0, this.k, aRpbRmodN, 0) ;
		_iadd( this.b , this.N , aRpbRmodN , bRmodN ) ;
		return aRpbRmodN ;
	}

	sub ( aRmodN , bRmodN ) {
		const aRpbRmodN = _alloc(this.k) ;
		_copy(aRmodN, 0, this.k, aRpbRmodN, 0) ;
		_isub( this.b , this.N , aRpbRmodN , bRmodN ) ;
		return aRpbRmodN ;
	}

	inv ( aRmodN ) {
		// The modular inverse
		// Compute (aR mod N)^-1 using Euclidean algo
		const ai = _trim_positive(aRmodN, 0, this.k);
		const [ GCD , GCDi , _S , _Si , aRmodNi ] =
			_extended_euclidean_algorithm ( this.b , this.N , 0 , this.k , aRmodN , ai , this.k ) ;

		// Assert that GCD(N,aRmodN) is 1.
		if (GCD.length - GCDi !== 1 || GCD[GCDi] !== 1)
			throw new Error('aRmodN has no inverse modulo N') ;

		const _2kp1 = 2 * this.k + 1 ;
		const red = _zeros(_2kp1) ; // TODO Use UintXArray ?

		// a^-1 R mod N = REDC((aR mod N)^-1(R^3 mod N)).
		_mul(this.b, this.N, this.M, this.R3, aRmodNi, red) ;

		return modR(this.k, red) ;
	}

	pow ( aRmodN , n ) {
		// Modular
		// exponentiation can be done using exponentiation by squaring by initializing the
		// initial product to the Montgomery representation of 1, that is, to R mod N, and
		// by replacing the multiply and square steps by Montgomery multiplies.
		const aRmodNpown = _alloc(this.k) ;

		if ( x === 0 ) {
			_copy(this.R, 0, this.k, aRmodNpown, 0) ;
			return aRmodNpown ;
		}

		_copy( aRmodN, 0, this.k, aRmodNpown, 0 ) ;

		if ( x === 1 ) return aRmodNpown ;

		const xbits = [] ;

		do { xbits.push(x & 1) ; x >>= 1 ; } while ( x !== 1 ) ;

		const _2kp1 = 2*this.k+1 ;
		const tmp = _alloc(_2kp1) ;

		do {
			_reset(tmp, 0, _2kp1);
			_mul(this.b, this.N, this.M, aRmodNpown, aRmodNpown, tmp) ;
			_copy(tmp, _2kp1 - k, _2kp1, aRmodNpown, 0) ;
			if (xbits.pop() === 1) {
				_reset(tmp, 0, _2kp1) ;
				_mul(this.b, this.N, this.M, aRmodNpown, aRmodN, tmp) ;
				_copy(tmp, _2kp1 - k, _2kp1, aRmodNpown, 0) ;
			}
		} while ( xbits.length ) ;

		return aRmodNpown ;

	}

}
