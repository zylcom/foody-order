<script setup>
import { computed, onMounted } from "vue";
import ProductCard from "./ProductCard.vue";
import productService from "@/services/product-service";
import { useBestRatedProductsStore } from "@/stores/bestRatedProducts";
import { useLoading } from "@/composables/useLoading";
import ProductCardSkeleton from "./ProductCardSkeleton.vue";
import GalleryWrapper from "./GalleryWrapper.vue";

const props = defineProps({
  title: String,
  category: String,
});

const bestRatedProductsStore = useBestRatedProductsStore();
const category = computed(() => props.category);
const bestRatedProducts = computed(() =>
  category.value === "food"
    ? bestRatedProductsStore.foods
    : bestRatedProductsStore.drinks,
);
const { isLoading, showLoading, hideLoading } = useLoading();

onMounted(async () => {
  showLoading();

  try {
    await productService.getBestRated(category.value);
  } catch (error) {
    // console.log(error);
  } finally {
    hideLoading();
  }
});
</script>

<template>
  <section class="relative mb-52">
    <h1 class="text-sm font-medium">{{ title }}</h1>

    <GalleryWrapper v-if="isLoading">
      <ProductCardSkeleton
        class="p-2"
        v-for="i in 5"
        :key="i"
        :isLoading="isLoading"
      />
    </GalleryWrapper>

    <GalleryWrapper v-else-if="!isLoading && bestRatedProducts.length > 0">
      <ProductCard
        class="p-2"
        v-for="popularProduct in bestRatedProducts"
        :key="popularProduct.id"
        :product="popularProduct"
        showLikesCountAndAverageRating
      />
    </GalleryWrapper>

    <p class="translate-y-6 text-center font-rubik" v-else>Empty</p>
  </section>
</template>
