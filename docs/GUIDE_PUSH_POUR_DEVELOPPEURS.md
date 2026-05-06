# Guide push Git — ne pas supprimer le travail des autres

Ce document explique comment pousser du code sur **prolifyformation** en **ajoutant** des modifications, sans écraser ni supprimer celles des autres contributeurs (merge forcé, reset sur `main`, etc.).

---

## Règle d’or

**Ne jamais faire `git push --force` ou `git push --force-with-lease` sur `main`.**  
Cela réécrit l’historique distant et peut **effacer des commits** déjà présents (comme un retour en arrière brutal pour tout le monde).

---

## Avant chaque push sur `main`

1. **Récupérer le dernier état du dépôt**
   ```bash
   git fetch origin
   git checkout main
   git pull origin main
   ```

2. **Vérifier que tu n’écrases personne**
   - Si `git pull` fusionne sans conflit : tu intègres le travail des autres **avant** d’envoyer le tien.
   - S’il y a des conflits : les résoudre **en gardant** les changements utiles des deux côtés, puis commit de merge (ou continue le rebase si tu utilises un rebase — voir ci‑dessous).

3. **Pousser normalement**
   ```bash
   git push origin main
   ```
   Sans `--force`.

---

## Méthode recommandée : branche + Pull Request (ajout propre)

C’est la façon la plus sûre de **n’ajouter que tes modifications** sans toucher à l’historique de `main` de manière dangereuse.

1. **Partir de `main` à jour**
   ```bash
   git fetch origin
   git checkout main
   git pull origin main
   ```

2. **Créer une branche dédiée**
   ```bash
   git checkout -b feature/nom-de-ta-tache
   ```
   Exemples : `feature/stripe-webhook`, `fix/login-validation`.

3. **Travailler et commit sur cette branche uniquement**
   ```bash
   git add .
   git commit -m "description claire de ce que tu ajoutes"
   ```

4. **Pousser la branche** (pas `main` en direct)
   ```bash
   git push -u origin feature/nom-de-ta-tache
   ```

5. **Ouvrir une Pull Request** sur GitHub : `feature/nom-de-ta-tache` → `main`.  
   Un responsable fusionne ; l’historique de `main` **grandit** avec tes commits : c’est bien un **ajout**, pas une suppression du travail existant.

---

## Si tu dois pousser directement sur `main`

- Toujours **`git pull origin main`** (ou `git pull --rebase origin main` si l’équipe le valide) **avant** `git push`.
- **Interdit** : `git push --force` sur `main`.
- **Éviter** : `git reset --hard` sur un ancien commit puis push — même effet qu’un force push pour les autres.

---

## Intégrer le dépôt d’organisation sans “écraser” l’historique

Si tu merges une branche `org/main` ou un autre remote :

- Préfère un **merge commit** classique ou une **PR** après avoir testé en local.
- Évite les stratégies qui **remplacent** entièrement `main` par une autre branche sans revue (risque de perdre des commits déjà sur `main`).

En cas de doute : **branche + PR**.

---

## En cas de conflit avec le travail d’un autre dev

1. Ne pas supposer que “ta version” doit tout remplacer la sienne.
2. Ouvrir les fichiers en conflit, **garder** ce qui est correct des deux côtés quand c’est possible.
3. Tester (`npm run build`, etc.) avant de commit / push.

---

## Résumé pour coller dans un message au dev

- Toujours `git pull` sur `main` avant de pousser.  
- **Jamais** `git push --force` sur `main`.  
- Pour ne **rajouter** que ton travail : branche `feature/...` + **Pull Request** vers `main`.  
- Les merges complexes ou l’intégration d’un autre remote : passer par une branche et une PR, pas un push qui réécrit l’historique.

---

*Document à usage interne — dépôt [Prolify-AI/prolifyformation](https://github.com/Prolify-AI/prolifyformation).*
