<script setup>
import { computed, ref, watch } from "vue";
import { useToast } from "vue-toast-notification";
import cartService from "@/services/cart-service";
import IconMinus from "./icons/IconMinus.vue";
import IconPlus from "./icons/IconPlus.vue";
import IconTrash from "./icons/IconTrash.vue";
import QuantityInput from "./QuantityInput.vue";
import { allStore } from "@/stores";
import { useLoading } from "@/composables/useLoading";
import { formatNumberToIDR } from "../utils";

const props = defineProps({
  quantity: Number,
  product: Object,
});

const $toast = useToast();
const { authUserStore, cartStore } = allStore();
const authUser = computed(() => authUserStore.authUser);
const product = computed(() => props.product);
const formattedTotalPrice = computed(() =>
  formatNumberToIDR(props.product.price * (props.quantity || 1)),
);
const qty = ref(props.quantity || 1);
const counterTimeoutId = ref();
const deleteItemTimeoutId = ref();
const itemWrapper = ref();
const deleteItemButton = ref();

const { hideLoading, showLoading } = useLoading();

async function updateCart(quantity) {
  showLoading();

  $toast.clear();

  try {
    if (authUser.value) {
      await cartService.upsert({
        productSlug: product.value.slug,
        quantity,
      });
    } else {
      cartStore.upsertItem({
        productSlug: product.value.slug,
        quantity,
        product: product.value,
      });
    }

    $toast.success("Your item updated.", { position: "top" });
  } catch (error) {
    console.log(error);

    $toast.error(
      "Failed to update the item. Please reload the page and try again.",
      { position: "top" },
    );
  } finally {
    hideLoading();
  }
}

async function removeItemHandler() {
  clearTimeout(deleteItemTimeoutId.value);
  $toast.clear();

  if (confirm("Delete this item? You will not able to recover it.")) {
    showLoading();

    itemWrapper.value.classList.remove("h-20");
    itemWrapper.value.classList.add("h-0");

    deleteItemTimeoutId.value = setTimeout(async () => {
      try {
        if (authUser.value) {
          await cartService.deleteItem(product.value.slug);
        } else {
          cartStore.deleteItem(product.value.slug);
        }

        $toast.success("Your item has been deleted.", { position: "top" });
      } catch (error) {
        $toast.error(
          "Failed to delete item. Please reload the page and try again.",
          {
            position: "top",
          },
        );

        itemWrapper.value.classList.remove("h-0");
        itemWrapper.value.classList.add("h-20");
      } finally {
        hideLoading();
      }
    }, 777);
  }
}

watch(qty, (newValue) => {
  clearTimeout(counterTimeoutId.value);

  counterTimeoutId.value = setTimeout(async () => {
    updateCart(newValue);
  }, 500);
});
</script>

<template>
  <div
    class="relative flex h-20 w-full items-center overflow-hidden rounded-md bg-bleached-silk shadow-md transition-all duration-700 before:absolute before:top-0 before:h-full before:w-0 before:rounded-md before:bg-red-500/80 before:transition-all before:duration-500 before:content-['']"
    ref="itemWrapper"
  >
    <button
      class="group relative m-2 min-w-max"
      title="Delete this item?"
      ref="deleteItemButton"
      @click="removeItemHandler()"
      @mouseenter="
        () => {
          itemWrapper.classList.remove('before:w-0');
          itemWrapper.classList.add('before:w-full');
        }
      "
      @mouseleave="
        () => {
          itemWrapper.classList.remove('before:w-full');
          itemWrapper.classList.add('before:w-0');
        }
      "
    >
      <img
        class="h-14 w-14 min-w-max rounded-md"
        :src="product.image"
        :alt="product.name"
      />
      <IconTrash
        class="absolute top-0 mx-auto h-14 rounded-md bg-black/80 stroke-torii-red opacity-5 transition-all duration-700 group-hover:opacity-100"
      />
    </button>

    <div class="relative w-max overflow-hidden font-rubik">
      <RouterLink
        :to="'/menu/' + product.slug"
        class="overflow-hidden truncate text-xs font-semibold tracking-widest"
        :title="product.name"
      >
        {{ product.name }}
      </RouterLink>

      <span class="block truncate text-[.65rem]" :title="product.description">
        {{ product.description }}
      </span>

      <span class="mt-1 block truncate font-roboto text-[.65rem]">
        {{ formatNumberToIDR(product.price) }}
      </span>
    </div>

    <div class="ml-auto mr-2">
      <div
        class="relative flex w-fit rounded-2xl bg-mercury px-1 py-1.5 text-thamar-black"
      >
        <button
          class="mr-3 block"
          @click="qty <= 1 ? qty : qty--"
          :disabled="qty <= 1 ? true : false"
        >
          <IconMinus class="w-4 stroke-dark-tone-ink hover:scale-110" />
        </button>

        <QuantityInput v-model:quantity="qty" />

        <button
          @click="qty > 999 ? qty : qty++"
          :disabled="qty >= 999 ? true : false"
        >
          <IconPlus class="w-4 stroke-dark-tone-ink hover:scale-110" />
        </button>
      </div>

      <span
        class="relative mt-1 block truncate text-center font-roboto text-[.65rem]"
      >
        {{ formattedTotalPrice }}
      </span>
    </div>
  </div>
</template>
