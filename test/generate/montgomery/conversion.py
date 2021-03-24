import os
from math import ceil
from math import sqrt
from modular import gcd
from util import prnt

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
DISPLAY_BASES = sorted([10])
REPRESENTATION_BASES = sorted([10, 16, 10**7, 2**26, 94906265])
modulos = sorted([2, 3, 5, 19, p25519])
smallnumbers = sorted([ 0, 1 , 3 , 7 , 9 , 11 , 17 , 22 , 24 , 27 , 29 , 1234 , 5678 ])

def gen_lines ( representation_base , display_base , modulos , numbers ) :

    LINE = "{} {} {} {} {}"

    def line ( LINE , N , x ) :
        yield LINE.format(representation_base, display_base, *prnt(display_base, [N,x,x]))

    for N in modulos :
        if gcd(representation_base, N) != 1: continue
        for a in numbers :
            yield from line(LINE, N, a%N)
            yield from line(LINE, N, -a%N)

nb = sorted(smallnumbers + hugenumbers)

dat = 'test/data/generated/montgomery'
os.makedirs(dat, exist_ok=True)

lines = set()
for representation_base in REPRESENTATION_BASES:
    for display_base in DISPLAY_BASES:
        lines.update(
            gen_lines( representation_base , display_base, modulos, nb )
        )

with open( '{}/conversion'.format(dat) , 'w' ) as f :
    for line in sorted(lines):
        f.write('{}\n'.format(line))
