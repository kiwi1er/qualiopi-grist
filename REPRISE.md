# Reprise du prototype

Le dépôt `kiwi1er/qualiopi-grist` a été cloné à partir du commit `cf93de2` (README seul). Les fichiers de `qualiopi-widget.zip` ont été intégrés à sa racine. Ce projet est indépendant de `grist-pilotage-personnel`.

L'analyse de septembre 2026 décrit une cible plus large que cette V1. Le périmètre conservé est : fiche session, objectifs et modalités d'évaluation, vingt étapes de suivi, liens de preuves, journal, import manuel CSV, programme et index documentaire HTML imprimables. Noticia reste la source des imports manuels ; les documents sont téléchargés puis déposés manuellement dans SharePoint.

Les participants, évaluations individuelles, conducteurs versionnés, modèles Word officiels et connecteurs ne sont pas encore développés. Les annexes citées par le rapport (inventaire, matrice, schéma cible, recette) n'étaient pas jointes séparément à la reprise. Ne pas les confondre avec `SCHEMA.json`, qui décrit uniquement les quatre tables de la V1.

Les archives institutionnelles et le rapport d'analyse restent dans le dossier parent, hors du dépôt public. Le README d'origine reste consultable dans l'historique Git.

## Ouvrir le bon dossier dans Codex

Ouvrir le dossier local `qualiopi-grist` comme projet dans l'application, en sélectionnant ce sous-dossier, et non son dossier parent contenant les archives. Dans le sélecteur macOS, Cmd + Maj + G permet de coller le chemin complet indiqué dans la conversation. Les intitulés exacts peuvent varier selon la version de l'application.

Le lien GitHub existe déjà : `origin` pointe vers `https://github.com/kiwi1er/qualiopi-grist.git`. Aucun reclonage ni changement de dépôt distant n'est nécessaire.

Pour une prochaine tâche, demander : « Lis REPRISE.md, VALIDATION.md et README.md. Continue cette V1 sans repartir de zéro et ne modifie jamais grist-pilotage-personnel. »

## Relancer les tests

Sur un ordinateur équipé de Node.js 22 ou supérieur et npm, depuis ce dossier :

```sh
npm install
npx playwright install chromium
npm run test:all
```

Playwright est une dépendance de développement uniquement. Aucun outil de compilation n'est nécessaire pour héberger le widget. Le test navigateur utilise une API Grist simulée ; il ne contacte aucun document réel.

## Préparer puis publier sur GitHub Pages

Un **commit** enregistre une version dans le dossier local. Un **push** l'envoie sur GitHub. **GitHub Pages** rend les fichiers web accessibles à Grist. La préparation locale ne publie rien à elle seule.

La méthode retenue est le téléversement manuel par Alexandre. Codex prépare et teste les fichiers localement ; Alexandre les publie depuis GitHub.

1. Ouvrir [le dépôt qualiopi-grist](https://github.com/kiwi1er/qualiopi-grist), et vérifier que la branche sélectionnée est **main**.
2. Choisir **Add file → Upload files**. Décompresser la livraison préparée par Codex, puis déposer **son contenu**, pas le ZIP ni le dossier englobant. `index.html`, `app.js`, `core.js` et `style.css` doivent apparaître à la racine.
3. Renseigner un message, par exemple `Intégrer la V1 du widget Qualiopi`, puis choisir **Commit changes** sur `main`. Les fichiers de même nom sont remplacés. Si une future livraison supprime un fichier, Codex précisera lequel supprimer séparément.
4. Lors de la première publication, ouvrir [les réglages Pages de ce dépôt](https://github.com/kiwi1er/qualiopi-grist/settings/pages).
5. Choisir **Deploy from a branch**, puis **main**, **/(root)** et **Save**.
6. Attendre la réussite du déploiement dans **Actions**. L'adresse attendue est `https://kiwi1er.github.io/qualiopi-grist/index.html`. Elle n'est pas confirmée active tant que le déploiement n'a pas réussi.
7. Ouvrir cette adresse avec `?demo=1` pour essayer les données fictives hors Grist.

Pour chaque nouvelle version, répéter uniquement le téléversement des fichiers fournis et attendre le déploiement. Recharger ensuite le widget dans Grist. Au besoin, ajouter `?v=2`, puis `?v=3`, à son URL pour contourner le cache.

Le téléversement crée lui-même un commit sur GitHub : vous n'avez pas à utiliser Push. Avant une prochaine modification, indiquer à Codex que le téléversement est terminé afin qu'il récupère l'état distant et rapproche les fichiers locaux sans écraser les changements en cours. Ne pas utiliser de push forcé ni de réinitialisation destructive.

Source : [configuration officielle GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

## Essai dans Grist après publication

1. Créer un document de test vierge, dont vous êtes propriétaire.
2. Ajouter une vue personnalisée associée à la table initiale, saisir l'URL Pages et accorder l'accès complet demandé par le widget.
3. Installer les tables puis charger l'exemple fictif. Vérifier une session, deux objectifs et vingt étapes.
4. Modifier le titre et enregistrer. Ajouter un troisième objectif et sa méthode d'évaluation.
5. Tenter de vérifier une étape sans contrôleur : elle doit être refusée. Renseigner un contrôleur fictif et une description de preuve, puis enregistrer.
6. Importer `exemple_import_sessions.csv` deux fois : le second import ne doit pas créer de doublon.
7. Télécharger le programme HTML, l'ouvrir puis l'imprimer en PDF ; vérifier accents, objectifs, dates et sauts de page. Vérifier l'absence des notes internes dans le programme.
8. Télécharger l'index et le suivi CSV, puis tester un dépôt manuel dans un dossier SharePoint de test.
9. Recharger complètement le document Grist : les saisies doivent être conservées. Vérifier les quatre tables Q_Sessions, Q_Objectifs, Q_Suivi et Q_Journal.
10. Noter l'instance, le navigateur, la date, les résultats et les éventuels messages d'erreur dans une copie locale de la recette, sans publier de liens privés.

L'URL de votre instance et l'accès à un document de test restent nécessaires pour réaliser cet essai. [Documentation Grist des widgets personnalisés](https://support.getgrist.com/widget-custom/).
