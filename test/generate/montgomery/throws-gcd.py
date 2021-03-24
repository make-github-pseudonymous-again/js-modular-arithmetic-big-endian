import os
from math import ceil
from math import sqrt
from modular import gcd

MAX_NUMBER = 2**53 - 1
MIN_NUMBER = -2**53

LARGEST_BASE = ceil(sqrt(MAX_NUMBER))
LARGEST_LIMB = LARGEST_BASE - 1

print('MAX_NUMBER', MAX_NUMBER)
print('MIN_NUMBER', MIN_NUMBER)
print('LARGEST_BASE', LARGEST_BASE)
print('LARGEST_LIMB', LARGEST_LIMB)

assert(LARGEST_LIMB ** 2 < MAX_NUMBER)

p25519 = 2**255-19
DISPLAY_BASES = sorted([10])
REPRESENTATION_BASES = sorted([10, 16, 10000000, 67108864, 94906265])
modulos = sorted([2, 3, 5, 19, p25519])

def gen_lines ( representation_base , display_base, modulos , isn = False) :
    for N in modulos :
        if gcd(representation_base, N) != 1:
            yield '{} {} {}'.format(representation_base, display_base, N)

dat = 'test/data/generated/montgomery/throws'
os.makedirs(dat, exist_ok=True)

lines = set()
for representation_base in REPRESENTATION_BASES:
    for display_base in DISPLAY_BASES:
        lines.update(gen_lines( representation_base , display_base, modulos ))

with open( '{}/gcd'.format(dat) , 'w' ) as f :
    for line in sorted(lines):
        f.write('{}\n'.format(line))
