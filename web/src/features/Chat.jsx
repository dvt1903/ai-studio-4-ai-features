import { useEffect, useRef, useState } from 'react';
import { streamChat } from '../api.js';

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const abortRef = useRef(null);
  useEffect(() => () => abortRef.current?.abort(), []);
  async function send(e) {
    e.preventDefault(); const text=input.trim(); if(!text||busy)return;
    const history=messages.map(({role,content})=>({role,content}));
    setMessages(m=>[...m,{role:'user',content:text},{role:'assistant',content:'',sources:[]}]); setInput(''); setBusy(true); abortRef.current=new AbortController();
    const patchLast=fn=>setMessages(m=>[...m.slice(0,-1),fn(m[m.length-1])]);
    try{await streamChat({message:text,history,signal:abortRef.current.signal,onSources:items=>patchLast(last=>({...last,sources:items})),onToken:t=>patchLast(last=>({...last,content:last.content+t}))})}
    catch(err){if(err.name!=='AbortError')patchLast(last=>({...last,content:`Lỗi: ${err.message}`}))} finally{setBusy(false)}
  }
  return <section className="chat"><h2>Trợ lý ShopLite (RAG)</h2><p className="muted">Câu trả lời dựa trên tài liệu chính sách và có thể sai.</p><div className="suggestions">{['Đổi trả trong bao lâu?','Phí giao hàng bao nhiêu?','Bảo hành điện tử bao lâu?'].map(q=><button type="button" disabled={busy} key={q} onClick={()=>setInput(q)}>{q}</button>)}</div><div className="messages" aria-live="polite">{!messages.length&&<div className="empty"><strong>Xin chào, tôi là trợ lý ShopLite</strong><p>Hỏi về đổi trả, bảo hành, giao hàng, thanh toán hoặc tài khoản.</p></div>}{messages.map((m,i)=><div key={i} className={`msg ${m.role}`}><p>{m.content||(busy&&i===messages.length-1?'…':'')}</p>{m.sources?.length>0&&<details><summary>Nguồn ({m.sources.length})</summary>{m.sources.map((s,j)=><p key={j} className="muted"><b>{s.source}</b> · {s.score}: {s.text.slice(0,160)}…</p>)}</details>}</div>)}</div><form className="row" onSubmit={send}><input value={input} onChange={e=>setInput(e.target.value)} placeholder="Đổi trả trong bao lâu?" aria-label="Câu hỏi" maxLength={1000}/>{busy?<button type="button" className="button" onClick={()=>abortRef.current?.abort()}>Dừng</button>:<button type="submit" className="button" disabled={!input.trim()}>Gửi</button>}</form></section>
}
