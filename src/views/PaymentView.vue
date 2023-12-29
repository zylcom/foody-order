<script setup>
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import PaymentReceipt from "@/components/PaymentReceipt.vue";
import paymentService from "@/services/payment-service";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
import { useLoading } from "@/composables/useLoading";

const route = useRoute();
const transactionId = route.params.transactionId;
const paymentDetail = ref(null);

const { isLoading, showLoading, hideLoading } = useLoading();

onMounted(async () => {
  showLoading();

  try {
    const result = await paymentService.get(transactionId);

    console.log(result.data.data);

    paymentDetail.value = result.data.data;
  } catch (error) {
    // console.log(error);
  } finally {
    hideLoading();
  }
});
</script>

<template>
  <div class="mx-auto flex min-h-[100dvh] max-w-md flex-col justify-center p-6">
    <LoadingSpinner v-if="isLoading" />

    <h2
      class="text-center text-lg text-dark-tone-ink"
      v-else-if="!paymentDetail"
    >
      Payment detail not found!
    </h2>

    <PaymentReceipt :payment="paymentDetail" v-else />

    <RouterLink class="mt-12 w-full" to="/">
      <button
        class="w-full rounded-lg bg-transparent py-3 text-center text-sm font-semibold tracking-widest text-seljuk-blue"
      >
        Back to Home
      </button>
    </RouterLink>
  </div>
</template>
