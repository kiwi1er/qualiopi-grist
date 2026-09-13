const {chromium}=require('playwright');
const http=require('node:http'),fs=require('node:fs'),path=require('node:path'),a=require('node:assert/strict');
const C=require('../core.js'),Zip=require('../vendor/jszip.min.js');
const root=path.resolve(__dirname,'..');
const model=process.env.QUALIOPI_TEMPLATE;
if(!model){console.log('SKIP Word navigateur : définir QUALIOPI_TEMPLATE vers le modèle local.');process.exit(0);}
const server=http.createServer((req,res)=>{
 const file=path.resolve(root,'.'+req.url.split('?')[0]);
 if(!file.startsWith(root+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404);res.end();return;}
 res.setHeader('Content-Type',file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':'text/html');res.end(fs.readFileSync(file));
});
(async()=>{
 let browser;
 try{
  await new Promise((r,j)=>{server.once('error',j);server.listen(0,'127.0.0.1',r)});
  browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH||undefined});
  const page=await browser.newPage({viewport:{width:1440,height:1100}});const errors=[],outbound=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('request',r=>{if(!r.url().startsWith('http://127.0.0.1:'))outbound.push(r.url())});
  const store=Object.fromEntries(Object.entries(C.SCHEMA).map(([name,cols])=>[name,{columns:cols.map(c=>c.id),rows:[]}]));
  store.Q_Sessions.rows=[{id:1,Titre:'Programme navigateur <test> & Canopé',Public:'Enseignants',Prerequis:'Aucun',ID_notice:'NOTICE-UI',ID_session:'SESSION-UI',Date_debut:'2026-11-06',Date_fin:'2026-11-06',Duree:6,Contenu:'Découverte\nRéalisation',Methodes:'Ateliers pratiques',Accompagnement:'Accompagnement sur place',Horaires:'9 h–16 h',Lieu:'Salle fictive',Formateurs:'Camille Exemple',Atelier:'Atelier fictif',Contact:'Contact fictif',Notes:'SECRET_UI'}];
  store.Q_Objectifs.rows=[{id:1,Session:1,Ordre:1,Objectif:'Concevoir une activité',Evaluation:'Présentation du projet'}];
  await page.addInitScript(store=>{if(window!==window.top)return;if(!localStorage.getItem('qualiopi-demo-v1'))localStorage.setItem('qualiopi-demo-v1',JSON.stringify(store));},store);
  await page.goto(`http://127.0.0.1:${server.address().port}/index.html?demo=1`);
  await page.locator('.hero').waitFor();await page.locator('[data-tab=documents]').click();
  await page.locator('#wordTemplate').setInputFiles({name:'faux.docx',mimeType:'application/octet-stream',buffer:Buffer.from('faux')});
  await page.locator('#notice').filter({hasText:'ne correspond pas'}).waitFor();
  await page.locator('#wordTemplate').setInputFiles(path.resolve(model));
  await page.locator('#wordModelState').filter({hasText:'— chargé'}).waitFor();
  await page.locator('#wordModalite').selectOption('En présence');
  await page.locator('#wordEmail').fill('formation@example.org');await page.locator('#wordTelephone').fill('00 00 00 00 00');
  await page.locator('#wordAcces').fill('Sans objet — formation en présence.');
  await page.locator('#wordPreviewStatus').filter({hasText:'Aperçu à jour'}).waitFor();
  const preview=page.frameLocator('#wordPreview');
  await preview.locator('body').filter({hasText:'Programme navigateur <test> & Canopé'}).waitFor();
  a.ok((await preview.locator('img').count())>0,'Logos du modèle présents');
  a.ok(!(await preview.locator('body').innerText()).includes('SECRET_UI'));
  await page.locator('#wordTelephone').fill('11 22 33 44 55');
  await preview.locator('body').filter({hasText:'11 22 33 44 55'}).waitFor();
  await page.locator('#wordTelephone').fill('');
  await page.locator('#wordPreviewStatus').filter({hasText:'Aperçu indisponible'}).waitFor();
  a.equal(await page.locator('#wordPreview').isVisible(),false);
  await page.locator('#wordTelephone').fill('00 00 00 00 00');
  await page.locator('#wordPreviewStatus').filter({hasText:'Aperçu à jour'}).waitFor();
  const pending=page.waitForEvent('download');await page.locator('#wordDownload').click();const dl=await pending;
  a.match(dl.suggestedFilename(),/^Session_SESSION-UI_programme_\d{4}-\d{2}-\d{2}\.docx$/);
  const output=path.join(root,'test-results');fs.mkdirSync(output,{recursive:true});const target=path.join(output,'programme-browser.docx');await dl.saveAs(target);
  const zip=await Zip.loadAsync(fs.readFileSync(target));const xml=await zip.file('word/document.xml').async('string');
  a.ok(xml.includes('Programme navigateur &lt;test&gt; &amp; Canopé'));a.ok(xml.includes('NOTICE-UI'));a.ok(!xml.includes('SECRET_UI'));a.ok(!xml.includes('{{'));
  await page.locator('[data-tab=overview]').click();await page.locator('[data-tab=documents]').click();a.equal(await page.locator('#wordEmail').inputValue(),'formation@example.org');
  await page.reload();await page.locator('.hero').waitFor();await page.locator('[data-tab=documents]').click();
  await page.locator('#wordModelState').filter({hasText:'chargé depuis'}).waitFor();
  a.equal(await page.locator('#wordEmail').inputValue(),'formation@example.org');
  const persisted=await page.evaluate(()=>JSON.parse(localStorage.getItem('qualiopi-demo-v1')));
  a.equal(persisted.Q_Modeles.rows.length,1);a.equal(persisted.Q_Documents.rows.length,1);
  // Another browser context, populated only with the document tables, no widget cache.
  const other=await browser.newPage();
  await other.addInitScript(data=>{if(window===window.top)localStorage.setItem('qualiopi-demo-v1',JSON.stringify(data));},persisted);
  await other.goto(page.url());await other.locator('.hero').waitFor();await other.locator('[data-tab=documents]').click();
  await other.locator('#wordModelState').filter({hasText:'chargé depuis'}).waitFor();
  a.equal(await other.locator('#wordTelephone').inputValue(),'00 00 00 00 00');
  const again=other.waitForEvent('download');await other.locator('#wordDownload').click();await again;await other.close();
  await page.locator('#wordPreviewStatus').filter({hasText:'Aperçu à jour'}).waitFor();
  await page.locator('#wordPreview').screenshot({path:path.join(output,'preview-programme.png')});
  await page.screenshot({path:path.join(output,'word-desktop.png'),fullPage:true});
  await page.setViewportSize({width:390,height:844});a.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await page.screenshot({path:path.join(output,'word-mobile.png'),fullPage:true});
  a.deepEqual(errors,[]);a.deepEqual(outbound,[]);
  console.log('PASS Word : modèle incorrect refusé, téléchargement DOCX, échappement, notes exclues, compléments conservés entre onglets, mobile, aucune requête externe.');
 }finally{if(browser)await browser.close();server.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
