'use strict';
let wordTemplate=null;
const wordExtras=new Map();
const wordStorageSchema={
  Q_Modeles:[{id:'Nom',type:'Text'},{id:'Contenu',type:'Text'}],
  Q_Documents:[{id:'Session',type:'Ref:Q_Sessions'},{id:'Complements',type:'Text'}]
};
async function ensureWordStorage(){
  const names=await api.listTables();
  const actions=Object.entries(wordStorageSchema).filter(([name])=>!names.includes(name)).map(([name,cols])=>['AddTable',name,cols.map(c=>({...c,isFormula:false,formula:''}))]);
  if(actions.length)await api.applyUserActions(actions);
}
function wordBase64(bytes){let text='';for(const byte of bytes)text+=String.fromCharCode(byte);return btoa(text);}
async function wordRows(name){return C.rows(await api.fetchTable(name));}
async function saveWordRecord(name,match,values){
  await ensureWordStorage();
  const rows=(await wordRows(name)).filter(match);
  if(rows.length>1)throw Error('Plusieurs enregistrements existent dans '+name+'. Faites vérifier cette table avant de continuer.');
  const row=rows[0];
  await api.applyUserActions([[row?'UpdateRecord':'AddRecord',name,row?.id??null,values]]);
}
async function restoreWordStorage(sid,form){
  const names=await api.listTables();
  if(names.includes('Q_Modeles')){
    const rows=(await wordRows('Q_Modeles')).filter(r=>r.Nom==='programme-stagiaire');
    if(rows.length>1)throw Error('Plusieurs modèles programme existent dans Q_Modeles.');
    if(rows[0])wordTemplate=await QDocx.load(Uint8Array.from(atob(rows[0].Contenu),c=>c.charCodeAt(0)));
  }
  if(names.includes('Q_Documents')){
    const rows=(await wordRows('Q_Documents')).filter(r=>r.Session===sid);
    if(rows.length>1)throw Error('Plusieurs compléments existent pour cette session.');
    if(rows[0])wordExtras.set(sid,JSON.parse(rows[0].Complements));
  }
  if(!form.isConnected)return;
  for(const [key,value]of Object.entries(wordExtras.get(sid)||{}))if(form.elements.namedItem(key))form.elements.namedItem(key).value=value;
  $('wordModelState').textContent=wordTemplate?wordTemplate.name+' — chargé depuis '+(demo?'la démonstration locale':'Grist'):'Choisissez le modèle une première fois pour l’enregistrer dans Grist.';
}

