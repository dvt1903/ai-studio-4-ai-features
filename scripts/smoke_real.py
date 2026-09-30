"""Real HTTP smoke test. Run after preparation + server startup. No stubs."""
import argparse,json,time
from pathlib import Path
import httpx
ROOT=Path(__file__).resolve().parents[1]
p=argparse.ArgumentParser();p.add_argument('--url',default='http://127.0.0.1:8000');args=p.parse_args()
c=httpx.Client(base_url=args.url,timeout=180)
report={}
def check(name,func):
    start=time.perf_counter();r=func();r.raise_for_status();data=r.json();report[name]={'latency_ms':round((time.perf_counter()-start)*1000,1),'data':data};return data
health=check('health',lambda:c.get('/api/health'))
assert all(health['models'].values()) and len(health['models'])==4,health
flower=next((ROOT/'data/gallery').glob('sunflowers_*.jpg')).read_bytes()
from ultralytics.utils import ASSETS
bus=(ASSETS/'bus.jpg').read_bytes()
r=check('classify',lambda:c.post('/api/classify',files={'file':('flower.jpg',flower,'image/jpeg')}));assert len(r['predictions'])==3
r=check('detect',lambda:c.post('/api/detect',files={'file':('bus.jpg',bus,'image/jpeg')}));assert any(x['label']=='bus' for x in r['detections']);r.pop('image',None)
r=check('search_text',lambda:c.post('/api/search/text',json={'query':'yellow sunflowers','k':5}));assert len(r['results'])==5
assert c.get(r['results'][0]['url']).status_code==200
r=check('search_image',lambda:c.post('/api/search/image',files={'file':('flower.jpg',flower,'image/jpeg')},data={'k':5}));assert len(r['results'])==5
r=check('chat',lambda:c.post('/api/chat/sync',json={'message':'Thiết bị điện tử được bảo hành bao nhiêu tháng?'}));assert r['answer'] and r['sources']
assert c.post('/api/classify',files={'file':('a.txt',b'not image')}).status_code==400
report['versions']=c.get('/api/models').json()
(ROOT/'docs'/'real_smoke_results.json').write_text(json.dumps(report,ensure_ascii=False,indent=2))
print(json.dumps({k:{'latency_ms':v.get('latency_ms')} for k,v in report.items()},indent=2))
