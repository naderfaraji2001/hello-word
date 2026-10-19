import re,json,pathlib
s=pathlib.Path('../files/01-UTOPIA-WEBSITE-CONTENT-EN.md').read_text(); records=[]
for line in s.splitlines():
 if re.match(r'\| P\d+',line):
  cols=[x.strip().strip('`') for x in line.strip('|').split('|')]; records.append(dict(id=cols[0],route=cols[1],label=cols[2],seoTitle=cols[3],description=cols[4]))
def between(a,b): return s[s.index(a)+len(a):s.index(b)].strip()
# Extract supplied public prose while excluding production instructions and private evidence.
def clean(t):
 out=[]
 for line in t.splitlines():
  line=line.strip()
  if not line: out.append('');continue
  if re.match(r'(Internal |Route:|Source:|Sources |Visual:|Editorial |Do not |Show |Use |Close with|FAQ:|CTAs:|CTA:|Action:|Next step:|Filters:|Captions:|Status pill:|Author label:|Categories:|Supporting text: These|The internal|Optional calendar)',line):
   if line.startswith('FAQ:'): out.append('### Frequently asked questions\n'+line[4:].strip())
   continue
  if any(x in line for x in ['Show the actual','Internal client association','Do not present','Link to the Bella','Display HealthQuest','Show the SBH','reviewed after','Use “Reviewed','Sources S','source spreadsheet','the source spreadsheet','financial figures remain withheld','public case does not assign','source describes that operational change','This case does not publish','source narrative includes']):
   if 'The public case' in line: line=line.split(' The public case')[0]
   elif ' Exact financial' in line:line=line.split(' Exact financial')[0]
   elif ' This case does' in line:line=line.split(' This case does')[0]
   elif ' The source describes' in line:line=line.split(' The source describes')[0]
   elif 'Utopia\'s source narrative' in line:line=line.split(" Utopia's source narrative")[0]
   else:continue
  if line.startswith(('Hero eyebrow:','Eyebrow:','H1:','Intro:','Body:','Heading:','Summary:','Capabilities:','Supporting line:','Status:','Role:')):
   key,val=line.split(':',1); line=('## ' if key=='Heading' else '')+val.strip()
  line=line.replace('{#lab-assistant}','')
  out.append(line)
 return '\n'.join(out).strip()
chunks={
'/solutions':between('## 4 P02 Services overview','## 5 P03'),
'/solutions/integrations':between('## 5 P03 Healthcare integrations','## 6 P04'),
'/solutions/managed-it':between('## 6 P04 Managed IT & security','## 7 P05'),
'/solutions/revenue-optimization':between('## 7 P05 Revenue workflows','## 8 P06'),
'/solutions/ai-automation':between('## 8 P06 Data, AI & automation','## 9 P07'),
'/solutions/patient-engagement':between('## 9 P07 Patient engagement','## 10 P08'),
'/industries':between('### P08 Industries overview','### P09 Laboratories'),
'/industries/laboratories':between('### P09 Laboratories','### P10 Behavioral health'),
'/industries/behavioral-health':between('### P10 Behavioral health','### P11 Clinics and practices'),
'/industries/clinics':between('### P11 Clinics and practices','## 11 P12'),
'/about':between('### P19 About','### P20 How we work'),
'/how-we-work':between('### P20 How we work','### P21 Partners'),
'/partners':between('### P21 Partners','## 14 P22'),
'/privacy':between('### Privacy notice','### Website terms'),
'/terms':between('### Website terms','### Accessibility statement'),
'/accessibility':between('### Accessibility statement','### 404 page')}
caseheads=['### Case 1 — Connected operations for a growing laboratory','### Case 2 — Reviewing recurring integration and licensing costs','### Case 3 — Building the foundation for a new laboratory facility','### Case 4 — Connecting a laboratory instrument to the LIS','### Internal claim register']
for i in range(4): chunks[records[14+i]['route']]=between(caseheads[i],caseheads[i+1])
arts=['### Article 1 — Where LIS, EMR and billing handoffs break down','### Article 2 — Review technology costs before buying another platform','### Article 3 — Design patient engagement around the work of behavioral health','### Video content that is not yet']
for i in range(3):chunks[records[22+i]['route']]=between(arts[i],arts[i+1])
for r in records:
 t=chunks.get(r['route'],'');h=re.search(r'^H1: (.+)',t,re.M); r['title']=h.group(1) if h else r['label']; r['body']=clean(re.sub(r'^H1: .*\n','',t,flags=re.M));r['slug']=r['route'].split('/')[-1]
 if r['route'].startswith('/resources/'):
  r['title']=arts[int(r['id'][1:])-23].split(' — ')[1]; r['excerpt']=re.search(r'Excerpt: (.+)',t).group(1);r['body']=clean(t[t.index('**'):])
# Homepage source slots, clean prose is kept separate from layout.
home={}
for i in range(1,15):
 a=re.search(r'### H%02d ([^\n]+)\n'%i,s);end=re.search(r'\n(?:### H|## 4)',s[a.end():]);home[f'H{i:02}']=s[a.end():a.end()+end.start()].strip()
pathlib.Path('src/content/pages.json').write_text(json.dumps(records,indent=2));pathlib.Path('src/content/home-source.json').write_text(json.dumps(home,indent=2))
claims=between('### Internal claim register — not website copy','## 13 P19');pathlib.Path('docs/evidence/claims.md').write_text(claims)
