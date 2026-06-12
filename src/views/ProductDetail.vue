<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useCartStore } from '@/stores/cart';
import { useProductsStore } from '@/stores/products';
import { getProductStock, getMaxQuantity } from '@/data/stockData';

const props = defineProps({
  slug: {
    type: String,
    required: true
  }
});

const route = useRoute();
const router = useRouter();
const cartStore = useCartStore();
const productsStore = useProductsStore();

const product = ref(null);
const localError = ref(null);

const loading = computed(() => productsStore.loading);
const error = computed(() => productsStore.error || localError.value);

const selectedColor = ref('Black');
const selectedSize = ref('M');
const quantity = ref(1);
const activeThumbIndex = ref(0);
const isAddingToCart = ref(false);

const colorsList = ['Black', 'White', 'Navy', 'Red'];
const sizesList = ['S', 'M', 'L', 'XL'];

const getColorHex = (name) => {
  const map = {
    'Black': '#1a1a1a',
    'White': '#eaeaea',
    'Navy': '#1d3557',
    'Red': '#e63946'
  };
  return map[name] || '#6366f1';
};

const filterClasses = [
  'filterNormal',
  'filterBrightness',
  'filterContrast',
  'filterGrayscale'
];

const productStock = computed(() => {
  if (!product.value) return {};
  return getProductStock(product.value.id);
});

const selectedSizeStockState = computed(() => {
  if (!productStock.value) return 'available';
  return productStock.value[selectedSize.value] || 'available';
});

const maxAllowedQuantity = computed(() => {
  return getMaxQuantity(selectedSizeStockState.value);
});

const originalPrice = computed(() => product.value ? product.value.price : 0);
const salePrice = computed(() => Number((originalPrice.value * 0.9).toFixed(2)));

const getRatingClass = (rate) => {
  if (rate >= 4) return 'ratingGreen';
  if (rate >= 3) return 'ratingWarning';
  return 'ratingDanger';
};

const selectColor = (color) => {
  selectedColor.value = color;
  syncParamsToUrl();
};

const selectSize = (size) => {
  selectedSize.value = size;
  const sizeStock = productStock.value[size] || 'available';
  const newMax = getMaxQuantity(sizeStock);
  if (quantity.value > newMax) {
    quantity.value = Math.max(1, newMax);
  }
  syncParamsToUrl();
};

const incrementQty = () => {
  if (quantity.value < maxAllowedQuantity.value) {
    quantity.value++;
  }
};

const decrementQty = () => {
  if (quantity.value > 1) {
    quantity.value--;
  }
};

const handleAddToCart = () => {
  if (isAddingToCart.value || selectedSizeStockState.value === 'sold_out') return;
  
  isAddingToCart.value = true;
  cartStore.addItem(product.value, {
    colour: selectedColor.value,
    size: selectedSize.value,
    quantity: quantity.value
  });
  
  setTimeout(() => {
    isAddingToCart.value = false;
    cartStore.openDrawer();
  }, 800);
};

const syncParamsToUrl = () => {
  router.replace({
    path: route.path,
    query: {
      ...route.query,
      color: selectedColor.value,
      size: selectedSize.value
    }
  });
};

const initFromQueryParams = () => {
  if (!product.value) return;
  const stock = getProductStock(product.value.id);
  
  const querySize = route.query.size;
  if (sizesList.includes(querySize)) {
    selectedSize.value = querySize;
  } else {
    if (stock['M'] !== 'sold_out') {
      selectedSize.value = 'M';
    } else {
      selectedSize.value = sizesList.find(s => stock[s] !== 'sold_out') || 'S';
    }
  }

  const queryColor = route.query.color;
  if (colorsList.includes(queryColor)) {
    selectedColor.value = queryColor;
  } else {
    selectedColor.value = 'Black';
  }
  
  syncParamsToUrl();
};

const loadProductDetail = async () => {
  localError.value = null;
  await productsStore.fetchProducts();
  const foundProduct = productsStore.getProductBySlug(props.slug);
  if (!foundProduct) {
    localError.value = 'Product not found';
    product.value = null;
  } else {
    product.value = foundProduct;
    initFromQueryParams();
  }
};

watch(() => props.slug, () => {
  loadProductDetail();
});

onMounted(() => {
  loadProductDetail();
});
</script>

