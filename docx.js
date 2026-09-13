/* Template-based exports. Original masters stay on the user's computer. */
(function(root){
'use strict';
const Zip=typeof module!=='undefined'?require('./vendor/jszip.min.js'):root.JSZip;
const MODEL={name:'Programme stagiaire Canopé — maître du 15/10/2025',sha256:'67bba48a8861112faf81f042d3f97b690cd730fe03bd2bf9da2c554889833c6f'};
const MIME='application/vnd.openxmlformats-officedocument.wordprocessingml.document';
async function sha256(bytes){return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',bytes)),b=>b.toString(16).padStart(2,'0')).join('');}
async function load(bytes){
  if(bytes.byteLength>5*1024*1024)throw Error('Le modèle est limité à 5 Mo.');
  if(await sha256(bytes)!==MODEL.sha256)throw Error('Ce fichier ne correspond pas au modèle préparé. Choisissez Programme_stagiaire_Canope_publipostage.docx dans la livraison Modèles locaux.');
  // Keep a private copy: neither subsequent UI changes nor another export can mutate it.
  return {bytes:new Uint8Array(bytes).slice(),name:MODEL.name};
}
function text(v){return String(v??'').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g,'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&apos;').replace(/\r\n?|\n/g,'</w:t><w:br/><w:t xml:space="preserve">');}
const lines=v=>String(v||'').split(/\r?\n/).map(s=>s.trim().replace(/^[-•]\s*/, '')).filter(Boolean);
const date=v=>/^\d{4}-\d{2}-\d{2}$/.test(v||'')?v.split('-').reverse().join('/'):String(v||'');
function values(session,objectives,extra={},today){
  const missing=[];
  for(const [k,label] of Object.entries({Titre:'titre',Public:'public',Prerequis:'prérequis',ID_notice:'ID notice Noticia',Date_debut:'date de début',Date_fin:'date de fin',Duree:'durée',Contenu:'contenu',Methodes:'méthodes',Accompagnement:'accompagnement',Horaires:'horaires',Lieu:'lieu',Formateurs:'intervenants',Atelier:'atelier',Contact:'contact'})){
    if(session[k]==null||String(session[k]).trim()==='')missing.push(label);
  }
  for(const [k,label] of Object.entries({Modalite:'modalité',Email:'mail du contact',Telephone:'téléphone du contact',Acces:'modalités d’accès ou mention « Sans objet »'}))if(!String(extra[k]||'').trim())missing.push(label);
  if(!objectives.length||objectives.some(o=>!String(o.Objectif||'').trim()))missing.push('objectifs');
  if(objectives.some(o=>!String(o.Evaluation||'').trim()))missing.push('évaluation de chaque objectif');
  if(missing.length)throw Error('Complétez avant de générer : '+missing.join(', ')+'.');
  // Explicit allowlist: internal notes and the journal never enter the template.
  const result={};
  for(const k of ['Titre','Public','Prerequis','Duree','Accompagnement','Horaires','Lieu','Formateurs','Atelier','Contact','ID_notice'])result[k]=String(session[k]??'');
  for(const k of ['Modalite','Email','Telephone','Acces'])result[k]=extra[k];
  result.Dates=date(session.Date_debut)+(session.Date_fin!==session.Date_debut?' au '+date(session.Date_fin):'');
  result.Date_edition=date(today);
  result.Objectifs=objectives.map(o=>o.Objectif);
  result.Evaluations=objectives.map(o=>o.Evaluation);
  result.Contenu=lines(session.Contenu);result.Methodes=lines(session.Methodes);
  return result;
}
async function generate(template,fields){
  // Re-check approved bytes before interpreting the DOCX; no macros or unknown templates.
  await load(template.bytes);
  const zip=await Zip.loadAsync(template.bytes);
  let xml=await zip.file('word/document.xml').async('string');
  const output=[];let last=0;
  const paras=/<w:p(?=[\s>])(?:[^>]*?\/>|[^>]*>.*?<\/w:p>)/gs;
  for(const match of xml.matchAll(paras)){
    output.push(xml.slice(last,match.index));const paragraph=match[0];
    const repeat=paragraph.match(/\{\{#(\w+)\}\}/);
    const fill=(part,extra={})=>part.replace(/\{\{(#?\w+)\}\}/g,(_,key)=>{
      const value=Object.hasOwn(extra,key)?extra[key]:fields[key];
      if(value==null||Array.isArray(value))throw Error('Champ de publipostage absent : '+key);
      return text(value);
    });
    if(repeat){
      const key=repeat[1],items=fields[key];
      if(!Array.isArray(items)||!items.length)throw Error('Liste vide : '+key);
      // Clone the master's list paragraph, preserving its run and paragraph properties.
      output.push(items.map(value=>fill(paragraph,{['#'+key]:(key==='Methodes'?'':'- ')+value})).join(''));
    }else output.push(fill(paragraph));
    last=match.index+paragraph.length;
  }
  output.push(xml.slice(last));xml=output.join('');
  zip.file('word/document.xml',xml);
  return zip.generateAsync({type:'uint8array',compression:'DEFLATE',mimeType:MIME});
}
const api={MODEL,MIME,load,generate,values,sha256};
if(typeof module!=='undefined')module.exports=api;else root.QDocx=api;
})(typeof window!=='undefined'?window:globalThis);
