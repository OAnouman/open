const randomString = (stringLength: number) => {
  let randomStringGenerated = '';

  const baseChars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < stringLength; i++)
    randomStringGenerated += baseChars.charAt(
      Math.floor(Math.random() * baseChars.length)
    );

  return randomStringGenerated;
};

const CATEGORIES: { text: string; value: string }[] = [
  {
    text: 'Emploi',
    value: 'job'
  },
  {
    text: 'Entreprise & Services',
    value: 'enterprise-services'
  },
  {
    text: 'Immobilier',
    value: 'estate'
  },
  {
    text: 'Informatique & Mutimédia',
    value: 'it-media'
  },
  {
    text: 'Jeux',
    value: 'games'
  },
  {
    text: 'Loisir',
    value: 'entertainment'
  },
  {
    text: 'Mode & Vêtements',
    value: 'fashion'
  },
  {
    text: 'Maison',
    value: 'house'
  },
  {
    text: 'Santé',
    value: 'health'
  },
  {
    text: 'Smartphones & Téléphones',
    value: 'telcom'
  },
  {
    text: 'Véhicules et Transport',
    value: 'cars'
  }
];

const TAGS: { name: string; color: string }[] = [
  {
    name: 'Défecteux',
    color: 'danger'
  },
  {
    name: 'Négociable',
    color: 'negociable'
  },
  {
    name: 'Neuf',
    color: 'success'
  },
  {
    name: 'Occasion',
    color: 'caution'
  },
  {
    name: 'Troc',
    color: 'light'
  }
];

export const Utils = {
  randomString,

  CATEGORIES,

  TAGS
};
