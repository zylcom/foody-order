<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import IconDotsHorizontal from "../components/icons/IconDotsHorizontal.vue";
import IconHome from "../components/icons/IconHome.vue";
import IconHistory from "../components/icons/IconHistory.vue";
import IconMenu from "../components/icons/IconMenu.vue";
import NavigationButton from "./NavigationButton.vue";
import { useAuthUserStore } from "../stores/authUser";

const route = useRoute();
const authUserStore = useAuthUserStore();
const authUser = computed(() => authUserStore.authUser);
</script>

<template>
  <nav class="fixed bottom-0 z-50 flex w-full justify-around bg-white py-2">
    <NavigationButton
      :path="route.path === '/' ? route.fullPath : '/'"
      pathName="Home"
      :icon="IconHome"
      activeColor="chocobo-feather"
    />

    <NavigationButton
      :path="route.path === '/menu' ? route.fullPath : '/menu'"
      pathName="Menu"
      :icon="IconMenu"
      activeColor="torii-red"
    />

    <NavigationButton
      path="/history"
      pathName="History"
      :icon="IconHistory"
      activeColor="heirloom-hydrangea"
      v-if="authUser"
    />

    <NavigationButton
      path="/settings"
      pathName="More"
      :icon="IconDotsHorizontal"
      activeColor="venetian-nights"
    />
  </nav>
</template>
