// Thin API layer: the frontend never filters or sorts – it only asks the server.
export async function fetchMeta() {
  const res = await fetch('/api/meta');
  if (!res.ok) throw new Error('Could not load filter options');
  return res.json();
}

export async function fetchProducts(state, signal) {
  const params = new URLSearchParams();
  if (state.categories.size) params.set('categories', [...state.categories].join(','));
  params.set('minPrice', state.minPrice);
  params.set('maxPrice', state.maxPrice);
  if (state.minRating) params.set('minRating', state.minRating);
  params.set('sort', state.sort);

  const res = await fetch(`/api/products?${params}`, { signal });
  if (!res.ok) throw new Error((await res.json()).error || 'Request failed');
  return res.json();
}
