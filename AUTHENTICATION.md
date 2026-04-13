# 🔐 Authentification - Fromiz Admin Panel

## 🎯 Vue d'ensemble

Le panneau d'administration Fromiz est maintenant protégé par un système d'authentification Firebase Auth. Seuls les utilisateurs autorisés peuvent accéder au panneau.

## 🚀 Configuration Initiale

### 1. Créer l'Utilisateur Administrateur

Exécutez le script de création d'utilisateur :

```bash
npm run create-admin
```

Ce script va créer un utilisateur administrateur avec les identifiants suivants :
- **Email :** `admin@fromiz.com`
- **Mot de passe :** `FromizAdmin2024!`
- **Nom :** `Administrateur Fromiz`

### 2. Première Connexion

1. Lancez le panneau d'administration :
   ```bash
   npm run dev
   ```

2. Ouvrez http://localhost:3000 dans votre navigateur

3. Vous verrez la page de connexion

4. Utilisez les identifiants créés par le script

## 🔒 Sécurité

### Changement de Mot de Passe

**IMPORTANT :** Changez le mot de passe par défaut après la première connexion !

1. Connectez-vous au panneau
2. Cliquez sur votre profil en haut à droite
3. Utilisez Firebase Console pour changer le mot de passe :
   - Allez sur [Firebase Console](https://console.firebase.google.com/)
   - Sélectionnez le projet `fromiz-mobile`
   - Allez dans **Authentication** > **Users**
   - Trouvez votre utilisateur et cliquez sur **Reset password**

### Ajout d'Utilisateurs Supplémentaires

Pour ajouter d'autres administrateurs :

1. Allez sur [Firebase Console](https://console.firebase.google.com/)
2. Sélectionnez le projet `fromiz-mobile`
3. Allez dans **Authentication** > **Users**
4. Cliquez sur **Add user**
5. Entrez l'email et un mot de passe sécurisé
6. L'utilisateur pourra se connecter avec ces identifiants

## 🛡️ Fonctionnalités de Sécurité

### Protection des Routes
- Toutes les pages sont protégées par `AuthGuard`
- Redirection automatique vers la page de connexion si non authentifié
- Vérification de l'état d'authentification en temps réel

### Gestion des Sessions
- Sessions persistantes Firebase Auth
- Déconnexion automatique après inactivité (configurable)
- Surveillance des connexions dans Firebase Console

### Messages d'Erreur Sécurisés
- Messages d'erreur génériques pour éviter l'énumération
- Protection contre les attaques par force brute
- Limitation du nombre de tentatives de connexion

## 🔧 Configuration Firebase

### Règles de Sécurité Firestore

Ajoutez ces règles dans Firebase Console > Firestore > Rules :

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Contenu mis en avant - Lecture pour tous, écriture pour les utilisateurs authentifiés
    match /featuredContent/{document} {
      allow read: if true; // L'app mobile peut lire
      allow write: if request.auth != null; // Seuls les utilisateurs connectés peuvent modifier
    }
    
    // Fromages - Lecture pour tous
    match /fromages/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### Configuration Authentication

Dans Firebase Console > Authentication > Settings :

1. **Authorized domains** : Ajoutez votre domaine de production
2. **Email/Password** : Activé
3. **User management** : Activé

## 🚨 Dépannage

### Problèmes de Connexion

1. **"Utilisateur non trouvé"**
   - Vérifiez que l'utilisateur existe dans Firebase Console
   - Exécutez `npm run create-admin` si nécessaire

2. **"Mot de passe incorrect"**
   - Vérifiez le mot de passe dans Firebase Console
   - Utilisez "Reset password" si nécessaire

3. **"Trop de tentatives"**
   - Attendez quelques minutes
   - Vérifiez votre connexion internet

### Problèmes de Configuration

1. **Erreur Firebase**
   - Vérifiez la configuration dans `src/lib/firebase.ts`
   - Assurez-vous que le projet Firebase est correct

2. **Problème de Build**
   - Vérifiez que toutes les dépendances sont installées
   - Exécutez `npm install` si nécessaire

## 📱 Intégration avec l'App Mobile

Le système d'authentification du panneau admin est indépendant de l'app mobile. L'app mobile utilise son propre système d'authentification pour les utilisateurs finaux.

### Synchronisation des Données

- Les modifications dans le panneau admin sont immédiatement visibles dans l'app mobile
- Aucune authentification requise pour lire les données dans l'app mobile
- Seul le panneau admin nécessite une authentification pour les modifications

## 🔄 Maintenance

### Surveillance des Connexions

1. Allez sur Firebase Console > Authentication > Users
2. Surveillez les connexions récentes
3. Vérifiez les adresses IP et les horaires de connexion

### Gestion des Utilisateurs

1. **Supprimer un utilisateur** : Firebase Console > Authentication > Users
2. **Réinitialiser un mot de passe** : Firebase Console > Authentication > Users
3. **Désactiver un utilisateur** : Firebase Console > Authentication > Users

## 📞 Support

En cas de problème :

1. Vérifiez les logs de la console du navigateur
2. Vérifiez les logs Firebase dans la console Google Cloud
3. Consultez la documentation Firebase Auth
4. Vérifiez la configuration du projet Firebase

---

**Note :** Ce système d'authentification est conçu pour un usage personnel/administratif. Pour un usage en production avec plusieurs utilisateurs, considérez l'ajout de rôles et permissions plus granulaires.
