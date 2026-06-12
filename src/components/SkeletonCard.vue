<template>
  <div class="skeleton">
    <div class="image"></div>
    <div class="content">
      <div class="title1"></div>
      <div class="title2"></div>
      <div class="price"></div>
      <div class="button"></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as *;
@use '@/styles/mixins' as *;

.skeleton {
  @include card-base;
  gap: 1rem;
  overflow: hidden;
}

.image {
  width: 100%;
  aspect-ratio: 1;
  border-radius: $radius-md;
  animation: pulse 1.5s infinite ease-in-out;
}

.content {
  @include flex-column;
  flex-grow: 1;
  gap: 0.75rem;
}

.title1 {
  height: 1.1rem;
  width: 85%;
  border-radius: $radius-sm;
  animation: pulse 1.5s infinite ease-in-out;
}

.title2 {
  height: 1.1rem;
  width: 55%;
  border-radius: $radius-sm;
  animation: pulse 1.5s infinite ease-in-out;
}

.price {
  height: 1.5rem;
  width: 35%;
  border-radius: $radius-sm;
  animation: pulse 1.5s infinite ease-in-out;
  margin-top: auto;
}

.button {
  height: 2.75rem;
  width: 100%;
  border-radius: $radius-md;
  animation: pulse 1.5s infinite ease-in-out;
}
</style>
