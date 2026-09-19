"""KORG handle engravings. Two strips, 150 x 25 mm each."""
import os
D = os.path.dirname(os.path.abspath(__file__))
INK = "#000000"          # pure black: laser software reads it as engrave
W, H = 150.0, 25.0

MARK = ('<g fill="none" stroke="{ink}" transform="translate({tx},{ty}) scale({s})">'
 '<path d="M 52 74 Q 52 52 74 52 H 164 Q 248 52 248 136 V 226 Q 248 248 226 248 H 74 Q 52 248 52 226 Z" stroke-width="16" stroke-linejoin="round"/>'
 '<path d="M 164 52 Q 164 136 248 136" stroke-width="16" stroke-linecap="round"/>'
 '<path d="M 82 84 H 152 M 82 84 V 218 M 82 218 H 218 M 218 218 V 158" stroke-width="10" stroke-linecap="round" stroke-dasharray="1 22"/></g>')

def doc(body):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}mm" height="{H}mm" '
            f'viewBox="0 0 {W} {H}">{body}</svg>')

# A — identity
handle_a = doc(
    MARK.format(ink=INK, tx=17.5, ty=2.1, s=18/300) +
    f'<text x="40.5" y="14.8" font-family="Fraunces" font-weight="600" font-size="12.5" fill="{INK}">Lease-a-Fleece</text>'
    f'<text x="41.5" y="20.4" font-family="IBM Plex Mono" font-weight="500" font-size="3.2" '
    f'letter-spacing="1.5" fill="{INK}">EST. 1986 · GRONINGEN</text>')

# B — the unit itself, mirroring A's structure
handle_b = doc(
    f'<text x="{W/2}" y="14.2" font-family="Fraunces" font-weight="600" font-size="13" '
    f'text-anchor="middle" fill="{INK}">KORG</text>'
    f'<text x="{W/2}" y="20.2" font-family="IBM Plex Mono" font-weight="500" font-size="3.2" '
    f'letter-spacing="1.5" text-anchor="middle" fill="{INK}">FLEECE CONTAINMENT UNIT</text>')

open(f'{D}/handle-a.svg','w').write(handle_a)
open(f'{D}/handle-b.svg','w').write(handle_b)
print("handles built")
