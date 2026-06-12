import { defineStore } from 'pinia';
import { getProductStock, getMaxQuantity } from '@/data/stockData';

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: JSON.parse(localStorage.getItem('cart_items')) || [],
    isDrawerOpen: false
  }),
  
  getters: {
    totalCount: (state) => {
      return state.items.reduce((sum, item) => sum + item.quantity, 0);
    },
    
    subtotal: (state) => {
      return state.items.reduce((sum, item) => sum + item.salePrice * item.quantity, 0);
    },
    
    grandTotal() {
      return this.subtotal;
    }
  },
  
  actions: {
    addItem(product, variant = {}) {
      const stock = getProductStock(product.id);
      
      let size = variant.size;
      if (!size) {
        size = ['S', 'M', 'L', 'XL'].find(s => stock[s] !== 'sold_out') || 'M';
      }
      
      const colour = variant.colour || 'Black';
      const quantityToAdd = variant.quantity || 1;
      
      const sizeStockState = stock[size] || 'available';
      const maxQty = getMaxQuantity(sizeStockState);
      
      if (maxQty === 0) {
        return false;
      }
      
      const itemId = `${product.id}-${colour}-${size}`;
      const existingItem = this.items.find(item => item.id === itemId);
      
      const salePrice = Number((product.price * 0.9).toFixed(2));
      
      if (existingItem) {
        const newQty = existingItem.quantity + quantityToAdd;
        existingItem.quantity = Math.min(newQty, maxQty);
      } else {
        this.items.push({
          id: itemId,
          productId: product.id,
          title: product.title,
          image: product.image,
          price: product.price,
          salePrice: salePrice,
          colour: colour,
          size: size,
          quantity: Math.min(quantityToAdd, maxQty),
          maxQuantity: maxQty
        });
      }
      
      this.saveToLocalStorage();
      return true;
    },
    
    removeItem(itemId) {
      this.items = this.items.filter(item => item.id !== itemId);
      this.saveToLocalStorage();
    },
    
    updateQuantity(itemId, quantity) {
      const item = this.items.find(item => item.id === itemId);
      if (item) {
        const stock = getProductStock(item.productId);
        const sizeStockState = stock[item.size] || 'available';
        const maxQty = getMaxQuantity(sizeStockState);
        
        item.quantity = Math.max(1, Math.min(quantity, maxQty));
        this.saveToLocalStorage();
      }
    },
    
    toggleDrawer() {
      this.isDrawerOpen = !this.isDrawerOpen;
    },
    
    closeDrawer() {
      this.isDrawerOpen = false;
    },
    
    openDrawer() {
      this.isDrawerOpen = true;
    },
    
    clearCart() {
      this.items = [];
      this.saveToLocalStorage();
    },
    
    saveToLocalStorage() {
      localStorage.setItem('cart_items', JSON.stringify(this.items));
    }
  }
});
