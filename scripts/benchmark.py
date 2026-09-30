"""Sequential warm API benchmark, not a concurrency/load test."""
import json,platform,os,time
from pathlib import Path
import httpx, numpy as np
root=Path(__file__).resolve().parents[1]
c=httpx.Client(base_url='http://127.0.0.1:8000',timeout=180)
flower=next((root/'data/gallery').glob('sunflowers_*.jpg')).read_bytes()
from ultralytics.utils import ASSETS
bus=(ASSETS/'bus.jpg').read_bytes()
ops={
 'classify':lambda:c.post('/api/classify',files={'file':('flower.jpg',flower,'image/jpeg')}),
 'detect':lambda:c.post('/api/detect',files={'file':('bus.jpg',bus,'image/jpeg')}),
 'search_text':lambda:c.post('/api/search/text',json={'query':'yellow sunflowers','k':8}),
 'search_image':lambda:c.post('/api/search/image',files={'file':('flower.jpg',flower,'image/jpeg')}),
 'chat_sync':lambda:c.post('/api/chat/sync',json={'message':'Thiết bị điện tử được bảo hành bao nhiêu tháng?'})}
report={'hardware':{'platform':platform.platform(),'logical_cpus':os.cpu_count(),'torch_threads':4},'protocol':'Sequential, warmed, 10 requests per image endpoint, 5 chat requests. Not a concurrent load test. Includes HTTP overhead.'}
for name,fn in ops.items():
 fn().raise_for_status(); times=[]
 for _ in range(5 if name=='chat_sync' else 10):
  start=time.perf_counter();fn().raise_for_status();times.append((time.perf_counter()-start)*1000)
 report[name]={'n':len(times),'p50_ms':round(float(np.percentile(times,50)),1),'p95_ms':round(float(np.percentile(times,95)),1)}
 print(name,report[name],flush=True)
for d in Path('/proc').glob('[0-9]*'):
 try:
  if 'uvicorn' in (d/'cmdline').read_text() and 'api.main:app' in (d/'cmdline').read_text():
   for line in (d/'status').read_text().splitlines():
    if line.startswith('VmRSS:'):report['hardware']['server_rss_mb']=round(int(line.split()[1])/1024,1)
 except (PermissionError,FileNotFoundError,ProcessLookupError):pass
(root/'docs/benchmark.json').write_text(json.dumps(report,indent=2))
