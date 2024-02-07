<script setup>
import { onMounted, ref } from "vue";
import ReceiptCard from "@/components/ReceiptCard.vue";
import orderService from "@/services/order-service";

const listOrder = ref([]);

onMounted(async () => {
  try {
    const result = await orderService.listOrder();

    listOrder.value = result;
  } catch (error) {
    console.log(error);
  }
});
</script>

<template>
  <div class="min-h-screen">
    <header class="sticky top-0 pb-24 pt-11">
      <h1 class="text-center text-2xl font-medium">History</h1>
    </header>

    <p class="text-center" v-if="listOrder.length < 1">There no records.</p>

    <main
      class="relative z-10 rounded-t-[20px] bg-zhen-zhu-bai-pearl pb-14"
      v-else
    >
      <ReceiptCard v-for="order in listOrder" :key="order.id" :order="order" />
    </main>
  </div>
</template>
