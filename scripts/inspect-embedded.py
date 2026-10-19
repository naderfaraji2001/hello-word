from pathlib import Path
import zipfile
from PIL import Image,ImageOps,ImageDraw
out=Path('inputs/embedded');out.mkdir(exist_ok=True);images=[]
for p in Path('../docs').rglob('*'):
 if p.suffix not in ['.docx','.pptx']:continue
 with zipfile.ZipFile(p) as z:
  for n in z.namelist():
   if '/media/' in n and n.lower().endswith(('.png','.jpg','.jpeg')):
    f=out/(p.stem[:35]+'-'+Path(n).name);f.write_bytes(z.read(n))
    try:
     im=Image.open(f).convert('RGB');im.thumbnail((350,230));images.append((f.name,im.copy()))
    except:pass
for b in range(0,len(images),12):
 group=images[b:b+12];sheet=Image.new('RGB',(1140,280*((len(group)+2)//3)),'#ddd');d=ImageDraw.Draw(sheet)
 for i,(label,im) in enumerate(group):
  x=i%3*380;y=i//3*280;sheet.paste(im,(x,y));d.text((x,y+235),label[:57],fill='black')
 sheet.save(out/f'sheet-{b//12}.jpg')
print('Embedded images:',len(images))
