# Atelier Qualité — Widget Grist 0.1

Reprise dans `kiwi1er/qualiopi-grist` : voir [le guide de téléversement et de reprise](REPRISE.md) et [les résultats des tests](VALIDATION.md). La publication est réalisée manuellement par Alexandre.

Prototype en français pour suivre le dossier qualité d’une session de formation. Le code est hébergé sur GitHub Pages, les données sont enregistrées dans votre document Grist. Aucun serveur métier, aucune clé API personnelle, aucune connexion Noticia ou SharePoint n’est nécessaire.

## Installation en dix minutes

1. Décompressez l’archive sur votre ordinateur.
2. Créez un dépôt GitHub, par exemple `qualiopi-widget`. Pour un premier essai avec GitHub Pages gratuit, utilisez un dépôt public contenant uniquement le code fourni.
3. Dans **Add file → Upload files**, déposez les fichiers `index.html`, `style.css`, `core.js` et `app.js` à la racine du dépôt. Validez avec **Commit changes**. Ne déposez pas seulement le ZIP et ne placez pas ces quatre fichiers dans un sous-dossier.
4. Dans **Settings → Pages**, choisissez **Deploy from a branch**, branche **main**, dossier **/ (root)**, puis **Save**. Attendez la fin du déploiement.
5. Copiez l’adresse du site affichée par GitHub Pages, par exemple `https://VOTRE-COMPTE.github.io/qualiopi-widget/index.html`. N’utilisez pas l’adresse de la page de code GitHub ni une adresse `raw`.
6. Dans Grist, créez un **document de test vierge**. Ajoutez une page/vue de type **Personnalisée / Custom**, associée à la table initiale (`Table1` convient).
7. Dans la configuration du widget, choisissez une **URL personnalisée**, collez l’adresse précédente et accordez l’**accès complet au document** demandé par le widget. Il sert à lire et modifier ses quatre tables. Vos droits Grist continuent de s’appliquer.
8. Cliquez sur **Installer les tables du widget**. Si vous venez d’accorder l’accès, cliquez au besoin sur **Actualiser**.
9. Cliquez sur **Charger l’exemple fictif**. Il crée une session, deux objectifs et vingt étapes à renseigner. Aucun justificatif réel n’est déclaré acquis.
10. Testez les onglets **Fiche session**, **Objectifs**, **Suivi & preuves**, **Documents** et **Import CSV**. Le sélecteur de session est dans le widget ; il ne suit pas automatiquement la ligne sélectionnée dans une autre vue Grist.

Les intitulés de menus peuvent varier selon la version de Grist. Si les widgets par URL sont interdits sur votre instance, l’administrateur doit autoriser ce mode d’intégration. Cette version n’a pas encore été testée sur votre instance gouvernementale.

## Parcours d’essai conseillé

- Modifiez le titre de l’exemple, puis enregistrez la fiche.
- Ajoutez un objectif et sa méthode d’évaluation.
- Dans le suivi, ouvrez une étape. Pour « Vérifié », renseignez le nom déclaré du contrôleur et un lien ou une description de la preuve. Pour « Non applicable », donnez une justification et un contrôleur.
- Ouvrez **Documents** : les informations enregistrées alimentent le programme. Téléchargez le HTML, ouvrez-le dans votre navigateur puis imprimez-le ou enregistrez-le en PDF. Un index documentaire est également disponible.
- Importez le fichier fictif `exemple_import_sessions.csv`, associez ses colonnes et contrôlez l’aperçu avant de confirmer. Réimportez-le : les ID existants seront ignorés.
- Actualisez le widget pour vérifier que les données sont bien conservées dans Grist.

## Ce que comprend cette première version

| Fonction | Fonctionnement |
|---|---|
| Fiche session | Notice et session Noticia distinctes, dates, public, besoins, organisation, modalités et contacts |
| Objectifs | Une ligne par objectif, avec méthode d’évaluation prévue |
| Suivi | Vingt étapes réparties dans les six phases du dossier ; échéance, responsable, lien, commentaire, contrôleur déclaré |
| Tableau de bord | Complétude déclarée, échéances dépassées et futures |
| Import manuel | CSV UTF-8, virgule ou point-virgule, correspondance de colonnes et aperçu |
| Publipostage | Programme et index documentaire en HTML imprimable A4 |
| Exports manuels | Données de la session en JSON, suivi en CSV, documents en HTML ou PDF via le navigateur |
| Journal | Historique des modifications effectuées par ce widget, avec date et valeurs modifiées |

Les six phases sont analyse, contractualisation, ingénierie, déploiement, évaluation et bilan. Les vingt étapes sont un premier paramétrage de travail ; elles ne constituent pas l’intégralité du référentiel. Les rapprochements avec les indicateurs Qualiopi sont indicatifs et doivent être validés par le responsable qualité.

## Noticia → Grist → SharePoint

Exportez manuellement vos sessions depuis Noticia en CSV. Si l’export est un fichier Excel, enregistrez une copie en CSV UTF-8. Le widget demande d’associer les colonnes ; le format réel de votre export n’a pas encore été fourni et testé. Les dates doivent être au format `AAAA-MM-JJ`. Titre et ID session sont obligatoires pour l’import. Maximum : 1 000 sessions et 3 Mo par fichier. Les imports n’écrasent pas les sessions existantes : les mises à jour se font dans la fiche pour cette V1.

