const {PT}=require('./core.js'),assert=require('node:assert/strict'),fs=require('node:fs');let passed=0;
function test(name,fn){fn();passed++;console.log('PASS '+name)}
const r={id:'demo-1',date:'2026-11-02',shift:'1st Shift',part:'DEMO-PART',operation:'OP 10',machine:'DEMO-MACHINE',person:'DEMO-OPERATOR',produced:10,nc:2,scrap:1,accountingVersion:3,createdAt:'2026-11-02T12:00:00Z',updatedAt:'2026-11-02T12:00:00Z',ncReasons:[{reason:'Test, "quoted"\nreason',quantity:2}],scrapReasons:[]};
const cell=x=>'"'+String(x??'').replaceAll('"','""')+'"';
function csv(rs,fields=PT.fields){return '\ufeff'+fields.map(cell).join(',')+'\r\n'+rs.map(r=>fields.map(k=>cell(k.endsWith('ReasonsJSON')?JSON.stringify(r[k.replace('JSON','')]):r[k])).join(',')).join('\r\n')}
class Memory{constructor(){this.m=new Map();this.fail=null}getItem(k){return this.m.get(k)??null}setItem(k,v){if(this.fail===k)throw Error('Quota exceeded');this.m.set(k,v)}}
test('BOM, CRLF, quoted commas/newlines and escaped quotes round trip',()=>assert.deepEqual(PT.decodeCSV(csv([r])),[r]));
test('all three historical CSV schemas',()=>{for(const f of [PT.fields,PT.fields.slice(0,13),PT.fields.filter(k=>!['accountingVersion','ncReasonsJSON','scrapReasonsJSON'].includes(k))])assert.equal(PT.decodeCSV(csv([r],f)).length,1)});
test('invalid tail aborts entire import',()=>assert.throws(()=>PT.decodeCSV(csv([r,{...r,id:'bad',produced:0}]))));
test('blank numeric cells rejected',()=>assert.throws(()=>PT.decodeCSV(csv([{...r,nc:''}]))));
test('impossible date rejected',()=>assert.throws(()=>PT.validate({...r,date:'2026-02-30'})));
test('reason over-allocation rejected',()=>assert.throws(()=>PT.validate({...r,nc:1})));
test('unknown header and unclosed quote rejected',()=>{assert.throws(()=>PT.decodeCSV('x,y\n1,2'));assert.throws(()=>PT.parseCSV('a,"oops'))});
test('malformed quote rejected',()=>assert.throws(()=>PT.parseCSV('a,"x"bad')));
test('duplicate IDs inside file rejected',()=>assert.throws(()=>PT.decodeCSV(csv([r,r]))));
test('merge preserves conflicting ID and is idempotent',()=>{const m=PT.merge([r],[{...r,part:'OTHER'}]);assert.equal(m.added,0);assert.equal(m.conflicts,1);assert.equal(m.next[0].part,r.part);assert.equal(PT.merge(m.next,[r]).added,0)});
test('save, reload, previous snapshot',()=>{const m=new Memory(),s=new PT.Store(m);s.load();s.save([r]);s.save([]);assert.deepEqual(s.previous(),[r]);assert.deepEqual(new PT.Store(m).load(),[])});
test('corrupt primary fails closed and remains byte-identical',()=>{const m=new Memory();m.setItem('production_tracker_v06_candidate','BROKEN');const s=new PT.Store(m);assert.throws(()=>s.load());assert.throws(()=>s.save([]));assert.equal(m.getItem(s.key),'BROKEN')});
test('checksum catches valid-JSON damage',()=>{const x=JSON.parse(PT.pack([r],1));x.records[0].produced=99;assert.throws(()=>PT.unpack(JSON.stringify(x)))});
test('missing primary with snapshot fails closed',()=>{const m=new Memory();m.setItem('production_tracker_v06_candidate.previous',PT.pack([r],1));assert.throws(()=>new PT.Store(m).load())});
test('stale tab cannot overwrite newer records',()=>{const m=new Memory(),a=new PT.Store(m),b=new PT.Store(m);a.load();b.load();a.save([r]);assert.throws(()=>b.save([]));assert.deepEqual(new PT.Store(m).load(),[r])});
test('quota failure preserves primary and prior snapshot',()=>{const m=new Memory(),s=new PT.Store(m);s.load();s.save([r]);m.fail=s.key;assert.throws(()=>s.save([]));assert.deepEqual(new PT.Store(m).load(),[r]);assert.deepEqual(s.previous(),[r])});
test('failed snapshot prevents primary replacement',()=>{const m=new Memory(),s=new PT.Store(m);s.load();s.save([r]);m.fail=s.key+'.previous';assert.throws(()=>s.save([]));assert.deepEqual(new PT.Store(m).load(),[r])});
if(process.env.PT_LOCAL_FIXTURE)test('private recovered November 2 fixture validates and reimport is idempotent',()=>{const a=PT.decodeCSV(fs.readFileSync(process.env.PT_LOCAL_FIXTURE,'utf8'));assert.equal(a.length,1);assert.equal(PT.merge(a,a).added,0)});
console.log(passed+' tests passed');
