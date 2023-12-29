<script setup>
import { computed, ref } from "vue";
import AddToCartButton from "./AddToCartButton.vue";
import IconStar from "./icons/IconStar.vue";
import LikeButton from "./LikeButton.vue";
import QuantityInput from "./QuantityInput.vue";
import ReviewComponent from "@/components/ReviewComponent.vue";
import { allStore } from "../stores";
import { formatFloatNumber, formatNumber, formatNumberToIDR } from "../utils";

const props = defineProps({
  product: Object,
  isLiked: Boolean,
});

const { cartStore } = allStore();
const formattedPrice = computed(() => formatNumberToIDR(props.product.price));
const product = computed(() => props.product);
const cartItem = computed(() => cartStore.getItem(product.value.slug));
const formattedAverageRating = computed(() =>
  formatFloatNumber(product.value.averageRating),
);

const quantity = ref(cartItem.value?.quantity || 1);
const total = computed(() =>
  formatNumberToIDR(product.value.price * quantity.value),
);
</script>

<template>
  <div
    class="relative mt-64 rounded-t-2xl bg-zhen-zhu-bai-pearl px-5 py-4 pt-8 md:mt-16 md:overflow-scroll md:pt-0"
  >
    <div class="sticky top-0 z-10 bg-zhen-zhu-bai-pearl pb-5">
      <span class="pb-3 text-xs font-semibold uppercase">Foods</span>

      <h1 class="mb-3 font-roboto text-2xl font-medium text-dark-tone-ink">
        {{ product.name }}
      </h1>

      <div class="flex items-center justify-between">
        <span class="font-rubik font-semibold">{{ formattedPrice }}</span>

        <div class="grid grid-cols-2 justify-items-center gap-x-2">
          <IconStar class="order-1 h-6 w-6 fill-spandex-green" />

          <span class="order-3 font-rubik text-sm font-bold" title="Rating">
            {{ formattedAverageRating }}
          </span>

          <LikeButton :isLiked="isLiked" />

          <span class="order-4 font-rubik text-sm">
            {{ formatNumber(product?.likes.length || 0) }}
          </span>
        </div>
      </div>
    </div>

    <div
      class="container grid grid-cols-3 [&>div]:order-2 [&>div]:col-span-3 [&>div]:hidden [&>div]:min-h-[200px] [&>div]:pt-4 [&>input:checked+label+div]:block [&>input:checked+label]:border-b-2 [&>input:checked+label]:border-b-torii-red [&>input]:order-1 [&>input]:hidden [&>label]:sticky [&>label]:top-32 [&>label]:z-10 [&>label]:cursor-pointer [&>label]:border-b-2 [&>label]:border-b-torii-red/40 [&>label]:bg-zhen-zhu-bai-pearl"
    >
      <input type="radio" name="tab" id="tab-1" checked />
      <label for="tab-1">Description</label>
      <div>
        <p class="text-sm">{{ product.description }}</p>

        <div class="mt-11 grid grid-cols-2">
          <div class="">
            <span class="mb-1 ml-3 block text-sm uppercase text-dark-tone-ink">
              Quantity
            </span>

            <div
              class="flex w-fit rounded-2xl bg-mercury px-3 py-1 text-thamar-black"
            >
              <button
                class="mr-3 block"
                @click="quantity < 1 ? quantity : quantity--"
                :disabled="quantity < 1 ? true : false"
              >
                -
              </button>

              <QuantityInput v-model:quantity="quantity" />

              <button
                @click="quantity > 999 ? quantity : quantity++"
                :disabled="quantity >= 999 ? true : false"
              >
                +
              </button>
            </div>
          </div>

          <div class="">
            <span class="mb-1 ml-2 block text-sm uppercase text-dark-tone-ink">
              Total Price
            </span>

            <span
              class="block w-fit min-w-[100px] rounded-2xl bg-mercury px-3 py-1 text-thamar-black"
            >
              {{ total }}
            </span>
          </div>
        </div>

        <AddToCartButton
          :quantity="quantity"
          :product="product"
          :cartItem="cartItem"
        />
      </div>

      <input type="radio" name="tab" id="tab-2" />
      <label class="text-center" for="tab-2">Details</label>
      <div>
        <h3 class="mb-2 font-semibold text-thamar-black">Ingredients:</h3>

        <p class="text-sm">{{ product.ingredients }}</p>
      </div>

      <input type="radio" name="tab" id="tab-3" />
      <label class="text-right" for="tab-3">Reviews</label>
      <div class="relative z-0 px-1">
        <ReviewComponent :reviewsLength="product.reviews.length" />
      </div>
    </div>
  </div>
</template>
