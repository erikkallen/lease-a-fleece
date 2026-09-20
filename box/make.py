import os
D = os.path.dirname(os.path.abspath(__file__))

MARK = ('<svg viewBox="0 0 300 300" fill="none" stroke="currentColor" class="mk">'
 '<path d="M 52 74 Q 52 52 74 52 H 164 Q 248 52 248 136 V 226 Q 248 248 226 248 H 74 Q 52 248 52 226 Z" stroke-width="15" stroke-linejoin="round"/>'
 '<path d="M 164 52 Q 164 136 248 136" stroke-width="15" stroke-linecap="round"/>'
 '<path d="M 82 84 H 152 M 82 84 V 218 M 82 218 H 218 M 218 218 V 158" stroke-width="9" stroke-linecap="round" stroke-dasharray="1 22"/></svg>')

PUNS = [
    ("FLEECE TO MEET YOU",     "Top — the first thing he reads"),
    ("RELEASE THE FLEECE",     "Opening flap"),
    ("A NEW FLEECE ON LIFE",   "Long side"),
    ("LEASE IS MORE",          "Long side"),
    ("OUR FLEECE RESISTANCE",  "Short side"),
    ("HANDLE WITH FLEECE",     "Short side"),
    ("FLEECE AND THANK YOU",   "Bottom — the last thing he reads"),
    ("GIVE FLEECE A CHANCE",   "Spare"),
    ("FLEECE OF MIND",         "Spare"),
    ("KEEP THE WARM FUZZIES",  "Spare"),
    ("RENT THE FLEECE",        "Spare"),
    ("MASTERFLEECE",           "Spare"),
    ("FLEECE AND QUIET",       "Spare"),
    ("AT LONG LAST FLEECE",    "Spare"),
    ("LEASE EXPECTATIONS",     "Spare"),
    ("FOR FLEECE SAKE",        "Spare"),
]

CSS = """
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600&family=IBM+Plex+Mono:wght@400;500&display=swap');
@page { size: A4 landscape; margin: 0; }
* { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
body { margin: 0; }
.pg { width: 297mm; height: 210mm; background: #f4f1ea; color: #171a14;
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      page-break-after: always; position: relative; padding: 0 18mm; }
.pg:last-child { page-break-after: auto; }
.mk { width: 22mm; height: 22mm; margin-bottom: 10mm; }
h1 { font-family: Fraunces, Georgia, serif; font-variation-settings: "SOFT" 40, "WONK" 1;
     font-weight: 600; font-size: 34mm; line-height: 1.02; letter-spacing: -0.015em;
     text-align: center; margin: 0; }
.sub { font-family: "IBM Plex Mono", monospace; font-size: 3.6mm; letter-spacing: 0.22em;
       text-transform: uppercase; color: #6e6e62; margin-top: 12mm; }
.rule { position: absolute; left: 18mm; right: 18mm; height: 0.4mm; background: #171a14; }
.rule.t { top: 14mm; } .rule.b { bottom: 14mm; }
.pos { position: absolute; bottom: 6mm; right: 18mm; font-family: "IBM Plex Mono", monospace;
       font-size: 2.6mm; letter-spacing: 0.14em; color: #b8b0a2; text-transform: uppercase; }
"""

pages = "".join(
    f'<div class="pg"><div class="rule t"></div>{MARK}<h1>{text}</h1>'
    f'<div class="sub">Lease-a-Fleece · Est. 1986 · Groningen</div>'
    f'<div class="rule b"></div><div class="pos">{pos}</div></div>'
    for text, pos in PUNS)

open(f'{D}/puns.html','w').write(f'<meta charset="utf-8"><style>{CSS}</style>{pages}')
print(f"{len(PUNS)} pun sheets")
