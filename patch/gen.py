import re, subprocess, sys, math

INK="#171a14"; STONE="#5f5f54"; BONE="#f4f1ea"
W,H = 150.0, 200.0          # mm — 1 SVG unit == 1 mm
NAME = sys.argv[1] if len(sys.argv)>1 else "————————"

UNITS = {
 "fjord":  dict(code="LAF-U-001", name="FJORD",  colour="OLIVE"),
 "aurora": dict(code="LAF-U-002", name="AURORA", colour="IVORY"),
}

def qr_group(x,y,size):
    svg=open(f'{D}/qr.svg').read()
    m=re.search(r'viewBox="0 0 (\d+) (\d+)"',svg); n=int(m.group(1))
    rects=re.findall(r'<rect[^>]*x="([\d.]+)"[^>]*y="([\d.]+)"[^>]*width="([\d.]+)"[^>]*height="([\d.]+)"[^>]*fill="#000000"[^>]*/>',svg)
    if not rects:
        rects=[(a,b,c,d) for a,b,c,d in re.findall(r'<rect x="([\d.]+)" y="([\d.]+)" width="([\d.]+)" height="([\d.]+)"',svg)][1:]
    s=size/n
    out=[f'<rect x="{x+float(a)*s:.3f}" y="{y+float(b)*s:.3f}" width="{float(c)*s+0.02:.3f}" height="{float(d)*s+0.02:.3f}" fill="{INK}"/>' for a,b,c,d in rects]
    return f'<g shape-rendering="crispEdges">{"".join(out)}</g>', n

MARK = ('<g fill="none" stroke="{ink}" stroke-width="{sw}" transform="translate({tx},{ty}) scale({s})">'
 '<path d="M 52 74 Q 52 52 74 52 H 164 Q 248 52 248 136 V 226 Q 248 248 226 248 H 74 Q 52 248 52 226 Z" stroke-linejoin="round"/>'
 '<path d="M 164 52 Q 164 136 248 136" stroke-linecap="round"/>'
 '<path d="M 82 84 H 152 M 82 84 V 218 M 82 218 H 218 M 218 218 V 158" stroke-linecap="round" stroke-dasharray="1 22" stroke-width="{sw2}"/></g>')

def seal(cx,cy,r):
    n=44; st=[]
    for i in range(n):
        a=2*math.pi*i/n
        st.append('<line x1="%.2f" y1="%.2f" x2="%.2f" y2="%.2f"/>'%(
            cx+(r-1.1)*math.cos(a), cy+(r-1.1)*math.sin(a), cx+(r+1.1)*math.cos(a), cy+(r+1.1)*math.sin(a)))
    return (f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="none" stroke="{INK}" stroke-width="0.5"/>'
            f'<g stroke="{INK}" stroke-width="0.5" stroke-linecap="round">{"".join(st)}</g>'
            f'<text x="{cx}" y="{cy+3.9}" font-family="Fraunces" font-weight="600" font-size="11.5" '
            f'text-anchor="middle" fill="{INK}">40</text>')

def build(slug):
    u=UNITS[slug]
    qr,_=qr_group(18, 141, 40)
    rows=[("LESSEE",NAME),("LESSEE AGE","40 YEARS"),("UNIT",f"{u['code']} · {u['name']}"),
          ("COLOURWAY",u["colour"]),("TERM","PERPETUAL"),("CONDITION","BOTH PARTIES SERVICEABLE")]
    ry=108.0; spec=[]
    for i,(k,v) in enumerate(rows):
        y=ry+i*5.6
        spec.append(f'<text x="18" y="{y}" font-family="IBM Plex Mono" font-size="3.1" letter-spacing="0.35" fill="{STONE}">{k}</text>')
        spec.append(f'<text x="132" y="{y}" font-family="IBM Plex Mono" font-weight="500" font-size="3.1" letter-spacing="0.2" text-anchor="end" fill="{INK}">{v}</text>')
        if i < len(rows)-1:
            spec.append(f'<line x1="18" y1="{y+1.9}" x2="132" y2="{y+1.9}" stroke="{INK}" stroke-width="0.12" opacity="0.35"/>')
    return f'''<svg xmlns="http://www.w3.org/2000/svg" width="{W}mm" height="{H}mm" viewBox="0 0 {W} {H}">
<rect width="{W}" height="{H}" fill="{BONE}"/>
<rect x="0.6" y="0.6" width="{W-1.2}" height="{H-1.2}" rx="7" fill="none" stroke="{INK}" stroke-width="0.9"/>
<rect x="7" y="7" width="{W-14}" height="{H-14}" rx="4" fill="none" stroke="{INK}" stroke-width="0.3"
 stroke-dasharray="1.6 2.4" opacity="0.55"/>
{MARK.format(ink=INK, sw=15, sw2=9, tx=(W-24)/2, ty=17, s=24/300)}
<text x="{W/2}" y="53.5" font-family="Fraunces" font-weight="600" font-size="13.5" text-anchor="middle" fill="{INK}">Lease-a-Fleece</text>
<text x="{W/2}" y="60.5" font-family="IBM Plex Mono" font-size="3.1" letter-spacing="1.5" text-anchor="middle" fill="{STONE}">EST. 1986 · AMSTERDAM</text>
<line x1="18" y1="70" x2="132" y2="70" stroke="{INK}" stroke-width="0.35"/>
<text x="{W/2}" y="81" font-family="IBM Plex Mono" font-size="3.3" letter-spacing="2.2" text-anchor="middle" fill="{STONE}">PROPERTY OF</text>
<text x="{W/2}" y="93.5" font-family="Fraunces" font-weight="600" font-size="10.5" text-anchor="middle" fill="{INK}">Lease-a-Fleece B.V.</text>
<line x1="18" y1="101" x2="132" y2="101" stroke="{INK}" stroke-width="0.35"/>
{''.join(spec)}
{qr}
{seal(116, 161, 15)}
<text x="80" y="153" font-family="IBM Plex Mono" font-size="2.8" letter-spacing="1.1" text-anchor="middle" fill="{STONE}">SCAN TO</text>
<text x="80" y="158" font-family="IBM Plex Mono" font-size="2.8" letter-spacing="1.1" text-anchor="middle" fill="{STONE}">VERIFY</text>
<text x="80" y="163" font-family="IBM Plex Mono" font-size="2.8" letter-spacing="1.1" text-anchor="middle" fill="{STONE}">TITLE</text>
<text x="{W/2}" y="187.5" font-family="IBM Plex Mono" font-size="2.35" letter-spacing="0.42" text-anchor="middle" fill="{STONE}">RETURN ON DEMAND · NOT FOR RESALE · LEASE-A-FLEECE.COM</text>
</svg>'''

D=f'/tmp/claude-1000/-home-erikkallen-Projects-erik-lease-a-fleece/5dbaab3e-e484-4a02-bb2c-66c4c73a23c7/scratchpad/patch'
for slug in UNITS:
    open(f'{D}/patch-{slug}.svg','w').write(build(slug))
print("built", list(UNITS))
