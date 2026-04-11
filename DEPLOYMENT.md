# Guide de déploiement

Ce guide vous aidera à résoudre les problèmes courants lors du déploiement de l'application.

## Problème: "Supabase URL required"

Cette erreur se produit lorsque les variables d'environnement Supabase ne sont pas configurées correctement sur votre plateforme de déploiement.

### Solution

Les variables d'environnement doivent être configurées dans les paramètres de votre plateforme de déploiement:

#### Pour Netlify

1. Allez dans votre dashboard Netlify
2. Sélectionnez votre site
3. Cliquez sur **Site settings** > **Environment variables**
4. Ajoutez les variables suivantes:

```
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_anon_key_ici
```

5. **Important**: Après avoir ajouté les variables, cliquez sur **Trigger deploy** pour redéployer le site avec les nouvelles variables

#### Pour Vercel

1. Allez dans votre dashboard Vercel
2. Sélectionnez votre projet
3. Cliquez sur **Settings** > **Environment Variables**
4. Ajoutez les variables suivantes pour tous les environnements (Production, Preview, Development):

```
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_anon_key_ici
```

5. Redéployez le site

### Où trouver vos credentials Supabase

1. Allez sur https://supabase.com/dashboard
2. Sélectionnez votre projet
3. Cliquez sur l'icône **Settings** (engrenage) dans la barre latérale
4. Cliquez sur **API**
5. Copiez:
   - **Project URL** → utilisez-le pour `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → utilisez-le pour `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Problème: Le bouton Sign Out ne fonctionne pas

### Solutions

1. **Videz le cache de votre navigateur**
   - Chrome: Ctrl+Shift+Delete (Cmd+Shift+Delete sur Mac)
   - Cochez "Cookies et autres données de site" et "Images et fichiers en cache"
   - Cliquez sur "Effacer les données"

2. **Vérifiez que les variables d'environnement sont correctes**
   - Assurez-vous que `NEXT_PUBLIC_SUPABASE_URL` et `NEXT_PUBLIC_SUPABASE_ANON_KEY` sont bien configurées
   - Redéployez le site après avoir ajouté/modifié les variables

3. **Testez en navigation privée**
   - Ouvrez une fenêtre de navigation privée
   - Connectez-vous et testez le bouton Sign Out

## Configuration Google OAuth

Pour activer l'authentification Google:

1. **Créer un projet Google Cloud** (si vous n'en avez pas):
   - Allez sur https://console.cloud.google.com
   - Créez un nouveau projet ou sélectionnez un projet existant

2. **Configurer OAuth 2.0**:
   - Dans la console Google Cloud, allez dans **APIs & Services** > **Credentials**
   - Cliquez sur **Create Credentials** > **OAuth client ID**
   - Type d'application: **Web application**
   - Nom: "Prolify" (ou le nom de votre choix)
   - Authorized redirect URIs: Ajoutez:
     - `https://votre-projet.supabase.co/auth/v1/callback`
     - `http://localhost:3000/auth/v1/callback` (pour le développement)

3. **Configurer Supabase**:
   - Allez dans votre dashboard Supabase
   - **Authentication** > **Providers**
   - Activez **Google**
   - Entrez:
     - **Client ID**: Copiez depuis Google Cloud Console
     - **Client Secret**: Copiez depuis Google Cloud Console
   - Cliquez sur **Save**

4. **Configurez l'URL de redirection** dans votre code:
   - Le code utilise déjà `window.location.origin/onboarding` comme redirect URL
   - Assurez-vous que cette URL est bien autorisée dans Google Cloud Console

## Vérification du déploiement

Pour vérifier que tout fonctionne:

1. Ouvrez la console du navigateur (F12)
2. Essayez de vous connecter
3. Si vous voyez des erreurs, notez-les:
   - Erreurs réseau: vérifiez les variables d'environnement
   - Erreurs d'authentification: vérifiez la configuration Supabase
   - Erreurs CORS: vérifiez les URLs autorisées dans Supabase

## Support

Si vous rencontrez toujours des problèmes:

1. Vérifiez les logs de votre plateforme de déploiement
2. Vérifiez les logs dans Supabase Dashboard > Logs
3. Ouvrez la console du navigateur pour voir les erreurs JavaScript
