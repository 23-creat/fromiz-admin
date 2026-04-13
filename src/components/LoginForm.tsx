'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await signIn(email, password);
    } catch (error: any) {
      console.error('Erreur de connexion:', error);
      
      // Messages d'erreur personnalisés
      switch (error.code) {
        case 'auth/user-not-found':
          setError('Aucun compte trouvé avec cette adresse email');
          break;
        case 'auth/wrong-password':
          setError('Mot de passe incorrect');
          break;
        case 'auth/invalid-email':
          setError('Adresse email invalide');
          break;
        case 'auth/too-many-requests':
          setError('Trop de tentatives. Veuillez réessayer plus tard');
          break;
        default:
          setError('Erreur de connexion. Veuillez réessayer');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="max-w-sm w-full">
        {/* Header minimaliste */}
        <div className="text-center mb-12">
          <h1 className="text-2xl font-light text-gray-900 mb-2">
            Fromiz Admin
          </h1>
          <div className="w-12 h-px bg-gray-300 mx-auto"></div>
        </div>

        {/* Formulaire de connexion */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Champ Email */}
          <div>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-0 py-3 border-0 border-b border-gray-300 focus:outline-none focus:border-gray-900 text-gray-900 placeholder-gray-400 bg-transparent"
              placeholder="Email"
              required
            />
          </div>

          {/* Champ Mot de passe */}
          <div>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-0 py-3 border-0 border-b border-gray-300 focus:outline-none focus:border-gray-900 text-gray-900 placeholder-gray-400 bg-transparent"
              placeholder="Mot de passe"
              required
            />
          </div>

          {/* Message d'erreur */}
          {error && (
            <div className="text-sm text-red-600 text-center">
              {error}
            </div>
          )}

          {/* Bouton de connexion */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-900 text-white font-light py-3 px-4 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        {/* Footer minimaliste */}
        <div className="text-center mt-16">
          <p className="text-xs text-gray-400">
            Accès administrateur sécurisé
          </p>
        </div>
      </div>
    </div>
  );
}
