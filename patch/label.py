import os
import symbols

D = os.path.dirname(os.path.abspath(__file__))
INK="#171a14"; STONE="#5f5f54"; BONE="#f4f1ea"
W, H = 40.0, 50.0

def t(x, y, s, size=2.2, ls=0.25, fill=STONE, weight="400", anchor="middle", fam="IBM Plex Mono"):
    return (f'<text x="{x}" y="{y}" font-family="{fam}" font-weight="{weight}" font-size="{size}" '
            f'letter-spacing="{ls}" text-anchor="{anchor}" fill="{fill}">{s}</text>')

def rule(y, inset=5):
    return f'<line x1="{inset}" y1="{y}" x2="{W-inset}" y2="{y}" stroke="{INK}" stroke-width="0.2" opacity="0.5"/>'

SIZE, GAP = 5.8, 0.85
row_w = 5*SIZE + 4*GAP
x0 = (W - row_w)/2
row = ''.join(symbols.place(s, x0 + i*(SIZE+GAP), 10.5, SIZE) for i, s in enumerate(symbols.SYMBOLS))

svg = f'''<svg xmlns="http://www.w3.org/2000/svg" width="{W}mm" height="{H}mm" viewBox="0 0 {W} {H}">
<rect width="{W}" height="{H}" fill="{BONE}"/>
<rect x="0.5" y="0.5" width="{W-1}" height="{H-1}" rx="2.5" fill="none" stroke="{INK}" stroke-width="0.5"/>
{t(W/2, 5.6, "LEASE-A-FLEECE", size=2.5, ls=0.85, fill=INK, weight="500")}
{rule(7.6)}
{row}
{t(W/2, 21.6, "MACHINE WASH 40°C", size=2.3, ls=0.2, fill=INK, weight="500")}
{t(W/2, 25.2, "100% POLYESTER FLEECE", size=2.0, ls=0.12)}
{rule(28.2)}
{t(W/2, 32.4, "UNIT AND LESSEE", size=2.0, ls=0.12)}
{t(W/2, 35.6, "BOTH RATED TO 40°", size=2.0, ls=0.12)}
{rule(38.6)}
{t(W/2, 42.6, "PROPERTY OF", size=2.0, ls=0.5)}
{t(W/2, 46.2, "LEASE-A-FLEECE B.V.", size=2.2, ls=0.12, fill=INK, weight="500")}
</svg>'''
open(f'{D}/label.svg','w').write(svg)
print("label built")
