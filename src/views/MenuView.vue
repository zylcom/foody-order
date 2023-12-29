<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import CartButton from "@/components/CartButton.vue";
import CategoryButton from "@/components/CategoryButton.vue";
import categoryService from "@/services/category-service";
import MenuList from "@/components/MenuList.vue";
import ProductTagButtonList from "@/components/ProductTagButtonList.vue";
import SearchBar from "@/components/SearchBar.vue";
import tagService from "@/services/tag-service";
import { allStore } from "@/stores";
import { clearKeyword } from "@/utils";

const route = useRoute();
const router = useRouter();
const { categoryStore, tagStore } = allStore();
const currentCategory = computed(
  () => route.query.category || categoryStore.category,
);
const categories = computed(() => categoryStore.categoryList);
const tag = computed(() => route.query.tag || tagStore.tag);
const tags = computed(() => tagStore.tagList);
const keyword = ref(route.query["product-name"] || "");

function changeCategoryHandler(categoryName) {
  categoryStore.changeCategory(categoryName);
  tagStore.changeTag("");

  router.push({
    path: "menu",
    query: {
      category: categoryName,
      "product-name": clearKeyword(keyword.value) || undefined,
    },
  });
}

function changeTagHandler(tagName) {
  router.push({
    path: "menu",
    query: {
      category: currentCategory.value,
      tag: tagName === "" ? undefined : tagName,
      "product-name": clearKeyword(keyword.value),
    },
  });

  tagStore.changeTag(tagName);
}

onMounted(async () => {
  try {
    await categoryService.get();
    await tagService.get(currentCategory.value);
  } catch (error) {
    console.log(error);
  }
});

watch(currentCategory, async (newValue) => {
  await tagService.get(newValue);
});
</script>

<template>
  <header class="inline bg-bleached-silk pt-9">
    <div class="relative flex justify-center pt-10">
      <h1 class="ml-10 w-full text-center text-2xl font-medium">Menu</h1>

      <CartButton class="mr-6" />
    </div>

    <div
      class="sticky top-0 flex justify-center gap-x-2.5 bg-bleached-silk px-6 py-4"
    >
      <SearchBar
        v-model:keyword="keyword"
        :category="currentCategory"
        :tag="tag"
      />
    </div>
  </header>

  <main class="min-h-[70vh] rounded-t-[20px] bg-zhen-zhu-bai-pearl">
    <div
      class="sticky top-16 z-20 rounded-t-[20px] bg-zhen-zhu-bai-pearl px-5 py-8"
    >
      <div class="flex justify-center gap-x-2.5">
        <CategoryButton
          v-for="category in categories"
          :key="category.id"
          :text="category.name"
          :class="
            currentCategory === category.slug
              ? 'bg-torii-red text-bleached-silk'
              : 'bg-charolais-cattle text-gray-500'
          "
          @click="changeCategoryHandler(category.slug)"
        />
      </div>

      <ProductTagButtonList
        :tag="tag"
        :tags="tags"
        :onClickHandler="changeTagHandler"
      />
    </div>

    <MenuList :category="currentCategory" :tag="tag" :keyword="keyword" />
  </main>
</template>
