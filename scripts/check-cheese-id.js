const { initializeApp } = require('firebase/app');
const { getFirestore, doc, getDoc, collection, getDocs } = require('firebase/firestore');

// Configuration Firebase
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

async function checkCheeseId() {
  try {
    console.log('🔍 Vérification de l\'ID fromage...');
    
    // Vérifier si l'ID spécifique existe
    const cheeseRef = doc(db, 'fromages', 'cheddar_en_grains');
    const cheeseSnap = await getDoc(cheeseRef);
    
    if (cheeseSnap.exists()) {
      const cheese = cheeseSnap.data();
      console.log('✅ Fromage trouvé:');
      console.log('  - Nom:', cheese.nom);
      console.log('  - Origine:', cheese.origine);
      console.log('  - Image:', cheese.imageUrl);
    } else {
      console.log('❌ Fromage avec ID "cheddar_en_grains" non trouvé');
      
      // Chercher des fromages contenant "cheddar" dans le nom
      console.log('\n🔍 Recherche de fromages contenant "cheddar"...');
      const fromagesRef = collection(db, 'fromages');
      const fromagesSnap = await getDocs(fromagesRef);
      
      const cheddarCheeses = [];
      fromagesSnap.forEach(doc => {
        const data = doc.data();
        if (data.nom && data.nom.toLowerCase().includes('cheddar')) {
          cheddarCheeses.push({
            id: doc.id,
            nom: data.nom,
            origine: data.origine
          });
        }
      });
      
      if (cheddarCheeses.length > 0) {
        console.log('📋 Fromages cheddar trouvés:');
        cheddarCheeses.forEach(cheese => {
          console.log(`  - ${cheese.id}: ${cheese.nom} (${cheese.origine})`);
        });
      } else {
        console.log('❌ Aucun fromage cheddar trouvé');
      }
    }
  } catch (error) {
    console.error('❌ Erreur:', error);
  }
}

checkCheeseId();
