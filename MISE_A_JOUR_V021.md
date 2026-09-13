# Mise à jour 0.2.1 — modèles conservés dans Grist

1. Décompressez le ZIP de mise à jour sur votre ordinateur.
2. Dans kiwi1er/qualiopi-grist, utilisez Add file → Upload files. Glissez le contenu du dossier décompressé (avec son dossier tests) et validez Commit changes. Ne glissez pas le dossier parent ni le ZIP.
3. Attendez la réussite du déploiement GitHub Pages, puis rechargez la page Grist.
4. Dans Documents, choisissez une dernière fois Programme_stagiaire_Canope_publipostage.docx. Attendez « chargé et enregistré dans Grist ».
5. Complétez les renseignements et cliquez sur Enregistrer les compléments. Le téléchargement Word les enregistre également.
6. Rechargez Grist puis revenez dans Documents : le modèle et les compléments doivent être retrouvés. Vérifiez aussi depuis un autre navigateur connecté au même document Grist.

Le modèle reste dans votre document Grist, avec ses droits d’accès. Il ne va pas sur GitHub. Les autres utilisateurs autorisés à lire ces tables peuvent accéder au modèle et aux compléments. Le mode demo=1 conserve ses données uniquement dans le navigateur : utilisez l’URL normale dans Grist.

Deux tables sont ajoutées lors du premier enregistrement, sans modifier les quatre tables existantes :
- Q_Modeles : Nom (Text), Contenu (Text, fichier DOCX encodé en base64).
- Q_Documents : Session (Ref:Q_Sessions), Complements (Text, JSON).

Le modèle programme est partagé par toutes les sessions de ce document. Les compléments sont propres à chaque session. L’accès complet du widget et les droits de création/écriture sont nécessaires pour le premier enregistrement. Les lignes de ces tables ne doivent pas être dupliquées.

Cette mise à jour concerne le programme stagiaire déjà disponible. Les autres modèles et l’aperçu HTML intégré restent à développer. Le Word continue à utiliser le même modèle institutionnel ; contrôlez sa pagination dans Word avant le dépôt manuel sur SharePoint.

Validation : huit tests de logique/DOCX réussis avec le modèle réel ; tests navigateur de génération, rechargement, récupération des tables dans un contexte neuf, et tests en iframe avec API Grist simulée, y compris refus d’écriture. L’essai sur l’instance Grist DINUM réelle et avec Safari reste à effectuer par l’utilisateur. Aucun téléversement ni déploiement automatique effectué.
