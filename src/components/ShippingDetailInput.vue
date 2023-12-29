<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { Dialog } from "radix-vue/namespaced";
import IconCross from "@/components/icons/IconCross.vue";
import IconGreaterThan from "@/components/icons/IconGreaterThan.vue";
import IconMapPin from "@/components/icons/IconMapPin.vue";
import validate from "@/validation/validation";
import { allStore } from "@/stores";
import { Select } from "@/components/form/form-compoent";
import { shippingDetailsValidation } from "@/validation/order-validation";
import { orderDetailsValidation } from "../validation/order-validation";

const { errorStore, orderStore } = allStore();
const orderDetails = computed(() => orderStore.orderDetails);
const shippingDetails = computed(() => orderStore.shippingDetails);
const error = errorStore.getError;
const city = ref("");
const state = ref("");
const address = ref("");
const postalCode = ref("");
const detail = ref("");
const isShippingDetailsModalOpen = ref(false);
const shippingDetailsArr = computed(() =>
  Object.values(shippingDetails.value).join(", "),
);

const cityOptions = [
  "Jakarta Barat",
  "Jakarta Timur",
  "Jakarta Selatan",
  "Jakarta Pusat",
  "Jakarta Utara",
];

const stateOptions = ["Jakarta"];

function saveShippingDetails() {
  try {
    const result = validate(shippingDetailsValidation, {
      address: address.value,
      detail: detail.value,
      city: city.value,
      state: state.value,
      postalCode: postalCode.value,
    });

    orderStore.setShippingDetails(result);

    localStorage.setItem("order_details", JSON.stringify(orderDetails.value));

    isShippingDetailsModalOpen.value = false;

    validate(orderDetailsValidation, orderDetails.value);

    errorStore.$reset();
  } catch (error) {
    errorStore.setError(error.issues);
  }
}

watch(isShippingDetailsModalOpen, (newValue) => {
  if (newValue === false) {
    address.value = shippingDetails.value?.address || "";
    city.value = shippingDetails.value?.city || "";
    detail.value = shippingDetails.value?.detail || "";
    postalCode.value = shippingDetails.value?.postalCode || "";
    state.value = shippingDetails.value?.state || "";
  }
});

watch([address, detail, city, state, postalCode], (newValue) => {
  try {
    validate(shippingDetailsValidation, {
      address: newValue[0],
      detail: newValue[1],
      city: newValue[2],
      state: newValue[3],
      postalCode: newValue[4],
    });

    validate(orderDetailsValidation, orderDetails.value);

    errorStore.$reset();
  } catch (error) {
    errorStore.setError(error.issues);
  }
});

onMounted(() => {
  try {
    const result = JSON.parse(localStorage.getItem("order_details"));

    if (result) {
      const validShippingDetails = validate(shippingDetailsValidation, {
        ...result.shippingDetails,
      });

      orderStore.setShippingDetails(validShippingDetails);
      city.value = validShippingDetails.city;
      address.value = validShippingDetails.address;
      detail.value = validShippingDetails.detail;
      state.value = validShippingDetails.state;
      postalCode.value = validShippingDetails.postalCode;
    }
  } catch {
    console.error("Data malformed");
  }
});
</script>

