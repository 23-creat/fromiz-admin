const { initializeApp } = require('firebase/app');
const { getFirestore, doc, getDoc } = require('firebase/firestore');

// Configuration Firebase (même que dans l'app)
const firebaseConfig = {
  apiKey: "AIzaSyBQJQJQJQJQJQJQJQJQJQJQJQJQJQJQJQ",
  authDomain: "fromiz-mobile.firebaseapp.com",
  projectId: "fromiz-mobile",
  storageBucket: "fromiz-mobile.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdefghijklmnop"
};

// Initialiser Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function debugFeaturedContent() {
  try {
    console.log('🔍 Debug du contenu mis en avant...');
    
    const docRef = doc(db, 'featuredContent', 'sections');
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      console.log('📋 Contenu mis en avant trouvé:');
      console.log(JSON.stringify(data, null, 2));
      
      // Vérifier chaque section
      if (data.cheeseOfTheWeek) {
        console.log('\n🧀 Fromage de la semaine:');
        console.log('  - Actif:', data.cheeseOfTheWeek.active);
        console.log('  - ID:', data.cheeseOfTheWeek.cheeseId);
        console.log('  - Titre:', data.cheeseOfTheWeek.title);
      }
      
      if (data.trendingCheeses) {
        console.log('\n📈 Fromages tendance:');
        console.log('  - Actif:', data.trendingCheeses.active);
        console.log('  - IDs:', data.trendingCheeses.cheeseIds);
        console.log('  - Titre:', data.trendingCheeses.title);
      }
      
      if (data.newCheeses) {
        console.log('\n🆕 Nouveaux fromages:');
        console.log('  - Actif:', data.newCheeses.active);
        console.log('  - IDs:', data.newCheeses.cheeseIds);
        console.log('  - Titre:', data.newCheeses.title);
      }
    } else {
      console.log('❌ Aucun contenu mis en avant trouvé');
    }
  } catch (error) {
    console.error('❌ Erreur:', error);
  }
}

debugFeaturedContent();
