<script setup>
import gsap from "gsap";
import { computed, onMounted, ref } from "vue";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ProductCard from "./ProductCard.vue";
import ProductCardSkeleton from "./ProductCardSkeleton.vue";
import { allStore } from "@/stores";
import { useInfinite } from "@/composables/useInfinite";
import { useLoading } from "@/composables/useLoading";

gsap.registerPlugin(ScrollTrigger);

const props = defineProps({
  title: String,
  keyword: String,
});

const { productsStore } = allStore();
const target = ref();
const products = computed(() => productsStore.products);
const hasNextPage = computed(() => productsStore.hasNextPage);
const cursor = computed(() => productsStore.cursor);
const searchKeyword = computed(() => props.keyword);

const { fetchData, fetchNextPage, infiniteScroll } = useInfinite();
const { isLoading, showLoading, hideLoading } = useLoading();

onMounted(async () => {
  showLoading();

  productsStore.$reset();

  infiniteScroll(target, async () => {
    showLoading();

    try {
      await fetchNextPage({ name: searchKeyword.value, cursor: cursor.value });
    } catch (error) {
      console.log(error);
    } finally {
      hideLoading();
    }
  });

  try {
    await fetchData({ name: searchKeyword.value });
  } catch (error) {
    console.log(error);
  } finally {
    hideLoading();
  }
});
</script>

<template>
  <section>
    <h1 class="text-sm font-medium">{{ title }}</h1>

    <div class="food-list mt-5 flex flex-col gap-y-5">
      <div
        v-if="products.length > 0"
        class="grid gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      >
        <ProductCard
          v-for="(product, index) in products"
          :key="product.id"
          :product="product"
          :id="'product-card-' + (index + 1)"
          class="p-2"
          showLikesCountAndAverageRating
        />

        <ProductCardSkeleton
          class="p-2"
          v-for="i in 10"
          :key="i"
          :isLoading="isLoading"
        />
      </div>

      <div class="pb-16 text-center" ref="target">
        <span v-if="isLoading"> Loading... </span>
        <span v-else-if="products.length < 1">Products not found!</span>
        <span v-else-if="!hasNextPage">That's a wrap!</span>

        <button
          v-else-if="!isLoading && hasNextPage"
          class="mt-3 cursor-pointer rounded bg-seljuk-blue/50 px-5 py-1"
          @click="fetchNextPage({ name: searchKeyword, cursor })"
        >
          Load more!
        </button>
      </div>
    </div>
  </section>
</template>