<template>
  <div class="detailPage container">
    <div class="breadcrumb">
      <router-link to="/">Catalog</router-link>
      <span>/</span>
      <span v-if="product">{{ product.title }}</span>
      <span v-else>Product Details</span>
    </div>

    <div v-if="error" class="errorContainer">
      <h3>Failed to Load Product Details</h3>
      <p>{{ error }}</p>
      <router-link to="/" class="backBtn">
        Return to Shop
      </router-link>
    </div>

    <div v-else-if="loading" class="skeletonPage">
      <div class="skeletonLayout">
        <div class="gallery">
          <div class="skeletonBox galleryMain"></div>
          <div class="skeletonBox galleryThumbs"></div>
        </div>
        <div>
          <div class="skeletonBox brand"></div>
          <div class="skeletonBox title"></div>
          <div class="skeletonBox price"></div>
          <div class="skeletonBox label"></div>
          <div class="skeletonBox swatches"></div>
          <div class="skeletonBox label"></div>
          <div class="skeletonBox sizes"></div>
          <div class="skeletonBox actions"></div>
        </div>
      </div>
    </div>

    <div v-else-if="product" class="layout">
      <div class="gallery">
        <div class="mainImgBox">
          <img 
            :src="product.image" 
            :alt="product.title" 
            :class="['mainImg', filterClasses[activeThumbIndex]]"
          />
        </div>
        
        <div class="thumbnails">
          <div 
            v-for="(filterCls, idx) in filterClasses" 
            :key="idx"
            :class="[
              'thumbBox', 
              filterCls, 
              { active: activeThumbIndex === idx }
            ]"
            @click="activeThumbIndex = idx"
          >
            <img :src="product.image" :alt="product.title" />
          </div>
        </div>
      </div>

      <div class="info">
        <span class="category">{{ product.category }}</span>
        <h1 class="title">{{ product.title }}</h1>
        <div v-if="product.rating" class="ratingRow">
          <div :class="['ratingBadge', getRatingClass(product.rating.rate)]">
            <span class="ratingRate">{{ product.rating.rate.toFixed(1) }}</span>
            <span class="starIcon">★</span>
          </div>
          <span class="ratingCount">({{ product.rating.count }} reviews)</span>
        </div>
        <div class="priceSection">
          <span class="salePrice">${{ salePrice.toFixed(2) }}</span>
          <span class="originalPrice">${{ originalPrice.toFixed(2) }}</span>
          <span class="discountBadge">10% OFF SALE</span>
        </div>

        <div class="optionSection">
          <h3 class="sectionTitle">Colour: {{ selectedColor }}</h3>
          <div class="swatches">
            <button 
              v-for="color in colorsList" 
              :key="color"
              :class="['swatchBtn', { active: selectedColor === color }]"
              :style="{ backgroundColor: getColorHex(color) }"
              @click="selectColor(color)"
              :aria-label="'Select color ' + color"
            ></button>
          </div>
        </div>

        <div class="optionSection">
          <h3 class="sectionTitle">Size</h3>
          <div class="sizes">
            <button 
              v-for="size in sizesList" 
              :key="size"
              :class="[
                'sizeBtn', 
                { 
                  active: selectedSize === size,
                  soldOut: productStock[size] === 'sold_out'
                }
              ]"
              :disabled="productStock[size] === 'sold_out'"
              @click="selectSize(size)"
            >
              {{ size }}
              <span 
                v-if="productStock[size] === 'low_stock'" 
                class="stockLabel lowStock"
              >
                Low stock
              </span>
              <span 
                v-else-if="productStock[size] === 'available'" 
                class="stockLabel available"
              >
                Available
              </span>
            </button>
          </div>
        </div>

        <div class="purchaseSection">
          <div v-if="selectedSizeStockState !== 'sold_out'" class="qtyWrapper">
            <button 
              class="qtyBtn" 
              @click="decrementQty"
              :disabled="quantity <= 1"
            >
              −
            </button>
            <span class="qtyValue">{{ quantity }}</span>
            <button 
              class="qtyBtn" 
              @click="incrementQty"
              :disabled="quantity >= maxAllowedQuantity"
            >
              +
            </button>
          </div>

          <button 
            class="addCartBtn" 
            :disabled="selectedSizeStockState === 'sold_out' || isAddingToCart"
            @click="handleAddToCart"
          >
            <template v-if="isAddingToCart">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              Adding...
            </template>
            <template v-else-if="selectedSizeStockState === 'sold_out'">
              Sold Out
            </template>
            <template v-else>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              Add to Cart
            </template>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as *;
@use '@/styles/mixins' as *;

