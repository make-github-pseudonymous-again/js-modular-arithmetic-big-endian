def prnt(display_base, numbers):
    if display_base == 10: return map(str, numbers)
    if display_base == 16: return map(lambda x: hex(x)[2:], numbers)
    raise Exception('Cannot print in base {}'.format(display_base))
