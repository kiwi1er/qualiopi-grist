# Version 0.3 — aperçu du programme complété

Téléversez le contenu du ZIP à la racine de kiwi1er/qualiopi-grist, avec les dossiers vendor, scripts et tests. Conservez les autres fichiers du dépôt. Attendez le déploiement GitHub Pages puis rechargez Grist. Gardez votre URL actuelle. Le numéro affiché devient 0.3.

Dans Documents, le modèle déjà enregistré est retrouvé automatiquement. Renseignez les données requises dans la fiche session, les objectifs et les compléments. L’aperçu apparaît sous « 3. Aperçu du programme complété » et se met à jour après une courte pause dans la saisie. Si des renseignements obligatoires manquent, un message les indique. Un ancien aperçu est masqué dès que la saisie change pour éviter de montrer une version périmée.

L’aperçu est réalisé à partir du même Word généré que celui proposé au téléchargement, avec le modèle institutionnel. Il ne sauvegarde pas votre saisie : utilisez Enregistrer les compléments ou Télécharger le programme Word. Aucune conversion externe, aucun envoi du modèle ou des données vers un service de prévisualisation.

Le rendu HTML reprend les images et la mise en forme du Word. Les polices disponibles et la pagination peuvent différer de Microsoft Word, particulièrement pour les contenus longs. Vérifiez le Word final avant diffusion et export PDF. Cette version concerne uniquement le programme stagiaire ; les autres documents ne sont pas encore intégrés.

Validation : 8 tests Node réussis avec le modèle réel. Tests Chromium réussis : aperçu rempli et logos présents, actualisation pendant la saisie, masquage si une donnée obligatoire est effacée, notes internes exclues, téléchargement, persistance, iframe avec API Grist simulée et mobile. Rendu de l’aperçu inspecté visuellement. L’essai utilisateur dans Grist DINUM/Safari reste à réaliser.

Dépendance ajoutée : docx-preview 0.3.7, Apache-2.0, https://github.com/VolodymyrBaydalka/docxjs ; bibliothèque et licence fournies dans vendor. Le paquet npm a été vérifié avec son empreinte SHA-512. Les scripts et CSS de index.html portent une empreinte de contenu pour éviter le mélange des versions mises en cache. Pour les futures modifications de code, exécuter python3 scripts/version_assets.py depuis le dépôt avant livraison.
