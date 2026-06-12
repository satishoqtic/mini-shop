<script setup>
import { ref, onMounted, computed } from 'vue';
import { useProductsStore } from '@/stores/products';
import ProductCard from '@/components/ProductCard.vue';
import SkeletonCard from '@/components/SkeletonCard.vue';

const productsStore = useProductsStore();

const products = computed(() => productsStore.products);
const loading = computed(() => productsStore.loading);
const error = computed(() => productsStore.error);

const sortBy = ref('default');

const sortedProducts = computed(() => {
  if (!products.value) return [];
  const list = [...products.value];
  
  if (sortBy.value === 'price-asc') {
    return list.sort((a, b) => a.price - b.price);
  }
  if (sortBy.value === 'price-desc') {
    return list.sort((a, b) => b.price - a.price);
  }
  if (sortBy.value === 'rating-desc') {
    return list.sort((a, b) => {
      const rateA = a.rating?.rate || 0;
      const rateB = b.rating?.rate || 0;
      return rateB - rateA;
    });
  }
  return list;
});

onMounted(() => {
  productsStore.fetchProducts();
});

const scrollToProducts = () => {
  const gridElement = document.querySelector('.grid-anchor');
  if (gridElement) {
    const navbarHeight = 70;
    const elementPosition = gridElement.getBoundingClientRect().top + window.scrollY;
    const offsetPosition = elementPosition - navbarHeight - 20; 

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }
};
</script>

<template>
  <div class="listingPage">
    <section class="hero-section">
      <div class="hero-container container">
        <div class="hero-content">
          <span class="hero-badge">FEATURED COLLECTION</span>
          <h1 class="hero-title">Elevate Your Everyday Lifestyle</h1>
          <p class="hero-subtitle">
            Explore a curated collection of fashion, electronics, and everyday essentials designed to complement modern living.
          </p>
        </div>
        <div class="hero-actions">
          <button class="hero-btn" @click="scrollToProducts">
            Explore Collection
            <svg 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              stroke-width="3" 
              stroke-linecap="round" 
              stroke-linejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <polyline points="19 12 12 19 5 12"></polyline>
            </svg>
          </button>
        </div>
      </div>
    </section>

    <div class="container catalog-section">
      <header class="header grid-anchor">
        <div class="header-text">
          <h2 class="title">Shop Collection</h2>
          <p class="subtitle">Explore premium essentials, fashion, and electronics in one place.</p>
        </div>
        <div class="sort-control">
          <label for="sort-select" class="sort-label">Sort By:</label>
          <div class="select-wrapper">
            <select id="sort-select" v-model="sortBy" class="sort-select">
              <option value="default">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating-desc">Customer Rating</option>
            </select>
            <span class="select-arrow">
              <svg 
                width="12" 
                height="12" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                stroke-width="3" 
                stroke-linecap="round" 
                stroke-linejoin="round"
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </span>
          </div>
        </div>
      </header>

      <div v-if="error" class="errorBox">
        <h3>Failed to Load Products</h3>
        <p>{{ error }}</p>
        <button class="retryBtn" @click="productsStore.fetchProducts">
          Retry Request
        </button>
      </div>

      <div v-else-if="loading" class="grid">
        <SkeletonCard v-for="n in 8" :key="n" />
      </div>
      <div v-else-if="sortedProducts && sortedProducts.length > 0" class="grid">
        <ProductCard 
          v-for="product in sortedProducts" 
          :key="product.id" 
          :product="product" 
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as *;
@use '@/styles/mixins' as *;

.listingPage {
  padding-bottom: 4rem;
  
  @include mobile {
    padding-bottom: 2.5rem;
  }
}

.catalog-section {
  padding-top: 2.5rem;
}

.header {
  @include flex-between;
  margin-bottom: 2rem;
  gap: 1.5rem;

  @include mobile {
    flex-direction: column;
    align-items: center;
    margin-bottom: 1.75rem;
    text-align: center;
  }
}

.header-text {
  flex: 1;
}

.sort-control {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  
  @include mobile {
    width: 100%;
    justify-content: center;
  }
}

.sort-label {
  font-size: 0.8rem;
  font-weight: 700;
  color: $color-text-muted;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
}

.select-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  
  @include mobile {
    flex-grow: 1;
    max-width: 220px;
  }
}