<template>
  <Dialog.Root v-model:open="isShippingDetailsModalOpen">
    <Dialog.Trigger
      class="flex w-full items-center gap-x-4 py-2 hover:bg-explosive-grey/80"
    >
      <IconMapPin class="h-6 w-6 shrink-0" />

      <div class="flex flex-col overflow-hidden">
        <p
          class="text-left text-sm font-medium after:ml-0.5 after:text-red-500 after:content-['*']"
        >
          Shipping Details
        </p>
        <p
          class="truncate text-left text-xs"
          v-if="!!shippingDetails"
          :title="shippingDetailsArr"
        >
          {{ shippingDetailsArr }}
        </p>
      </div>

      <IconGreaterThan class="ml-auto h-4 w-4 shrink-0" />
    </Dialog.Trigger>

    <Dialog.Portal>
      <Dialog.Overlay
        class="fixed bottom-0 left-0 right-0 top-0 z-50 grid place-items-center overflow-y-auto py-4 backdrop-blur-sm"
      >
        <Dialog.Content
          class="relative w-[90vw] max-w-[450px] rounded-[6px] bg-white p-6 focus:outline-none"
        >
          <Dialog.Title class="m-0 text-[17px] font-semibold">
            Shipping Details
          </Dialog.Title>

          <Dialog.Description class="mb-5 mt-[10px] text-[15px] leading-normal">
            Make sure your shipping address is correct. Click save when you're
            done.
          </Dialog.Description>

          <fieldset class="mb-4">
            <label class="block" for="address">
              Address line

              <input
                type="text"
                id="address"
                class="block w-full rounded-[10px] bg-zhen-zhu-bai-pearl/70 px-1 py-4 text-sm placeholder:font-roboto focus:border focus:border-[#66afe9] focus:shadow-[inset_0_1px_1px_rgba(0,0,0,.2),0_0_8px_#66afe999] focus:outline-none focus:ring-0"
                :class="{
                  'border border-red-400': error && error.address,
                  'border border-gray-400': !(error && error.address),
                }"
                placeholder="Your home address"
                v-model="address"
                data-cy="address-input"
                required
              />
            </label>

            <span
              v-if="error && error.address"
              class="block text-xs text-red-500"
            >
              {{ error.address._errors[0] }}
            </span>
          </fieldset>

          <fieldset class="mb-4">
            <label class="block" for="detail">
              Detail (position/mark/number)

              <input
                type="text"
                id="detail"
                class="block w-full rounded-[10px] bg-zhen-zhu-bai-pearl/70 px-1 py-4 text-sm placeholder:font-roboto focus:border focus:border-[#66afe9] focus:shadow-[inset_0_1px_1px_rgba(0,0,0,.2),0_0_8px_#66afe999] focus:outline-none focus:ring-0"
                :class="{
                  'border border-red-400': error && error.detail,
                  'border border-gray-400': !(error && error.detail),
                }"
                placeholder="Your home detail"
                v-model="detail"
                data-cy="detail-input"
                required
              />
            </label>

            <span
              v-if="error && error.detail"
              class="block text-xs text-red-500"
            >
              {{ error.detail._errors[0] }}
            </span>
          </fieldset>

          <fieldset class="mb-4">
            <p class="block w-full">State</p>

            <Select
              class="bg-red-500"
              :options="stateOptions"
              placeholder="Select your state..."
              v-model:value="state"
            />

            <span
              v-if="error && error.state"
              class="block text-xs text-red-500"
            >
              {{ error.state._errors[0] }}
            </span>
          </fieldset>

          <fieldset class="mb-4">
            <p class="block w-full">City</p>

            <Select
              :options="cityOptions"
              placeholder="Select your city..."
              v-model:value="city"
            />

            <span v-if="error && error.city" class="block text-xs text-red-500">
              {{ error.city._errors[0] }}
            </span>
          </fieldset>

          <fieldset class="mb-4">
            <label class="block" for="postal-code">
              Postal code

              <input
                type="number"
                id="postal-code"
                class="block w-full rounded-[10px] bg-zhen-zhu-bai-pearl/70 px-1 py-4 text-sm placeholder:font-roboto focus:border focus:border-[#66afe9] focus:shadow-[inset_0_1px_1px_rgba(0,0,0,.2),0_0_8px_#66afe999] focus:outline-none focus:ring-0"
                :class="{
                  'border border-red-400': error && error.postalCode,
                  'border border-gray-400': !(error && error.postalCode),
                }"
                min="1"
                placeholder="Postal code"
                v-model="postalCode"
                data-cy="postal-code-input"
                required
              />
            </label>

            <span
              v-if="error && error.postalCode"
              class="block text-xs text-red-500"
            >
              {{ error.postalCode._errors[0] }}
            </span>
          </fieldset>

          <div class="mt-6 flex justify-end">
            <button
              class="inline-flex h-8 items-center justify-center rounded-[4px] bg-seljuk-blue px-4 font-semibold leading-none text-zhen-zhu-bai-pearl hover:bg-seljuk-blue/90 focus:shadow-[0_0_0_2px] focus:shadow-seljuk-blue/50 focus:outline-none"
              @click="saveShippingDetails"
            >
              Save changes
            </button>
          </div>

          <Dialog.Close
            class="absolute right-5 top-5 inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full text-mint-jelly hover:bg-mint-jelly/10 focus:outline-none focus:ring-1"
            aria-label="Close"
          >
            <IconCross />
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Overlay>
    </Dialog.Portal>
  </Dialog.Root>
</template>
