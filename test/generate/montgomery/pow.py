import os
from math import ceil
from math import sqrt
from modular import gcd, mpow
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
REPRESENTATION_BASES = sorted([10, 16, 10000000, 67108864, 94906265])
modulos = sorted([2, 3, 19, p25519])
smallnumbers = sorted([ 0, 1 , 3 , 7 , 9 , 11 , 17 , 22 , 24 , 27 , 29 , 1234 , 5678 ])

arithmetic = {
    'pow' : {
        'modulos' : modulos ,
        'numbers' : smallnumbers + hugenumbers ,
        'apply' : lambda N,a,b: (mpow(N, a, b),) ,
    } ,
}

def gen_lines ( representation_base , display_base, name, modulos , numbers , t , isn = False) :

    if isn :
        raise Exception('Not implemented')

    LINE = "{} {} {} {} {} {} {}"

    def line ( LINE, N , x , y ) :
        if not isn or MIN_NUMBER <= y <= MAX_NUMBER:
            try:
                c = t( N , x , y )
                yield LINE.format(representation_base, display_base, name, *prnt(display_base, [N,x,y,*c]))
            except:
                pass


    for N in modulos :
        if gcd(representation_base, N) != 1: continue
        for a in numbers :
            for b in numbers :
                yield from line(LINE, N, a%N, b%N)
                yield from line(LINE, N, -a%N, b%N)
                yield from line(LINE, N, a%N, -b%N)
                yield from line(LINE, N, -a%N, -b%N)
                yield from line(LINE, N, a%N, b)
                yield from line(LINE, N, -a%N, b)
                yield from line(LINE, N, a%N, -b)
                yield from line(LINE, N, -a%N, -b)

dat = 'test/data/generated/montgomery'
os.makedirs(dat, exist_ok=True)

lines = set()
for name , op in arithmetic.items():
    t = op['apply']
    nb = op['numbers']
    modulos = op['modulos']
    for representation_base in REPRESENTATION_BASES:
        for display_base in DISPLAY_BASES:
            lines.update(
                gen_lines( representation_base , display_base, name, modulos, nb, t )
            )

with open( '{}/pow'.format(dat) , 'w' ) as f :
    for line in sorted(lines):
        f.write('{}\n'.format(line))
