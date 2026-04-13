import { collection, doc, getDoc, setDoc, onSnapshot, Timestamp, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { FeaturedContent, Cheese } from '@/types';

// Collection et document constants
const FEATURED_CONTENT_COLLECTION = 'featuredContent';
const FEATURED_CONTENT_DOC = 'sections';
const CHEESES_COLLECTION = 'fromages';

/**
 * Récupère tous les fromages disponibles
 */
export const getAllCheeses = async (): Promise<Cheese[]> => {
  try {
    const cheesesRef = collection(db, CHEESES_COLLECTION);
    const snapshot = await getDocs(cheesesRef);
    
    const cheeses: Cheese[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      // Validation des données essentielles
      if (data.nom && data.origine) {
        cheeses.push({ id: doc.id, ...data } as Cheese);
      } else {
        console.warn(`⚠️ Fromage ${doc.id} ignoré: données incomplètes`, data);
      }
    });
    
    console.log(`📋 ${cheeses.length} fromages récupérés sur ${snapshot.size} documents`);
    return cheeses;
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des fromages:', error);
    throw new Error(`Impossible de récupérer les fromages: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
  }
};

/**
 * Récupère le contenu mis en avant
 */
export const getFeaturedContent = async (): Promise<FeaturedContent> => {
  try {
    const docRef = doc(db, FEATURED_CONTENT_COLLECTION, FEATURED_CONTENT_DOC);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data() as FeaturedContent;
      console.log('📋 FeaturedContent récupéré:', data);
      return data;
    } else {
      console.log('📋 Aucun contenu mis en avant trouvé, retour des valeurs par défaut');
      return getDefaultFeaturedContent();
    }
  } catch (error) {
    console.error('❌ Erreur lors de la récupération du contenu mis en avant:', error);
    return getDefaultFeaturedContent();
  }
};

/**
 * Écoute les changements du contenu mis en avant en temps réel
 */
export const subscribeFeaturedContent = (
  callback: (content: FeaturedContent) => void,
  onError?: (error: Error) => void
) => {
  const docRef = doc(db, FEATURED_CONTENT_COLLECTION, FEATURED_CONTENT_DOC);
  
  return onSnapshot(
    docRef, 
    (doc) => {
      if (doc.exists()) {
        const data = doc.data() as FeaturedContent;
        console.log('🔄 Mise à jour temps réel du contenu mis en avant:', data);
        callback(data);
      } else {
        console.log('🔄 Document non trouvé, utilisation des valeurs par défaut');
        callback(getDefaultFeaturedContent());
      }
    },
    (error) => {
      console.error('❌ Erreur d\'écoute temps réel:', error);
      if (onError) {
        onError(error);
      } else {
        callback(getDefaultFeaturedContent());
      }
    }
  );
};

/**
 * Met à jour tout le contenu mis en avant
 */
export const updateFeaturedContent = async (
  content: FeaturedContent,
  updatedBy: string = 'admin'
): Promise<void> => {
  try {
    const docRef = doc(db, FEATURED_CONTENT_COLLECTION, FEATURED_CONTENT_DOC);
    
    // Validation des données avant sauvegarde
    if (!content.cheeseOfTheWeek && !content.trendingCheeses && !content.newCheeses) {
      throw new Error('Aucun contenu à sauvegarder');
    }
    
    // Ajouter les métadonnées à chaque section
    const updatedContent: FeaturedContent = {};
    const now = Timestamp.now();
    
    if (content.cheeseOfTheWeek) {
      // Validation du fromage de la semaine
      if (!content.cheeseOfTheWeek.cheeseId && content.cheeseOfTheWeek.active) {
        throw new Error('Un fromage doit être sélectionné pour la section "Fromage de la semaine"');
      }
      
      updatedContent.cheeseOfTheWeek = {
        ...content.cheeseOfTheWeek,
        updatedAt: now,
        updatedBy
      };
    }
    
    if (content.trendingCheeses) {
      // Validation des tendances
      if (content.trendingCheeses.cheeseIds.length > content.trendingCheeses.maxCount) {
        throw new Error(`Trop de fromages sélectionnés pour les tendances (max: ${content.trendingCheeses.maxCount})`);
      }
      
      updatedContent.trendingCheeses = {
        ...content.trendingCheeses,
        updatedAt: now,
        updatedBy
      };
    }
    
    if (content.newCheeses) {
      // Validation des nouveautés
      if (content.newCheeses.cheeseIds.length > content.newCheeses.maxCount) {
        throw new Error(`Trop de fromages sélectionnés pour les nouveautés (max: ${content.newCheeses.maxCount})`);
      }
      
      updatedContent.newCheeses = {
        ...content.newCheeses,
        updatedAt: now,
        updatedBy
      };
    }

    await setDoc(docRef, updatedContent, { merge: true });
    console.log('✅ Contenu mis en avant mis à jour avec succès');
  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour du contenu:', error);
    throw new Error(`Erreur de sauvegarde: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
  }
};

/**
 * Initialise le document avec les valeurs par défaut
 */
export const initializeFeaturedContent = async (): Promise<void> => {
  try {
    const docRef = doc(db, FEATURED_CONTENT_COLLECTION, FEATURED_CONTENT_DOC);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      await setDoc(docRef, getDefaultFeaturedContent());
      console.log('✅ Contenu mis en avant initialisé');
    }
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation:', error);
    throw error;
  }
};

/**
 * Retourne les valeurs par défaut
 */
function getDefaultFeaturedContent(): FeaturedContent {
  const now = Timestamp.now();
  
  return {
    cheeseOfTheWeek: {
      id: 'cheese-of-week',
      title: 'Fromage de la semaine',
      subtitle: 'Notre sélection hebdomadaire',
      cheeseId: '',
      active: true,
      updatedAt: now,
      updatedBy: 'system'
    },
    trendingCheeses: {
      id: 'trending',
      title: 'Tendances du moment',
      subtitle: 'Les fromages qui font sensation',
      cheeseIds: [],
      maxCount: 6,
      active: true,
      updatedAt: now,
      updatedBy: 'system'
    },
    newCheeses: {
      id: 'new-arrivals',
      title: 'Nouveautés',
      subtitle: 'Fraîchement ajoutés à notre sélection',
      cheeseIds: [],
      maxCount: 6,
      active: true,
      updatedAt: now,
      updatedBy: 'system'
    }
  };
}
