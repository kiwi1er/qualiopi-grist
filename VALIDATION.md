## Version 0.3 — aperçu

Tests Node (8) et deux suites navigateur réussis. Aperçu du DOCX rempli, logos, mise à jour à la saisie et masquage si champs manquants vérifiés. Capture inspectée visuellement. Aucun changement au moteur de génération Word. Validation réelle DINUM/Safari à effectuer.

## Mise à jour 0.2.1

Huit tests Node réussis. Tests Chromium : persistance du modèle et des compléments après rechargement, génération Word sans nouvelle sélection du modèle, récupération depuis les seules tables dans un contexte neuf, stockage via API Grist simulée en iframe et refus d’écriture. L’essai réel DINUM/Safari reste à réaliser. Voir MISE_A_JOUR_V021.md.

# Validation 0.2 — 13 septembre 2026

## Vérifications réalisées

- Huit tests Node réussis, incluant les cinq tests de logique V1 et trois tests Word. Le test nécessitant le vrai modèle a été exécuté avec QUALIOPI_TEMPLATE.
- Scénario navigateur Grist simulé réussi : installation, écritures, preuves, import sans écrasement, refus de droits, export de l’index HTML, démonstration persistante et objectifs.
- Nouveau scénario navigateur Word réussi : rejet d’un faux modèle, chargement local, téléchargement DOCX, caractères spéciaux, exclusion des notes, conservation des compléments entre onglets et affichage mobile sans débordement horizontal. Aucune requête externe observée pendant ce scénario de démonstration.
- Maître de référence relu sur ses deux pages. Modèle préparé relu sur ses deux pages. Programme court relu sur deux pages ; programme long avec neuf objectifs sur trois pages, sans troncature.
- Images, styles, en-têtes, pieds, relations, numérotation et autres parties non éditables comparés octet par octet au maître. Seuls document.xml et le réglage updateFields changent lors de la préparation ; seule document.xml change pendant la fusion dans le navigateur.
- Le code et les fichiers publiés sur origin/main ont été consultés via git fetch, sans écriture distante. Aucun push, commit local ou déploiement automatique de la 0.2.
- grist-pilotage-personnel n’a pas été consulté ni modifié.

## Essais utilisateurs déjà confirmés sur la 0.1

Le 12 septembre, Alexandre a confirmé le déploiement GitHub Pages, l’installation des tables, le chargement de l’exemple et la conservation du titre après rechargement dans grist.numerique.gouv.fr. Le 13 septembre, il a indiqué que le publipostage fonctionnait, mais ne respectait pas le maître. La 0.2 traite ce dernier point pour le programme stagiaire.

## Reste à vérifier après téléversement

Chargement du modèle et téléchargement Word dans la vraie iframe Grist, ouverture dans Microsoft Word sur le poste utilisateur, actualisation des champs de page, export PDF et dépôt SharePoint. Les contrôles visuels locaux utilisent LibreOffice fourni ; ils ne prouvent pas un rendu identique au pixel près dans toutes les versions de Word et avec toutes les polices. Les textes longs peuvent augmenter le nombre de pages.

Les autres documents ne sont pas encore raccordés au moteur. L’inventaire local liste les versions trouvées et les données supplémentaires nécessaires.

---

## Historique de la première préparation

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
