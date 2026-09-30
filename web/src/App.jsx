import {useEffect,useState} from 'react';
import {getHealth} from './api.js';
import Classify from './features/Classify.jsx';
import Detect from './features/Detect.jsx';
import Search from './features/Search.jsx';
import Chat from './features/Chat.jsx';
const tabs=[
 {id:'classify',label:'Nhận diện hoa',model:'classifier',symbol:'01',subtitle:'ResNet-18 · 5 loài hoa',component:Classify},
 {id:'detect',label:'Phát hiện đối tượng',model:'detector',symbol:'02',subtitle:'YOLO11n · 80 lớp COCO',component:Detect},
 {id:'search',label:'Tìm kiếm ảnh',model:'retrieval',symbol:'03',subtitle:'CLIP ViT-B/32 + FAISS',component:Search},
 {id:'chat',label:'Trợ lý ShopLite',model:'llm',symbol:'04',subtitle:'Qwen2.5 + RAG',component:Chat},
];
export default function App(){
 const [tab,setTab]=useState('classify'),[health,setHealth]=useState(null);
 useEffect(()=>{const check=()=>getHealth().then(setHealth).catch(()=>setHealth({status:'down',models:{}}));check();const t=setInterval(check,15000);return()=>clearInterval(t)},[]);
 const current=tabs.find(t=>t.id===tab),ready=health?.models?.[current.model];
 return <div className="shell"><aside><a className="brand" href="#"><span className="brandmark">A</span><span>AI Studio<small>ỨNG DỤNG AI TRÊN WEB</small></span></a><p className="nav-label">KHÔNG GIAN LÀM VIỆC</p><nav aria-label="Chức năng AI">{tabs.map(t=><button key={t.id} onClick={()=>setTab(t.id)} aria-current={tab===t.id?'page':undefined} className={tab===t.id?'active':''}><span className="number">{t.symbol}</span><span>{t.label}<small>{t.subtitle}</small></span></button>)}</nav><div className="aside-bottom"><strong>4 chức năng · 1 nền tảng</strong><p>Phát triển từ notebook<br/>AI Web Apps của giảng viên.</p><a href="/docs" target="_blank" rel="noreferrer">Tài liệu API</a></div></aside><div className="workspace"><header><span>Lập trình Web nâng cao</span><div className="server-status"><i className={health?.status==='ok'?'online':''}/>{health?.status==='ok'?`Máy chủ ${health.device.toUpperCase()}`:health?'Chưa kết nối':'Đang kết nối…'}</div></header><main><div className="page-heading"><p className="eyebrow">CHỨC NĂNG {current.symbol} / 04</p><h1>{current.label}</h1><p>{current.subtitle}</p></div>{health&&!ready&&<p className="error" role="alert">{health.status==='down'?'Không kết nối được máy chủ. Hãy chạy start.bat hoặc start.sh.':'Mô hình đang chưa sẵn sàng. Xem trạng thái và lỗi ở /api/health.'}</p>}{tabs.map(t=><div key={t.id} hidden={tab!==t.id}><t.component /></div>)}<footer><span>AI Studio 1.0</span><span>Mô hình thực · Kết quả suy luận trực tiếp</span></footer></main></div></div>
}
