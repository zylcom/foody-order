<script setup>
import { computed } from "vue";
import { isNumberKey } from "../utils";

const props = defineProps({ quantity: Number });
const emit = defineEmits(["update:quantity"]);

const quantityItem = computed(() => props.quantity);

function onInputQuantity() {
  const maxLength = 3;
  const maxValue = 999;
  const minValue = 1;

  if (this.value.length > maxLength) {
    this.value = this.value.slice(0, maxLength);
  }
  if (this.value > maxValue) this.value = maxValue;
  if (this.value < minValue) this.value = minValue;

  emit("update:quantity", +this.value.slice(0, maxLength));
}
</script>

<template>
  <input
    type="number"
    class="bg-mercury text-center font-rubik text-sm focus:outline-none focus:ring-0"
    min="1"
    max="999"
    :value="quantityItem"
    :oninput="onInputQuantity"
    :onkeypress="isNumberKey"
  />
</template>
