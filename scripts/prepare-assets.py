from PIL import Image,ImageOps,ImageDraw
from pathlib import Path
r=Path('..');pub=Path('public/media');pub.mkdir(exist_ok=True)
sources=[(r/'docs/Images/5aa38f32-cfb1-4f15-b2de-0873892b88f9.JPG','founder',1000),(r/'docs/Images/8d3a350f-8647-40e9-a3b1-4b5c1c1d81d4.JPG','event',1000)]
for source,name,w in sources:
 im=ImageOps.exif_transpose(Image.open(source));im.thumbnail((w,1400));im.save(pub/(name+'.webp'),'WEBP',quality=84)
p=Path('/Users/hamedsattarian/.codex/generated_images/01a14bcd-f3bf-7893-93c2-407db2846cd8/exec-8d232619-4aab-499d-912f-207c705f30fd.png')
if p.exists():
 im=Image.open(p).convert('RGB');im.thumbnail((1920,1080));im.save(pub/'hero-operations-overhead.webp','WEBP',quality=82);ImageOps.fit(im,(750,1000)).save(pub/'hero-mobile.webp','WEBP',quality=78)
print('Prepared selected derivatives only.')
