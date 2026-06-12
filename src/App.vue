<script setup>
import Navbar from '@/components/Navbar.vue';
import CartDrawer from '@/components/CartDrawer.vue';
</script>

<template>
  <div class="app-wrapper">
    <Navbar />
    <main class="main-content">
      <router-view />
    </main>
    <CartDrawer />
  </div>
</template>

<style lang="scss">
@use '@/styles/variables' as *;

.app-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex-grow: 1;
}
</style>
