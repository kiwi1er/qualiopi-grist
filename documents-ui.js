'use strict';
let wordTemplate=null;
const wordExtras=new Map();
function wordDocumentsView(){
  const sid=current,s=session(),extra=wordExtras.get(sid)||{};
  $('content').innerHTML=`<div class="card"><h2>Programme stagiaire Réseau Canopé</h2>
    <p>Le programme Word utilise le modèle Canopé fourni, avec ses logos, rubriques et pieds de page. La fiche enregistrée et les objectifs alimentent les emplacements prévus.</p>
    <div class="actions"><button id="showIndex">Index des preuves</button><button id="jsonExport">Exporter les données de la session</button><button id="csvExport">Exporter le suivi CSV</button></div>
    <p class="hint">L’index est un outil de suivi du widget, sans modèle institutionnel identifié. Pour le programme, ouvrez le Word téléchargé puis exportez-le en PDF depuis Word.</p></div>
    <div class="card"><h2>1. Charger le modèle local</h2>
    <label for="wordTemplate">Programme_stagiaire_Canope_publipostage.docx</label>
    <input id="wordTemplate" type="file" accept=".docx">
    <p id="wordModelState" role="status">${wordTemplate?e(wordTemplate.name)+' — chargé':'Choisissez le fichier préparé dans la livraison « Modèles locaux ».'}</p>
    <p class="hint">Le fichier est lu dans votre navigateur. Il reste hors de GitHub et de Grist. Rechargez-le après fermeture ou actualisation de la page.</p></div>
    <form id="wordForm" class="card"><h2>2. Compléter cet export</h2>
    <p>Session : <strong>${e(s.Titre)}</strong> · ${objectives().length} objectif(s). Le champ « ID NOTICIA » du modèle reprend l’ID notice : <strong>${e(s.ID_notice||'à compléter dans la fiche')}</strong>.</p>
    <div class="formgrid"><div><label for="wordModalite">Modalité</label><select id="wordModalite" name="Modalite" required><option value="">Choisir</option>${['En présence','À distance','Hybride'].map(v=>`<option ${extra.Modalite===v?'selected':''}>${v}</option>`).join('')}</select></div>
    <div><label for="wordEmail">Mail du contact</label><input id="wordEmail" name="Email" type="email" required value="${e(extra.Email||'')}"></div>
    <div><label for="wordTelephone">Téléphone du contact</label><input id="wordTelephone" name="Telephone" required value="${e(extra.Telephone||'')}"></div>
    <div class="wide"><label for="wordAcces">Accès à distance : plateforme et transmission du lien ; sinon « Sans objet — formation en présence »</label><textarea id="wordAcces" name="Acces" required>${e(extra.Acces||'')}</textarea></div></div>
    <p class="hint">Ces compléments sont conservés pour cette session tant que cette page reste ouverte. Ils ne sont pas enregistrés dans Grist. Les autres informations se modifient dans la fiche et les objectifs.</p>
    <p>Les mentions fixes, le référent handicap et les liens restent ceux du modèle du 15/10/2025. Vérifiez leur pertinence avant diffusion. Le champ Accessibilité de la fiche n’est pas ajouté au texte fixe de ce modèle.</p>
    <div class="actions"><button type="submit" id="wordDownload" class="primary">Télécharger le programme Word</button></div>
    <p class="hint">Les contenus longs peuvent augmenter le nombre de pages. Contrôlez la pagination dans Word avant d’enregistrer le PDF et de le déposer dans SharePoint.</p></form>`;
  $('showIndex').onclick=()=>{docKind='index';documentsView();};
  $('jsonExport').onclick=()=>download(filePrefix()+'.json',JSON.stringify({format:'qualiopi-widget-export-v1',date:new Date().toISOString(),session:s,objectifs:objectives(),suivi:tasks(),journal:db.Q_Journal.filter(r=>r.Session===sid)},null,2),'application/json');
  $('csvExport').onclick=()=>download(filePrefix()+'_suivi.csv',C.csv(['Etape','Libelle','Statut','Echeance','Responsable','Lien','Note','Controle_par'],tasks().map(t=>['Etape','Libelle','Statut','Echeance','Responsable','Lien','Note','Controle_par'].map(k=>t[k]))),'text/csv;charset=utf-8');
  $('wordTemplate').onchange=()=>{const file=$('wordTemplate').files[0];wordTemplate=null;if(!file)return;run(async()=>{
    $('wordModelState').textContent='Vérification du modèle…';
    try{wordTemplate=await QDocx.load(await file.arrayBuffer());$('wordModelState').textContent=wordTemplate.name+' — chargé';}
    catch(err){$('wordModelState').textContent='Modèle non chargé';throw err;}
  });};
  const form=$('wordForm');
  form.addEventListener('input',()=>wordExtras.set(sid,Object.fromEntries(new FormData(form))));
  form.addEventListener('change',()=>wordExtras.set(sid,Object.fromEntries(new FormData(form))));
  form.onsubmit=ev=>{ev.preventDefault();run(async()=>{
    if(!wordTemplate)throw Error('Chargez d’abord le modèle Word préparé.');
    const extra=Object.fromEntries(new FormData(form));wordExtras.set(sid,extra);
    const fields=QDocx.values(s,objectives(),extra,C.today());
    const bytes=await QDocx.generate(wordTemplate,fields);
    download(filePrefix()+'_programme_'+C.today()+'.docx',bytes,QDocx.MIME);
    tell('Programme Word généré. Ouvrez-le dans Word pour contrôler la mise en page et exporter le PDF.');
  });};
}
