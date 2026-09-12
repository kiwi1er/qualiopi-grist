# Validation de la reprise — 12 septembre 2026

## Résultats exécutés

- Syntaxe JavaScript vérifiée.
- Les cinq tests de logique fournis passent, sans modification de core.js.
- Le scénario navigateur passe sous Chromium 151, Playwright 1.62.1 et Node.js 24.19.0 sur macOS.
- Installation des quatre tables via une API Grist simulée, création d'une session et de vingt étapes.
- Enregistrement de la fiche, validation obligatoire du contrôleur et de la preuve, refus d'écriture simulé sans modification de la ligne.
- Import d'un ID existant et d'un nouvel ID : deux sessions au total, quarante étapes, fiche existante préservée.
- Téléchargement HTML : titre échappé correctement, notes internes absentes du programme.
- Ajout d'un troisième objectif en démonstration et conservation après rechargement.
- Aucune erreur JavaScript détectée par le scénario iframe.
- Captures du tableau de bord relues sur ordinateur (1440 px) et mobile (390 px), sans débordement horizontal du document.
- Programme téléchargé relu avec les styles d'impression. La pagination PDF réelle n'a pas été testée.

Les captures et le programme fictif sont dans test-results/, ignoré par Git et exclu de la livraison.

## Continuité avec la V1

index.html, app.js, core.js, style.css, SCHEMA.json et tests/core.test.cjs sont identiques aux fichiers de l'archive fournie. Le test navigateur a été complété pour contrôler le contenu téléchargé, le débordement mobile et la persistance des objectifs en démonstration. Des documents de reprise, une configuration npm de développement et un .gitignore ont été ajoutés.

## Reste à vérifier

- Publication GitHub Pages et chargement à son adresse définitive : à effectuer par Alexandre.
- Intégration dans une vraie instance Grist : non exécutée. Le simulateur ne valide ni le protocole complet de Grist, ni les droits réels, ni les restrictions de l'instance.
- Rechargement et persistance dans un vrai document Grist, impression PDF paginée, export Noticia réel anonymisé, dépôt SharePoint et autorisations des liens.
- Validation métier des vingt étapes et validation du modèle de programme par rapport aux documents maîtres.

Le guide REPRISE.md détaille le téléversement manuel et la recette réelle. Aucun commit local, push ou déploiement n'a été réalisé pendant cette préparation. Aucun accès ni changement n'a été effectué dans grist-pilotage-personnel.
