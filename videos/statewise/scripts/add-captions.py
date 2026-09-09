from pathlib import Path
import re,json,html
p=Path('.')
for f in (p/'compositions/frames').glob('*.html'):
 s=f.read_text().replace('<div class="ground clip"','<div id="background" class="ground clip"');f.write_text(s)
# Sentence-sized readable cues, manually aligned to the generated narration.
cues=[(0,1.4,'Fifty states.'),(1.4,3.3,'Where do you start? Pick one.'),(3.3,6.8,'Statewise turns a map of the United States'),(6.8,10.2,'into a little discovery, every time you explore.'),(10.2,11.5,'Tap California.'),(11.5,15,'There is the capital, the year it became a state,'),(15,17.6,'and a fact worth remembering.'),(17.6,20,'Mark it as learned, and keep exploring.'),(20,22.2,'Now try the map challenge.'),(22.2,26.8,'Pick the wrong state, and you see exactly where you went wrong.'),(26.8,28.3,'The correct outline lights up.'),(28.3,30.92,'Try again, and make it stick.'),(30.92,33.5,'Practice capitals and nicknames too.'),(33.5,35.9,'Your progress stays on your device,'),(35.9,38.1,'and the map works on your phone.'),(38.1,41.12,'Open Statewise. Learn one state today.')]
s=(p/'index.html').read_text();s=re.sub(r'<script src="https://cdn[^>]+></script>','<script src="assets/gsap.min.js"></script>',s)
s=s.replace('.scene {','.scene {')
s=s.replace('</style>', '''@font-face{font-family:DM;src:url('assets/dm-sans-400.ttf')}.narration-caption{position:absolute;left:96px;right:96px;top:974px;height:60px;display:flex;align-items:center;justify-content:center;z-index:50;font-family:DM,sans-serif;font-size:27px;line-height:1.35;color:#263D33;text-align:center}.narration-caption span{display:block;padding:8px 22px;background:#F7F8F4;border-radius:7px}</style>''')
clips='\n'.join(f'<div id="caption-{i}" class="clip narration-caption" data-start="{a}" data-duration="{b-a:.3f}" data-track-index="2" data-layout-allow-caption-zone><span>{html.escape(t)}</span></div>' for i,(a,b,t) in enumerate(cues))
s=s.replace('\n    </div>\n\n    <script>', '\n'+clips+'\n    </div>\n\n    <script>')
(p/'index.html').write_text(s)
(p/'caption_groups.json').write_text(json.dumps(cues,indent=2))
