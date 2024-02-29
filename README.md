:mermaid: [@arithmetic-operations-for/integers-modulo-n-big-endian](https://arithmetic-operations-for.github.io/integers-modulo-n-big-endian)
==

Modular arithmetic for JavaScript.
See [docs](https://arithmetic-operations-for.github.io/integers-modulo-n-big-endian/index.html).

> [Try it on RunKit](https://runkit.com/aureooms/js-modular-arithmetic-big-endian)!

```js
import { Montgomery } from '@arithmetic-operations-for/integers-modulo-n-big-endian' ; 
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

[![License](https://img.shields.io/github/license/arithmetic-operations-for/integers-modulo-n-big-endian.svg)](https://raw.githubusercontent.com/arithmetic-operations-for/integers-modulo-n-big-endian/main/LICENSE)
[![Version](https://img.shields.io/npm/v/@arithmetic-operations-for/integers-modulo-n-big-endian.svg)](https://www.npmjs.org/package/@arithmetic-operations-for/integers-modulo-n-big-endian)
[![Tests](https://img.shields.io/github/actions/workflow/status/arithmetic-operations-for/integers-modulo-n-big-endian/ci.yml?branch=main&event=push&label=tests)](https://github.com/arithmetic-operations-for/integers-modulo-n-big-endian/actions/workflows/ci.yml?query=branch:main)
[![Dependencies](https://img.shields.io/librariesio/github/arithmetic-operations-for/integers-modulo-n-big-endian.svg)](https://github.com/arithmetic-operations-for/integers-modulo-n-big-endian/network/dependencies)
[![GitHub issues](https://img.shields.io/github/issues/arithmetic-operations-for/integers-modulo-n-big-endian.svg)](https://github.com/arithmetic-operations-for/integers-modulo-n-big-endian/issues)
[![Downloads](https://img.shields.io/npm/dm/@arithmetic-operations-for/integers-modulo-n-big-endian.svg)](https://www.npmjs.org/package/@arithmetic-operations-for/integers-modulo-n-big-endian)

[![Code issues](https://img.shields.io/codeclimate/issues/arithmetic-operations-for/integers-modulo-n-big-endian.svg)](https://codeclimate.com/github/arithmetic-operations-for/integers-modulo-n-big-endian/issues)
[![Code maintainability](https://img.shields.io/codeclimate/maintainability/arithmetic-operations-for/integers-modulo-n-big-endian.svg)](https://codeclimate.com/github/arithmetic-operations-for/integers-modulo-n-big-endian/trends/churn)
[![Code coverage (cov)](https://img.shields.io/codecov/c/gh/arithmetic-operations-for/integers-modulo-n-big-endian/main.svg)](https://codecov.io/gh/arithmetic-operations-for/integers-modulo-n-big-endian)
[![Code technical debt](https://img.shields.io/codeclimate/tech-debt/arithmetic-operations-for/integers-modulo-n-big-endian.svg)](https://codeclimate.com/github/arithmetic-operations-for/integers-modulo-n-big-endian/trends/technical_debt)
[![Documentation](https://arithmetic-operations-for.github.io/integers-modulo-n-big-endian/badge.svg)](https://arithmetic-operations-for.github.io/integers-modulo-n-big-endian/source.html)
[![Package size](https://img.shields.io/bundlephobia/minzip/@arithmetic-operations-for/integers-modulo-n-big-endian)](https://bundlephobia.com/result?p=@arithmetic-operations-for/integers-modulo-n-big-endian)
