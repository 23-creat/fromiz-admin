/**
 * Script pour configurer les règles de sécurité Firebase et initialiser les données
 * 
 * Usage: node scripts/setup-firebase-rules.js
 */

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, doc, setDoc, getDoc } = require('firebase/firestore');

// Configuration Firebase
const firebaseConfig = {
  apiKey: 'AIzaSyBaDW0qIihCjDLoHMi6ycnnNWhGLIXzou0',
  authDomain: 'fromiz-mobile.firebaseapp.com',
  projectId: 'fromiz-mobile',
  storageBucket: 'fromiz-mobile.appspot.com',
  messagingSenderId: '943258683727',
  appId: '1:943258683727:web:bb5df16c6cedfb77849d3a',
};

async function setupFirebase() {
  try {
    console.log('🔧 Configuration de Firebase...');
    
    // Initialiser Firebase
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    
    console.log('✅ Firebase initialisé');
    
    // Créer le document featuredContent avec des valeurs par défaut
    console.log('\n📝 Création du document featuredContent...');
    
    const featuredContentRef = doc(db, 'featuredContent', 'sections');
    const featuredContentSnap = await getDoc(featuredContentRef);
    
    if (!featuredContentSnap.exists()) {
      const defaultContent = {
        cheeseOfTheWeek: {
          id: 'cheese-of-week',
          title: 'Fromage de la semaine',
          subtitle: 'Notre sélection hebdomadaire',
          cheeseId: '',
          active: true,
          updatedAt: new Date(),
          updatedBy: 'system'
        },
        trendingCheeses: {
          id: 'trending',
          title: 'Tendances du moment',
          subtitle: 'Les fromages qui font sensation',
          cheeseIds: [],
          maxCount: 6,
          active: true,
          updatedAt: new Date(),
          updatedBy: 'system'
        },
        newCheeses: {
          id: 'new-arrivals',
          title: 'Nouveautés',
          subtitle: 'Fraîchement ajoutés à notre sélection',
          cheeseIds: [],
          maxCount: 6,
          active: true,
          updatedAt: new Date(),
          updatedBy: 'system'
        }
      };
      
      await setDoc(featuredContentRef, defaultContent);
      console.log('✅ Document featuredContent créé avec les valeurs par défaut');
    } else {
      console.log('ℹ️  Document featuredContent existe déjà');
    }
    
    // Tester la lecture des fromages
    console.log('\n🧀 Test de lecture des fromages...');
    const cheesesRef = collection(db, 'fromages');
    const cheesesSnapshot = await getDocs(cheesesRef);
    console.log(`✅ ${cheesesSnapshot.size} fromages accessibles`);
    
    // Afficher les règles de sécurité recommandées
    console.log('\n🔒 Règles de sécurité recommandées:');
    console.log('Allez sur Firebase Console > Firestore Database > Rules');
    console.log('Remplacez les règles par:');
    console.log(`
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Fromages - Lecture pour tous les utilisateurs connectés
    match /fromages/{document} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
    
    // Contenu mis en avant - Lecture pour tous, écriture pour les utilisateurs connectés
    match /featuredContent/{document} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
    
    // Utilisateurs - Accès restreint aux propriétaires
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      match /{subcollection=**} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}
    `);
    
    console.log('\n✅ Configuration terminée !');
    console.log('💡 Prochaines étapes:');
    console.log('   1. Mettez à jour les règles de sécurité dans Firebase Console');
    console.log('   2. Relancez le panneau d\'administration');
    console.log('   3. Les fromages devraient maintenant s\'afficher');
    
  } catch (error) {
    console.error('❌ Erreur lors de la configuration:', error);
    
    if (error.code === 'permission-denied') {
      console.log('\n💡 Erreur de permissions:');
      console.log('   - Les règles de sécurité Firebase empêchent l\'écriture');
      console.log('   - Allez sur Firebase Console > Firestore Database > Rules');
      console.log('   - Activez temporairement: allow read, write: if true;');
      console.log('   - Puis remplacez par les règles recommandées ci-dessus');
    }
  }
}

// Exécuter la configuration
setupFirebase()
  .then(() => {
    console.log('\n🏁 Script terminé.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Erreur fatale:', error);
    process.exit(1);
  });