Téléchargez les documents générés, puis déposez-les manuellement dans le dossier SharePoint prévu. Vous pouvez coller son adresse dans la fiche. Les liens de preuves pointent vers les fichiers existants : le widget ne les copie pas, ne vérifie pas leurs permissions et ne constitue pas une archive contenant leurs pièces jointes.

## Calculs et traçabilité

La complétude est le nombre d’étapes « Vérifié » parmi les étapes applicables exigibles aujourd’hui. Les échéances futures et les étapes « Non applicable » sont exclues du dénominateur. Une étape sans échéance compte comme exigible. Ce taux décrit un suivi déclaré, jamais une certification ou une conclusion de conformité.

L’échéance à froid est initialisée à **date de fin + trois mois calendaires** lorsqu’une session datée est créée/importée. Si la date de fin change, utilisez **Recalculer l’échéance à froid** dans le suivi. Aucun envoi ni rappel automatique n’est effectué.

Le nom du contrôleur est saisi librement : aucune signature ou authentification distincte n’est fournie. Le journal est une table Grist, modifiable selon les droits du document, et ne capture pas les changements effectués directement dans d’autres vues. La V1 ne définit pas de règles d’accès par rôle. Un contrôle avant écriture détecte certaines modifications concurrentes, mais ce prototype n’est pas conçu pour des imports ou éditions simultanés nombreux.

## Documents et périmètre

Le programme est un modèle générique portant la mention **aperçu de test**, à rapprocher du modèle maître et de la charte Canopé avant diffusion. Il reprend les données enregistrées, sans notes internes. Le journal et les exports JSON peuvent contenir ces notes. La génération d’un programme ne marque aucune étape comme vérifiée et ne prouve pas sa transmission ou sa validation.

Non inclus : questionnaires en ligne, réponses individuelles aux acquis, émargement électronique, signatures, modèles Word officiels, conducteur détaillé, versionnement des programmes, archivage des fichiers de preuves, formulaires publics, envoi de mails, connecteurs ou authentification d’un espace apprenant. Le JSON est un export de données, pas une sauvegarde complète du document Grist ni un format réimportable dans cette V1.

## Démonstration hors Grist

Ouvrez l’adresse GitHub Pages avec `?demo=1` à la fin. Ce mode autonome conserve des données fictives dans le stockage local du navigateur. Il n’est activé qu’en dehors d’une iframe : le widget intégré à Grist ne bascule jamais silencieusement vers une sauvegarde locale en cas d’erreur.

## Dépannage

- **Accès refusé** : vérifiez les droits sur le document et l’accès complet accordé au widget, puis actualisez.
- **Script Grist bloqué** : vérifiez avec l’administrateur l’autorisation de l’URL GitHub Pages et de `https://docs.getgrist.com/grist-plugin-api.js`.
- **Tables incompatibles** : utilisez un document vierge. Ne renommez pas les identifiants des tables/colonnes décrits dans `SCHEMA.json`. L’installation ne remplace pas une table existante.
- **Création interrompue après ajout d’une session** : actualisez, sélectionnez la session, puis utilisez **Compléter les étapes manquantes**. La création de la session et de ses étapes utilise deux écritures successives.
- **Impression bloquée dans Grist** : téléchargez le HTML et imprimez-le dans un onglet de navigateur.
- **Données modifiées dans une autre vue** : cliquez sur **Actualiser** ; la synchronisation n’est pas automatique.
- **Nouvelle version du widget invisible** : attendez le déploiement Pages puis rechargez la vue, éventuellement avec `?v=2` ajouté à l’URL.

Ne publiez sur GitHub que le code et les exemples fictifs. Les exports réels, documents internes, liens privés et clés d’accès restent dans vos espaces de travail autorisés.

## Structure technique et tests

Aucune compilation : HTML/CSS/JavaScript sans dépendance applicative. Seul le script officiel Grist est chargé lors de l’intégration. `SCHEMA.json` décrit les quatre tables ; les données métier sont lues et écrites par `grist.docApi` et `applyUserActions`.

Tests locaux : `node --test tests/core.test.cjs`. Test navigateur : installer Playwright et Chromium dans votre environnement de développement, puis lancer `node tests/browser.test.cjs`. Le scénario de test fourni utilise une API Grist simulée : installation, création, saisie, contrôles de preuve, import sans écrasement, erreur de droits, téléchargement HTML et affichage ordinateur/mobile. Ces tests ne remplacent pas l’essai sur votre instance Grist.

Documentation officielle : [widgets Grist](https://support.getgrist.com/widget-custom/), [API du document](https://support.getgrist.com/code/interfaces/grist_plugin_api.GristDocAPI/), [GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site).

État de vérification au 12 septembre 2026 : syntaxe JavaScript et cinq tests de logique réussis. Le scénario navigateur a désormais été exécuté avec succès sous Chromium, y compris les contrôles complémentaires de téléchargement et de persistance en démonstration. Le tableau de bord ordinateur/mobile et le HTML d'impression ont été relus visuellement. La pagination PDF et les échanges avec une véritable instance Grist restent à vérifier. Voir [VALIDATION.md](VALIDATION.md).
