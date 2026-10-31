import type { Diary } from '../api'
const KEY='xinyu:english-demo:v1'
export const demoUser={userId:1,username:'visitor',nickname:'Alex',role:'STUDENT' as const}
const rules=[
 ['Anxious',/\b(anxious|anxiety|worried|worry|nervous|panic)\b/i,-2],
 ['Stressed',/\b(stress|stressed|deadline|overwhelmed|pressure)\b/i,-2],
 ['Tired',/\b(tired|exhausted|sleepy|fatigue)\b/i,-1],
 ['Sad',/\b(sad|lonely|unhappy|upset|hopeless)\b/i,-3],
 ['Angry',/\b(angry|furious|annoyed|frustrated)\b/i,-2],
 ['Happy',/\b(happy|grateful|joy|excited|proud|delighted)\b/i,3],
 ['Calm',/\b(calm|peaceful|relaxed|content)\b/i,1],
] as const
export function classify(text:string){const found=rules.filter(r=>r[1].test(text));return {primaryEmotion:found[0]?.[0]??'Calm',tags:found.map(r=>({tag:r[0],confidence:0.6})),emotionScore:found.length?Math.round(found.reduce((sum,r)=>sum+r[2],0)/found.length):0}}
function seed():Diary[]{return [
 ['A small beginning','I felt anxious before the seminar, but a conversation with a friend helped.',4],
 ['Room to breathe','A peaceful walk after class gave me a calm moment.',7],
 ['One thing at a time','I was stressed about a deadline. Breaking the work into small steps helped.',5],
 ['A good afternoon','I feel happy and proud after finishing a small part of my project.',8],
].map((entry,i)=>{const d=new Date();d.setDate(d.getDate()-3+i);const content=String(entry[1]);return {id:i+1,title:String(entry[0]),content,moodIntensity:Number(entry[2]),privacy:'PRIVATE',createdAt:d.toISOString(),...classify(content)}})}
let initial:Diary[]|undefined
export function readDiaries():Diary[]{try{const raw=localStorage.getItem(KEY);if(raw!==null){const data=JSON.parse(raw);if(Array.isArray(data))return data}}catch{}return initial??(initial=seed())}
export function saveDiaries(items:Diary[]){try{localStorage.setItem(KEY,JSON.stringify(items))}catch{throw Error('Browser storage is unavailable. Changes were not saved.')}}
export function resetDemo(){localStorage.removeItem(KEY)}
export function makeTrend(items:Diary[],days:number){const key=(s:string)=>new Date(s).toLocaleDateString('en-CA');const dates=Array.from({length:days},(_,i)=>{const d=new Date();d.setDate(d.getDate()-days+1+i);return key(d.toISOString())});const period=items.filter(d=>dates.includes(key(d.createdAt)));const scores=dates.map(date=>{const entries=period.filter(d=>key(d.createdAt)===date);return entries.length?entries.reduce((sum,d)=>sum+(d.emotionScore??0),0)/entries.length:null});const dist=new Map<string,number>();period.forEach(d=>dist.set(d.primaryEmotion??'Calm',(dist.get(d.primaryEmotion??'Calm')??0)+1));const valid=scores.filter((s):s is number=>s!==null);return {dates,scores,diaryCount:period.length,avgScore:valid.length?valid.reduce((a,b)=>a+b,0)/valid.length:null,emotionDistribution:[...dist].map(([emotion,cnt])=>({emotion,cnt}))}}
export const resources=[
 {id:1,title:'One manageable next step',category:'EXERCISE',emotionTag:'Stressed',summary:'Make room for one small action.',content:'Write down what is on your mind. Choose one task you can begin today. Leave the rest for another moment.'},
 {id:2,title:'Notice a moment that helped',category:'ARTICLE',emotionTag:'Happy',summary:'Keep a small detail from a good moment.',content:'Think of a moment you appreciated today. What happened? What would you like to remember? There is no need to force a positive interpretation.'},
 {id:3,title:'A pause between tasks',category:'EXERCISE',emotionTag:'Tired',summary:'A short invitation to stop and reflect.',content:'Put down the current task for a moment. Notice your surroundings. Ask yourself whether you need rest, company or a practical next step.'},
]
