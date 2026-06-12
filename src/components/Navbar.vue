<script setup>
import { computed } from 'vue';
import { useCartStore } from '@/stores/cart';

const cartStore = useCartStore();
const totalCount = computed(() => cartStore.totalCount);
</script>

<template>
  <nav class="navbar">
    <div class="nav-container container">
      <a href="/" class="logo">
        Satish<span>Store</span>
      </a>

      <button 
        class="cart-button" 
        @click="cartStore.toggleDrawer"
      >
        <svg 
          width="20" 
          height="20" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          stroke-width="2" 
          stroke-linecap="round" 
          stroke-linejoin="round"
        >
          <circle cx="9" cy="21" r="1"></circle>
          <circle cx="20" cy="21" r="1"></circle>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
        </svg>
        
        <span 
          v-if="totalCount > 0" 
          :key="totalCount" 
          class="badge"
        >
          {{ totalCount }}
        </span>
      </button>
    </div>
  </nav>
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as *;
@use '@/styles/mixins' as *;

.navbar {
  position: sticky;
  top: 0;
  left: 0;
  width: 100%;
  height: 70px;
  background-color: rgba($color-bg, 0.75);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid $color-border;
  z-index: 100;
  display: flex;
  align-items: center;
  transition: $transition-normal;
}

.nav-container {
  @include flex-between;
  width: 100%;
}

.logo {
  font-size: 1.5rem;
  font-weight: 800;
  letter-spacing: -0.5px;
  color: $color-text;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  user-select: none;

  span { color: $color-primary; }
}

.cart-button {
  position: relative;
  width: 44px;
  height: 44px;
  border-radius: $radius-full;
  background-color: $color-white;
  border: 1px solid $color-border;
  @include flex-center;
  color: $color-text;
  transition: $transition-fast;

  &:hover {
    color: $color-primary;
    border-color: $color-border-hover;
    background-color: $color-white-hover;
    transform: translateY(-2px);
  }

  &:active { transform: translateY(0); }
}

.badge {
  position: absolute;
  top: -4px;
  right: -4px;
  background-color: $color-primary;
  color: $color-white;
  font-size: 0.7rem;
  font-weight: 800;
  min-width: 18px;
  height: 18px;
  border-radius: $radius-full;
  @include flex-center;
  padding: 0 4px;
  box-shadow: 0 0 10px rgba($color-primary, 0.5);
  animation: popScale 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes popScale {
  0% {
    transform: scale(0.5);
  }
  100% {
    transform: scale(1);
  }
}
</style>
