# Version 0.2 — programme Word Canopé

Le programme générique HTML est remplacé par un export Word à partir du modèle stagiaire fourni. Le reste du widget conserve ses quatre tables et ses données. Ne réinstallez pas les tables et ne rechargez pas l’exemple fictif si votre document contient déjà votre session.

## Téléversement manuel

1. Décompressez `Livraison-qualiopi-grist-V02.zip`.
2. Dans `kiwi1er/qualiopi-grist`, branche `main`, choisissez **Add file → Upload files**.
3. Déposez le contenu de la livraison : fichiers à la racine et dossiers `vendor`, `tests`, `scripts` entiers. Le dossier `vendor` doit contenir `jszip.min.js` et sa licence ; ne placez pas ces fichiers à la racine. Le ZIP ne doit pas être téléversé lui-même.
4. Validez avec **Commit changes** puis attendez le déploiement vert dans **Actions**.
5. Dans les réglages du widget Grist, utilisez `https://kiwi1er.github.io/qualiopi-grist/index.html?v=0.2`, puis rechargez la page.

Les fichiers d’application requis sont `index.html`, `app.js`, `core.js`, `style.css`, `docx.js`, `documents-ui.js` et `vendor/jszip.min.js`. Le schéma est inchangé. Aucun fichier existant n’a besoin d’être supprimé sur GitHub.

## Modèle à garder sur votre ordinateur

Le fichier `Programme_stagiaire_Canope_publipostage.docx` est livré séparément. Ne le mettez pas sur GitHub. Il a été préparé à partir du modèle stagiaire du dossier type, version indiquée dans le maître : 15/10/2025. L’original reste intact. Ne réenregistrez pas le modèle préparé dans Word : le widget contrôle son empreinte et refusera une version modifiée. Les Word générés peuvent être modifiés normalement.

1. Ouvrez **Documents** dans le widget et choisissez ce modèle local.
2. Complétez la modalité, le mail, le téléphone et les modalités d’accès pour cet export. Pour le présentiel, vous pouvez indiquer « Sans objet — formation en présence » dans le complément d’accès à distance.
3. Cliquez sur **Télécharger le programme Word**. Si des champs de la fiche ou des objectifs manquent, le widget les énumère : complétez-les et enregistrez, puis revenez dans Documents.
4. Ouvrez le Word généré, contrôlez sa mise en page et les mentions fixes, puis utilisez l’export PDF de Word. Déposez ensuite le document manuellement dans SharePoint.

Le modèle et les compléments restent en mémoire pendant l’ouverture de la page ; les compléments sont séparés par session, mais ne sont pas enregistrés dans Grist. Il faut les ressaisir après un rechargement. Les informations de la fiche et les objectifs restent enregistrés dans Grist comme auparavant.

## Fidélité et limites

Les images, en-têtes, pieds de page, styles, numérotation et relations du maître sont conservés. Les seules modifications portent sur les emplacements à remplir et la demande de mise à jour des champs à l’ouverture de Word. Les consignes et exemples rouges des emplacements variables sont remplacés par les données en texte noir issu du modèle. Les listes clonent leurs paragraphes sources et ne tronquent aucun objectif.

Le champ `ID NOTICIA` du document reçoit explicitement **l’ID notice**, pas l’ID session. Le nom du fichier utilise l’ID session. La date de mise à jour affichée est celle de l’export. Les mentions fixes de satisfaction, de handicap, les contacts fixes et les liens sont ceux du maître ; le champ Accessibilité libre de la fiche n’est pas injecté dans ce texte institutionnel.

Le contrôle visuel a été effectué avec LibreOffice fourni par l’environnement : deux pages avec trois objectifs courts, trois pages avec neuf objectifs longs. Word et ses polices peuvent produire des sauts de page différents. La conservation du modèle ne garantit pas un nombre fixe de pages pour tous les textes ; une relecture du Word/PDF reste nécessaire.

**Seul le programme stagiaire est raccordé dans cette livraison.** L’inventaire local recense les autres modèles et les données manquantes pour les raccorder. Les attestations, conventions, conducteurs et questionnaires ne sont pas présentés comme déjà automatisés. L’index de preuves reste un export de suivi HTML du widget, sans modèle institutionnel identifié.

## Tests

```sh
npm install
npx playwright install chromium
npm test
npm run test:browser
```

Pour les tests sur le véritable modèle conservé localement, définir `QUALIOPI_TEMPLATE` vers son chemin, puis lancer `npm test` et `npm run test:word`. Sans cette variable, les tests qui exigent le maître sont explicitement marqués comme non exécutés. Le modèle ne fait pas partie du dépôt public.

La bibliothèque JSZip 3.10.1 est embarquée dans `vendor` sous sa licence MIT. Aucune dépendance ni modèle n’est téléchargé lors du publipostage. Le chargement du fichier et la fusion sont locaux au navigateur. Documentation technique : [lecture des archives](https://stuk.github.io/jszip/documentation/api_jszip/load_async.html) et [génération](https://stuk.github.io/jszip/documentation/api_jszip/generate_async.html).
