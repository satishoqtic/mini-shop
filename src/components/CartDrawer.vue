<script setup>
import { ref, computed } from 'vue';
import { useCartStore } from '@/stores/cart';
import SuccessModal from '@/components/SuccessModal.vue';
import CartItem from '@/components/CartItem.vue';

const cartStore = useCartStore();
const showSuccessModal = ref(false);

const isOpen = computed(() => cartStore.isDrawerOpen);
const cartItems = computed(() => cartStore.items);
const subtotal = computed(() => cartStore.subtotal);
const grandTotal = computed(() => cartStore.grandTotal);

const closeCart = () => {
  cartStore.closeDrawer();
};

const handleCheckout = () => {
  showSuccessModal.value = true;
  cartStore.clearCart();
  cartStore.closeDrawer();
};
</script>

<template>
  <div>
    <div 
      class="overlay" 
      :class="{ active: isOpen }" 
      @click="closeCart"
    ></div>

    <div class="drawer" :class="{ active: isOpen }">
      
      <div class="header">
        <h2>Shopping Cart</h2>
        <button 
          class="close-btn" 
          @click="closeCart"
          aria-label="Close cart"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <div class="items-list">
        <template v-if="cartItems.length > 0">
          <CartItem
            v-for="item in cartItems"
            :key="item.id"
            :item="item"
          />
        </template>
        
        <template v-else>
          <div class="empty-state">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            <p>Your shopping cart is empty</p>
            <a href="/" class="shop-now-btn">
              Shop Now
            </a>
          </div>
        </template>
      </div>

      <div v-if="cartItems.length > 0" class="footer">
        <div class="bill-row">
          <span>Subtotal</span>
          <span>${{ subtotal.toFixed(2) }}</span>
        </div>
        <div class="bill-row">
          <span>Shipping</span>
          <span style="color: #10b981;">FREE</span>
        </div>
        <div class="bill-row total">
          <span>Grand Total</span>
          <span>${{ grandTotal.toFixed(2) }}</span>
        </div>
        <button class="checkout-btn" @click="handleCheckout">
          Proceed to Checkout
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </button>
      </div>
    </div>

    <SuccessModal :show="showSuccessModal" @close="showSuccessModal = false" />
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as *;
@use '@/styles/mixins' as *;

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(5, 7, 12, 0.6);
  backdrop-filter: blur(4px);
  z-index: 200;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease-out;
  
  &.active {
    opacity: 1;
    pointer-events: auto;
  }
}

.drawer {
  position: fixed;
  top: 0;
  right: 0;
  width: 440px;
  max-width: 100%;
  height: 100vh;
  background-color: $color-white;
  border-left: 1px solid $color-border;
  z-index: 201;
  @include flex-column;
  box-shadow: $shadow-lg;
  transform: translateX(100%);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &.active { transform: translateX(0); }

  @include mobile { width: 85%; }
}

.header {
  padding: 1.5rem;
  border-bottom: 1px solid $color-border;
  @include flex-between;

  h2 {
    font-size: 1.25rem;
    font-weight: 700;
    color: $color-text;
  }
}

.close-btn {
  color: $color-text-muted;
  transition: $transition-fast;
  @include flex-center;
  width: 32px;
  height: 32px;
  border-radius: $radius-full;

  &:hover {
    color: $color-text;
    background-color: $color-white-hover;
  }
}

.items-list {
  flex-grow: 1;
  overflow-y: auto;
  padding: 1.5rem;
  @include flex-column;
  gap: 1.25rem;
}

.empty-state {
  @include flex-column;
  align-items: center;
  justify-content: center;
  gap: 1.25rem;
  height: 100%;
  color: $color-text-muted;
  text-align: center;
  padding: 2rem;

  svg {
    opacity: 0.3;
    color: $color-text-muted;
  }

  p { font-size: 0.95rem; }

  .shop-now-btn {
    @include btn-primary(0.75rem 1.75rem);
    font-size: 0.875rem;
    font-weight: 600;
    margin-top: 0.5rem;
  }
}

.footer {
  padding: 1.5rem;
  border-top: 1px solid $color-border;
  background-color: rgba($color-white, 0.95);
}

.bill-row {
  @include flex-between;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  color: $color-text-muted;

  &.total {
    font-size: 1.15rem;
    font-weight: 700;
    color: $color-text;
    border-top: 1px solid $color-border;
    padding-top: 0.75rem;
    margin-top: 0.75rem;
    margin-bottom: 1.25rem;
  }
}

.checkout-btn {
  @include btn-primary(1rem);
  width: 100%;
  font-size: 0.95rem;

  &:hover {
    box-shadow: 0 4px 16px rgba($color-primary, 0.35);
  }
}
</style>
