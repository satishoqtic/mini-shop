<script setup>
defineProps({
  show: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    default: 'Order Placed!'
  },
  message: {
    type: String,
    default: 'Thank you for shopping with us. Your order has been placed successfully'
  },
  buttonText: {
    type: String,
    default: 'Thank You'
  }
});

defineEmits(['close']);
</script>

<template>
  <Transition name="modal-fade">
    <div v-if="show" class="success-modal-overlay" @click.self="$emit('close')">
      <div class="success-modal-card">
        <div class="success-icon-wrapper">
          <svg class="success-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
        <h3>{{ title }}</h3>
        <p>{{ message }}</p>
        <button class="success-close-btn" @click="$emit('close')">
          {{ buttonText }}
        </button>
      </div>
    </div>
  </Transition>
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as *;
@use '@/styles/mixins' as *;

.success-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  z-index: 300;
  @include flex-center;
  padding: 1rem;
}

.success-modal-card {
  background-color: $color-white;
  border-radius: $radius-lg;
  box-shadow: $shadow-lg;
  padding: 2.5rem 2rem;
  width: 100%;
  max-width: 400px;
  text-align: center;
  @include flex-column;
  align-items: center;
  gap: 1.25rem;
  animation: modalScale 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.success-icon-wrapper {
  width: 64px;
  height: 64px;
  border-radius: $radius-full;
  background-color: rgba($color-success, 0.1);
  color: $color-success;
  @include flex-center;
  margin-bottom: 0.5rem;
}

.success-icon {
  width: 32px;
  height: 32px;
}

h3 {
  font-size: 1.40rem;
  font-weight: 800;
  color: $color-text;
  margin: 0;
}

p {
  font-size: 0.95rem;
  color: $color-text-muted;
  line-height: 1.5;
  margin: 0;
}

.success-close-btn {
  @include btn-primary(0.85rem 1.75rem);
  width: 100%;
  font-size: 0.95rem;
  font-weight: 600;
  margin-top: 0.5rem;
}

@keyframes modalScale {
  from {
    transform: scale(0.92);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.25s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
