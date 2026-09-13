"""Prepare the retained Canopé master. Run with the bundled Python runtime.

The original is never overwritten; only mapped slots in document.xml and the
field-refresh setting change. All other ZIP members are copied byte for byte.
"""
import argparse
import hashlib
import json
import re
import zipfile
from pathlib import Path
from lxml import etree as E

W = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'
NS = {'w': W}
SOURCE_SHA = 'b652234a7f805f664edfd6dbc717497894723cd5f9c3d135f1e3769ea5bb58a4'

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('source', type=Path)
    parser.add_argument('output', type=Path)
    parser.add_argument('manifest', type=Path)
    args = parser.parse_args()
    source = args.source.read_bytes()
    digest = hashlib.sha256(source).hexdigest()
    if digest != SOURCE_SHA or args.source.resolve() == args.output.resolve():
        raise ValueError('Ce préparateur exige le modèle stagiaire retenu et un fichier de sortie distinct.')
    with zipfile.ZipFile(args.source) as z:
        xml = z.read('word/document.xml').decode()
        chunks = list(re.finditer(r'<w:p(?=[\s>])(?:[^>]*?/>|[^>]*>.*?</w:p>)', xml, re.S))
        if len(chunks) != 76:
            raise ValueError('Structure du modèle inattendue')
        root = E.fromstring(xml.encode())
        paragraphs = root.findall('.//w:p', NS)
        preserve = {n: hashlib.sha256(z.read(n)).hexdigest() for n in z.namelist() if not n.endswith('/')}
        # Contract is written before changing the working copy.
        contract = args.output.parent / 'artifact.md'
        contract.write_text(f'''# Contrat de fidélité programme stagiaire

Référence conservée : {args.source.resolve()}
SHA-256 : {digest}
Rendu de référence : qa-reference, deux pages, toutes relues.
Une section A4 portrait (11906 × 16838 twips), marges gauche/droite 1134,
haut 907, bas 567 ; en-tête 284, pied 454. Première page distincte.
Titre centré Arial 12 pt ; libellés initiaux Arial 10 pt ; corps et listes
repris de leurs paragraphes sources, sans remplacement des styles du document.
Logos ancrés, bordures, pieds, champs PAGE, hyperliens et rubriques conservés.

Emplacements dans word/document.xml (index de paragraphe à partir de zéro) :
1 titre ; 3 public ; 4 prérequis/durée/modalité ; 9-11 objectifs ; 14-16 contenu ;
19-23 méthodes ; 27 accompagnement ; 31-32 évaluations ; 40-43 dates/lieu/mail/tél ;
49 accès distanciel ; 62 intervenants ; 65 atelier/contact/mail/tél ; 75 date/ID notice.
Les listes variables clonent leur paragraphe source ; elles ne sont jamais tronquées.
Les instructions rouges sont remplacées, dans les seuls emplacements remplis,
par le format de texte noir du corps du même modèle. Les rubriques restent intactes.
Les champs absents du schéma V1 sont saisis pour chaque export dans le widget.
Les mentions de satisfaction, handicap, liens et mentions légales restent celles du maître.
Le champ ID NOTICIA reçoit explicitement l'ID notice ; l'ID session sert au nom du fichier.
La date de mise à jour du document est la date d'export, sans changer la version du maître.

Seules les parties document.xml et settings.xml sont modifiables ; toutes les autres
doivent conserver leur SHA-256. settings.xml demande la mise à jour des champs à l'ouverture.
La pagination est contrôlée sur jeux courts et longs ; aucun nombre fixe de pages n'est promis
pour des contenus de longueur arbitraire. Aucun changement des dimensions ou réduction de police.
''')
        def parsed(i):
            return E.fromstring(E.tostring(paragraphs[i]))
        def plain(i, text, normal=False):
            p = parsed(i)
            nodes = p.findall('.//w:t', NS)
            nodes[0].text = text
            nodes[0].set('{http://www.w3.org/XML/1998/namespace}space', 'preserve')
            for node in nodes[1:]: node.text = ''
            if normal:
                for props in p.findall('.//w:rPr', NS):
                    for child in list(props):
                        if E.QName(child).localname in ('color', 'b', 'bCs', 'i', 'iCs', 'sz', 'szCs'):
                            props.remove(child)
            return p
        replacements = {}
        replacements[1] = plain(1, '{{Titre}}')
        replacements[3] = plain(3, 'Public(s) visé(s) : {{Public}}')
        p = parsed(4); ts = p.findall('.//w:t', NS)
        ts[1].text = ' : {{Prerequis}}'
        ts[2].text = 'Durée : {{Duree}} h'
        ts[5].text = ': {{Modalite}}'
        ts[6].text = ''; ts[7].text = ''
        replacements[4] = p
        for i, key in [(9,'Objectifs'),(14,'Contenu'),(20,'Methodes'),(31,'Evaluations')]:
            replacements[i] = plain(i, '{{#'+key+'}}', normal=i==20)
        for i in [10,11,15,16,19,21,22,23,32]: replacements[i] = None
        for i, text, normal in [
            (27,'{{Accompagnement}}',True),
            (40,'Date, horaires : {{Dates}} — {{Horaires}}',False),
            (41,'Lieu : {{Lieu}}',False),(42,'Mail : {{Email}}',False),
            (43,'Tél. : {{Telephone}}',False),(49,'{{Acces}}',True),
            (62,'{{Formateurs}}',False)]:
            replacements[i] = plain(i,text,normal)
        p=parsed(65)
        for t,value in zip(p.findall('.//w:t',NS),['{{Atelier}}','{{Contact}}','Mail : {{Email}}','Tél. : {{Telephone}}']):t.text=value
        replacements[65]=p
        p=parsed(75); ts=p.findall('.//w:t',NS)
        ts[1].text='{{Date_edition}}';ts[2].text='ID NOTICIA : {{ID_notice}}'
        replacements[75]=p
        # Serialize edited paragraphs only, leaving all other source XML intact.
        for i in sorted(replacements,reverse=True):
            p=replacements[i]
            if p is None: replacement=''
            else:
                replacement=E.tostring(p,encoding='unicode')
                replacement=re.sub(r' xmlns(?::[\w]+)?="[^"]*"','',replacement)
            xml=xml[:chunks[i].start()]+replacement+xml[chunks[i].end():]
        E.fromstring(xml.encode())
        settings=z.read('word/settings.xml').decode()
        if '<w:updateFields' in settings:
            settings=re.sub(r'<w:updateFields\b[^>]*/>', '<w:updateFields w:val="true"/>', settings)
        else:settings=settings.replace('</w:settings>','<w:updateFields w:val="true"/></w:settings>')
        args.output.parent.mkdir(parents=True,exist_ok=True)
        with zipfile.ZipFile(args.output,'w',zipfile.ZIP_DEFLATED) as out:
            for item in z.infolist():
                data=xml.encode() if item.filename=='word/document.xml' else settings.encode() if item.filename=='word/settings.xml' else z.read(item.filename)
                out.writestr(item,data)
    data={'id':'programme-stagiaire-2025-10-15','name':'Programme stagiaire Canopé — maître du 15/10/2025',
          'sha256':hashlib.sha256(args.output.read_bytes()).hexdigest(),'sourceSha256':digest,
          'file':args.output.name,'preserve':{k:v for k,v in preserve.items() if k not in ['word/document.xml','word/settings.xml']}}
    args.manifest.write_text(json.dumps(data,ensure_ascii=False,indent=2))
    with zipfile.ZipFile(args.output) as out:
        for n,h in data['preserve'].items():assert hashlib.sha256(out.read(n)).hexdigest()==h,n
    print(args.output, data['sha256'])

if __name__ == '__main__': main()
