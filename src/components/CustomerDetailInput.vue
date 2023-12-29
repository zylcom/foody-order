<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { Dialog } from "radix-vue/namespaced";
import IconCross from "@/components/icons/IconCross.vue";
import IconUser from "@/components/icons/IconUser.vue";
import IconGreaterThan from "@/components/icons/IconGreaterThan.vue";
import PhoneNumberInput from "@/components/PhoneNumberInput.vue";
import validate from "@/validation/validation";
import { allStore } from "@/stores";
import { customerDetailsValidation } from "@/validation/user-validation";
import { orderDetailsValidation } from "@/validation/order-validation";

const { errorStore, orderStore } = allStore();
const customerDetails = computed(() => orderStore.customerDetails);
const orderDetails = computed(() => orderStore.orderDetails);
const error = errorStore.getError;
const name = ref("");
const phonenumberForm = ref({});
const isCustomerDetailsModalOpen = ref(false);

function saveCustomerDetails() {
  try {
    const result = validate(customerDetailsValidation, {
      name: name.value,
      phonenumberForm: phonenumberForm.value,
    });

    orderStore.setCustomerDetails(result);

    localStorage.setItem("order_details", JSON.stringify(orderDetails.value));

    isCustomerDetailsModalOpen.value = false;

    validate(orderDetailsValidation, orderDetails.value);

    errorStore.$reset();
  } catch (error) {
    errorStore.setError(error.issues);
  }
}

watch(isCustomerDetailsModalOpen, (newValue) => {
  try {
    if (newValue === false) {
      name.value = customerDetails.value?.name || "";
      phonenumberForm.value = customerDetails.value?.phonenumberForm || {};
    }

    validate(orderDetailsValidation, orderDetails.value);

    errorStore.$reset();
  } catch (error) {
    errorStore.setError(error.issues);
  }
});

watch([name, phonenumberForm], (newValue) => {
  try {
    validate(customerDetailsValidation, {
      name: newValue[0],
      phonenumberForm: newValue[1],
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
      const validCustomerDetails = validate(customerDetailsValidation, {
        ...result.customerDetails,
      });

      orderStore.setCustomerDetails(validCustomerDetails);
      name.value = validCustomerDetails.name;
      phonenumberForm.value = validCustomerDetails.phonenumberForm;
    }
  } catch {
    console.error("Data malformed");
  }
});
</script>

<template>
  <Dialog.Root v-model:open="isCustomerDetailsModalOpen">
    <Dialog.Trigger
      class="flex w-full items-center gap-x-4 rounded-t-md py-2 hover:bg-explosive-grey/80"
    >
      <IconUser class="h-6 w-6 shrink-0" />

      <div class="flex flex-col">
        <p
          class="text-left text-sm font-medium after:ml-0.5 after:text-red-500 after:content-['*']"
        >
          Customer Details
        </p>
        <p class="text-left text-xs" v-if="!!customerDetails">
          {{ customerDetails.name }}
          ({{ customerDetails.phonenumberForm.number }})
        </p>
      </div>

      <IconGreaterThan class="ml-auto h-4 w-4 shrink-0" />
    </Dialog.Trigger>

    <Dialog.Portal>
      <Dialog.Overlay class="fixed inset-0 z-50 backdrop-blur-sm" />
      <Dialog.Content
        class="fixed left-[50%] top-[50%] z-[100] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] focus:outline-none"
      >
        <Dialog.Title class="m-0 text-[17px] font-semibold">
          Customer Details
        </Dialog.Title>

        <Dialog.Description class="mb-5 mt-[10px] text-[15px] leading-normal">
          Make changes to your information. Click save when you're done.
        </Dialog.Description>

        <fieldset class="mb-4">
          <label class="block" for="name">
            Name

            <input
              type="text"
              id="name"
              class="block w-full rounded-[10px] bg-bleached-silk px-1 py-4 text-sm placeholder:font-roboto focus:border focus:border-[#66afe9] focus:shadow-[inset_0_1px_1px_rgba(0,0,0,.2),0_0_8px_#66afe999] focus:outline-none focus:ring-0"
              :class="{
                'border border-red-400': error && error.name,
                'border border-gray-400': !(error && error.name),
              }"
              placeholder="Your fullname..."
              v-model="name"
              data-cy="name-input"
              required
            />
          </label>

          <span v-if="error && error.name" class="block text-xs text-red-500">
            {{ error.name._errors[0] }}
          </span>
        </fieldset>

        <fieldset>
          Phone number (Whatsapp)

          <PhoneNumberInput
            v-model:phonenumberForm="phonenumberForm"
            :error="error"
          />
        </fieldset>

        <div class="mt-[25px] flex justify-end">
          <button
            class="inline-flex h-[35px] items-center justify-center rounded-[4px] bg-seljuk-blue px-[15px] font-semibold leading-none text-zhen-zhu-bai-pearl hover:bg-seljuk-blue/90 focus:shadow-[0_0_0_2px] focus:shadow-seljuk-blue/50 focus:outline-none"
            @click="saveCustomerDetails"
          >
            Save changes
          </button>
        </div>

        <Dialog.Close
          class="absolute right-[10px] top-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full text-mint-jelly hover:bg-mint-jelly/10 focus:outline-none focus:ring-1"
          aria-label="Close"
        >
          <IconCross />
        </Dialog.Close>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
</template>
