const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc, Timestamp } = require('firebase/firestore');

// Configuration Firebase (même que dans l'app)
const firebaseConfig = {
  apiKey: 'AIzaSyBaDW0qIihCjDLoHMi6ycnnNWhGLIXzou0',
  authDomain: 'fromiz-mobile.firebaseapp.com',
  projectId: 'fromiz-mobile',
  storageBucket: 'fromiz-mobile.appspot.com',
  messagingSenderId: '943258683727',
  appId: '1:943258683727:web:bb5df16c6cedfb77849d3a',
};

// Initialiser Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function initializeFeaturedContent() {
  try {
    console.log('🚀 Initialisation du contenu mis en avant...');

    const now = Timestamp.now();
    const defaultContent = {
      cheeseOfTheWeek: {
        id: 'cheese-of-week',
        title: 'Fromage de la semaine',
        subtitle: 'Notre sélection hebdomadaire',
        cheeseId: '', // Sera défini via l'admin panel
        active: true,
        updatedAt: now,
        updatedBy: 'init-script'
      },
      trendingCheeses: {
        id: 'trending',
        title: 'Tendances du moment',
        subtitle: 'Les fromages qui font sensation',
        cheeseIds: [], // Sera défini via l'admin panel
        maxCount: 6,
        active: true,
        updatedAt: now,
        updatedBy: 'init-script'
      },
      newCheeses: {
        id: 'new-arrivals',
        title: 'Nouveautés',
        subtitle: 'Fraîchement ajoutés à notre sélection',
        cheeseIds: [], // Sera défini via l'admin panel
        maxCount: 6,
        active: true,
        updatedAt: now,
        updatedBy: 'init-script'
      }
    };

    const docRef = doc(db, 'featuredContent', 'sections');
    await setDoc(docRef, defaultContent);

    console.log('✅ Contenu mis en avant initialisé avec succès !');
    console.log('📋 Document créé: featuredContent/sections');
    console.log('🎯 Vous pouvez maintenant utiliser le panel d\'administration');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation:', error);
    process.exit(1);
  }
}

initializeFeaturedContent();
