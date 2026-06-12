<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '@/stores/cart';
import { slugify } from '@/stores/products';

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
});

const router = useRouter();
const cartStore = useCartStore();
const isAdding = ref(false);

const salePrice = computed(() => {
  return Number((props.product.price * 0.9).toFixed(2));
});

const goToDetail = () => {
  router.push(`/product/${slugify(props.product.title)}`);
};

const getRatingClass = (rate) => {
  if (rate >= 4) return 'ratingGreen';
  if (rate >= 3) return 'ratingWarning';
  return 'ratingDanger';
};

const handleQuickAdd = () => {
  if (isAdding.value) return;
  isAdding.value = true;
  cartStore.addItem(props.product);
  cartStore.openDrawer();
  
  setTimeout(() => {
    isAdding.value = false;
  }, 1000);
};
</script>

<template>
  <div class="card">
    <div class="discountBadge">10% OFF</div>
    <div class="imageWrapper" @click="goToDetail">
      <img 
        :src="product.image" 
        :alt="product.title" 
        class="image"
        loading="lazy"
      />
    </div>
    <div class="content">
      <span class="brand">{{ product.category }}</span>

      <h3 class="title" @click="goToDetail">
        {{ product.title }}
      </h3>
      
      <div v-if="product.rating" class="ratingRow">
        <div :class="['ratingBadge', getRatingClass(product.rating.rate)]">
          <span class="ratingRate">{{ product.rating.rate.toFixed(1) }}</span>
          <span class="starIcon">★</span>
        </div>
        <span class="ratingCount">({{ product.rating.count }} reviews)</span>
      </div>

      <div class="priceRow">
        <span class="salePrice">${{ salePrice.toFixed(2) }}</span>
        <span class="originalPrice">${{ product.price.toFixed(2) }}</span>
      </div>

      <button 
        :class="['quickAddBtn', { adding: isAdding }]" 
        @click="handleQuickAdd"
        :disabled="isAdding"
      >
        <template v-if="isAdding">
          ADDED!
        </template>
        <template v-else>
          QUICK ADD
        </template>
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as *;
@use '@/styles/mixins' as *;

.card {
  @include card-base;
  position: relative;
  box-shadow: $shadow-sm;
  transition: $transition-normal;

  &:hover {
    transform: translateY(-5px);
    border-color: $color-border-hover;
    box-shadow: $shadow-card-hover;

    .image        { transform: scale(1.06); }
    .imageWrapper { background-color: $color-bg; }
  }
}

.imageWrapper {
  width: 100%;
  aspect-ratio: 1;
  background-color: $color-white;
  border: 1px solid $color-white-hover;
  border-radius: $radius-md;
  padding: 1.5rem;
  overflow: hidden;
  @include flex-center;
  cursor: pointer;
  margin-bottom: 1.25rem;
  transition: background-color 0.3s ease;
}

.image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  transition: $transition-normal;
}

.content {
  @include flex-column;
  flex-grow: 1;
}

.brand {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  color: $color-text-muted;
  margin-bottom: 0.4rem;
  letter-spacing: 1px;
}

.title {
  font-size: 1.05rem;
  font-weight: 700;
  line-height: 1.4;
  color: $color-text;
  margin-bottom: 0.5rem;
  cursor: pointer;
  transition: $transition-fast;
  @include line-clamp(2);
  height: 3rem;

  &:hover { color: $color-primary; }
}

.ratingRow {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.85rem;
}

.ratingBadge {
  display: inline-flex;
  align-items: center;
  gap: 0.15rem;
  font-size: 0.75rem;
  padding: 0.15rem 0.45rem;
  border-radius: $radius-xs;
  font-weight: 700;
  color: $color-white;
  line-height: 1;
}

.starIcon {
  font-size: 0.75rem;
  line-height: 1;
  color: $color-white;
}

.ratingRate {
  font-weight: 700;
  line-height: 1;
  color: $color-white;
}

.ratingCount {
  font-size: 0.82rem;
  color: $color-text-muted;
  font-weight: 500;
}

.ratingGreen   { background-color: $color-price; }
.ratingWarning { background-color: $color-warning-dark; }
.ratingDanger  { background-color: $color-danger-dark; }

.priceRow {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  margin-top: auto;
  margin-bottom: 1.25rem;
}

.salePrice {
  font-size: 1.4rem;
  font-weight: 800;
  color: $color-price;
}

.originalPrice {
  font-size: 0.95rem;
  color: $color-text-muted;
  text-decoration: line-through;
}

.discountBadge {
  position: absolute;
  top: 1rem;
  left: 1rem;
  z-index: 10;
  font-size: 0.72rem;
  font-weight: 800;
  color: $color-white;
  background-color: $color-sale;
  padding: 0.25rem 0.55rem;
  border-radius: $radius-sm;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 4px 10px rgba($color-sale, 0.22);
}

.quickAddBtn {
  width: 100%;
  background: $gradient-primary;
  color: $color-white;
  padding: 0.75rem 1rem;
  border-radius: $radius-md;
  font-weight: 800;
  font-size: 0.875rem;
  letter-spacing: 0.75px;
  text-transform: uppercase;
  transition: $transition-normal;
  @include flex-center;
  border: 1px solid transparent;
  box-shadow: $shadow-glow;

  &:hover {
    background: $gradient-primary-hover;
    box-shadow: 0 8px 24px rgba($color-primary, 0.35);
    transform: translateY(-2px);
  }

  &:active { transform: translateY(0) scale(0.97); }

  &.adding {
    background: $color-success;
    cursor: default;
    transform: none;
    box-shadow: none;
  }
}
</style>
