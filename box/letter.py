import os
D = os.path.dirname(os.path.abspath(__file__))

MARK = ('<svg viewBox="0 0 300 300" fill="none" stroke="currentColor" class="mk">'
 '<path d="M 52 74 Q 52 52 74 52 H 164 Q 248 52 248 136 V 226 Q 248 248 226 248 H 74 Q 52 248 52 226 Z" stroke-width="15" stroke-linejoin="round"/>'
 '<path d="M 164 52 Q 164 136 248 136" stroke-width="15" stroke-linecap="round"/>'
 '<path d="M 82 84 H 152 M 82 84 V 218 M 82 218 H 218 M 218 218 V 158" stroke-width="9" stroke-linecap="round" stroke-dasharray="1 22"/></svg>')

ROWS = [
    ("LAF-U-001", "Fjord",  "Olive", "130 × 160 cm · 260 gsm", "Perpetual lease"),
    ("LAF-U-002", "Aurora", "Ivory", "130 × 160 cm · 260 gsm", "Perpetual lease"),
    ("LAF-A-001", "KORG",   "White", "Fleece Containment Unit", "Sold outright"),
]

CSS = """
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600&family=Karla:wght@400;500&family=IBM+Plex+Mono:wght@400;500&family=Mrs+Saint+Delafield&display=swap');
@page { size: A4; margin: 0; }
* { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
body { margin: 0; font-family: Karla, sans-serif; color: #171a14; }
.pg { width: 210mm; height: 297mm; background: #f4f1ea; padding: 13mm 22mm 25mm; position: relative; }
header { display: flex; justify-content: space-between; align-items: flex-start;
         border-bottom: 0.4mm solid #171a14; padding-bottom: 6mm; }
.brand { display: flex; align-items: center; gap: 4mm; }
.mk { width: 13mm; height: 13mm; color: #171a14; }
.wm { font-family: Fraunces, serif; font-variation-settings: "SOFT" 40, "WONK" 1;
      font-weight: 600; font-size: 7.6mm; letter-spacing: -0.015em; line-height: 1; }
.addr { font-family: "IBM Plex Mono", monospace; font-size: 2.6mm; letter-spacing: 0.13em;
        text-transform: uppercase; color: #6e6e62; text-align: right; line-height: 1.85; }
.meta { display: flex; justify-content: space-between; margin-top: 7mm;
        font-family: "IBM Plex Mono", monospace; font-size: 2.7mm; letter-spacing: 0.13em;
        text-transform: uppercase; color: #6e6e62; }
h1 { font-family: Fraunces, serif; font-variation-settings: "SOFT" 40, "WONK" 1; font-weight: 600;
     font-size: 8.2mm; line-height: 1.06; letter-spacing: -0.015em; margin: 5mm 0 4mm; }
p { font-size: 3.25mm; line-height: 1.45; margin: 0 0 2.6mm; max-width: 156mm; }
h2 { font-family: "IBM Plex Mono", monospace; font-size: 2.8mm; letter-spacing: 0.2em;
     text-transform: uppercase; color: #6e6e62; font-weight: 500; margin: 4.2mm 0 1.8mm; }
table { width: 100%; border-collapse: collapse; margin: 1.2mm 0 3.2mm; }
th { font-family: "IBM Plex Mono", monospace; font-size: 2.5mm; letter-spacing: 0.14em;
     text-transform: uppercase; color: #6e6e62; font-weight: 400; text-align: left;
     padding: 0 0 1.6mm; border-bottom: 0.3mm solid #171a14; }
td { font-size: 2.95mm; padding: 1.6mm 0; border-bottom: 0.15mm solid #dcd7ca; }
td.c { font-family: "IBM Plex Mono", monospace; font-size: 2.9mm; letter-spacing: 0.06em; }
.sigs { display: grid; grid-template-columns: 1fr 1fr; gap: 2.5mm 14mm; margin-top: 2.5mm;
         max-width: 152mm; }
.sig .name { font-family: "Mrs Saint Delafield", cursive; font-size: 8.4mm; line-height: 1;
             color: #2b2f26; }
.sig .who { font-family: "IBM Plex Mono", monospace; font-size: 2.5mm; letter-spacing: 0.13em;
            text-transform: uppercase; color: #6e6e62; margin-top: 1.1mm; line-height: 1.6;
            border-top: 0.2mm solid #dcd7ca; padding-top: 1.1mm; }
footer { position: absolute; left: 22mm; right: 22mm; bottom: 12mm; border-top: 0.3mm solid #dcd7ca;
         padding-top: 3mm; font-family: "IBM Plex Mono", monospace; font-size: 2.4mm;
         letter-spacing: 0.13em; text-transform: uppercase; color: #8d897e;
         display: flex; justify-content: space-between; }
"""

rows = "".join(
    f'<tr><td class="c">{c}</td><td>{n}</td><td>{col}</td><td>{d}</td><td class="c">{t}</td></tr>'
    for c, n, col, d, t in ROWS)

BODY = f"""<div class="pg">
<header>
  <div class="brand">{MARK}<div class="wm">Lease&#8209;a&#8209;Fleece</div></div>
  <div class="addr">Lease-a-Fleece B.V.<br>Groningen, the Netherlands<br>Est. 1986</div>
</header>
<div class="meta"><span>Contract LAF-2026-001</span><span>17 September 2026</span></div>

<h1>Welcome to the<br>lessee register.</h1>

<p>Dear Mr Olijve,</p>

<p>Your application has been reviewed, approved and entered into the register. You join a
body of lessees that has remained comfortably small since 1986.</p>

<h2>Assets covered by this contract</h2>
<table>
<tr><th>Code</th><th>Unit</th><th>Colourway</th><th>Specification</th><th>Disposition</th></tr>
{rows}
</table>

<p>A word on the third item. KORG is not leased. It is the only article we have ever sold, and
it is yours without condition. We do not expect to source another.</p>

<h2>Terms</h2>
<p>Both units are held on <strong>perpetual lease</strong>. There is no monthly charge, no end
date and no scheduled inspection. Quarterly laundering remains the responsibility of the
lessee, and we have elected not to enforce it.</p>

<p>The Five-Kilometre Concession has been applied in full. Our records confirm the distance
was completed. They do not record the time, and we did not ask.</p>

<h2>Care</h2>
<p>Machine wash at 40&nbsp;°C; the label carries the rest. The temperature is not a coincidence,
but we will say no more about it.</p>

<h2>In closing</h2>
<p>Forty years is a long time for a firm to operate with a fleet of two. We have found the
trick is to choose the right lessee and then stop looking. Congratulations on your fortieth
year; may the residual thermal value remain undiminished.</p>

<p>A lease granted in perpetuity cannot be issued on one signature. Article 12 of our founding
documents requires the hand of every serving director, and the board has been the same four
people since 1986. Nobody has proposed amending it.</p>

<div class="sigs"><div class="sig"><div class="name">Erik Kallen</div><div class="who">Erik Kallen<br>Managing Director</div></div><div class="sig"><div class="name">Talisa Kallen</div><div class="who">Talisa Kallen<br>Director of Underwriting</div></div><div class="sig"><div class="name">Ailynn Kallen</div><div class="who">Ailynn Kallen<br>Registrar of the Fleet</div></div><div class="sig"><div class="name">Quinn Kallen</div><div class="who">Quinn Kallen<br>Inspector of Warmth</div></div></div>

<footer><span>lease-a-fleece.com</span><span>Fleece remains the property of the lessor at all times</span></footer>
</div>"""

open(f'{D}/letter.html','w').write(f'<meta charset="utf-8"><style>{CSS}</style>{BODY}')
print("letter built")
