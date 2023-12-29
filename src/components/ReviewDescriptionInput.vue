<script setup>
import IconSend from "./icons/IconSend.vue";

defineProps({ description: String });
defineEmits(["update:description"]);
</script>

<template>
  <input
    type="text"
    placeholder="Leave review (optional)"
    class="w-full rounded-[10px] px-1 py-2 pr-10 focus:outline-none focus:ring-0"
    :value="description"
    @input="$emit('update:description', $event.target.value)"
    autofocus
  />

  <button
    type="submit"
    class="absolute right-3 top-3 hover:scale-125"
    title="Send review"
  >
    <IconSend />
  </button>
</template>
