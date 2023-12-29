<script setup>
import { computed, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "vue-toast-notification";
import IconLoading from "../components/icons/IconLoading.vue";
import userService from "../services/user-service";
import { allStore } from "../stores";
import { saveAccessToken } from "../utils";

const route = useRouter();
const username = ref("");
const password = ref("");

const { authUserStore, errorStore, loadingStore } = allStore();
const authUser = computed(() => authUserStore.authUser);
const error = errorStore.getError;

const $toast = useToast();

async function onSubmitHandler() {
  loadingStore.showLoading();

  try {
    const result = await userService.login({
      username: username.value,
      password: password.value,
    });

    console.log(result.data);

    saveAccessToken(result.data.data.token);

    await authUserStore.preload();
  } catch (error) {
    if (error.code === "ERR_NETWORK") {
      $toast.error("Something went wrong!", { position: "top" });

      return;
    }

    if (error.response) {
      errorStore.setError({
        general: { _errors: [error.response.data.errors] },
      });
    } else {
      errorStore.setError(error.issues);
    }
  } finally {
    loadingStore.hideLoading();
  }
}

watch(authUser, () => {
  console.log(authUser.value);

  if (authUser.value) {
    route.push({ path: "/" });
  }
});

watch([username, password], () => {
  errorStore.$reset();
});
</script>

<template>
  <form
    action=""
    class="mx-5 mt-8 text-sm"
    @submit.prevent="onSubmitHandler()"
    data-cy="form-login"
  >
    <label for="username">
      Username

      <input
        type="text"
        id="username"
        class="block w-full rounded-[10px] bg-bleached-silk px-1 py-3 text-sm placeholder:font-roboto focus:outline-none focus:ring-0"
        :class="!!error && !!error.username ? 'border border-red-400' : ''"
        v-model="username"
        placeholder="john doe"
        autocomplete="username"
        data-cy="username-input"
        autofocus
      />

      <span
        v-if="!!error && !!error.username"
        class="block text-xs text-red-500"
      >
        {{ error.username._errors[0] }}
      </span>
    </label>

    <label for="password" class="mt-3 block">
      Password

      <input
        type="password"
        id="password"
        class="block w-full rounded-[10px] bg-bleached-silk px-1 py-3 text-sm placeholder:font-roboto focus:outline-none focus:ring-0"
        :class="!!error && !!error.password ? 'border border-red-400' : ''"
        v-model="password"
        placeholder="Password"
        autocomplete="current-password"
        data-cy="password-input"
      />

      <span
        v-if="!!error && !!error.password"
        class="mb-2 block text-xs text-red-500"
      >
        {{ error.password._errors[0] }}
      </span>
    </label>

    <label
      for="remember-me"
      class="float-righ inline-flex items-center gap-x-1 text-[length:10px]"
    >
      <input type="checkbox" name="" id="remember-me" />

      Remember me
    </label>

    <a href="#" class="float-right text-[length:10px] text-venetian-nights">
      Forgot password?
    </a>

    <span
      v-if="!!error && !!error.general"
      class="mt-2 block text-sm text-red-500"
    >
      {{ error.general._errors[0] }}
    </span>

    <button
      type="submit"
      class="my-6 flex w-full items-center justify-center gap-x-2 rounded-lg py-2 font-rubik text-charolais-cattle"
      :class="
        loadingStore.isLoading
          ? 'bg-gray-400 hover:bg-gray-400'
          : 'bg-torii-red/95 hover:bg-torii-red/90 active:bg-torii-red'
      "
      :disabled="loadingStore.isLoading"
    >
      <IconLoading class="my-0" v-if="loadingStore.isLoading" />
      Login
    </button>
  </form>
</template>
