# Fromiz Admin Panel

Panel d'administration web pour gérer le contenu mis en avant dans l'application mobile Fromiz.

## 🚀 Démarrage rapide

1. **Installation des dépendances**
   ```bash
   npm install
   ```

2. **Lancement en développement**
   ```bash
   npm run dev
   ```

3. **Accès au panel**
   - Ouvrir http://localhost:3000 dans votre navigateur

## 📋 Fonctionnalités

### 🏆 Fromage de la semaine
- Sélection du fromage mis en avant sur l'écran d'accueil
- Personnalisation du titre et sous-titre
- Activation/désactivation de la section

### 📈 Tendances du moment  
- Sélection de jusqu'à 6 fromages pour la section tendances
- Affichage dans la page de recherche de l'app mobile
- Gestion des titres personnalisés

### ✨ Nouveautés
- Sélection de jusqu'à 6 fromages pour les nouveautés
- Affichage dans la page de recherche de l'app mobile  
- Contrôle total du contenu affiché

## 🔧 Architecture technique

- **Framework**: Next.js 14 avec App Router
- **Styling**: Tailwind CSS
- **Base de données**: Firebase Firestore
- **Formulaires**: React Hook Form
- **Déploiement**: Vercel (recommandé)

## 📱 Intégration avec l'app mobile

Les modifications effectuées dans ce panel sont automatiquement synchronisées en temps réel avec l'application mobile React Native via Firebase Firestore.

### Sections gérées
- `HomeScreen.tsx` : Fromage de la semaine
- `SearchScreen.tsx` : Tendances du moment et Nouveautés

## 🔒 Sécurité

⚠️ **Important**: Ce panel n'inclut pas d'authentification par défaut. Pour un déploiement en production, ajoutez :

- Authentification Firebase Auth
- Règles de sécurité Firestore
- Variables d'environnement pour la configuration Firebase

## 📦 Déploiement

### Vercel (Recommandé)
```bash
# Connecter à Vercel
npx vercel

# Déployer
npx vercel --prod
```

### Variables d'environnement
Créer un fichier `.env.local` :
```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
# ... autres variables Firebase
```

## 🛠️ Développement

### Structure du projet
```
src/
├── app/
│   └── page.tsx              # Page principale
├── components/
│   ├── AdminPanel.tsx        # Composant principal
│   ├── CheeseSelector.tsx    # Sélecteur de fromages
│   ├── SectionCard.tsx       # Carte de section
│   ├── LoadingSpinner.tsx    # Spinner de chargement
│   └── SaveButton.tsx        # Bouton de sauvegarde
├── lib/
│   └── firebase.ts           # Configuration Firebase
├── services/
│   └── featuredContentService.ts  # Service Firestore
└── types/
    └── index.ts              # Types TypeScript
```

### Commandes utiles
```bash
# Développement
npm run dev

# Build de production
npm run build

# Démarrage en production
npm start

# Linting
npm run lint
```

## 📝 Notes de développement

- Les images des fromages sont chargées depuis Firestore
- Un placeholder SVG est utilisé pour les fromages sans image
- La recherche de fromages fonctionne par nom et origine
- La sélection multiple est limitée à 6 éléments maximum
- Les modifications sont sauvegardées instantanément dans Firestore

## 🐛 Dépannage

### Erreurs communes

1. **Erreur de connexion Firebase**
   - Vérifier la configuration dans `src/lib/firebase.ts`
   - S'assurer que les règles Firestore permettent la lecture/écriture

2. **Images non chargées**
   - Vérifier les URLs des images dans Firestore
   - Le placeholder SVG s'affiche si l'image est manquante

3. **Données non synchronisées**
   - Vérifier la console du navigateur pour les erreurs
   - S'assurer que l'app mobile utilise les mêmes hooks `useFeaturedContent`

## 📞 Support

Pour toute question ou problème, vérifier :
- Les logs de la console navigateur
- Les logs Firebase dans la console Google Cloud
- La structure des documents Firestore