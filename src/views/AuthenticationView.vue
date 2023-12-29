<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import BackButton from "../components/BackButton.vue";
import LoginInput from "../components/LoginInput.vue";
import RegisterInput from "../components/RegisterInput.vue";
import { useHideOnScroll } from "../composables/useHideOnScroll";

const route = useRouter();
const path = ref(route.currentRoute.value.name);
const navElement = ref(null);

useHideOnScroll(navElement);

function switchTab(newPath) {
  path.value = newPath;

  route.push({ path: newPath });
}
</script>

<template>
  <header class="inline">
    <nav
      class="fixed top-0 z-30 flex w-full justify-between px-6 pb-3 pt-5 backdrop-blur-md transition-all duration-500"
      ref="navElement"
    >
      <BackButton class="" />
    </nav>

    <div
      class="fixed left-0 top-0 w-full after:absolute after:left-0 after:top-0 after:z-10 after:inline-block after:h-full after:w-full after:bg-gradient-to-b after:from-black/80 after:content-['']"
    >
      <div
        class="absolute top-0 min-h-[100dvh] w-full bg-explosive-grey pt-[66.7%] shadow-md"
      >
        <img
          src="https://picsum.photos/480/320.webp"
          alt=""
          class="absolute left-0 top-0 block min-h-[100dvh] w-full object-cover object-center"
          loading="lazy"
        />
      </div>
    </div>
  </header>

  <div
    class="relative bottom-0 z-10 mt-48 w-full rounded-t-[20px] bg-white pb-4 pt-2 font-rubik md:mx-auto md:w-3/5 md:rounded-[20px]"
  >
    <div class="flex w-full justify-around text-sm">
      <button
        class="px-4 py-1"
        :class="path === 'login' ? 'border-b-2 border-torii-red' : ''"
        @click="switchTab('login')"
      >
        Login
      </button>

      <button
        class="px-4 py-1"
        :class="path === 'register' ? 'border-b-2 border-torii-red' : ''"
        @click="switchTab('register')"
      >
        Register
      </button>
    </div>

    <LoginInput v-if="path === 'login'" />

    <RegisterInput v-if="path === 'register'" />
  </div>
</template>