.sort-select {
  appearance: none;
  -webkit-appearance: none;
  background-color: $color-white;
  border: 1px solid $color-border;
  border-radius: $radius-md;
  padding: 0.6rem 2.5rem 0.6rem 1rem;
  font-family: inherit;
  font-size: 0.875rem;
  font-weight: 500;
  color: $color-text;
  cursor: pointer;
  transition: $transition-fast;
  width: 100%;
  
  &:hover {
    border-color: $color-border-hover;
    background-color: $color-white-hover;
  }
  
  &:focus {
    border-color: $color-primary;
  }
}

.select-arrow {
  position: absolute;
  right: 1rem;
  pointer-events: none;
  color: $color-text-muted;
  @include flex-center;
}

.title {
  font-size: 2rem;
  font-weight: 800;
  color: $color-text;
  letter-spacing: -0.75px;
}

.subtitle {
  font-size: 1rem;
  color: $color-text-muted;
}

.grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.25rem;

  @include desktop {
    grid-template-columns: repeat(3, 1fr);
  }

  @include tablet {
    grid-template-columns: repeat(2, 1fr);
  }

  @include mobile {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}

.errorBox {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 1.25rem;
  padding: 5rem 2rem;
  background-color: $color-white;
  border: 1px solid $color-border;
  border-radius: $radius-lg;
  color: $color-text-muted;
  
  h3 {
    color: $color-danger;
    font-size: 1.35rem;
    font-weight: 700;
  }
  
  p {
    max-width: 400px;
    font-size: 0.95rem;
    line-height: 1.5;
  }
}

.retryBtn {
  background-color: $color-primary;
  color: #ffffff;
  padding: 0.75rem 1.75rem;
  border-radius: $radius-md;
  font-weight: 600;
  transition: $transition-fast;
  box-shadow: 0 4px 10px rgba($color-primary, 0.2);
  
  &:hover {
    background-color: $color-primary-hover;
    transform: translateY(-1px);
  }
}

.hero-section {
  width: 100%;
  height: 250px;
  background: radial-gradient(circle at 80% 20%, rgba($color-primary, 0.15) 0%, transparent 60%), linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  position: relative;
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgba($color-white, 0.05);
  box-shadow: inset 0 -10px 20px rgba(0, 0, 0, 0.2);

  @include mobile {
    height: auto;
    padding: 2.5rem 0;
  }
}

.hero-container {
  @include flex-between;
  gap: 2rem;
  width: 100%;

  @include mobile {
    flex-direction: column;
    text-align: center;
    align-items: center;
    gap: 1.5rem;
  }
}

.hero-content {
  flex: 1;
  max-width: 65%;
  
  @media (max-width: 768px) {
    max-width: 100%;
  }
}

.hero-badge {
  background: rgba($color-primary, 0.25);
  color: lighten($color-primary, 25%);
  border: 1px solid rgba($color-primary, 0.4);
  padding: 4px 10px;
  border-radius: $radius-full;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1.2px;
  display: inline-block;
  margin-bottom: 0.75rem;
}

.hero-title {
  font-size: 2rem;
  font-weight: 800;
  color: #ffffff;
  line-height: 1.2;
  margin-bottom: 0.5rem;
  letter-spacing: -0.5px;
  
  @include mobile {
    font-size: 1.75rem;
  }
}

.hero-subtitle {
  font-size: 0.95rem;
  color: $color-text-muted;
  line-height: 1.5;
  margin: 0;

  @include mobile { font-size: 0.875rem; }
}

.hero-actions {
  @include flex-column;
  align-items: flex-end;
  gap: 0.75rem;
  flex-shrink: 0;

  @include mobile {
    align-items: center;
    width: 100%;
  }
}

.hero-btn {
  background: $gradient-primary;
  color: $color-white;
  padding: 0.8rem 1.75rem;
  border-radius: $radius-md;
  font-weight: 700;
  font-size: 0.9rem;
  transition: $transition-normal;
  box-shadow: 0 4px 14px rgba($color-primary, 0.3);
  cursor: pointer;
  border: none;
  @include flex-center;
  gap: 0.5rem;

  &:hover {
    background: $gradient-primary-hover;
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba($color-primary, 0.45);

    svg { transform: translateY(2px); }
  }

  &:active { transform: translateY(0); }

  svg { transition: transform 0.2s ease; }
}
</style>
