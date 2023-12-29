import { computed, ref } from "vue";
import { defineStore } from "pinia";
import {
  calculateTotalItems,
  calculateTotalPrice,
  saveCartToLocalstorage,
} from "../utils";
import { useAuthUserStore } from "./authUser";
import cartService from "../services/cart-service";

export const useCartStore = defineStore("Cart", () => {
  const cart = ref({});
  const authUserStore = useAuthUserStore();
  const getMyCart = computed(() => cart.value);

  function setMyCart(cartData) {
    cart.value = {
      ...cartData,
      totalItems: calculateTotalItems(cartData.cartItems),
      totalPrice: calculateTotalPrice(cartData.cartItems),
    };

    saveCartToLocalstorage(cart.value);
  }

  function upsertItem(item) {
    const copyItems = [...cart.value.cartItems];
    const index = copyItems.findIndex(
      (val) => val.productSlug === item.productSlug,
    );

    if (index === -1) {
      copyItems.push(item);
    } else {
      copyItems[index] = item;
    }

    const infoMessage =
      cart.value.cartItems.length === copyItems.length ? "Updated" : "Added";

    setMyCart({ cartItems: copyItems });

    return infoMessage;
  }

  function getItem(productSlug) {
    const cart = getMyCart;

    return cart.value.cartItems.find(
      (item) => item.product?.slug === productSlug,
    );
  }

  function deleteItem(itemProductSlug) {
    const updatedItems = cart.value.cartItems.filter(
      (item) => item.product.slug !== itemProductSlug,
    );

    setMyCart({ cartItems: updatedItems });

    return "Item deleted!";
  }

  async function $reset() {
    const authUser = computed(() => authUserStore.authUser);

    if (authUser.value) {
      await cartService.clearCart();
    }

    setMyCart({ cartItems: [], totalPrice: 0 });
  }

  return {
    cart,
    getMyCart,
    deleteItem,
    getItem,
    setMyCart,
    upsertItem,
    $reset,
  };
});