.detailPage {
  padding: 3rem 0;
  
  @include mobile {
    padding: 1.5rem 0;
  }
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: $color-text-muted;
  margin-bottom: 2rem;
  
  a {
    transition: $transition-fast;
    &:hover {
      color: $color-primary;
    }
  }
  
  span {
    user-select: none;
  }
}

.layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3.5rem;
  align-items: start;

  @include tablet {
    gap: 2.25rem;
  }

  @include mobile {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
}

.gallery {
  @include flex-column;
  gap: 1.25rem;
}

.mainImgBox {
  background-color: $color-white;
  border-radius: $radius-lg;
  border: 1px solid $color-border;
  aspect-ratio: 1.1;
  padding: 2.5rem;
  @include flex-center;
  overflow: hidden;
  box-shadow: $shadow-sm;

  @include mobile {
    aspect-ratio: 1.15;
    padding: 1.5rem;
  }
}

.mainImg {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  transition: filter 0.3s ease;
}

.thumbnails {
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
  
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar { display: none; }
  
  @include mobile {
    scroll-snap-type: x mandatory;
    padding-bottom: 0.75rem;
  }
}

.thumbBox {
  flex-shrink: 0;
  width: calc(25% - 0.75rem);
  aspect-ratio: 1;
  background-color: $color-white;
  border: 2px solid transparent;
  border-radius: $radius-md;
  padding: 0.5rem;
  @include flex-center;
  cursor: pointer;
  transition: $transition-fast;

  &:hover { border-color: $color-border-hover; }

  &.active {
    border-color: $color-primary;
    box-shadow: 0 0 10px rgba($color-primary, 0.2);
  }

  img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }

  @include mobile {
    width: 74px;
    scroll-snap-align: start;
  }
}

.filterNormal {
  filter: none;
}

.filterBrightness {
  filter: brightness(1.2) contrast(0.9);
}

.filterContrast {
  filter: contrast(1.35) brightness(0.95);
}

.filterGrayscale {
  filter: grayscale(0.65) contrast(1.1);
}

.info {
  @include flex-column;
}

.category {
  display: inline-block;
  align-self: flex-start;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: $color-primary;
  background-color: rgba($color-primary, 0.1);
  padding: 0.35rem 0.85rem;
  border-radius: $radius-sm;
  margin-bottom: 1.25rem;
}

.title {
  font-size: 2.25rem;
  font-weight: 800;
  color: $color-text;
  line-height: 1.25;
  margin-bottom: 0.75rem;
  letter-spacing: -0.75px;
  
  @include mobile {
    font-size: 1.75rem;
  }
}

.ratingRow {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  margin-bottom: 1.5rem;
}

.ratingBadge {
  display: inline-flex;
  align-items: center;
  gap: 0.15rem;
  font-size: 0.8rem;
  padding: 0.2rem 0.55rem;
  border-radius: $radius-xs;
  font-weight: 700;
  color: $color-white;
  line-height: 1;
}

.starIcon {
  font-size: 0.8rem;
  line-height: 1;
  color: $color-white;
}

.ratingRate {
  font-weight: 700;
  line-height: 1;
  color: $color-white;
}

.ratingCount {
  font-size: 0.9rem;
  color: $color-text-muted;
  font-weight: 500;
}

.ratingGreen   { background-color: $color-price; }
.ratingWarning { background-color: $color-warning-dark; }
.ratingDanger  { background-color: $color-danger-dark; }

.priceSection {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.875rem;
  margin-bottom: 2rem;
  padding-bottom: 1.75rem;
  border-bottom: 1px solid $color-border;
}

.salePrice {
  font-size: 2rem;
  font-weight: 800;
  color: $color-price;
}

.originalPrice {
  font-size: 1.25rem;
  color: $color-text-muted;
  text-decoration: line-through;
}

.discountBadge {
  font-size: 0.875rem;
  font-weight: 700;
  color: $color-sale;
  background-color: $color-sale-bg;
  padding: 0.25rem 0.6rem;
  border-radius: $radius-sm;
}

.sectionTitle {
  font-size: 0.85rem;
  font-weight: 700;
  color: $color-text-muted;
  text-transform: uppercase;
  margin-bottom: 0.75rem;
  letter-spacing: 0.75px;
}

.optionSection {
  margin-bottom: 2rem;
}

.swatches {
  display: flex;
  gap: 1rem;
}

