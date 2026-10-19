"""Non-destructive derivatives: precise source-screen placement and field-only sanitation.
The user explicitly requests preserving actual UI in a generated device composition.
No interface pixels are generated, recolored or redesigned.
"""
from PIL import Image, ImageDraw
from pathlib import Path
base=Path(__file__).resolve().parents[1]
sources=base.parent/'docs/Mobile app images'
out=base/'public/media/products';out.mkdir(parents=True,exist_ok=True)
# Coordinates are in original source pixels; bars conceal only identifying sample fields.
redactions={
 'mobile app 1.png':[],
 'mobile app 2.png':[(91,88,115,98),(539,88,563,98),(582,111,617,131),(321,300,383,316),(321,334,402,348),(321,366,408,380),(1219,96,1288,111)],
 'mobile app 3- case manager.png':[(490,96,550,104),(490,126,548,135),(490,156,548,165),(490,186,540,195),(490,216,548,225),(490,246,548,255),(490,276,548,285),(490,306,548,315),(490,336,548,345),(719,56,763,68),(716,88,778,106),(756,122,810,137),(696,192,826,215),(783,229,830,256),(788,270,830,283),(788,298,830,311),(788,326,830,339),(1154,69,1209,79),(1154,165,1210,175),(1154,261,1210,271),(1384,64,1444,83)]}
for i,(name,boxes) in enumerate(redactions.items(),1):
 im=Image.open(sources/name).convert('RGB');d=ImageDraw.Draw(im)
 for box in boxes:d.rectangle(box,fill='#d5d9d8')
 im.save(out/f'app-board-{i}.png',optimize=True)
# Exact non-emergency source screen. Uniform scaling preserves original typography and proportions.
screen=Image.open(sources/'mobile app 1.png').convert('RGB').crop((672,53,834,413))
screen.save(out/'progress-screen.png')
scene=Image.open(base/'inputs/product-device-environment.png').convert('RGB')
# Generated empty device screen measured at (601,92)-(934,794).
slot=Image.new('RGB',(333,702),'#0d0e10');screen=screen.resize((316,702),Image.Resampling.LANCZOS);slot.paste(screen,(8,0))
mask=Image.new('L',(333,702));ImageDraw.Draw(mask).rounded_rectangle((0,0,332,701),radius=35,fill=255)
scene.paste(slot,(601,92),mask);scene.save(out/'behavioral-health-showcase.webp',quality=92,method=6)
scene.crop((350,0,1186,1024)).save(out/'behavioral-health-showcase-mobile.webp',quality=92,method=6)
print('Prepared 3 original-design boards, exact screen crop and one composite with mobile crop.')
