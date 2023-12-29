<script setup>
defineProps({
  path: String,
  pathName: String,
  icon: Object,
  activeColor: String,
});

const strokeVariants = {
  default: "stroke-gray-600",
  "torii-red": "stroke-torii-red",
  "chocobo-feather": "stroke-chocobo-feather",
  "heirloom-hydrangea": "stroke-heirloom-hydrangea",
  "venetian-nights": "stroke-venetian-nights",
};
const textVariants = {
  default: "text-gray-600",
  "torii-red": "text-torii-red",
  "chocobo-feather": "text-chocobo-feather",
  "heirloom-hydrangea": "text-heirloom-hydrangea",
  "venetian-nights": "text-venetian-nights",
};

function navigation(navigateFunction, isActive) {
  isActive ? window.scrollTo(0, 0) : navigateFunction();
}
</script>

<template>
  <RouterLink :to="path" custom v-slot="{ isActive, navigate }">
    <button
      class="flex flex-col items-center justify-end"
      @click="navigation(navigate, isActive)"
    >
      <component
        :is="icon"
        :isActive="isActive"
        :class="strokeVariants[isActive ? activeColor : 'default']"
      />

      <span
        :class="textVariants[isActive ? activeColor : 'default']"
        class="text-[length:9px]"
      >
        {{ pathName }}
      </span>
    </button>
  </RouterLink>
</template>
