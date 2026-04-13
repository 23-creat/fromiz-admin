'use client';
import React, { useState, useEffect } from 'react';
import { AdminFromizActuService } from '@/services/fromizNewsService';
import { FromizActu, NewsConfig } from '@/types';
import Image from 'next/image';

interface NewsManagerProps {
  onClose: () => void;
}

export function NewsManager({ onClose }: NewsManagerProps) {
  const [news, setNews] = useState<FromizActu[]>([]);
  const [config, setConfig] = useState<NewsConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [editingNews, setEditingNews] = useState<FromizActu | null>(null);
  const [showConfig, setShowConfig] = useState(false);

  // États pour le formulaire
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    content: '',
    imageUrl: '',
    category: 'actualité' as FromizActu['category'],
    author: '',
    featured: false,
    active: true,
    publishDate: new Date().toISOString().split('T')[0],
  });

  // Charger les données
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [newsData, configData] = await Promise.all([
        AdminFromizActuService.getAllNews(),
        AdminFromizActuService.getNewsConfig(),
      ]);
      
      setNews(newsData);
      setConfig(configData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      setSuccess(null);

      const newsData = {
        ...formData,
        publishDate: new Date(formData.publishDate),
      };

      if (editingNews) {
        await AdminFromizActuService.updateNews(editingNews.id, newsData);
        setSuccess('Actualité mise à jour avec succès');
      } else {
        await AdminFromizActuService.createNews(newsData);
        setSuccess('Actualité créée avec succès');
      }

      await loadData();
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    }
  };

  const handleEdit = (newsItem: FromizActu) => {
    setEditingNews(newsItem);
    setFormData({
      title: newsItem.title,
      summary: newsItem.summary,
      content: newsItem.content,
      imageUrl: newsItem.imageUrl,
      category: newsItem.category,
      author: newsItem.author,
      featured: newsItem.featured,
      active: newsItem.active,
      publishDate: newsItem.publishDate.toISOString().split('T')[0],
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette actualité ?')) {
      return;
    }

    try {
      await AdminFromizActuService.deleteNews(id);
      setSuccess('Actualité supprimée avec succès');
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    }
  };

  const handleDuplicate = async (id: string) => {
    try {
      await AdminFromizActuService.duplicateNews(id);
      setSuccess('Actualité dupliquée avec succès');
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    }
  };

  const resetForm = () => {
    setEditingNews(null);
    setFormData({
      title: '',
      summary: '',
      content: '',
      imageUrl: '',
      category: 'actualité',
      author: '',
      featured: false,
      active: true,
      publishDate: new Date().toISOString().split('T')[0],
    });
  };

  const updateConfig = async (updates: Partial<NewsConfig>) => {
    try {
      await AdminFromizActuService.updateNewsConfig(updates);
      setSuccess('Configuration mise à jour avec succès');
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg text-gray-600">Chargement des actualités...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-light text-gray-900 mb-2">
              Gestion des Actualités Fromiznews
            </h1>
            <p className="text-sm text-gray-500">
              Créez et gérez les actualités du monde du fromage
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowConfig(!showConfig)}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Configuration
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              Fermer
            </button>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-4 p-4 border-l-4 border-red-500 bg-red-50">
            <div className="text-sm text-red-800">{error}</div>
          </div>
        )}
        {success && (
          <div className="mb-4 p-4 border-l-4 border-green-500 bg-green-50">
            <div className="text-sm text-green-800">{success}</div>
          </div>
        )}
      </div>

      {/* Configuration */}
      {showConfig && config && (
        <div className="mb-8 p-6 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Configuration</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre d'actualités à afficher
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={config.maxDisplayCount}
                onChange={(e) => updateConfig({ maxDisplayCount: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="showFeaturedOnly"
                checked={config.showFeaturedOnly}
                onChange={(e) => updateConfig({ showFeaturedOnly: e.target.checked })}
                className="h-4 w-4 text-gray-900 focus:ring-gray-900 border-gray-300"
              />
              <label htmlFor="showFeaturedOnly" className="ml-2 text-sm text-gray-700">
                Afficher seulement les actualités en vedette
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="active"
                checked={config.active}
                onChange={(e) => updateConfig({ active: e.target.checked })}
                className="h-4 w-4 text-gray-900 focus:ring-gray-900 border-gray-300"
              />
              <label htmlFor="active" className="ml-2 text-sm text-gray-700">
                Section active
              </label>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Formulaire */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {editingNews ? 'Modifier l\'actualité' : 'Nouvelle actualité'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Titre *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Résumé *
              </label>
              <textarea
                value={formData.summary}
                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contenu *
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL de l'image *
              </label>
              <input
                type="url"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Catégorie
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as FromizActu['category'] })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                >
                  <option value="actualité">Actualité</option>
                  <option value="production">Production</option>
                  <option value="événement">Événement</option>
                  <option value="découverte">Découverte</option>
                  <option value="conseil">Conseil</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Auteur
                </label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date de publication
              </label>
              <input
                type="date"
                value={formData.publishDate}
                onChange={(e) => setFormData({ ...formData, publishDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>

            <div className="flex gap-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="h-4 w-4 text-gray-900 focus:ring-gray-900 border-gray-300"
                />
                <label htmlFor="featured" className="ml-2 text-sm text-gray-700">
                  Mettre en vedette
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="active"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="h-4 w-4 text-gray-900 focus:ring-gray-900 border-gray-300"
                />
                <label htmlFor="active" className="ml-2 text-sm text-gray-700">
                  Actif
                </label>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                {editingNews ? 'Mettre à jour' : 'Créer'}
              </button>
              {editingNews && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Annuler
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Liste des actualités */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Actualités ({news.length})
          </h3>
          
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {news.map((newsItem) => (
              <div key={newsItem.id} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="w-16 h-16 relative rounded-lg overflow-hidden">
                    <Image
                      src={newsItem.imageUrl}
                      alt={newsItem.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-gray-900 text-sm">
                        {newsItem.title}
                      </h4>
                      {newsItem.featured && (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">
                          ⭐ Vedette
                        </span>
                      )}
                      {!newsItem.active && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded">
                          Inactif
                        </span>
                      )}
                    </div>
                    
                    <p className="text-xs text-gray-600 mb-2">
                      {newsItem.summary}
                    </p>
                    
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>{newsItem.category}</span>
                      <span>•</span>
                      <span>{newsItem.author}</span>
                      <span>•</span>
                      <span>{newsItem.publishDate.toLocaleDateString('fr-FR')}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => handleEdit(newsItem)}
                    className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded hover:bg-blue-200 transition-colors"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDuplicate(newsItem.id)}
                    className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded hover:bg-green-200 transition-colors"
                  >
                    Dupliquer
                  </button>
                  <button
                    onClick={() => handleDelete(newsItem.id)}
                    className="px-3 py-1 bg-red-100 text-red-700 text-xs rounded hover:bg-red-200 transition-colors"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
