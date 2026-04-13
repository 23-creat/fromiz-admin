// Script pour initialiser les collections Firebase pour les actualités Fromiznews
const admin = require('firebase-admin');

// Configuration Firebase Admin SDK
const serviceAccount = require('./firebase-service-account.json'); // Vous devez avoir ce fichier

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'fromiz-mobile', // Remplacez par votre project ID
});

const db = admin.firestore();

/**
 * Initialise la collection newsConfig avec une configuration par défaut
 */
async function initializeNewsConfig() {
  try {
    const configRef = db.collection('newsConfig').doc('config');
    const configSnap = await configRef.get();
    
    if (!configSnap.exists) {
      const defaultConfig = {
        maxDisplayCount: 3,
        showFeaturedOnly: false,
        active: true,
        updatedAt: admin.firestore.Timestamp.now(),
        updatedBy: 'admin-script',
      };
      
      await configRef.set(defaultConfig);
      console.log('✅ Configuration des actualités créée avec succès');
    } else {
      console.log('ℹ️  Configuration des actualités existe déjà');
    }
  } catch (error) {
    console.error('❌ Erreur lors de la création de la configuration:', error);
  }
}

/**
 * Crée quelques actualités d'exemple pour tester
 */
async function createSampleNews() {
  try {
    const newsRef = db.collection('fromiznews');
    const sampleNews = [
      {
        title: 'Nouvelle découverte : Le fromage de chèvre aux herbes de Provence',
        summary: 'Un fromager français vient de créer une recette unique combinant les saveurs méditerranéennes avec la douceur du lait de chèvre.',
        content: 'Cette innovation culinaire marque un tournant dans l\'art fromager français. Le fromager Jean-Pierre Dubois, installé dans les Alpes-de-Haute-Provence, a développé cette recette après 3 ans de recherche. Le fromage est affiné pendant 6 semaines dans des caves naturelles, ce qui lui confère une texture crémeuse et un goût délicat.',
        imageUrl: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        category: 'découverte',
        publishDate: admin.firestore.Timestamp.fromDate(new Date()),
        author: 'Fromiz News',
        featured: true,
        active: true,
        createdAt: admin.firestore.Timestamp.now(),
        updatedAt: admin.firestore.Timestamp.now(),
        updatedBy: 'admin-script',
      },
      {
        title: 'Festival du Fromage de Lyon 2024 : Les inscriptions sont ouvertes',
        summary: 'Le plus grand festival fromager de France revient du 15 au 17 mars 2024 avec plus de 200 exposants et des dégustations exceptionnelles.',
        content: 'Le Festival du Fromage de Lyon, événement incontournable pour tous les amateurs de fromage, annonce son retour pour 2024. Cette édition promet d\'être exceptionnelle avec la participation de fromagers venus de toute la France et d\'Europe. Au programme : dégustations, ateliers, conférences et concours de fromages.',
        imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        category: 'événement',
        publishDate: admin.firestore.Timestamp.fromDate(new Date()),
        author: 'Fromiz News',
        featured: false,
        active: true,
        createdAt: admin.firestore.Timestamp.now(),
        updatedAt: admin.firestore.Timestamp.now(),
        updatedBy: 'admin-script',
      },
      {
        title: 'Conseil dégustation : Comment bien choisir un fromage de saison',
        summary: 'Nos experts vous donnent leurs conseils pour sélectionner les meilleurs fromages selon les saisons et profiter pleinement de leurs saveurs.',
        content: 'Chaque saison apporte ses propres fromages avec des caractéristiques uniques. En hiver, privilégiez les fromages à pâte pressée comme le Comté ou le Beaufort. Au printemps, découvrez les fromages de chèvre frais. L\'été est parfait pour les fromages à pâte molle comme le Camembert, et l\'automne révélera les fromages bleus comme le Roquefort.',
        imageUrl: 'https://images.unsplash.com/photo-1559564484-0c0b4a0b0b0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        category: 'conseil',
        publishDate: admin.firestore.Timestamp.fromDate(new Date()),
        author: 'Fromiz News',
        featured: false,
        active: true,
        createdAt: admin.firestore.Timestamp.now(),
        updatedAt: admin.firestore.Timestamp.now(),
        updatedBy: 'admin-script',
      },
    ];

    // Vérifier si des actualités existent déjà
    const existingNews = await newsRef.limit(1).get();
    
    if (existingNews.empty) {
      for (const news of sampleNews) {
        await newsRef.add(news);
      }
      console.log('✅ Actualités d\'exemple créées avec succès');
    } else {
      console.log('ℹ️  Des actualités existent déjà, pas de création d\'exemples');
    }
  } catch (error) {
    console.error('❌ Erreur lors de la création des actualités d\'exemple:', error);
  }
}

/**
 * Fonction principale
 */
async function initializeFromizActu() {
  console.log('🚀 Initialisation des collections Fromiznews...');
  
  await initializeNewsConfig();
  await createSampleNews();
  
  console.log('✅ Initialisation terminée !');
  console.log('');
  console.log('📋 Collections créées :');
  console.log('   - fromiznews (actualités)');
  console.log('   - newsConfig (configuration)');
  console.log('');
  console.log('🎯 Prochaines étapes :');
  console.log('   1. Ajoutez les règles de sécurité Firebase');
  console.log('   2. Testez l\'application mobile');
  console.log('   3. Utilisez le panneau admin pour gérer les actualités');
  
  process.exit(0);
}

// Exécuter le script
initializeFromizActu().catch(console.error);
