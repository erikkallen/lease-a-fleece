"""ISO 3758 / GINETEX care symbols, drawn as paths in a 40x40 box each."""
INK="#171a14"

def _x(sw=3.2):
    return (f'<path d="M 4 4 L 36 36 M 36 4 L 4 36" stroke-width="{sw}" stroke-linecap="round"/>')

def washtub(temp="40"):
    # tub: wavy waterline on top, body splaying outward
    wave = "M 3 13 Q 7.25 8.5 11.5 13 T 20 13 T 28.5 13 T 37 13"
    body = "M 3 13 L 8 35 L 32 35 L 37 13"
    return (f'<path d="{body}" stroke-width="3" stroke-linejoin="round"/>'
            f'<path d="{wave}" stroke-width="3" stroke-linecap="round"/>'
            f'<text x="20" y="32" font-family="IBM Plex Mono" font-weight="500" font-size="16.5" '
            f'text-anchor="middle" fill="{INK}" stroke="none">{temp}</text>')

def no_bleach():
    return ('<path d="M 20 4 L 37 35 L 3 35 Z" stroke-width="3" stroke-linejoin="round"/>' + _x())

def no_tumble():
    return ('<rect x="4" y="6" width="32" height="30" rx="2" stroke-width="3" fill="none"/>'
            '<circle cx="20" cy="21" r="10" stroke-width="3" fill="none"/>' + _x())

def no_iron():
    # flat sole plate, splayed body, handle arc on top
    sole = "M 3 33 L 37 33"
    body = "M 7 33 L 9.5 21 Q 10.5 17.5 14.5 17.5 L 26 17.5 Q 30 17.5 31 21 L 33 33"
    grip = "M 14.5 17.5 Q 20.5 8.5 26 17.5"
    return (f'<path d="{sole}" stroke-width="3.4" stroke-linecap="round"/>'
            f'<path d="{body}" stroke-width="3" stroke-linejoin="round"/>'
            f'<path d="{grip}" stroke-width="3" stroke-linecap="round"/>' + _x())

def no_dryclean():
    return ('<circle cx="20" cy="20" r="16" stroke-width="3" fill="none"/>' + _x())

SYMBOLS = [washtub(), no_bleach(), no_tumble(), no_iron(), no_dryclean()]

def place(sym, x, y, size):
    s = size/40.0
    return (f'<g transform="translate({x},{y}) scale({s})" fill="none" stroke="{INK}" '
            f'stroke-linecap="round">{sym}</g>')
