/**
 * Script pour créer un utilisateur administrateur dans Firebase Auth
 * 
 * Ce script doit être exécuté une seule fois pour créer le compte administrateur
 * 
 * Usage: node scripts/create-admin-user.js
 */

const { initializeApp } = require('firebase/app');
const { getAuth, createUserWithEmailAndPassword, updateProfile } = require('firebase/auth');

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
const auth = getAuth(app);

async function createAdminUser() {
  try {
    console.log('🔐 Création de l\'utilisateur administrateur...');
    
    // Informations de l'administrateur
    const adminEmail = 'admin@fromiz.com';
    const adminPassword = 'FromizAdmin2024!'; // Mot de passe sécurisé
    const adminDisplayName = 'Administrateur Fromiz';
    
    // Créer l'utilisateur
    const userCredential = await createUserWithEmailAndPassword(auth, adminEmail, adminPassword);
    const user = userCredential.user;
    
    // Mettre à jour le profil
    await updateProfile(user, {
      displayName: adminDisplayName
    });
    
    console.log('✅ Utilisateur administrateur créé avec succès !');
    console.log('📧 Email:', adminEmail);
    console.log('👤 Nom:', adminDisplayName);
    console.log('🆔 UID:', user.uid);
    console.log('');
    console.log('🔑 Informations de connexion:');
    console.log('   Email:', adminEmail);
    console.log('   Mot de passe:', adminPassword);
    console.log('');
    console.log('⚠️  IMPORTANT: Gardez ces informations en sécurité !');
    console.log('⚠️  Changez le mot de passe après la première connexion.');
    
  } catch (error) {
    console.error('❌ Erreur lors de la création de l\'utilisateur:', error);
    
    if (error.code === 'auth/email-already-in-use') {
      console.log('ℹ️  L\'utilisateur administrateur existe déjà.');
      console.log('ℹ️  Vous pouvez vous connecter avec les identifiants existants.');
    } else {
      console.log('💡 Vérifiez votre connexion internet et la configuration Firebase.');
    }
  }
}

// Exécuter le script
createAdminUser()
  .then(() => {
    console.log('🏁 Script terminé.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Erreur fatale:', error);
    process.exit(1);
  });
