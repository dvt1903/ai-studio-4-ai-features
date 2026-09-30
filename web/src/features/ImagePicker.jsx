import {useEffect,useState} from 'react';
import {API_BASE} from '../api.js';
export default function ImagePicker({onChange,label='Chọn ảnh từ máy',sample,disabled=false}){
 const [preview,setPreview]=useState(null),[error,setError]=useState('');
 useEffect(()=>()=>preview&&URL.revokeObjectURL(preview),[preview]);
 function pick(file){if(!file)return;if(!/^image\/(jpeg|png|webp)$/.test(file.type)){setError('Chọn ảnh JPG, PNG hoặc WEBP.');return}if(file.size>8*1024*1024){setError('Ảnh tối đa 8 MB.');return}setError('');setPreview(URL.createObjectURL(file));onChange(file)}
 async function useSample(){try{const r=await fetch(`${API_BASE}/api/samples/${sample}`);if(!r.ok)throw Error('Chưa có ảnh mẫu. Hãy chạy scripts/prepare.py.');pick(new File([await r.blob()],`${sample}.jpg`,{type:'image/jpeg'}))}catch(e){setError(e.message)}}
 return <div className="picker"><div className="upload-zone"><strong>Tải ảnh để phân tích</strong><label className="button">{label}<input aria-label={label} type="file" accept="image/jpeg,image/png,image/webp" disabled={disabled} hidden onChange={e=>{pick(e.target.files?.[0]);e.target.value=''}}/></label><p>JPG, PNG, WEBP · Tối đa 8 MB</p></div>{sample&&<button className="sample" type="button" disabled={disabled} onClick={useSample}>Dùng ảnh mẫu có sẵn</button>}{error&&<p className="error">{error}</p>}{preview&&<img src={preview} alt="Ảnh đầu vào" className="preview"/>}</div>
}
