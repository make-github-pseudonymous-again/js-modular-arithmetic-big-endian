from collections import deque

def gcd ( a , b ) :
    while b != 0 : a , b = b , a % b
    return a

def _extended_euclidean_algorithm ( a , b , sa = 1 , ta = 0 , sb = 0 , tb = 1 ) :

    yield (a, sa, ta)
    if b == 0:
        yield (b, sb, tb)

    else:
        q, _a = a // b, a % b
        _sa = sa - q * sb
        _ta = ta - q * tb
        yield from _extended_euclidean_algorithm( b, _a, sb, tb, _sa, _ta)

def inv ( N , x ) :

    [ a , b ] = deque(_extended_euclidean_algorithm(N, x), 2)
    gcd = a[0]
    if gcd != 1:
        raise Exception('{} has no inverse mod {}'.format(x,N))
    assert(b[0] == 0)
    assert(N*a[1] + x*a[2] == 1)
    assert(N*b[1] + x*b[2] == 0)

    _inv = a[2] % N
    assert((x*_inv) % N == 1)
    return _inv

def mpow ( N , a , b ) :
    assert(0 <= a < N)
    if b < 0 : return inv(N, mpow(N, a, -b))
    if b == 0: return 1
    if b == 1: return a

    r = b & 1
    s = b >> 1
    if r == 0:
        return mpow( N, (a**2)%N, s)
    else:
        return (mpow( N, (a**2)%N, s)*a)%N


