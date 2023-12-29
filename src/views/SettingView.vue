<script setup>
import { computed } from "vue";
import IconGreaterThan from "@/components/icons/IconGreaterThan.vue";
import IconLogin from "@/components/icons/IconLogin.vue";
import IconLogout from "@/components/icons/IconLogout.vue";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
import ToggleSwitch from "@/components/ToggleSwitch.vue";
import SettingButton from "@/components/SettingButton.vue";
import { allStore } from "@/stores";
import { removeAccessToken } from "@/utils";
import { useLoading } from "@/composables/useLoading";

const { authUserStore } = allStore();
const authUser = computed(() => authUserStore.authUser);
const { isLoading, showLoading, hideLoading } = useLoading();

function logout() {
  removeAccessToken();
  showLoading();

  setTimeout(() => {
    authUserStore.$reset();

    window.location.reload();

    hideLoading();
  }, 3000);
}
</script>

<template>
  <LoadingSpinner v-if="isLoading" />

  <header class="sticky top-0 pb-8 pr-7 pt-7">
    <img src="../assets/images/gear.png" alt="" class="ml-auto" />
  </header>

  <main class="relative z-10 rounded-t-[20px] bg-zhen-zhu-bai-pearl pb-14">
    <h1 class="pb-6 text-center text-2xl font-medium">Settings</h1>
    <div class="flex flex-col gap-y-4 px-5">
      <SettingButton
        settingName="Profile"
        to="/profile"
        :child="IconGreaterThan"
        v-if="authUser"
      />

      <SettingButton
        toggleId="dark-mode-switch"
        settingName="Dark Mode"
        :child="ToggleSwitch"
      />

      <SettingButton
        toggleId="push-notification-toggle"
        settingName="Push Notification"
        :child="ToggleSwitch"
        v-if="authUser"
      />

      <SettingButton settingName="Help" to="/help" :child="IconGreaterThan" />

      <SettingButton
        settingName="Send Us Feedback"
        to="feedback"
        :child="IconGreaterThan"
        class="text-heirloom-hydrangea"
      />

      <!-- <SettingButton  settingName="Show More" :child="IconGreaterThan" /> -->
    </div>

    <button
      class="m-auto mb-28 mt-14 flex items-center gap-x-3 text-lg"
      @click="logout"
      v-if="authUser"
    >
      Log out <span><IconLogout /></span>
    </button>

    <RouterLink
      to="/login"
      class="m-auto mb-28 mt-14 flex items-center justify-center gap-x-3 text-lg"
      v-else
    >
      Log in <span><IconLogin /></span>
    </RouterLink>
  </main>
</template>
