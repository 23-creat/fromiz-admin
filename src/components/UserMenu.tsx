'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export function UserMenu() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await logout();
    } catch (error) {
      console.error('Erreur de déconnexion:', error);
    } finally {
      setLoggingOut(false);
    }
  };

  if (!user) return null;

  return (
    <div className="relative">
      {/* Bouton utilisateur minimaliste */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 p-2 hover:bg-gray-50 transition-colors"
      >
        <div className="w-6 h-6 bg-gray-900 rounded-full flex items-center justify-center">
          <span className="text-xs font-light text-white">
            {user.email?.charAt(0).toUpperCase() || 'A'}
          </span>
        </div>
        <div className="text-left">
          <div className="text-sm font-light text-gray-900">
            {user.displayName || 'Administrateur'}
          </div>
        </div>
        <div className={`w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}></div>
      </button>

      {/* Menu déroulant minimaliste */}
      {isOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Menu */}
          <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 z-20">
            <div className="p-4 border-b border-gray-100">
              <div className="text-sm font-light text-gray-900">
                {user.displayName || 'Administrateur'}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {user.email}
              </div>
            </div>

            <div className="p-2">
              <div className="px-3 py-2 text-xs text-gray-400">
                Connecté
              </div>

              <div className="mt-2 pt-2 border-t border-gray-100">
                <button
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="w-full px-3 py-2 text-left text-sm text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loggingOut ? 'Déconnexion...' : 'Se déconnecter'}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
