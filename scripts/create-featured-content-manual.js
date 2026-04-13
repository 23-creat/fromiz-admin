/**
 * Script pour créer manuellement le document featuredContent
 * Ce script affiche les données à copier-coller dans Firebase Console
 * 
 * Usage: node scripts/create-featured-content-manual.js
 */

console.log('📝 Instructions pour créer le document featuredContent manuellement:');
console.log('');
console.log('1. Allez sur Firebase Console > Firestore Database > Data');
console.log('2. Créez une nouvelle collection appelée "featuredContent"');
console.log('3. Créez un document avec l\'ID "sections"');
console.log('4. Copiez-collez le contenu suivant dans le document:');
console.log('');

const featuredContent = {
  cheeseOfTheWeek: {
    id: 'cheese-of-week',
    title: 'Fromage de la semaine',
    subtitle: 'Notre sélection hebdomadaire',
    cheeseId: '',
    active: true,
    updatedAt: new Date().toISOString(),
    updatedBy: 'system'
  },
  trendingCheeses: {
    id: 'trending',
    title: 'Tendances du moment',
    subtitle: 'Les fromages qui font sensation',
    cheeseIds: [],
    maxCount: 6,
    active: true,
    updatedAt: new Date().toISOString(),
    updatedBy: 'system'
  },
  newCheeses: {
    id: 'new-arrivals',
    title: 'Nouveautés',
    subtitle: 'Fraîchement ajoutés à notre sélection',
    cheeseIds: [],
    maxCount: 6,
    active: true,
    updatedAt: new Date().toISOString(),
    updatedBy: 'system'
  }
};

console.log(JSON.stringify(featuredContent, null, 2));
console.log('');
console.log('5. Sauvegardez le document');
console.log('6. Relancez le panneau d\'administration');
console.log('');
console.log('✅ Une fois créé, le panneau d\'administration devrait fonctionner parfaitement !');
