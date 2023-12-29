import { defineStore } from "pinia";
import { ref } from "vue";

export const useBestRatedProductsStore = defineStore(
  "Best Rated Products",
  () => {
    const foods = ref([]);
    const drinks = ref([]);

    function setFoods(data) {
      foods.value = data;
    }

    function setDrinks(data) {
      drinks.value = data;
    }

    return { foods, drinks, setDrinks, setFoods };
  },
);
