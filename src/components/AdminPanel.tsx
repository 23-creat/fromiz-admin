'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { 
  getAllCheeses, 
  getFeaturedContent, 
  updateFeaturedContent,
  initializeFeaturedContent 
} from '@/services/featuredContentService';
import { FeaturedContent, Cheese } from '@/types';
import { CheeseSelector } from './CheeseSelector';
import { SectionCard } from './SectionCard';
import { LoadingSpinner } from './LoadingSpinner';
import { SaveButton } from './SaveButton';
import { UserMenu } from './UserMenu';
import { NewsManager } from './NewsManager';
import { InitFromizNews } from './InitFromizNews';
import Image from 'next/image';

export function AdminPanel() {
  const [cheeses, setCheeses] = useState<Cheese[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showNewsManager, setShowNewsManager] = useState(false);
  const [showInitFromizNews, setShowInitFromizNews] = useState(false);

  const { register, handleSubmit, setValue, watch, reset } = useForm<FeaturedContent>();
  
  const watchedData = watch();

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('🔄 Début du chargement des données...');

        // Charger les fromages d'abord
        console.log('🧀 Chargement des fromages...');
        const cheesesData = await getAllCheeses();
        console.log('✅ Fromages chargés:', cheesesData.length);
        setCheeses(cheesesData);

        // Ensuite charger le contenu mis en avant
        console.log('🎯 Chargement du contenu mis en avant...');
        try {
          await initializeFeaturedContent();
          const featuredData = await getFeaturedContent();
          console.log('✅ Contenu mis en avant chargé:', featuredData);
          reset(featuredData);
        } catch (featuredError) {
          console.warn('⚠️ Erreur lors du chargement du contenu mis en avant:', featuredError);
          // Continuer même si le contenu mis en avant ne se charge pas
          reset({});
        }
        
        console.log('✅ Données chargées avec succès:', { 
          cheeses: cheesesData.length, 
          featured: 'loaded'
        });
      } catch (err) {
        console.error('❌ Erreur de chargement:', err);
        setError(err instanceof Error ? err.message : 'Erreur de chargement');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [reset]);

  const onSubmit = async (data: FeaturedContent) => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      // Validation côté client
      if (!data.cheeseOfTheWeek && !data.trendingCheeses && !data.newCheeses) {
        setError('Veuillez configurer au moins une section');
        return;
      }

      await updateFeaturedContent(data, 'admin-panel');
      
      setSuccess('✅ Contenu mis à jour avec succès ! Les modifications sont maintenant visibles dans l\'application mobile.');
      
      // Effacer le message de succès après 5 secondes
      setTimeout(() => setSuccess(null), 5000);
    } catch (err) {
      console.error('❌ Erreur de sauvegarde:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erreur de sauvegarde';
      setError(`❌ ${errorMessage}`);
      
      // Effacer le message d'erreur après 8 secondes
      setTimeout(() => setError(null), 8000);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      {/* Header avec logo centré */}
      <div className="mb-12">
        {/* Logo centré */}
        <div className="flex justify-center mb-8">
          <div className="relative w-32 h-16">
            <Image
              src="/fromiz-logo-new.png"
              alt="Fromiz"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* Titre et menu utilisateur */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-light text-gray-900 mb-2">
              Fromiz Admin
            </h1>
            <p className="text-sm text-gray-500">
              Gestion du contenu mis en avant
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button
                onClick={() => setShowInitFromizNews(true)}
              className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm"
            >
              🔧 Init Collections
            </button>
            <button
              onClick={() => setShowNewsManager(true)}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
            >
              📰 Actualités
            </button>
            <UserMenu />
          </div>
        </div>

        {/* Stats minimalistes */}
        <div className="grid grid-cols-3 gap-8 mb-8">
          <div className="text-center">
            <div className="text-3xl font-light text-gray-900">{cheeses.length}</div>
            <div className="text-xs text-gray-500 mt-1">Fromages</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-light text-gray-900">
              {watchedData.trendingCheeses?.cheeseIds?.length || 0}
            </div>
            <div className="text-xs text-gray-500 mt-1">Tendances</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-light text-gray-900">
              {watchedData.newCheeses?.cheeseIds?.length || 0}
            </div>
            <div className="text-xs text-gray-500 mt-1">Nouveautés</div>
          </div>
        </div>
      </div>

      {/* Messages minimalistes */}
      {error && (
        <div className="mb-8 p-4 border-l-4 border-red-500 bg-red-50">
          <div className="text-sm text-red-800">{error}</div>
        </div>
      )}
      
      {success && (
        <div className="mb-8 p-4 border-l-4 border-green-500 bg-green-50">
          <div className="text-sm text-green-800">{success}</div>
        </div>
      )}

      {/* Formulaire simplifié */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
        {/* Fromage de la semaine */}
        <SectionCard
          title="Fromage de la semaine"
          description="Le fromage mis en avant sur l'écran d'accueil de l'application"
        >
          <div className="space-y-6">
            <div>
              <input
                {...register('cheeseOfTheWeek.title')}
                className="w-full px-0 py-3 border-0 border-b border-gray-300 focus:outline-none focus:border-gray-900 text-gray-900 placeholder-gray-400 bg-transparent"
                placeholder="Titre de la section"
              />
            </div>
            
            <div>
              <input
                {...register('cheeseOfTheWeek.subtitle')}
                className="w-full px-0 py-3 border-0 border-b border-gray-300 focus:outline-none focus:border-gray-900 text-gray-900 placeholder-gray-400 bg-transparent"
                placeholder="Sous-titre (optionnel)"
              />
            </div>

            <CheeseSelector
              cheeses={cheeses}
              selectedCheeseId={watchedData.cheeseOfTheWeek?.cheeseId || ''}
              onSelect={(cheeseId) => setValue('cheeseOfTheWeek.cheeseId', cheeseId)}
              label="Fromage à mettre en avant"
            />

            <div className="flex items-center">
              <input
                {...register('cheeseOfTheWeek.active')}
                type="checkbox"
                className="h-4 w-4 text-gray-900 focus:ring-gray-900 border-gray-300"
              />
              <label className="ml-3 text-sm text-gray-700">
                Afficher cette section
              </label>
            </div>
          </div>
        </SectionCard>

        {/* Tendances du moment */}
        <SectionCard
          title="Tendances du moment"
          description="Fromages affichés dans la section tendances de l'application"
        >
          <div className="space-y-6">
            <div>
              <input
                {...register('trendingCheeses.title')}
                className="w-full px-0 py-3 border-0 border-b border-gray-300 focus:outline-none focus:border-gray-900 text-gray-900 placeholder-gray-400 bg-transparent"
                placeholder="Titre de la section"
              />
            </div>

            <CheeseSelector
              cheeses={cheeses}
              selectedCheeseIds={watchedData.trendingCheeses?.cheeseIds || []}
              onSelectMultiple={(cheeseIds) => setValue('trendingCheeses.cheeseIds', cheeseIds)}
              label="Fromages tendances (maximum 6)"
              multiple
              maxSelection={6}
            />

            <div className="flex items-center">
              <input
                {...register('trendingCheeses.active')}
                type="checkbox"
                className="h-4 w-4 text-gray-900 focus:ring-gray-900 border-gray-300"
              />
              <label className="ml-3 text-sm text-gray-700">
                Afficher cette section
              </label>
            </div>
          </div>
        </SectionCard>

        {/* Nouveautés */}
        <SectionCard
          title="Nouveautés"
          description="Fromages affichés dans la section nouveautés de l'application"
        >
          <div className="space-y-6">
            <div>
              <input
                {...register('newCheeses.title')}
                className="w-full px-0 py-3 border-0 border-b border-gray-300 focus:outline-none focus:border-gray-900 text-gray-900 placeholder-gray-400 bg-transparent"
                placeholder="Titre de la section"
              />
            </div>

            <CheeseSelector
              cheeses={cheeses}
              selectedCheeseIds={watchedData.newCheeses?.cheeseIds || []}
              onSelectMultiple={(cheeseIds) => setValue('newCheeses.cheeseIds', cheeseIds)}
              label="Nouveaux fromages (maximum 6)"
              multiple
              maxSelection={6}
            />

            <div className="flex items-center">
              <input
                {...register('newCheeses.active')}
                type="checkbox"
                className="h-4 w-4 text-gray-900 focus:ring-gray-900 border-gray-300"
              />
              <label className="ml-3 text-sm text-gray-700">
                Afficher cette section
              </label>
            </div>
          </div>
        </SectionCard>

        {/* Bouton de sauvegarde */}
        <div className="flex justify-end pt-8">
          <SaveButton loading={saving} />
        </div>
      </form>
      
      {/* Gestionnaire d'actualités */}
      {showNewsManager && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <NewsManager onClose={() => setShowNewsManager(false)} />
          </div>
        </div>
      )}
      
      {/* Initialisation des collections */}
        {showInitFromizNews && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <InitFromizNews onClose={() => setShowInitFromizNews(false)} />
            </div>
          </div>
        )}
    </div>
  );
}