.swatchBtn {
  width: 38px;
  height: 38px;
  border-radius: $radius-full;
  border: 2px solid transparent;
  @include flex-center;
  transition: $transition-fast;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    width: 28px;
    height: 28px;
    border-radius: $radius-full;
    background-color: inherit;
    border: 1px solid rgba(0, 0, 0, 0.08);
  }

  &.active {
    border-color: $color-primary;
    box-shadow: 0 0 8px rgba($color-primary, 0.4);
  }

  &:hover:not(.active) {
    border-color: $color-border-hover;
    transform: scale(1.05);
  }
}

.sizes {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.sizeBtn {
  min-width: 68px;
  height: 48px;
  border: 1px solid $color-border;
  background-color: $color-white;
  color: $color-text;
  font-weight: 600;
  font-size: 0.95rem;
  border-radius: $radius-md;
  @include flex-column;
  align-items: center;
  justify-content: center;
  padding: 0 0.5rem;
  transition: $transition-fast;

  &:hover:not(.soldOut):not(.active) {
    border-color: $color-border-hover;
    background-color: $color-white-hover;
  }

  &.active {
    border-color: $color-primary;
    background-color: $color-primary;
    color: $color-white;
  }

  &.soldOut {
    opacity: 0.3;
    text-decoration: line-through;
    cursor: not-allowed;
    border-color: transparent;
  }

  .stockLabel {
    font-size: 0.65rem;
    font-weight: 700;
    margin-top: 0.15rem;

    &.available { color: $color-success; }
    &.lowStock  { color: $color-warning; }
  }
}

.purchaseSection {
  display: flex;
  gap: 1.25rem;
  margin-top: 1rem;
  align-items: center;
  
  @include mobile {
    flex-direction: column;
    align-items: stretch;
  }
}

.qtyWrapper {
  display: flex;
  align-items: center;
  border: 1px solid $color-border;
  border-radius: $radius-md;
  background-color: $color-white;
  height: 52px;
  flex-shrink: 0;
  
  @include mobile {
    justify-content: space-between;
  }
}

.qtyBtn {
  width: 44px;
  height: 100%;
  @include flex-center;
  font-size: 1.25rem;
  color: $color-text-muted;
  transition: $transition-fast;

  &:hover:not(:disabled) {
    color: $color-text;
    background-color: $color-white-hover;
  }

  &:disabled {
    opacity: 0.25;
    cursor: not-allowed;
  }
}

.qtyValue {
  width: 38px;
  text-align: center;
  font-weight: 700;
  font-size: 1rem;
  color: $color-text;
}

.addCartBtn {
  flex-grow: 1;
  @include btn-primary;
  height: 52px;
  font-size: 1rem;
  gap: 0.75rem;

  &:disabled {
    background-color: $color-white-hover;
    border: 1px solid $color-border;
    color: $color-text-muted;
    cursor: not-allowed;
    box-shadow: none;
    opacity: 0.45;
    transform: none;
  }
}

.errorContainer {
  @include flex-column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 1.5rem;
  padding: 6rem 2rem;
  background-color: $color-white;
  border: 1px solid $color-border;
  border-radius: $radius-lg;
  color: $color-text-muted;

  h3 {
    color: $color-danger;
    font-size: 1.5rem;
    font-weight: 700;
  }
}

.backBtn {
  @include btn-primary(0.75rem 1.75rem);
  font-weight: 600;
}

.skeletonPage {
  padding: 3rem 0;
}

.skeletonLayout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3.5rem;
  
  @include mobile {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
}

// @keyframes pulse is defined globally in global.scss

.skeletonBox {
  border-radius: $radius-lg;
  animation: pulse 1.5s infinite ease-in-out;
  
  &.galleryMain {
    aspect-ratio: 1.1;
    margin-bottom: 1.25rem;
  }
  &.galleryThumbs {
    height: 80px;
    width: 100%;
  }
  &.brand {
    height: 1.5rem;
    width: 80px;
    margin-bottom: 1.25rem;
    border-radius: $radius-sm;
  }
  &.title {
    height: 3rem;
    width: 90%;
    margin-bottom: 1.25rem;
  }
  &.price {
    height: 2.25rem;
    width: 40%;
    margin-bottom: 2.25rem;
  }
  &.label {
    height: 1.25rem;
    width: 100px;
    margin-bottom: 0.75rem;
  }
  &.swatches {
    height: 40px;
    width: 180px;
    margin-bottom: 2rem;
  }
  &.sizes {
    height: 48px;
    width: 320px;
    margin-bottom: 2rem;
  }
  &.actions {
    height: 52px;
    width: 100%;
  }
}
</style>
