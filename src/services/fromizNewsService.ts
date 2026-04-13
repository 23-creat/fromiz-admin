import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  Timestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { FromizActu, NewsConfig } from '@/types';

const FROMIZNEWS_COLLECTION = 'fromiznews';
const NEWSCONFIG_COLLECTION = 'newsConfig';
const NEWSCONFIG_DOC = 'config';

/**
 * Service pour gérer les actualités Fromiznews dans l'admin panel
 */
export class AdminFromizActuService {
  
  /**
   * Récupère toutes les actualités
   */
  static async getAllNews(): Promise<FromizActu[]> {
    try {
      const newsRef = collection(db, FROMIZNEWS_COLLECTION);
      const q = query(newsRef, orderBy('publishDate', 'desc'));
      
      const snapshot = await getDocs(q);
      const news: FromizActu[] = [];
      
      snapshot.forEach((doc) => {
        const data = doc.data();
        news.push({
          id: doc.id,
          ...data,
          publishDate: data.publishDate?.toDate() || new Date(),
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as FromizActu);
      });
      
      console.log(`📰 ${news.length} actualités récupérées pour l'admin`);
      return news;
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des actualités:', error);
      throw new Error(`Impossible de récupérer les actualités: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  }

  /**
   * Récupère une actualité par son ID
   */
  static async getNewsById(id: string): Promise<FromizActu | null> {
    try {
      const newsRef = doc(db, FROMIZNEWS_COLLECTION, id);
      const newsSnap = await getDoc(newsRef);
      
      if (newsSnap.exists()) {
        const data = newsSnap.data();
        return {
          id: newsSnap.id,
          ...data,
          publishDate: data.publishDate?.toDate() || new Date(),
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as FromizActu;
      }
      
      return null;
    } catch (error) {
      console.error('❌ Erreur lors de la récupération de l\'actualité:', error);
      throw new Error(`Impossible de récupérer l'actualité: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  }

  /**
   * Récupère la configuration des actualités
   */
  static async getNewsConfig(): Promise<NewsConfig | null> {
    try {
      const configRef = doc(db, NEWSCONFIG_COLLECTION, NEWSCONFIG_DOC);
      const configSnap = await getDoc(configRef);
      
      if (configSnap.exists()) {
        const data = configSnap.data();
        return {
          ...data,
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as NewsConfig;
      }
      
      // Créer une configuration par défaut si elle n'existe pas
      const defaultConfig: NewsConfig = {
        maxDisplayCount: 3,
        showFeaturedOnly: false,
        active: true,
        updatedAt: new Date(),
        updatedBy: 'admin',
      };
      
      await this.updateNewsConfig(defaultConfig);
      return defaultConfig;
    } catch (error) {
      console.error('❌ Erreur lors de la récupération de la configuration:', error);
      return null;
    }
  }

  /**
   * Met à jour la configuration des actualités
   */
  static async updateNewsConfig(config: Partial<NewsConfig>, updatedBy: string = 'admin'): Promise<void> {
    try {
      const configRef = doc(db, NEWSCONFIG_COLLECTION, NEWSCONFIG_DOC);
      const now = Timestamp.now();
      
      await updateDoc(configRef, {
        ...config,
        updatedAt: now,
        updatedBy,
      });
      
      console.log('✅ Configuration des actualités mise à jour');
    } catch (error) {
      console.error('❌ Erreur lors de la mise à jour de la configuration:', error);
      throw new Error(`Erreur de sauvegarde: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  }

  /**
   * Crée une nouvelle actualité
   */
  static async createNews(news: Omit<FromizActu, 'id' | 'createdAt' | 'updatedAt'>, createdBy: string = 'admin'): Promise<string> {
    try {
      // Validation des données
      if (!news.title || !news.summary || !news.content) {
        throw new Error('Le titre, le résumé et le contenu sont obligatoires');
      }
      
      if (!news.imageUrl) {
        throw new Error('L\'image est obligatoire');
      }
      
      const newsRef = collection(db, FROMIZNEWS_COLLECTION);
      const now = Timestamp.now();
      
      const docRef = await addDoc(newsRef, {
        ...news,
        publishDate: Timestamp.fromDate(news.publishDate),
        createdAt: now,
        updatedAt: now,
        updatedBy: createdBy,
      });
      
      console.log('✅ Actualité créée avec succès:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('❌ Erreur lors de la création de l\'actualité:', error);
      throw new Error(`Erreur de création: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  }

  /**
   * Met à jour une actualité existante
   */
  static async updateNews(id: string, updates: Partial<FromizActu>, updatedBy: string = 'admin'): Promise<void> {
    try {
      const newsRef = doc(db, FROMIZNEWS_COLLECTION, id);
      const now = Timestamp.now();
      
      const updateData: any = {
        ...updates,
        updatedAt: now,
        updatedBy,
      };
      
      // Convertir les dates si nécessaire
      if (updates.publishDate) {
        updateData.publishDate = Timestamp.fromDate(updates.publishDate);
      }
      
      await updateDoc(newsRef, updateData);
      
      console.log('✅ Actualité mise à jour avec succès:', id);
    } catch (error) {
      console.error('❌ Erreur lors de la mise à jour de l\'actualité:', error);
      throw new Error(`Erreur de mise à jour: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  }

  /**
   * Supprime une actualité
   */
  static async deleteNews(id: string): Promise<void> {
    try {
      const newsRef = doc(db, FROMIZNEWS_COLLECTION, id);
      await deleteDoc(newsRef);
      
      console.log('✅ Actualité supprimée avec succès:', id);
    } catch (error) {
      console.error('❌ Erreur lors de la suppression de l\'actualité:', error);
      throw new Error(`Erreur de suppression: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  }

  /**
   * Duplique une actualité existante
   */
  static async duplicateNews(id: string, createdBy: string = 'admin'): Promise<string> {
    try {
      const originalNews = await this.getNewsById(id);
      if (!originalNews) {
        throw new Error('Actualité introuvable');
      }
      
      const duplicatedNews = {
        ...originalNews,
        title: `${originalNews.title} (Copie)`,
        publishDate: new Date(),
        featured: false,
        active: false,
      };
      
      delete (duplicatedNews as any).id;
      delete (duplicatedNews as any).createdAt;
      delete (duplicatedNews as any).updatedAt;
      
      return await this.createNews(duplicatedNews, createdBy);
    } catch (error) {
      console.error('❌ Erreur lors de la duplication de l\'actualité:', error);
      throw new Error(`Erreur de duplication: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  }
}
