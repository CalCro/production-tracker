/* Generic application logic. No telemetry or network data transmission. */
(function(root){
'use strict';
const fields=['id','date','shift','part','operation','machine','person','produced','nc','scrap','accountingVersion','createdAt','updatedAt','ncReasonsJSON','scrapReasonsJSON'];
function parseCSV(text){
 text=text.replace(/^\ufeff/,'');let rows=[],row=[],cell='',state='start';
 function end(){row.push(cell);cell='';state='start'}
 for(let i=0;i<text.length;i++){const c=text[i];
 if(state==='quoted'){if(c==='"'){if(text[i+1]==='"'){cell+='"';i++}else state='closed'}else cell+=c;continue}
 if(c===',' ){end();continue}
 if(c==='\r'||c==='\n'){if(c==='\r'&&text[i+1]==='\n')i++;end();if(row.some(x=>x!==''))rows.push(row);row=[];continue}
 if(state==='closed')throw Error('Unexpected character after closing quote');
 if(c==='"'){if(state!=='start')throw Error('Quote inside unquoted field');state='quoted'}else{cell+=c;state='plain'}
 }
 if(state==='quoted')throw Error('Unclosed CSV quote');
 if(cell!==''||row.length||state==='closed'){end();rows.push(row)}return rows;
}
function validate(r){
 if(!r||typeof r!=='object'||typeof r.id!=='string'||!r.id.trim()||r.id.length>200)throw Error('Invalid record ID');
 if(!/^\d{4}-\d{2}-\d{2}$/.test(r.date)||new Date(r.date+'T00:00:00Z').toISOString().slice(0,10)!==r.date)throw Error('Invalid date');
 if(!['1st Shift','2nd Shift','3rd Shift'].includes(r.shift))throw Error('Invalid shift');
 for(const k of ['part','operation','machine','person'])if(typeof r[k]!=='string'||!r[k].trim()||r[k].length>80)throw Error('Invalid '+k);
 for(const k of ['produced','nc','scrap'])if(!Number.isSafeInteger(r[k])||r[k]<0)throw Error('Invalid quantity');
 if(![1,2,3].includes(r.accountingVersion))throw Error('Invalid accounting version');
 if(r.accountingVersion===1?(r.scrap>r.nc||r.nc>r.produced):r.nc+r.scrap>r.produced)throw Error('Invalid quantity accounting');
 for(const k of ['createdAt','updatedAt'])if(typeof r[k]!=='string'||!Number.isFinite(Date.parse(r[k])))throw Error('Invalid timestamp');
 for(const kind of ['nc','scrap']){let a=r[kind+'Reasons'];if(!Array.isArray(a)||a.some(x=>!x||typeof x.reason!=='string'||!x.reason.trim()||x.reason.length>250||!Number.isSafeInteger(x.quantity)||x.quantity<=0)||a.reduce((s,x)=>s+x.quantity,0)>r[kind])throw Error('Invalid reason quantities')}
 return r;
}
function validateAll(a){if(!Array.isArray(a)||a.length>50000)throw Error('Invalid record collection');const ids=new Set();for(const r of a){validate(r);if(ids.has(r.id))throw Error('Duplicate ID within backup');ids.add(r.id)}return a}
function decodeCSV(text){if(text.length>10*1024*1024)throw Error('Backup exceeds 10 MB limit');const rows=parseCSV(text),h=rows.shift();
 const schemas=[fields,fields.slice(0,13),fields.filter(k=>!['accountingVersion','ncReasonsJSON','scrapReasonsJSON'].includes(k))];
 const schema=schemas.find(s=>h&&h.length===s.length&&s.every((k,i)=>h[i]===k));if(!schema)throw Error('Unrecognized Production Tracker CSV headers');
 return validateAll(rows.map((a,i)=>{try{if(a.length!==schema.length)throw Error('Wrong column count');let r=Object.fromEntries(schema.map((k,j)=>[k,a[j]]));for(const k of ['produced','nc','scrap']){if(!/^\d+$/.test(r[k]))throw Error('Quantity must be a whole number');r[k]=Number(r[k])}r.accountingVersion=schema.includes('accountingVersion')?Number(r.accountingVersion):1;for(const k of ['nc','scrap']){r[k+'Reasons']=schema===fields?JSON.parse(r[k+'ReasonsJSON']||'[]'):[];delete r[k+'ReasonsJSON']}return validate(r)}catch(e){throw Error('Row '+(i+2)+': '+e.message)}}));
}
function comparable(r){return fields.map(k=>k.endsWith('ReasonsJSON')?r[k.replace('JSON','')].map(x=>[x.reason,x.quantity]):r[k])}
function merge(existing,incoming){validateAll(existing);validateAll(incoming);const ids=new Map(existing.map(r=>[r.id,r]));let added=0,duplicates=0,conflicts=0,next=[...existing];for(const r of incoming){if(ids.has(r.id)){duplicates++;if(JSON.stringify(comparable(ids.get(r.id)))!==JSON.stringify(comparable(r)))conflicts++}else{next.push(r);ids.set(r.id,r);added++}}return {next,added,duplicates,conflicts}}
function checksum(s){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return (h>>>0).toString(16)}
function pack(records,revision){validateAll(records);const data=JSON.stringify(records);return JSON.stringify({schema:6,revision,savedAt:new Date().toISOString(),checksum:checksum(data),records})}
function unpack(raw){let x=JSON.parse(raw);if(x.schema!==6||!Number.isSafeInteger(x.revision)||x.revision<0||x.checksum!==checksum(JSON.stringify(x.records)))throw Error('Storage checksum or schema mismatch');validateAll(x.records);return x}
class Store{
 constructor(storage,key='production_tracker_v06_candidate'){this.s=storage;this.key=key;this.raw=null;this.revision=0;this.blocked=false}
 load(){try{this.raw=this.s.getItem(this.key);if(this.raw===null){if(this.s.getItem(this.key+'.previous')!==null)throw Error('Primary missing; previous snapshot available');return []}const x=unpack(this.raw);this.revision=x.revision;return x.records}catch(e){this.blocked=true;throw e}}
 save(next){if(this.blocked)throw Error('Storage is locked for recovery');validateAll(next);if(this.s.getItem(this.key)!==this.raw){this.blocked=true;throw Error('Another tab changed data. Reload before saving')}
 const raw=pack(next,this.revision+1);
 const previous=this.raw===null?pack([],0):this.raw;this.s.setItem(this.key+'.previous',previous);if(this.s.getItem(this.key+'.previous')!==previous)throw Error('Snapshot verification failed');
 try{this.s.setItem(this.key,raw);if(this.s.getItem(this.key)!==raw)throw Error('Save verification failed')}catch(e){this.blocked=true;throw e}
 this.raw=raw;this.revision++;return next;
 }
 previous(){const x=this.s.getItem(this.key+'.previous');if(x===null)throw Error('No previous snapshot available');return unpack(x).records}
}
root.PT={fields,parseCSV,decodeCSV,validate,validateAll,merge,pack,unpack,Store};
})(typeof module==='object'?module.exports:window);
