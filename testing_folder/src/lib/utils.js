export const WHATSAPP_AGENTS = [
  { id: 1, number: '2347044423621', name: 'Agent 1' },
  { id: 2, number: '2349056539548', name: 'Agent 2' },
];

export function formatPrice(amount) {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function generateWhatsAppLink(propertyTitle, area, agentNumber = WHATSAPP_AGENTS[0].number) {
  const areaName = typeof area === 'object' ? area?.name : area;
  const message = encodeURIComponent(
    `Hello, I'm interested in ${propertyTitle} in ${areaName} listed on 360Urban.`
  );
  return `https://wa.me/${agentNumber}?text=${message}`;
}

export function generateGeneralWhatsAppLink(agentNumber = WHATSAPP_AGENTS[0].number) {
  const message = encodeURIComponent(
    `Hello, I found your listing on 360Urban and I'd like to make an inquiry.`
  );
  return `https://wa.me/${agentNumber}?text=${message}`;
}

export function filterProperties(properties, filters = {}) {
  let result = [...properties];

  if (filters.area) {
    result = result.filter((p) => p.areaSlug === filters.area);
  }

  if (filters.category) {
    result = result.filter((p) => p.category === filters.category);
  }

  if (filters.propertyType) {
    result = result.filter((p) => p.propertyType === filters.propertyType);
  }

  if (filters.status) {
    result = result.filter((p) => p.status === filters.status);
  }

  if (filters.minPrice) {
    result = result.filter((p) => p.price >= filters.minPrice);
  }

  if (filters.maxPrice) {
    result = result.filter((p) => p.price <= filters.maxPrice);
  }

  return result;
}

export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

export function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-');
}

export const priceRanges = [
  { label: 'All Prices', min: null, max: null },
  { label: 'Under ₦500K', min: 0, max: 500000 },
  { label: '₦500K – ₦2M', min: 500000, max: 2000000 },
  { label: '₦2M – ₦10M', min: 2000000, max: 10000000 },
  { label: '₦10M – ₦50M', min: 10000000, max: 50000000 },
  { label: '₦50M – ₦200M', min: 50000000, max: 200000000 },
  { label: 'Above ₦200M', min: 200000000, max: null },
];

export const propertyTypes = ['Flat', 'Duplex', 'Self-Contain', 'Land'];
export const categories = ['Rent', 'Sale', 'Land'];
