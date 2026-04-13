# 🚀 Guide de Déploiement - Panneau d'Administration Fromiz

## 📋 Prérequis

- Compte GitHub (déjà configuré)
- Compte Vercel (gratuit)
- Configuration Firebase (déjà configurée)

## 🎯 Déploiement sur Vercel

### 1. Créer un compte Vercel
1. Aller sur [vercel.com](https://vercel.com)
2. Cliquer sur "Sign Up"
3. Choisir "Continue with GitHub"
4. Autoriser l'accès à votre compte GitHub

### 2. Déployer le projet
1. Dans Vercel Dashboard, cliquer sur "New Project"
2. Sélectionner le repository `fromiz`
3. Choisir le dossier `admin-panel` comme racine
4. Vercel détectera automatiquement Next.js

### 3. Configuration des Variables d'Environnement
Dans Vercel Dashboard > Settings > Environment Variables, ajouter :

```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyBQJQJQJQJQJQJQJQJQJQJQJQJQJQJQJQ
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=fromiz-mobile.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=fromiz-mobile
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=fromiz-mobile.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdefghijklmnop
```

### 4. Déploiement Automatique
- Vercel déploiera automatiquement à chaque push sur `main`
- URL sera : `https://fromiz-admin-panel.vercel.app` (ou similaire)

## 🔧 Configuration Post-Déploiement

### 1. Tester la Connexion
- Aller sur l'URL Vercel
- Se connecter avec : `admin@fromiz.com` / `FromizAdmin2024!`

### 2. Vérifier Firebase
- Les règles Firebase sont déjà configurées
- Le contenu mis en avant devrait être accessible

## 🌐 Alternatives Gratuites

### Netlify
- Alternative à Vercel
- Déploiement depuis GitHub
- URL : `https://fromiz-admin.netlify.app`

### Railway
- Hébergement moderne
- Déploiement automatique
- Base de données incluse

### Render
- Hébergement gratuit
- Déploiement depuis GitHub
- SSL automatique

## 📱 Accès Mobile

Une fois déployé, vous pourrez :
- Accéder au panneau depuis n'importe où
- Configurer le contenu mis en avant
- Modifier les fromages en vedette
- Tout en temps réel sur l'app mobile

## 🔒 Sécurité

- Authentification Firebase obligatoire
- Variables d'environnement sécurisées
- HTTPS automatique
- Pas d'accès public sans authentification
