/**
 * Script de test pour vérifier la connexion Firebase et les données
 * 
 * Usage: node scripts/test-firebase-connection.js
 */

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');

// Configuration Firebase (même que dans l'app)
const firebaseConfig = {
  apiKey: 'AIzaSyBaDW0qIihCjDLoHMi6ycnnNWhGLIXzou0',
  authDomain: 'fromiz-mobile.firebaseapp.com',
  projectId: 'fromiz-mobile',
  storageBucket: 'fromiz-mobile.appspot.com',
  messagingSenderId: '943258683727',
  appId: '1:943258683727:web:bb5df16c6cedfb77849d3a',
};

async function testFirebaseConnection() {
  try {
    console.log('🔍 Test de connexion Firebase...');
    
    // Initialiser Firebase
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    
    console.log('✅ Firebase initialisé avec succès');
    console.log('📊 Projet ID:', firebaseConfig.projectId);
    
    // Tester la connexion en récupérant les fromages
    console.log('\n🧀 Test de récupération des fromages...');
    
    const cheesesRef = collection(db, 'fromages');
    console.log('📁 Collection "fromages" référencée');
    
    const snapshot = await getDocs(cheesesRef);
    console.log(`📊 Nombre de documents trouvés: ${snapshot.size}`);
    
    if (snapshot.size === 0) {
      console.log('⚠️  Aucun fromage trouvé dans la collection "fromages"');
      console.log('💡 Vérifiez que:');
      console.log('   - La collection "fromages" existe dans Firebase Console');
      console.log('   - Les règles de sécurité permettent la lecture');
      console.log('   - Des données ont été ajoutées à la collection');
    } else {
      console.log('\n📋 Premiers fromages trouvés:');
      snapshot.docs.slice(0, 3).forEach((doc, index) => {
        const data = doc.data();
        console.log(`   ${index + 1}. ${doc.id}: ${data.nom || 'Sans nom'} (${data.origine || 'Sans origine'})`);
      });
      
      // Vérifier la structure des données
      console.log('\n🔍 Structure des données:');
      const firstDoc = snapshot.docs[0];
      const firstData = firstDoc.data();
      console.log('   Champs disponibles:', Object.keys(firstData));
      
      // Vérifier les champs requis
      const requiredFields = ['nom', 'origine'];
      const missingFields = requiredFields.filter(field => !firstData[field]);
      
      if (missingFields.length > 0) {
        console.log('⚠️  Champs manquants:', missingFields);
      } else {
        console.log('✅ Tous les champs requis sont présents');
      }
    }
    
    // Tester aussi la collection featuredContent
    console.log('\n🎯 Test de la collection "featuredContent"...');
    
    try {
      const featuredRef = collection(db, 'featuredContent');
      const featuredSnapshot = await getDocs(featuredRef);
      console.log(`📊 Documents dans "featuredContent": ${featuredSnapshot.size}`);
      
      if (featuredSnapshot.size > 0) {
        featuredSnapshot.docs.forEach(doc => {
          console.log(`   - ${doc.id}: ${Object.keys(doc.data()).join(', ')}`);
        });
      }
    } catch (error) {
      console.log('⚠️  Erreur lors de la lecture de "featuredContent":', error.message);
    }
    
  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
    
    if (error.code === 'permission-denied') {
      console.log('\n💡 Erreur de permissions - Vérifiez les règles de sécurité Firestore:');
      console.log('   1. Allez sur Firebase Console > Firestore Database > Rules');
      console.log('   2. Assurez-vous que les règles permettent la lecture:');
      console.log('      allow read: if true; // Temporaire pour le test');
    } else if (error.code === 'unavailable') {
      console.log('\n💡 Service indisponible - Vérifiez votre connexion internet');
    } else {
      console.log('\n💡 Erreur inconnue - Vérifiez la configuration Firebase');
    }
  }
}

// Exécuter le test
testFirebaseConnection()
  .then(() => {
    console.log('\n🏁 Test terminé.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Erreur fatale:', error);
    process.exit(1);
  });
