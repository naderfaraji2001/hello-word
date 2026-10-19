from pathlib import Path
import json,zipfile,xml.etree.ElementTree as E
import fitz,openpyxl
from PIL import Image,ImageOps,ImageDraw
root=Path('/Users/hamedsattarian/Utopia'); out=root/'website/inputs'; records=[]; texts=[]; thumbs=[]
for p in (root/'docs').rglob('*'):
 if not p.is_file() or p.name=='.DS_Store': continue
 ext=p.suffix.lower(); text=''; rel=str(p.relative_to(root)); public=False
 if ext in ['.docx','.pptx']:
  with zipfile.ZipFile(p) as z:
   names=[n for n in z.namelist() if n=='word/document.xml' or (n.startswith('ppt/slides/slide') and n.endswith('.xml'))]
   for n in sorted(names):
    e=E.fromstring(z.read(n)); text+='\n'+n+'\n'+' '.join(t.text or '' for t in e.iter() if t.tag.endswith('}t'))
 elif ext=='.pdf':
  d=fitz.open(p); text='\n'.join(f'PAGE {i+1}\n'+pg.get_text() for i,pg in enumerate(d))
  for i,pg in enumerate(d):
   pix=pg.get_pixmap(matrix=fitz.Matrix(.4,.4)); f=out/(p.stem+f'-{i}.png'); pix.save(f)
   im=Image.open(f); im.thumbnail((260,180)); thumbs.append((rel+f' p{i+1}',im.copy()))
 elif ext=='.xlsx':
  w=openpyxl.load_workbook(p,data_only=False); text='\n'.join(s.title+'\n'+'\n'.join(str(r) for r in s.iter_rows(values_only=True)) for s in w)
 elif ext=='.md': text=p.read_text()
 elif ext in ['.jpg','.png']:
  im=ImageOps.exif_transpose(Image.open(p)); im.thumbnail((260,180)); thumbs.append((rel,im.copy()))
 if text: texts.append('SOURCE '+rel+'\n'+text)
 records.append({'path':rel,'subject':p.parent.name,'intendedUse':'Evidence; public derivative only after review','page':'About' if p.parent.name=='Images' else 'Services / case studies / product concepts','publicOriginal':False,'uncertainty':'Attribution pending; screenshots may contain private or clinical information; financial claims unapproved'})
(out/'source-text.txt').write_text('\n\n'.join(texts)); (root/'website/docs/source-asset-register.json').write_text(json.dumps(records,indent=2))
for batch in range(0,len(thumbs),24):
 group=thumbs[batch:batch+24]; sheet=Image.new('RGB',(1120,240*((len(group)+3)//4)), '#ddd'); draw=ImageDraw.Draw(sheet)
 for i,(label,im) in enumerate(group):
  x=(i%4)*280;y=(i//4)*240; sheet.paste(im,(x,y)); draw.text((x,y+182),label[-65:],fill='black')
 sheet.save(out/f'contact-sheet-{batch//24}.jpg')
print(len(records),'sources;',len(thumbs),'visuals;',len('\n'.join(texts)),'characters extracted')
