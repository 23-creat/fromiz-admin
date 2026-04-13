'use client';
import React, { useState } from 'react';
import { initializeFromizActu } from '@/utils/initFromizNews';

interface InitFromizNewsProps {
  onClose: () => void;
}

export function InitFromizNews({ onClose }: InitFromizNewsProps) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; configCreated: boolean; newsCreated: boolean; error?: string } | null>(null);

  const handleInitialize = async () => {
    setLoading(true);
    setResult(null);
    
    try {
      const result = await initializeFromizActu();
      setResult(result);
    } catch (error) {
      setResult({ 
        success: false, 
        configCreated: false, 
        newsCreated: false, 
        error: error instanceof Error ? error.message : 'Erreur inconnue' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-light text-gray-900 mb-2">
          Initialisation des Collections Fromiznews
        </h1>
        <p className="text-sm text-gray-500">
          Ce script va créer les collections Firebase nécessaires pour les actualités
        </p>
      </div>

      {!result && (
        <div className="space-y-6">
          <div className="p-6 bg-blue-50 rounded-lg">
            <h3 className="text-lg font-medium text-blue-900 mb-2">
              Collections à créer :
            </h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• <strong>fromiznews</strong> - Collection des actualités</li>
              <li>• <strong>newsConfig</strong> - Configuration des actualités</li>
            </ul>
          </div>

          <div className="p-6 bg-yellow-50 rounded-lg">
            <h3 className="text-lg font-medium text-yellow-900 mb-2">
              ⚠️ Important :
            </h3>
            <p className="text-sm text-yellow-800">
              Assurez-vous d'avoir ajouté les règles de sécurité Firebase avant d'exécuter ce script.
            </p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleInitialize}
              disabled={loading}
              className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Initialisation...' : 'Initialiser les Collections'}
            </button>
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Annuler
            </button>
          </div>
        </div>
      )}

      {result && (
        <div className="space-y-6">
          {result.success ? (
            <div className="p-6 bg-green-50 rounded-lg">
              <h3 className="text-lg font-medium text-green-900 mb-2">
                ✅ Initialisation Réussie !
              </h3>
              <div className="text-sm text-green-800 space-y-1">
                {result.configCreated && <p>• Configuration des actualités créée</p>}
                {result.newsCreated && <p>• Actualités d'exemple créées</p>}
                {!result.configCreated && !result.newsCreated && (
                  <p>• Toutes les collections existent déjà</p>
                )}
              </div>
            </div>
          ) : (
            <div className="p-6 bg-red-50 rounded-lg">
              <h3 className="text-lg font-medium text-red-900 mb-2">
                ❌ Erreur lors de l'initialisation
              </h3>
              <p className="text-sm text-red-800">
                {result.error}
              </p>
            </div>
          )}

          <div className="p-6 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Prochaines étapes :
            </h3>
            <ol className="text-sm text-gray-700 space-y-1">
              <li>1. Vérifiez que les règles de sécurité Firebase sont configurées</li>
              <li>2. Testez l'application mobile</li>
              <li>3. Utilisez le gestionnaire d'actualités pour créer du contenu</li>
            </ol>
          </div>

          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
