<script setup>
import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { useToast } from "vue-toast-notification";
import BackButton from "@/components/BackButton.vue";
import orderService from "@/services/order-service";
import { allStore } from "@/stores";
import { formatDateToLocaleId, formatNumberToIDR } from "@/utils";
import { useHideOnScroll } from "@/composables/useHideOnScroll";
import { useLoading } from "@/composables/useLoading";
import IconHome from "../components/icons/IconHome.vue";

const route = useRoute();
const $toast = useToast();
const { orderStore } = allStore();
const order = computed(() => orderStore.orderDetails);
const orderId = route.params.id;
const navElement = ref(null);
const { isLoading, showLoading, hideLoading } = useLoading();
const {
  isLoading: isFetching,
  showLoading: showFetching,
  hideLoading: hideFetching,
} = useLoading();

useHideOnScroll(navElement);

async function checkout() {
  showFetching();
  window.snap.show();

  try {
    const result = await orderService.checkout(order.value);

    window.snap.pay(result.transactionToken, {
      onSuccess: function (result) {
        console.log(result);
        console.log("success");

        window.location.href = `/payment/${result.transaction_id}`;
      },
      onError: function () {
        console.log("payment error. Try again later.");
      },
      onPending: () => {},
      onClose: () => {},
    });
  } catch (error) {
    window.snap.hide();

    $toast.error("Oops something went wrong!", { position: "top" });
  } finally {
    hideFetching();
  }
}

async function cancelOrder() {
  const confirmResponse = confirm(
    "Are you sure want to cancel the order? It's can't be undone!",
  );

  showFetching();

  try {
    if (confirmResponse) {
      await orderService.cancel(orderId);
    }

    $toast.success("Order has been canceled!", { position: "top" });
  } catch (error) {
    $toast.error("Oops something went wrong!", { position: "top" });
  } finally {
    hideFetching();
  }
}

onMounted(async () => {
  showLoading();

  try {
    await orderService.get(orderId);
  } catch (error) {
    console.log(error);
  } finally {
    hideLoading();
  }
});
</script>

<template>
  <header class="bg-cloud-break">
    <nav
      class="fixed top-0 z-50 flex w-full items-center justify-between bg-cloud-break px-6 pb-2 pt-3 shadow transition-all duration-500"
      ref="navElement"
    >
      <BackButton />

      <h1 class="text-2xl font-medium">Your Order</h1>

      <RouterLink to="/">
        <IconHome class="h-7 w-7 stroke-torii-red" />
      </RouterLink>
    </nav>
  </header>

  <main
    class="mx-auto flex min-h-[100dvh] max-w-md items-center justify-center py-14"
    v-if="!isLoading"
  >
    <div
      class="mx-4 w-full rounded-3xl bg-white px-6 pt-8 shadow-md"
      v-if="order"
    >
      <span class="block text-[0.65rem] leading-[0] text-blood-moon">
        ID# {{ orderId }}
      </span>

      <span class="text-[0.65rem]">
        {{ formatDateToLocaleId({ date: order.createdAt, showTime: true }) }}
      </span>

      <h2 class="my-4 text-center text-sm font-medium text-blood-moon">
        {{
          order.status === "uncomplete" || order.status === "pending"
            ? `Your order is ${order.status}! Checkout to complete the order.`
            : order.status === "canceled"
              ? "Your order is canceled!."
              : "Your order is on its way!"
        }}
      </h2>

      <img
        class="mx-auto w-4/5"
        src="../assets/images/order_success.svg"
        alt=""
        v-if="order.status === 'success'"
      />
      <img
        class="mx-auto w-4/5"
        src="../assets/images/order_delivered.svg"
        alt=""
        v-else-if="order.status === 'delivered'"
      />
      <img
        class="mx-auto w-4/5"
        src="../assets/images/order_uncomplete.svg"
        alt=""
        v-else
      />

      <span class="mt-4 block font-rubik">Here's your order items</span>

      <ul class="mt-4 max-h-60 overflow-y-auto">
        <li
          class="grid w-full grid-cols-6 items-center gap-x-4 border-b border-dashed py-2 text-sm hover:bg-mercury"
          v-for="item in order.items"
          :key="item.id"
        >
          <RouterLink
            class="col-span-3 truncate"
            :to="'/menu/' + item.productSlug"
            :title="item.productName"
          >
            {{ item.productName }}
          </RouterLink>

          <span class="mr-4 whitespace-nowrap">Qty: {{ item.quantity }}</span>

          <span
            class="col-span-2 overflow-hidden truncate text-right font-medium"
          >
            {{ formatNumberToIDR(item.quantity * item.product.price) }}
          </span>
        </li>
      </ul>

      <div
        class="grid w-full grid-cols-6 items-center gap-x-4 border-b border-dashed py-2 text-sm hover:bg-mercury"
      >
        <span class="col-span-3 truncate">Delivery Cost</span>

        <span class="mr-4 whitespace-nowrap">Qty: 1</span>

        <span
          class="col-span-2 overflow-hidden truncate text-right font-medium"
        >
          {{ formatNumberToIDR(order.shipment.cost) }}
        </span>
      </div>

      <div class="mt-4 flex justify-end gap-x-2 text-sm">
        <span class="whitespace-nowrap uppercase">Total :</span>
        <span class="font-medium">
          {{ formatNumberToIDR(order.total) }}
        </span>
      </div>

      <div class="pb-2 pt-5">
        <div
          class="my-4 flex justify-evenly gap-x-4"
          v-if="order.status !== 'success'"
        >
          <button
            class="rounded bg-transparent p-1 font-medium uppercase tracking-wider text-chilled-chilly transition-all hover:scale-110"
            @click="cancelOrder()"
            :disabled="isFetching"
          >
            Cancel
          </button>

          <button
            type="button"
            class="flex gap-x-2 rounded p-1 px-2 font-medium uppercase tracking-wider text-white"
            :class="
              isFetching
                ? 'cursor-default bg-gray-400'
                : 'bg-spandex-green/95 hover:bg-spandex-green/90 active:bg-spandex-green'
            "
            :disabled="isFetching"
            @click="checkout()"
          >
            Checkout
          </button>
        </div>

        <span class="block pt-3 text-center text-[0.65rem]">
          Have any troubles? Please contact
          <a href="#" class="text-seljuk-blue hover:underline">our support</a>
        </span>
      </div>
    </div>

    <div v-else>Order not found!</div>
  </main>

  <div
    class="flex h-screen items-center justify-center bg-zhen-zhu-bai-pearl"
    v-else
  >
    <strong class="text-2xl">Loading...</strong>
  </div>
</template>
