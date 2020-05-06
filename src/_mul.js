import { _mul } from '@aureooms/js-integer-big-endian' ;

import _redc from './redc' ;

//
// mul by non montgomery ?
// abR mod N = (aR mod N)(b mod N) MODULO????

/**
 *
 * abR mod N = REDC((aR mod N)(bR mod N))
 *
 *
 * |N| >= |a| >= |b|
 * |c| = 2*|N| + 1
 *
 */

export default function ( r , N , M , a , b , c ) {

	const k = N.length ;
	const _2kp1 = 2*k+1;

	if (a.length > k) throw new Error('|a| > |N|') ;
	if (b.length > a.length) throw new Error('|b| > |a|') ;
	if (c.length !== _2kp1) throw new Error('|c| !== 2*k+1') ;

	// c = (aR mod N)(bR mod N)
	_mul(r, a, 0, a.length, b, 0, b.length, c, _2kp1 - a.length - b.length, _2kp1) ;

	// c = REDC((aR mod N)(bR mod N))
	return _redc( r , k , N , 0 , k , M , 0 , k , c, 0, _2kp1 ) ;

}
