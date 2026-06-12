<script setup>
import { useRouter } from 'vue-router';
import { useCartStore } from '@/stores/cart';
import { slugify } from '@/stores/products';

defineProps({
  item: {
    type: Object,
    required: true
  }
});

const router = useRouter();
const cartStore = useCartStore();

const incrementQty = (item) => {
  cartStore.updateQuantity(item.id, item.quantity + 1);
};

const decrementQty = (item) => {
  if (item.quantity > 1) {
    cartStore.updateQuantity(item.id, item.quantity - 1);
  }
};

const removeItem = (itemId) => {
  cartStore.removeItem(itemId);
};

const goToProduct = (item) => {
  cartStore.closeDrawer();
  router.push(`/product/${slugify(item.title)}`);
};

const getColorHex = (colorName) => {
  const map = {
    'Black': '#1a1a1a',
    'White': '#f5f5f5',
    'Navy': '#1d3557',
    'Red': '#e63946'
  };
  return map[colorName] || '#6366f1';
};
</script>

<template>
  <div class="item">
    <div class="img-box" @click="goToProduct(item)">
      <img :src="item.image" :alt="item.title" />
    </div>
    <div class="details">
      <h4 class="item-title" @click="goToProduct(item)">
        {{ item.title }}
      </h4>
      
      <div class="variants">
        <span class="variant-group">
          <span 
            class="color-indicator" 
            :style="{ backgroundColor: getColorHex(item.colour) }"
          ></span>
          {{ item.colour }}
        </span>
        <span>•</span>
        <span>Size: {{ item.size }}</span>
      </div>

      <div class="price-and-qty">
        <span class="item-price">${{ (item.salePrice * item.quantity).toFixed(2) }}</span>
        
        <div class="action-row">
          <div class="qty-controls">
            <button 
              class="qty-btn" 
              @click="decrementQty(item)"
              :disabled="item.quantity <= 1"
            >
              −
            </button>
            <span class="qty-val">{{ item.quantity }}</span>
            <button 
              class="qty-btn" 
              @click="incrementQty(item)"
              :disabled="item.quantity >= item.maxQuantity"
            >
              +
            </button>
          </div>

          <button 
            class="remove-btn" 
            @click="removeItem(item.id)"
            aria-label="Remove item from cart"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              <line x1="10" y1="11" x2="10" y2="17"></line>
              <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as *;
@use '@/styles/mixins' as *;

.item {
  display: flex;
  gap: 1rem;
  border-bottom: 1px solid $color-border;
  padding-bottom: 1.25rem;
  
  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
}

.img-box {
  width: 72px;
  height: 72px;
  background-color: $color-white;
  border-radius: $radius-md;
  padding: 0.5rem;
  @include flex-center;
  flex-shrink: 0;
  cursor: pointer;

  img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }
}

.details {
  @include flex-column;
  flex-grow: 1;
  min-width: 0;
}

.item-title {
  font-size: 0.9rem;
  font-weight: 600;
  color: $color-text;
  @include line-clamp(1);
  margin-bottom: 0.25rem;
  transition: $transition-fast;
  cursor: pointer;
  
  &:hover {
    color: $color-primary;
  }
}

.variants {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.8rem;
  color: $color-text-muted;
  margin-bottom: 0.5rem;
}

.variant-group {
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.color-indicator {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: $radius-full;
  border: 1px solid rgba($color-white, 0.2);
}

.price-and-qty {
  @include flex-between;
  margin-top: auto;
}

.item-price {
  font-size: 0.95rem;
  font-weight: 700;
  color: $color-text;
}

.action-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.qty-controls {
  display: flex;
  align-items: center;
  border: 1px solid $color-border;
  border-radius: $radius-sm;
  background-color: $color-bg;
}

.qty-btn {
  width: 28px;
  height: 28px;
  @include flex-center;
  color: $color-text-muted;
  transition: $transition-fast;
  font-size: 1rem;

  &:hover:not(:disabled) {
    color: $color-text;
    background-color: $color-white-hover;
  }

  &:disabled {
    opacity: 0.25;
    cursor: not-allowed;
  }
}

.qty-val {
  width: 28px;
  text-align: center;
  font-size: 0.85rem;
  font-weight: 600;
  color: $color-text;
}

.remove-btn {
  color: $color-text-muted;
  @include flex-center;
  transition: $transition-fast;
  padding: 0.25rem;
  border-radius: $radius-sm;

  &:hover {
    color: $color-danger;
    background-color: rgba($color-danger, 0.1);
  }
}
</style>
