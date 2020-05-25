import os
from math import ceil
from math import sqrt

MAX_NUMBER = 2**53 - 1
MIN_NUMBER = -2**53

LARGEST_BASE = ceil(sqrt(MAX_NUMBER))
LARGEST_LIMB = LARGEST_BASE - 1

print('MAX_NUMBER', MAX_NUMBER)
print('MIN_NUMBER', MIN_NUMBER)
print('LARGEST_BASE', LARGEST_BASE)
print('LARGEST_LIMB', LARGEST_LIMB)

assert(LARGEST_LIMB ** 2 < MAX_NUMBER)

hugenumbers = sorted([
    LARGEST_LIMB ,
    LARGEST_BASE ,
    91**7 ,
    2**30 ,
    3**50 ,
])

p25519 = 2**255-19
DISPLAY_BASE = 10
representation_bases = sorted([10, 16, 10**7, 2**26, 94906265])
modulos = sorted([2, 3, 5, 19, p25519])
smallnumbers = sorted([ 1 , 3 , 7 , 9 , 11 , 17 , 22 , 24 , 27 , 29 , 1234 , 5678 ])

def gcd ( a , b ) :
    while b != 0 : a , b = b , a % b
    return a

def gen_digits ( base , x ) :
    while x != 0:
        yield x % base
        x //= base

def get_digits ( base , x ) :
    return list(reversed(list(gen_digits(base, x))))


def write ( f , display_base , representation_base , modulos , numbers ) :

    f.write("import test from 'ava';\n")
    f.write("import {parse, stringify} from '@aureooms/js-integer-big-endian';\n");

    f.write("import {Montgomery} from '../../../../../src';\n");

    f.write("const REPRESENTATION_BASE = {};\n".format(representation_base));
    f.write("const DISPLAY_BASE = {};\n".format(display_base));
    f.write("const fmt = x => x.length <= 40 ? x : x.slice(0,19) + '..' + x.slice(-19);\n");

    f.write("""function macro(t, N, A) {{
    const n = parse(DISPLAY_BASE, REPRESENTATION_BASE, N);
    const mont = new Montgomery(REPRESENTATION_BASE, n);

    const a = parse(DISPLAY_BASE, REPRESENTATION_BASE, A);

    const _a = mont.from(a);

    const a_ = mont.out(_a);

    const A_ = stringify(REPRESENTATION_BASE, DISPLAY_BASE, a_, 0, a_.length);

    t.is(A, A_);
}}\n\n""" )


    f.write("macro.title = ( _ , N , A ) => `conversion ${fmt(A)} mod ${fmt(N)}` ;\n\n")

    LINE = "test(macro, '{}', '{}');\n"

    done = set()

    def line ( LINE , N , x ) :
        key = (N, x)
        if key not in done:
            done.add(key)
            f.write(LINE.format(N,x))

    for N in modulos :
        if gcd(representation_base, N) != 1:
            key = ('throw', representation_base, N)
            if key not in done:
                done.add(key)
                digits = get_digits(representation_base, N)
                f.write("""test(`F_{} base ${{REPRESENTATION_BASE}} throws`, (t) => {{
    t.throws(() => new Montgomery(REPRESENTATION_BASE, {}), {{message: /GCD/}});
}});\n""".format(N, digits))
            continue

        for a in numbers :
            line(LINE, N, a%N)
            line(LINE, N, -a%N)

root = 'test/src/generated/montgomery/conversion'
os.makedirs(root, exist_ok=True)

def open_and_write ( display_base , representation_base , modulos , nb , **kwargs ) :
    with open( root + '/conversion-{}-{}.js'.format(display_base, representation_base) , 'w' ) as f :
        write( f, display_base , representation_base , modulos , nb , **kwargs )

for representation_base in representation_bases:

    nb = smallnumbers + hugenumbers

    # standard op
    open_and_write( DISPLAY_BASE, representation_base, modulos , nb )
