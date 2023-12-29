import { defineStore } from "pinia";
import { ref } from "vue";
import { z } from "zod";
import cartService from "../services/cart-service";
import userService from "../services/user-service";
import {
  getAccessToken,
  getCartFromLocalstorage,
  getGuestUserId,
  removeAccessToken,
  saveGuestUserId,
} from "../utils";
import { useCartStore } from "./cart";

export const useAuthUserStore = defineStore("User", () => {
  const cartStore = useCartStore();
  const authUser = ref(null);
  const isLoggedIn = ref(false);

  async function setAuthUser(data) {
    const cart = getCartFromLocalstorage();
    const validGuestUserId = z
      .string({
        invalid_type_error: "Guest user id must be a string!",
        required_error: "Guest user id is required!",
      })
      .min(1, { message: "Guest user id is not allowed to be empty!" })
      .uuid({ message: "Guest user id is invalid!" })
      .safeParse(getGuestUserId());

    if (data.isLoggedIn) {
      localStorage.removeItem("guest_uid");

      authUser.value = data.userPayload;
      cartStore.setMyCart(data.userPayload.cart);
    } else {
      authUser.value = null;
      removeAccessToken();

      if (!validGuestUserId.success) {
        saveGuestUserId(data.userPayload.guestUserId);
      }

      if (!cart) {
        cartStore.setMyCart({ cartItems: [], totalPrice: 0 });
      } else {
        const result = await cartService.revalidateCart(cart);

        cartStore.setMyCart(result.data.data);
      }
    }
  }

  async function preload() {
    const token = getAccessToken();
    const guestUserId = getGuestUserId();
    const validGuestUserId = z
      .string({
        invalid_type_error: "Guest user id must be a string!",
        required_error: "Guest user id is required!",
      })
      .min(1, { message: "Guest user id is not allowed to be empty!" })
      .uuid({ message: "Guest user id is invalid!" })
      .safeParse(guestUserId);
    let userData = { isLoggedIn: false, userPayload: null };

    if (token) {
      const result = await userService.getMyProfile();

      if (result !== null) {
        userData.isLoggedIn = true;
        userData.userPayload = result.data.data;
      } else {
        window.location.reload();
      }
    } else if (guestUserId && validGuestUserId.success) {
      userData.userPayload = { guestUserId };
    } else {
      const result = await userService.createGuestUser();

      userData.userPayload = result.data.data;
    }

    setAuthUser(userData);

    return userData;
  }

  function $reset() {
    authUser.value = null;
    isLoggedIn.value = false;
  }

  return {
    authUser,
    isLoggedIn,
    preload,
    setAuthUser,
    $reset,
  };
});
