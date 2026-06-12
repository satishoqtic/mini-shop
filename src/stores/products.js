import { defineStore } from 'pinia';

export function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

export const useProductsStore = defineStore('products', {
  state: () => ({
    products: [],
    loading: false,
    error: null
  }),
  
  getters: {
    getProductBySlug: (state) => (slug) => {
      return state.products.find(p => slugify(p.title) === slug);
    }
  },
  
  actions: {
    async fetchProducts() {
      if (this.products.length > 0) return;
      this.loading = true;
      this.error = null;
      try {
        const response = await fetch('https://fakestoreapi.com/products');
        if (!response.ok) {
          throw new Error('Failed to load products catalog');
        }
        this.products = await response.json();
      } catch (err) {
        this.error = err.message || 'Something went wrong';
      } finally {
        this.loading = false;
      }
    }
  }
});
