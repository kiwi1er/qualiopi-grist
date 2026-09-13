const {test}=require('node:test');
const a=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const D=require('../docx.js'),Zip=require('../vendor/jszip.min.js');
const templatePath=process.env.QUALIOPI_TEMPLATE;
const session={Titre:'Formation fictive — fabrication',Public:'Enseignants',Prerequis:'Aucun prérequis technique',Duree:6,Accompagnement:'Accompagnement par le formateur pendant les ateliers.',Horaires:'9 h–12 h ; 13 h 30–16 h 30',Lieu:'Salle de démonstration',Formateurs:'Camille Exemple, formatrice',Atelier:'Atelier de démonstration',Contact:'Contact de démonstration',ID_notice:'NOTICE-TEST',ID_session:'SESSION-TEST',Date_debut:'2026-11-06',Date_fin:'2026-11-06',Contenu:'Découverte des outils\nConception d’une activité\nPrésentation des productions',Methodes:'Apports de connaissances\nAteliers pratiques\nTravail en petits groupes',Notes:'CONFIDENTIEL_NE_JAMAIS_EXPORTER'};
const objectives=[{Objectif:'Identifier les étapes d’un projet.',Evaluation:'Présentation commentée du projet.'},{Objectif:'Concevoir une activité adaptée à son public.',Evaluation:'Production d’une fiche activité.'},{Objectif:'Analyser sa production.',Evaluation:'Retour oral argumenté.'}];
const extra={Modalite:'En présence',Email:'formation@example.org',Telephone:'00 00 00 00 00',Acces:'Sans objet — formation en présence.'};
test('programme : données manquantes refusées et notes internes exclues',()=>{
 a.throws(()=>D.values({},[],{},'2026-09-13'),/Complétez/);
 const fields=D.values(session,objectives,extra,'2026-09-13');
 a.equal(fields.Date_edition,'13/09/2026');a.equal(fields.ID_notice,'NOTICE-TEST');a.equal(fields.Notes,undefined);
 a.throws(()=>D.values(session,[{Objectif:'Test'}],extra,'2026-09-13'),/évaluation/);
});
test('modèle inconnu refusé',async()=>{await a.rejects(D.load(new Uint8Array([1,2,3])),/modèle préparé/);});
test('modèle réel : préservation des parties, caractères XML, listes longues et génération répétée',{skip:!templatePath},async()=>{
 const template=await D.load(fs.readFileSync(templatePath));const original=await Zip.loadAsync(template.bytes);
 const out=path.join(__dirname,'../test-results');fs.mkdirSync(out,{recursive:true});
 for(const long of [false,true]){
  const obs=long?Array.from({length:9},(_,i)=>({Objectif:`Objectif ${i+1} : concevoir une activité de fabrication adaptée à un public scolaire et expliciter les choix pédagogiques retenus pour accompagner chaque participant.`,Evaluation:`Évaluation ${i+1} : présentation d’une production et analyse argumentée de la démarche suivie.`})):objectives;
  const s=long?{...session,Titre:'Formation fictive <avancée> & fabrication — adaptation pédagogique pour les équipes éducatives',Contenu:Array.from({length:8},(_,i)=>`Séquence ${i+1} : découverte, conception et présentation d’une activité pédagogique adaptée.`).join('\n')}:session;
  const generated=await D.generate(template,D.values(s,obs,extra,'2026-09-13'));const z=await Zip.loadAsync(generated);
  for(const [name,file] of Object.entries(original.files))if(!file.dir&&name!=='word/document.xml')a.deepEqual(await z.file(name).async('uint8array'),await file.async('uint8array'),name);
  const xml=await z.file('word/document.xml').async('string');
  a.ok(!xml.includes('{{'));a.ok(!xml.includes('CONFIDENTIEL_NE_JAMAIS_EXPORTER'));a.ok(xml.includes('NOTICE-TEST'));a.ok(xml.includes('13/09/2026'));
  if(long){a.ok(xml.includes('&lt;avancée&gt; &amp;'));a.ok(xml.includes('Objectif 9'));a.ok(xml.includes('Évaluation 9'));}
  fs.writeFileSync(path.join(out,long?'programme-long.docx':'programme-court.docx'),generated);
 }
 a.equal(await D.sha256(template.bytes),D.MODEL.sha256);
});
module.exports={session,objectives,extra};
