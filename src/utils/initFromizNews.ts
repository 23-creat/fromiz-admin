// Script simple pour initialiser les collections Firebase pour les actualités Fromiznews
// Ce script utilise le SDK Firebase client et peut être exécuté depuis le navigateur

import {
  collection,
  doc, 
  setDoc, 
  getDoc, 
  addDoc, 
  getDocs,
  Timestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

/**
 * Initialise la collection newsConfig avec une configuration par défaut
 */
export async function initializeNewsConfig() {
  try {
    const configRef = doc(db, 'newsConfig', 'config');
    const configSnap = await getDoc(configRef);
    
    if (!configSnap.exists()) {
      const defaultConfig = {
        maxDisplayCount: 3,
        showFeaturedOnly: false,
        active: true,
        updatedAt: Timestamp.now(),
        updatedBy: 'admin-script',
      };
      
      await setDoc(configRef, defaultConfig);
      console.log('✅ Configuration des actualités créée avec succès');
      return true;
    } else {
      console.log('ℹ️  Configuration des actualités existe déjà');
      return false;
    }
  } catch (error) {
    console.error('❌ Erreur lors de la création de la configuration:', error);
    throw error;
  }
}

/**
 * Crée quelques actualités d'exemple pour tester
 */
export async function createSampleNews() {
  try {
    const newsRef = collection(db, 'fromiznews');
    
    // Vérifier si des actualités existent déjà
    const existingNews = await getDocs(newsRef);
    
    if (existingNews.empty) {
      const sampleNews = [
        {
          title: 'Nouvelle découverte : Le fromage de chèvre aux herbes de Provence',
          summary: 'Un fromager français vient de créer une recette unique combinant les saveurs méditerranéennes avec la douceur du lait de chèvre.',
          content: 'Cette innovation culinaire marque un tournant dans l\'art fromager français. Le fromager Jean-Pierre Dubois, installé dans les Alpes-de-Haute-Provence, a développé cette recette après 3 ans de recherche. Le fromage est affiné pendant 6 semaines dans des caves naturelles, ce qui lui confère une texture crémeuse et un goût délicat.',
          imageUrl: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          category: 'découverte',
          publishDate: Timestamp.now(),
          author: 'Fromiz News',
          featured: true,
          active: true,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
          updatedBy: 'admin-script',
        },
        {
          title: 'Festival du Fromage de Lyon 2024 : Les inscriptions sont ouvertes',
          summary: 'Le plus grand festival fromager de France revient du 15 au 17 mars 2024 avec plus de 200 exposants et des dégustations exceptionnelles.',
          content: 'Le Festival du Fromage de Lyon, événement incontournable pour tous les amateurs de fromage, annonce son retour pour 2024. Cette édition promet d\'être exceptionnelle avec la participation de fromagers venus de toute la France et d\'Europe. Au programme : dégustations, ateliers, conférences et concours de fromages.',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          category: 'événement',
          publishDate: Timestamp.now(),
          author: 'Fromiz News',
          featured: false,
          active: true,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
          updatedBy: 'admin-script',
        },
        {
          title: 'Conseil dégustation : Comment bien choisir un fromage de saison',
          summary: 'Nos experts vous donnent leurs conseils pour sélectionner les meilleurs fromages selon les saisons et profiter pleinement de leurs saveurs.',
          content: 'Chaque saison apporte ses propres fromages avec des caractéristiques uniques. En hiver, privilégiez les fromages à pâte pressée comme le Comté ou le Beaufort. Au printemps, découvrez les fromages de chèvre frais. L\'été est parfait pour les fromages à pâte molle comme le Camembert, et l\'automne révélera les fromages bleus comme le Roquefort.',
          imageUrl: 'https://images.unsplash.com/photo-1559564484-0c0b4a0b0b0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          category: 'conseil',
          publishDate: Timestamp.now(),
          author: 'Fromiz News',
          featured: false,
          active: true,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
          updatedBy: 'admin-script',
        },
      ];

      for (const news of sampleNews) {
        await addDoc(newsRef, news);
      }
      console.log('✅ Actualités d\'exemple créées avec succès');
      return true;
    } else {
      console.log('ℹ️  Des actualités existent déjà, pas de création d\'exemples');
      return false;
    }
  } catch (error) {
    console.error('❌ Erreur lors de la création des actualités d\'exemple:', error);
    throw error;
  }
}

/**
 * Fonction principale pour initialiser les collections
 */
export async function initializeFromizActu() {
  try {
    console.log('🚀 Initialisation des collections Fromiznews...');
    
    const configCreated = await initializeNewsConfig();
    const newsCreated = await createSampleNews();
    
    console.log('✅ Initialisation terminée !');
    console.log('');
    console.log('📋 Collections créées :');
    console.log('   - fromiznews (actualités)');
    console.log('   - newsConfig (configuration)');
    console.log('');
    
    if (configCreated || newsCreated) {
      console.log('🎯 Prochaines étapes :');
      console.log('   1. Ajoutez les règles de sécurité Firebase');
      console.log('   2. Testez l\'application mobile');
      console.log('   3. Utilisez le panneau admin pour gérer les actualités');
    } else {
      console.log('ℹ️  Toutes les collections existent déjà !');
    }
    
    return { success: true, configCreated, newsCreated };
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation:', error);
    return {
      success: false,
      configCreated: false,
      newsCreated: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue',
    };
  }
}
