import type { Diary } from './index'
import { classify,demoUser,makeTrend,readDiaries,resources,saveDiaries } from '../demo/engine'
// Explicit browser-local adapter for the English showcase. No live backend requests.
async function request(method:string,url:string,payload?:any,config?:any):Promise<any>{
 const [path,query='']=url.split('?'),params=new URLSearchParams(query),items=readDiaries();let data:any
 if(path==='/auth/me')data=demoUser
 else if(path==='/auth/data-export')data={mode:'browser-local-demo',diaries:items,user:demoUser}
 else if(path==='/auth/privacy-activity')data=[]
 else if(path==='/analysis/overview')data={recentDiaries:[...items].sort((a,b)=>b.createdAt.localeCompare(a.createdAt)),trend7:makeTrend(items,7)}
 else if(path==='/analysis/trend')data=makeTrend(items,Math.min(30,Math.max(1,Number(params.get('days'))||7)))
 else if(path==='/diaries'&&method==='GET')data=[...items].sort((a,b)=>b.createdAt.localeCompare(a.createdAt))
 else if(path==='/diaries'&&method==='POST'){
  const title=String(payload.title??'').trim(),content=String(payload.content??'').trim();if(!title||!content)throw Error('Please add a title and entry text.')
  const item:Diary={id:Math.max(0,...items.map(d=>d.id))+1,title:title.slice(0,128),content:content.slice(0,10000),moodIntensity:Math.max(1,Math.min(10,Number(payload.moodIntensity)||5)),privacy:payload.privacy==='SHARED'?'SHARED':'PRIVATE',createdAt:new Date().toISOString(),...classify(content)}
  saveDiaries([...items,item]);data=item
 }else if(/^\/diaries\/\d+$/.test(path)){
  const id=Number(path.split('/').at(-1)),item=items.find(d=>d.id===id);if(!item)throw Error('This entry could not be found.')
  if(method==='DELETE'){saveDiaries(items.filter(d=>d.id!==id));data=null}
  else if(method==='PUT'){
   if(!String(payload.title??'').trim()||!String(payload.content??'').trim())throw Error('A title and entry text are required.')
   data={...item,title:String(payload.title).slice(0,128),content:String(payload.content).slice(0,10000),moodIntensity:Math.max(1,Math.min(10,Number(payload.moodIntensity)||5)),privacy:payload.privacy==='SHARED'?'SHARED':'PRIVATE',...classify(String(payload.content))};saveDiaries(items.map(d=>d.id===id?data:d))
  }else data=item
 }else if(path==='/resources'){
  const f=config?.params??{};data=resources.filter(r=>(!f.category||r.category===f.category)&&(!f.keyword||`${r.title} ${r.summary} ${r.emotionTag}`.toLowerCase().includes(String(f.keyword).toLowerCase())))
 }else if(/^\/resources\/\d+$/.test(path))data=resources.find(r=>r.id===Number(path.split('/').at(-1)))
 else if(path==='/guidance/recommend'){
  const tag=config?.params?.emotionTag??'Calm';data={plans:[{id:1,technique:'REFLECTION PROMPT · RULE-BASED DEMO',title:`Make space for feeling ${String(tag).toLowerCase()}`,summary:'A general reflection prompt, not clinical advice or a live AI response.',steps:['Name what is on your mind in your own words.','Consider what you need: rest, company, or a manageable next step.','Choose one small action, or leave a note to revisit later.']}],resources:resources.filter(r=>r.emotionTag===tag)}
 }else throw Error('This operation is not available in the browser demo.')
 return {code:0,data}
}
const api={get:(url:string,config?:any)=>request('GET',url,undefined,config),post:(url:string,payload?:any)=>request('POST',url,payload),put:(url:string,payload?:any)=>request('PUT',url,payload),delete:(url:string,config?:any)=>request('DELETE',url,undefined,config)}
export default api
