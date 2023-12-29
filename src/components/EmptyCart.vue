<script setup>
import IconPlus from "@/components/icons/IconPlus.vue";
</script>

<template>
  <div>
    <p class="mb-4">Your cart is empty!</p>

    <RouterLink
      to="/menu"
      class="flex h-fit items-center justify-center gap-x-1 text-sm text-heirloom-hydrangea hover:underline"
    >
      Add some item
      <span class="rounded-full bg-mercury p-1">
        <IconPlus class="h-4" />
      </span>
    </RouterLink>
  </div>
</template>
