:mermaid: [@aureooms/js-modular-arithmetic-big-endian](https://make-github-pseudonymous-again.github.io/js-modular-arithmetic-big-endian)
==

Modular arithmetic for JavaScript.
See [docs](https://make-github-pseudonymous-again.github.io/js-modular-arithmetic-big-endian/index.html).

> [Try it on RunKit](https://runkit.com/aureooms/js-modular-arithmetic-big-endian)!

```js
import { Montgomery } from '@aureooms/js-modular-arithmetic-big-endian' ; 
const int = s => s.split('').map(x => +x) ;
const str = x => x.join('') ;
const base = 10 ;
const N = int('57896044618658097711785492504343953926634992332820282019728792003956564819949') ;
const mont = new Montgomery(base, N) ;

const a = int('57896044618658097711785492504343953926634992332820281301830804312103976049700') ;
const b = int('57896044618658097711785492504343953926634992332820282019728792003955491078125') ;
const _a = mont.from(a) ;
const _x = mont.pow(_a, b) ; // a^b % N
const x = mont.out(_x) ;
str(x) ; // 40504055762004792620159537441437949886475081163592261781667958256380085618313

const c = int('717897987691852588770249') ;
const _y = mont.pow(_a, c, false) ; // a^-c % N
const y = mont.out(_y) ;
str(y) ; // 51815386826945512755518685488363592823806772017922768894709047770322605499358
```

[![License](https://img.shields.io/github/license/aureooms/js-modular-arithmetic-big-endian.svg)](https://raw.githubusercontent.com/aureooms/js-modular-arithmetic-big-endian/main/LICENSE)
[![Version](https://img.shields.io/npm/v/@aureooms/js-modular-arithmetic-big-endian.svg)](https://www.npmjs.org/package/@aureooms/js-modular-arithmetic-big-endian)
[![Build](https://img.shields.io/travis/aureooms/js-modular-arithmetic-big-endian/main.svg)](https://travis-ci.com/aureooms/js-modular-arithmetic-big-endian/branches)
[![Dependencies](https://img.shields.io/david/aureooms/js-modular-arithmetic-big-endian.svg)](https://david-dm.org/aureooms/js-modular-arithmetic-big-endian)
[![Dev dependencies](https://img.shields.io/david/dev/aureooms/js-modular-arithmetic-big-endian.svg)](https://david-dm.org/aureooms/js-modular-arithmetic-big-endian?type=dev)
[![GitHub issues](https://img.shields.io/github/issues/aureooms/js-modular-arithmetic-big-endian.svg)](https://github.com/aureooms/js-modular-arithmetic-big-endian/issues)
[![Downloads](https://img.shields.io/npm/dm/@aureooms/js-modular-arithmetic-big-endian.svg)](https://www.npmjs.org/package/@aureooms/js-modular-arithmetic-big-endian)

[![Code issues](https://img.shields.io/codeclimate/issues/aureooms/js-modular-arithmetic-big-endian.svg)](https://codeclimate.com/github/aureooms/js-modular-arithmetic-big-endian/issues)
[![Code maintainability](https://img.shields.io/codeclimate/maintainability/aureooms/js-modular-arithmetic-big-endian.svg)](https://codeclimate.com/github/aureooms/js-modular-arithmetic-big-endian/trends/churn)
[![Code coverage (cov)](https://img.shields.io/codecov/c/gh/aureooms/js-modular-arithmetic-big-endian/main.svg)](https://codecov.io/gh/aureooms/js-modular-arithmetic-big-endian)
[![Code technical debt](https://img.shields.io/codeclimate/tech-debt/aureooms/js-modular-arithmetic-big-endian.svg)](https://codeclimate.com/github/aureooms/js-modular-arithmetic-big-endian/trends/technical_debt)
[![Documentation](https://make-github-pseudonymous-again.github.io/js-modular-arithmetic-big-endian/badge.svg)](https://make-github-pseudonymous-again.github.io/js-modular-arithmetic-big-endian/source.html)
[![Package size](https://img.shields.io/bundlephobia/minzip/@aureooms/js-modular-arithmetic-big-endian)](https://bundlephobia.com/result?p=@aureooms/js-modular-arithmetic-big-endian)
