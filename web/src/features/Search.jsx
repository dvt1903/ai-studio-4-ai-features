import {useState} from 'react';
import {API_BASE,postImage,postJson} from '../api.js';
import ImagePicker from './ImagePicker.jsx';
export default function Search(){
 const [query,setQuery]=useState('yellow sunflowers in a field'),[state,setState]=useState({status:'idle'});
 const busy=state.status==='loading';
 async function run(fn){if(busy)return;setState({status:'loading'});try{setState({status:'ok',results:(await fn()).results})}catch(e){setState({status:'error',error:e.message})}}
 return <section><h2>Tìm ảnh tương đồng</h2><p className="muted">CLIP ViT-B/32 mã hóa ảnh và văn bản. FAISS tìm các ảnh gần nhất.</p><form className="row" onSubmit={e=>{e.preventDefault();run(()=>postJson('/api/search/text',{query:query.trim(),k:12}))}}><input value={query} onChange={e=>setQuery(e.target.value)} maxLength={200} aria-label="Câu mô tả" placeholder="a dog on a sofa"/><button className="button" type="submit" disabled={busy||!query.trim()}>Tìm ảnh</button></form><ImagePicker disabled={busy} label="Tìm bằng ảnh từ máy" onChange={f=>run(()=>postImage('/api/search/image',f,{k:12}))}/>{state.status==='idle'&&<div className="empty"><strong>Kho ảnh COCO + Flowers</strong><p>Kết quả xếp hạng theo cosine similarity.</p></div>}{busy&&<div className="empty"><span className="spinner"/><strong>Đang tìm ảnh…</strong></div>}{state.status==='error'&&<p className="error">{state.error}</p>}{state.status==='ok'&&<><p className="muted">{state.results.length} ảnh tương đồng nhất</p><div className="gallery">{state.results.map(r=><figure key={r.id}><img src={`${API_BASE}${r.url}`} alt={r.label} loading="lazy"/><figcaption>{r.label} · {r.score.toFixed(3)}</figcaption></figure>)}</div></>}</section>
}
