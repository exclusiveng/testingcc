export const areas = [
  {
    name: 'Jabi',
    slug: 'jabi',
    description: 'A fast-growing district known for upscale residences, shopping centres, and proximity to the city centre. Popular with young professionals and families.',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80', // Modern apartment/city feel
  },
  {
    name: 'Lugbe',
    slug: 'lugbe',
    description: 'One of Abuja\'s most affordable satellite towns with rapid development. Great for budget-conscious renters and first-time buyers.',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80', // Suburban housing
  },
  {
    name: 'Katampe',
    slug: 'katampe',
    description: 'A prestigious hill-top neighbourhood offering serenity, views, and high-end properties. Ideal for executives and diplomats.',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80', // Luxury home with view
  },
  {
    name: 'Maitama',
    slug: 'maitama',
    description: 'Abuja\'s premier district — home to embassies, luxury estates, and top-tier amenities. The gold standard of urban living.',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80', // Luxury mansion
  },
  {
    name: 'Gwarinpa',
    slug: 'gwarinpa',
    description: 'Africa\'s largest housing estate, known for residential comfort, family-friendly layouts, and vibrant community life.',
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80', // Estate housing
  },
  {
    name: 'Wuse',
    slug: 'wuse',
    description: 'A bustling commercial and residential hub at the heart of Abuja. Close to markets, offices, and nightlife.',
    image: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&q=80', // Cityscape/busy
  },
];

export function getAreaBySlug(slug) {
  return areas.find((a) => a.slug === slug);
}
