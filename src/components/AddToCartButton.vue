<script setup>
import { computed } from "vue";
import { useToast } from "vue-toast-notification";
import cartService from "@/services/cart-service";
import { allStore } from "@/stores";
import { useLoading } from "@/composables/useLoading";

const props = defineProps({
  product: Object,
  quantity: Number,
  cartItem: Object,
});

const $toast = useToast();

const { authUserStore, cartStore } = allStore();
const authUser = computed(() => authUserStore.authUser);
const cartItem = computed(() => props.cartItem);
const quantity = computed(() => props.quantity);
const product = computed(() => props.product);
const { isLoading, showLoading, hideLoading } = useLoading();

async function addToCartHandler() {
  showLoading();

  try {
    let result;

    if (authUser.value) {
      result = await cartService.upsert({
        productSlug: product.value.slug,
        quantity: quantity.value,
      });
    } else {
      result = cartStore.upsertItem({
        productSlug: product.value.slug,
        quantity: quantity.value,
        product: product.value,
      });
    }

    $toast.success(`${result} success!`, { position: "top", duration: 1000 });
  } catch (error) {
    console.log(error);

    $toast.error("Something went wrong!", { position: "top" });
  } finally {
    hideLoading();
  }
}
</script>

<template>
  <button
    class="mt-6 w-full rounded-lg py-2 font-rubik text-charolais-cattle"
    :class="{
      'cursor-wait bg-mercury text-gray-500': quantity < 1 || isLoading,
      'bg-torii-red/80 hover:bg-torii-red/90 active:bg-torii-red':
        !isLoading && quantity > 0,
    }"
    :disabled="!(quantity > 0) ? true : isLoading ? true : false"
    @click="addToCartHandler()"
  >
    {{ cartItem?.product?.id ? "Update" : "Add to cart" }}
  </button>
</template>