function wordDocumentsView(){
  const sid=current,s=session(),extra=wordExtras.get(sid)||{};
  $('content').innerHTML=`<div class="card"><h2>Programme stagiaire Réseau Canopé</h2>
    <p>Le programme Word utilise le modèle Canopé fourni, avec ses logos, rubriques et pieds de page. La fiche enregistrée et les objectifs alimentent les emplacements prévus.</p>
    <div class="actions"><button id="showIndex">Index des preuves</button><button id="jsonExport">Exporter les données de la session</button><button id="csvExport">Exporter le suivi CSV</button></div>
    <p class="hint">L’index est un outil de suivi du widget, sans modèle institutionnel identifié. Pour le programme, ouvrez le Word téléchargé puis exportez-le en PDF depuis Word.</p></div>
    <div class="card"><h2>1. Modèle du document</h2>
    <label for="wordTemplate">Programme_stagiaire_Canope_publipostage.docx</label>
    <input id="wordTemplate" type="file" accept=".docx">
    <p id="wordModelState" role="status">${wordTemplate?e(wordTemplate.name)+' — chargé':'Choisissez le fichier préparé dans la livraison « Modèles locaux ».'}</p>
    <p class="hint">Le modèle est enregistré dans ce document Grist une seule fois. Il sera retrouvé sur vos autres navigateurs et ordinateurs ayant accès à ce document. Choisissez un fichier uniquement pour installer ou remplacer le modèle. En démonstration, le stockage reste local au navigateur.</p></div>
    <form id="wordForm" class="card"><h2>2. Compléter cet export</h2>
    <p>Session : <strong>${e(s.Titre)}</strong> · ${objectives().length} objectif(s). Le champ « ID NOTICIA » du modèle reprend l’ID notice : <strong>${e(s.ID_notice||'à compléter dans la fiche')}</strong>.</p>
    <div class="formgrid"><div><label for="wordModalite">Modalité</label><select id="wordModalite" name="Modalite" required><option value="">Choisir</option>${['En présence','À distance','Hybride'].map(v=>`<option ${extra.Modalite===v?'selected':''}>${v}</option>`).join('')}</select></div>
    <div><label for="wordEmail">Mail du contact</label><input id="wordEmail" name="Email" type="email" required value="${e(extra.Email||'')}"></div>
    <div><label for="wordTelephone">Téléphone du contact</label><input id="wordTelephone" name="Telephone" required value="${e(extra.Telephone||'')}"></div>
    <div class="wide"><label for="wordAcces">Accès à distance : plateforme et transmission du lien ; sinon « Sans objet — formation en présence »</label><textarea id="wordAcces" name="Acces" required>${e(extra.Acces||'')}</textarea></div></div>
    <p class="hint">Cliquez sur Enregistrer les compléments pour les conserver dans Grist pour cette session. Le téléchargement les enregistre également. Les autres informations se modifient dans la fiche et les objectifs.</p>
    <p>Les mentions fixes, le référent handicap et les liens restent ceux du modèle du 15/10/2025. Vérifiez leur pertinence avant diffusion. Le champ Accessibilité de la fiche n’est pas ajouté au texte fixe de ce modèle.</p>
    <div class="actions"><button type="button" id="wordSave">Enregistrer les compléments</button><button type="submit" id="wordDownload" class="primary">Télécharger le programme Word</button></div>
    <p class="hint">Les contenus longs peuvent augmenter le nombre de pages. Contrôlez la pagination dans Word avant d’enregistrer le PDF et de le déposer dans SharePoint.</p></form>`;
  $('showIndex').onclick=()=>{docKind='index';documentsView();};
  $('jsonExport').onclick=()=>download(filePrefix()+'.json',JSON.stringify({format:'qualiopi-widget-export-v1',date:new Date().toISOString(),session:s,objectifs:objectives(),suivi:tasks(),journal:db.Q_Journal.filter(r=>r.Session===sid)},null,2),'application/json');
  $('csvExport').onclick=()=>download(filePrefix()+'_suivi.csv',C.csv(['Etape','Libelle','Statut','Echeance','Responsable','Lien','Note','Controle_par'],tasks().map(t=>['Etape','Libelle','Statut','Echeance','Responsable','Lien','Note','Controle_par'].map(k=>t[k]))),'text/csv;charset=utf-8');
  $('wordTemplate').onchange=()=>{const file=$('wordTemplate').files[0];if(!file)return;run(async()=>{
    const candidate=await QDocx.load(await file.arrayBuffer());
    await saveWordRecord('Q_Modeles',r=>r.Nom==='programme-stagiaire',{Nom:'programme-stagiaire',Contenu:wordBase64(candidate.bytes)});
    wordTemplate=candidate;
    $('wordModelState').textContent=wordTemplate.name+' — chargé et enregistré dans '+(demo?'la démonstration locale':'Grist');
  });};
  const form=$('wordForm');
  const controls=[...form.elements,$('wordTemplate')];
  controls.forEach(control=>control.disabled=true);
  restoreWordStorage(sid,form).catch(err=>tell('Lecture des modèles et compléments impossible : '+err.message,true)).finally(()=>{if(form.isConnected)controls.forEach(control=>control.disabled=false);});
  const saveExtras=async()=>{const extra=Object.fromEntries(new FormData(form));await saveWordRecord('Q_Documents',r=>r.Session===sid,{Session:sid,Complements:JSON.stringify(extra)});wordExtras.set(sid,extra);dirty=false;};
  $('wordSave').onclick=()=>run(async()=>{await saveExtras();tell('Compléments enregistrés dans '+(demo?'la démonstration locale.':'Grist.'));});
  form.addEventListener('input',()=>{dirty=true;wordExtras.set(sid,Object.fromEntries(new FormData(form)));});
  form.addEventListener('change',()=>{dirty=true;wordExtras.set(sid,Object.fromEntries(new FormData(form)));});
  form.onsubmit=ev=>{ev.preventDefault();run(async()=>{
    if(!wordTemplate)throw Error('Chargez d’abord le modèle Word préparé.');
    const extra=Object.fromEntries(new FormData(form));wordExtras.set(sid,extra);
    const fields=QDocx.values(s,objectives(),extra,C.today());
    await saveExtras();
    const bytes=await QDocx.generate(wordTemplate,fields);
    download(filePrefix()+'_programme_'+C.today()+'.docx',bytes,QDocx.MIME);
    tell('Programme Word généré. Ouvrez-le dans Word pour contrôler la mise en page et exporter le PDF.');
  });};
}
