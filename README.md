> **Version 0.3 : aperçu du programme complété dans Grist.** Voir [la mise à jour](MISE_A_JOUR_V03.md). Le modèle enregistré est réutilisé ; la pagination finale reste à contrôler dans Word.

> **Mise à jour 0.2.1 :** le modèle programme et les compléments peuvent désormais être enregistrés dans le document Grist. Voir [les instructions](MISE_A_JOUR_V021.md). Les indications antérieures de stockage uniquement en mémoire sont remplacées par cette mise à jour.

# Atelier Qualité — Widget Grist 0.2

Widget de suivi de sessions, objectifs et preuves. Les imports Noticia et les dépôts SharePoint sont manuels. Les données sont conservées dans votre document Grist.

**Nouveau : le programme stagiaire est généré en Word à partir du modèle Canopé fourni.** Voir [la mise à jour 0.2](MISE_A_JOUR_V02.md), [la reprise du projet](REPRISE.md) et [les vérifications](VALIDATION.md).

## Installation et mise à jour

Le code est publié manuellement par Alexandre dans `kiwi1er/qualiopi-grist`, branche `main`. GitHub Pages utilise `main`, dossier `/(root)`. Aucun serveur métier ni compilation n’est nécessaire. Déposer les fichiers d’application à la racine et conserver les dossiers `vendor`, `tests` et `scripts`.

Dans Grist, ajouter une vue personnalisée à un document de test, avec l’URL `https://kiwi1er.github.io/qualiopi-grist/index.html?v=0.2`. Accorder l’accès complet, puis installer les tables uniquement lors de la première utilisation. Une mise à jour 0.1 → 0.2 ne nécessite aucune réinstallation des tables.

Hors Grist, `?demo=1` ouvre la démonstration avec stockage local. Dans une iframe, le widget utilise toujours Grist et ne bascule pas silencieusement vers le stockage local.

## Fonctions

- Fiche session avec ID notice et ID session distincts, dates, public, besoins, organisation et contacts.
- Objectifs : une ligne par objectif et sa méthode d’évaluation.
- Vingt étapes de suivi en six phases, avec responsable, échéance, lien, commentaire et contrôleur déclaré.
- Complétude : étapes vérifiées parmi les étapes applicables et exigibles. Les futures et non applicables sont exclues. Ce calcul ne constitue pas une certification.
- Import CSV UTF-8 manuel, virgule ou point-virgule, dates AAAA-MM-JJ, aperçu et association des colonnes. Maximum 1 000 sessions et 3 Mo. Les ID existants sont ignorés, sans mise à jour de leur fiche.
- Programme stagiaire Word depuis le modèle local préparé ; conversion PDF dans Word. Le programme générique HTML a été retiré.
- Index de preuves HTML imprimable, suivi CSV et données de session JSON. L’index est un outil du widget, sans modèle Canopé identifié.
- Journal des écritures du widget. Actualisation manuelle pour relire les modifications effectuées ailleurs dans Grist.

## Programme Word

Charger le fichier `Programme_stagiaire_Canope_publipostage.docx` livré séparément, puis compléter les informations de l’export. Les champs manquants bloquent la génération et sont énumérés. Les notes internes ne sont jamais ajoutées au programme.

Les maîtres Word restent hors du dépôt public. Le modèle et les quatre compléments de l’export sont conservés uniquement en mémoire, par session, pendant l’ouverture de la page. Ils doivent être rechargés ou ressaisis après actualisation ; les données de la fiche et les objectifs restent dans Grist.

Seul le programme stagiaire est raccordé à un maître pour cette version. Les autres modèles retrouvés sont inventoriés localement. Les participants, conducteurs détaillés, évaluations individuelles, signatures, envois de courriels et archivage des versions ne sont pas implémentés.

## Limites du suivi

Le nom du contrôleur est déclaré ; le journal est une table Grist modifiable selon les droits et ne capture pas les changements effectués dans d’autres vues. La V1 ne configure pas les droits par rôle. Les liens de preuves ne sont ni téléchargés ni vérifiés. L’export JSON n’est pas une sauvegarde complète ni un format réimportable.

L’échéance à froid est initialisée à la fin de session + trois mois calendaires. Si la date change, utiliser le bouton de recalcul. Aucun rappel ou envoi n’est automatique. La création d’une session et de ses étapes utilise deux écritures ; en cas d’interruption, actualiser puis utiliser « Compléter les étapes manquantes ».

## Tests et structure

`core.js` contient les règles métier ; `app.js` gère Grist et la navigation ; `documents-ui.js` et `docx.js` gèrent le programme Word. `SCHEMA.json` décrit les quatre tables inchangées. JSZip 3.10.1 est embarqué avec sa licence dans `vendor`. Le seul script distant chargé en mode intégré est l’API officielle Grist.

```sh
npm install
npx playwright install chromium
npm test
npm run test:browser
```

Les tests Word sur le maître exigent la variable `QUALIOPI_TEMPLATE` vers le fichier local, puis `npm test` et `npm run test:word`. Sans ce fichier, ces contrôles sont explicitement non exécutés. Voir [les résultats de recette](VALIDATION.md).

Ne déposer sur GitHub que le code, les tests fictifs et la documentation technique. Conserver exports réels, archives institutionnelles et modèles Word localement ou dans les espaces autorisés.
