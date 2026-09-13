'use strict';
// Render the generated DOCX in isolation. No document is uploaded for preview.
window.QPreview={async html(bytes){
  const container=document.createElement('div');
  await window.docx.renderAsync(bytes,container,null,{
    inWrapper:true,ignoreWidth:false,ignoreHeight:false,
    ignoreLastRenderedPageBreak:true,breakPages:true,
    renderHeaders:true,renderFooters:true,renderFootnotes:true,
    renderEndnotes:true,renderComments:false,renderChanges:false,
    renderAltChunks:false,useBase64URL:true
  });
  container.querySelectorAll('a').forEach(a=>a.removeAttribute('href'));
  return '<!doctype html><html lang="fr"><head><meta charset="utf-8">'+
    '<meta http-equiv="Content-Security-Policy" content="default-src \'none\'; img-src data:; font-src data:; style-src \'unsafe-inline\'">'+
    '<style>body{margin:0;background:#edf2f1}.docx-wrapper{padding:16px!important}section.docx{margin-bottom:16px!important}</style>'+
    '</head><body>'+container.innerHTML+'</body></html>';
}};
