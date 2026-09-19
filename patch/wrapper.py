import os, re, subprocess
D = os.path.dirname(os.path.abspath(__file__))
INK="#171a14"; STONE="#5f5f54"; BONE="#f4f1ea"
BW, BH = 297.0, 115.0          # reading orientation: length around, band width

MARK=('<g fill="none" stroke="{ink}" transform="translate({tx},{ty}) scale({s})">'
 '<path d="M 52 74 Q 52 52 74 52 H 164 Q 248 52 248 136 V 226 Q 248 248 226 248 H 74 Q 52 248 52 226 Z" stroke-width="15" stroke-linejoin="round"/>'
 '<path d="M 164 52 Q 164 136 248 136" stroke-width="15" stroke-linecap="round"/>'
 '<path d="M 82 84 H 152 M 82 84 V 218 M 82 218 H 218 M 218 218 V 158" stroke-width="9" stroke-linecap="round" stroke-dasharray="1 22"/></g>')

def qr(x, y, size):
    url = "HTTPS://LEASE-A-FLEECE.COM"
    subprocess.run(['qrencode','-o',f'{D}/qr-wrap.svg','-t','SVG','-m','0','-l','Q',url], check=True)
    svg = open(f'{D}/qr-wrap.svg').read()
    n = int(re.search(r'viewBox="0 0 (\d+)', svg).group(1))
    rects = re.findall(r'<rect x="([\d.]+)" y="([\d.]+)" width="([\d.]+)" height="([\d.]+)"', svg)[1:]
    s = size / n
    body = ''.join(f'<rect x="{x+float(a)*s:.3f}" y="{y+float(b)*s:.3f}" '
                   f'width="{float(c)*s+0.02:.3f}" height="{float(d)*s+0.02:.3f}" fill="{INK}"/>'
                   for a,b,c,d in rects)
    return f'<g shape-rendering="crispEdges">{body}</g>'

SPECS = ["PROPERTY OF",
         "LEASE-A-FLEECE B.V.",
         "130 × 160 CM · 260 GSM",
         "100% POLYESTER FLEECE",
         "RETURN ON DEMAND"]

def band():
    spec = ''.join(
        f'<text x="196" y="{44+i*7.0}" font-family="IBM Plex Mono" font-size="2.95" '
        f'letter-spacing="0.45" fill="{INK if i==1 else STONE}">{t}</text>'
        for i, t in enumerate(SPECS))
    return f'''<g>
<rect width="{BW}" height="{BH}" fill="{BONE}"/>
<line x1="0" y1="11" x2="{BW}" y2="11" stroke="{INK}" stroke-width="0.4"/>
<line x1="0" y1="{BH-11}" x2="{BW}" y2="{BH-11}" stroke="{INK}" stroke-width="0.4"/>
{MARK.format(ink=INK, tx=20, ty=44, s=27/300)}
<text x="52" y="62" font-family="Fraunces" font-weight="600" font-size="16" fill="{INK}">Lease-a-Fleece</text>
<text x="53" y="71" font-family="IBM Plex Mono" font-size="3.4" letter-spacing="2" fill="{STONE}">EST. 1986 · GRONINGEN</text>
<line x1="184" y1="36" x2="184" y2="{BH-36}" stroke="{INK}" stroke-width="0.3" opacity="0.55"/>
{spec}
{qr(252, 41, 32)}
<text x="268" y="79" font-family="IBM Plex Mono" font-size="2.9" letter-spacing="1" text-anchor="middle" fill="{STONE}">LEASE-A-FLEECE.COM</text>
</g>'''

# Portrait strip 115 x 297: the band rotated so it reads around the roll.
open(f'{D}/wrapper.svg','w').write(
 f'<svg xmlns="http://www.w3.org/2000/svg" width="{BH}mm" height="{BW}mm" viewBox="0 0 {BH} {BW}">'
 f'<g transform="translate(0,{BW}) rotate(-90)">{band()}</g></svg>')
# Reading-orientation copy, for looking at.
open(f'{D}/wrapper-flat.svg','w').write(
 f'<svg xmlns="http://www.w3.org/2000/svg" width="{BW}mm" height="{BH}mm" viewBox="0 0 {BW} {BH}">{band()}</svg>')
print("wrapper built")
