#!/bin/bash
# ສ້າງໄຟລ໌ດຽວຈົບ insee-driver-prototype.html (ແລ່ນທຸກຄັ້ງທີ່ແກ້ css/js)
cd "$(dirname "$0")"
python3 - <<'PY'
import io,re,time
VER = str(int(time.time()))
# ໃສ່ ?v=<ເວລາ> ໃຫ້ທຸກ css/js ໃນ index.html ແລະ preview.html (ກັນ cache ເກົ່າຄ້າງ)
for f in ('index.html','preview.html'):
    h = io.open(f,encoding='utf-8').read()
    h = re.sub(r'(href="css/style\.css)(\?v=\d+)?"', r'\1?v=' + VER + '"', h)
    h = re.sub(r'(src="js/[a-z0-9]+\.js)(\?v=\d+)?"', r'\1?v=' + VER + '"', h)
    io.open(f,'w',encoding='utf-8').write(h)
print('  ↳ cache-bust v' + VER)
html=io.open('index.html',encoding='utf-8').read()
css=io.open('css/style.css',encoding='utf-8').read()
js=''.join(io.open('js/'+f,encoding='utf-8').read()+'\n' for f in ('data.js','state.js','ui.js','screens.js','screens2.js','app.js'))
html=re.sub(r'<link rel="stylesheet" href="css/style\.css(\?v=\d+)?">', '<style>\n'+css.replace('\\','\\\\')+'\n</style>', html)
html=re.sub(r'<script src="js/[a-z0-9]+\.js(\?v=\d+)?"></script>\s*','',html)
html=html.replace('</body>','<script>\n'+js+'\n</script>\n</body>')
io.open('insee-driver-prototype.html','w',encoding='utf-8').write(html)
print('✓ insee-driver-prototype.html', len(html), 'bytes')
PY
