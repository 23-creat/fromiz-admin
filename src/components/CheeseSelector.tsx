'use client';

import { useState } from 'react';
import { Cheese } from '@/types';
import Image from 'next/image';

interface CheeseSelectorProps {
  cheeses: Cheese[];
  selectedCheeseId?: string;
  selectedCheeseIds?: string[];
  onSelect?: (cheeseId: string) => void;
  onSelectMultiple?: (cheeseIds: string[]) => void;
  label: string;
  multiple?: boolean;
  maxSelection?: number;
}

export function CheeseSelector({
  cheeses,
  selectedCheeseId = '',
  selectedCheeseIds = [],
  onSelect,
  onSelectMultiple,
  label,
  multiple = false,
  maxSelection = 6
}: CheeseSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const filteredCheeses = cheeses.filter(cheese =>
    cheese.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cheese.origine.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSingleSelect = (cheeseId: string) => {
    onSelect?.(cheeseId);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleMultipleSelect = (cheeseId: string) => {
    if (!onSelectMultiple) return;

    const currentIds = selectedCheeseIds;
    
    if (currentIds.includes(cheeseId)) {
      // Retirer de la sélection
      onSelectMultiple(currentIds.filter(id => id !== cheeseId));
    } else {
      // Ajouter à la sélection (si pas déjà au max)
      if (currentIds.length < maxSelection) {
        onSelectMultiple([...currentIds, cheeseId]);
      }
    }
  };

  const getSelectedCheese = () => {
    return cheeses.find(cheese => cheese.id === selectedCheeseId);
  };

  const getSelectedCheeses = () => {
    return cheeses.filter(cheese => selectedCheeseIds.includes(cheese.id));
  };

  const removeFromSelection = (cheeseId: string) => {
    if (onSelectMultiple) {
      onSelectMultiple(selectedCheeseIds.filter(id => id !== cheeseId));
    }
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-light text-gray-900">
        {label}
      </label>

      {/* Sélection multiple - Affichage des fromages sélectionnés */}
      {multiple && selectedCheeseIds.length > 0 && (
        <div className="space-y-3">
          <div className="text-xs text-gray-500">
            {selectedCheeseIds.length} sur {maxSelection} sélectionnés
          </div>
          <div className="space-y-2">
            {getSelectedCheeses().map((cheese) => (
              <div
                key={cheese.id}
                className="flex items-center justify-between p-3 border border-gray-200"
              >
                <div className="flex items-center gap-3">
                  <Image
                    src={cheese.imageUrl || '/placeholder-cheese.svg'}
                    alt={cheese.nom}
                    width={32}
                    height={32}
                    className="object-cover"
                  />
                  <div>
                    <div className="text-sm font-light text-gray-900">
                      {cheese.nom}
                    </div>
                    <div className="text-xs text-gray-500">
                      {cheese.origine}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeFromSelection(cheese.id)}
                  className="text-gray-400 hover:text-gray-600 text-sm"
                >
                  Supprimer
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sélection simple - Affichage du fromage sélectionné */}
      {!multiple && selectedCheeseId && (
        <div className="p-3 border border-gray-200">
          {(() => {
            const cheese = getSelectedCheese();
            return cheese ? (
              <div className="flex items-center gap-3">
                <Image
                  src={cheese.imageUrl || '/placeholder-cheese.svg'}
                  alt={cheese.nom}
                  width={40}
                  height={40}
                  className="object-cover"
                />
                <div>
                  <div className="text-sm font-light text-gray-900">{cheese.nom}</div>
                  <div className="text-xs text-gray-500">{cheese.origine}</div>
                </div>
              </div>
            ) : (
              <div className="text-sm text-gray-500">Fromage non trouvé</div>
            );
          })()}
        </div>
      )}

      {/* Bouton d'ouverture */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-0 py-3 text-left border-0 border-b border-gray-300 focus:outline-none focus:border-gray-900 text-gray-900 bg-transparent hover:border-gray-900 transition-colors"
        >
          {multiple 
            ? `Ajouter des fromages`
            : selectedCheeseId 
              ? 'Changer le fromage'
              : 'Sélectionner un fromage'
          }
        </button>

        {/* Dropdown */}
        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 max-h-96 overflow-hidden">
            {/* Barre de recherche */}
            <div className="p-3 border-b border-gray-200">
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-0 py-2 border-0 border-b border-gray-300 focus:outline-none focus:border-gray-900 text-gray-900 placeholder-gray-400 bg-transparent"
              />
            </div>

            {/* Liste des fromages */}
            <div className="max-h-64 overflow-y-auto">
              {filteredCheeses.length === 0 ? (
                <div className="p-3 text-sm text-gray-500 text-center">
                  Aucun fromage trouvé
                </div>
              ) : (
                filteredCheeses.map((cheese) => {
                  const isSelected = multiple 
                    ? selectedCheeseIds.includes(cheese.id)
                    : selectedCheeseId === cheese.id;
                  const isDisabled = multiple && 
                    !isSelected && 
                    selectedCheeseIds.length >= maxSelection;

                  return (
                    <button
                      key={cheese.id}
                      type="button"
                      onClick={() => multiple 
                        ? handleMultipleSelect(cheese.id)
                        : handleSingleSelect(cheese.id)
                      }
                      disabled={isDisabled}
                      className={`w-full p-3 text-left hover:bg-gray-50 flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed border-b border-gray-100 ${
                        isSelected ? 'bg-gray-50' : ''
                      }`}
                    >
                      <Image
                        src={cheese.imageUrl || '/placeholder-cheese.svg'}
                        alt={cheese.nom}
                        width={32}
                        height={32}
                        className="object-cover"
                      />
                      <div className="flex-1">
                        <div className="text-sm font-light text-gray-900">
                          {cheese.nom}
                          {isSelected && multiple && (
                            <span className="ml-2 text-xs text-gray-500">
                              (sélectionné)
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500">
                          {cheese.origine}
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>

            {/* Footer avec bouton fermer */}
            <div className="p-3 border-t border-gray-200">
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  setSearchTerm('');
                }}
                className="w-full px-0 py-2 text-sm text-gray-600 hover:text-gray-900 text-center"
              >
                Fermer
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
