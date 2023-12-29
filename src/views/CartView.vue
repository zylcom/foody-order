<script setup>
import { computed, ref, watch } from "vue";
import { Separator } from "radix-vue";
import { useToast } from "vue-toast-notification";
import BackButton from "@/components/BackButton.vue";
import CartItem from "@/components/CartItem.vue";
import CustomerDetailInput from "@/components/CustomerDetailInput.vue";
import DeliveryMethodPopover from "@/components/DeliveryMethodPopover.vue";
import EmptyCart from "@/components/EmptyCart.vue";
import IconHome from "@/components/icons/IconHome.vue";
import IconPlus from "@/components/icons/IconPlus.vue";
import IconLoading from "@/components/icons/IconLoading.vue";
import ShippingDetailInput from "@/components/ShippingDetailInput.vue";
import validate from "@/validation/validation";
import orderService from "@/services/order-service";
import { allStore } from "@/stores";
import { formatNumberToIDR } from "@/utils";
import { useHideOnScroll } from "@/composables/useHideOnScroll";
import { useLoading } from "@/composables/useLoading";
import { orderDetailsValidation } from "@/validation/order-validation";

const $toast = useToast();
const { cartStore, errorStore, orderStore } = allStore();
const error = errorStore.getError;
const orderDetails = computed(() => orderStore.orderDetails);
const myCart = computed(() => cartStore.cart);
const items = computed(() => cartStore.cart.cartItems);
const subTotal = computed(() =>
  formatNumberToIDR(myCart.value.totalPrice || 0),
);
const deliveryCost = computed(() =>
  formatNumberToIDR(orderDetails.value?.deliveryDetails?.cost || 0),
);
const total = computed(() =>
  formatNumberToIDR(
    myCart.value.totalPrice + orderDetails.value?.deliveryDetails?.cost || 0,
  ),
);
const navElement = ref(null);

const { isLoading, showLoading, hideLoading } = useLoading();

useHideOnScroll(navElement);

async function checkoutHandler() {
  showLoading();
  window.snap.show();

  try {
    const result = await orderService.create({
      cart: myCart.value,
      ...orderDetails.value,
    });

    window.snap.pay(result.transactionToken, {
      onSuccess: async function (result) {
        console.log(result);
        console.log("success");

        await cartStore.$reset();

        window.location.href = `/payment/${result.transaction_id}`;
      },
      onPending: function (result) {
        console.log(result);
        console.log("pending");

        window.location.href = `/order/${result.order_id}`;
      },
      onError: function (result) {
        console.log(result);
        console.log("error");
      },
      onClose: function () {
        window.location.href = `/order/${result.order.id}`;

        console.log(result.order);
        console.log("customer closed the popup without finishing the payment");
      },
    });
  } catch (error) {
    console.error(error);

    window.snap.hide();

    $toast.error("Something went wrong. Try again later.", { position: "top" });
  } finally {
    hideLoading();
  }
}

watch(orderDetails, (newValue) => {
  try {
    validate(orderDetailsValidation, newValue);

    errorStore.$reset();
  } catch (error) {
    errorStore.setError(error.issues);
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

      <h1 class="text-2xl font-medium">Your Cart</h1>

      <RouterLink to="/">
        <IconHome class="h-7 w-7 stroke-torii-red" />
      </RouterLink>
    </nav>
  </header>

  <main
    class="relative flex min-h-screen flex-col items-center justify-center pt-24"
  >
    <EmptyCart v-if="items?.length < 1" />

    <div class="w-full rounded-t-2xl bg-zhen-zhu-bai-pearl px-4 pb-32" v-else>
      <div
        class="grid grid-cols-1 items-center gap-4 pb-6 pt-6 md:grid-cols-2 xl:grid-cols-3 [&>div]:relative"
      >
        <CartItem
          v-for="item in items"
          :key="item.product.id"
          :product="item.product"
          :quantity="item.quantity"
        />

        <RouterLink
          to="/menu"
          class="flex h-fit items-center justify-center gap-x-1 text-sm text-heirloom-hydrangea hover:underline"
        >
          Add some more
          <span class="rounded-full bg-mercury p-1">
            <IconPlus class="h-4" />
          </span>
        </RouterLink>
      </div>

      <div class="mt-2 flex flex-col rounded-md bg-bleached-silk shadow-md">
        <CustomerDetailInput />

        <ShippingDetailInput />

        <DeliveryMethodPopover />
      </div>

      <div
        class="mt-4 pb-8 font-rubik [&_ul>li]:flex [&_ul>li]:justify-between [&_ul>li]:text-sm [&_ul>li]:font-medium [&_ul>li]:text-thamar-black/80"
      >
        <h4 class="py-2 text-lg font-semibold text-dark-tone-ink">
          Bill details
        </h4>

        <ul>
          <li>
            Sub-total: <strong>{{ subTotal }}</strong>
          </li>

          <li>
            Delivery cost:
            <strong>{{ deliveryCost }}</strong>
          </li>

          <li>
            Tax: <strong>{{ 0 }}</strong>
          </li>

          <li>
            Discount: <strong>{{ 0 }}</strong>
          </li>
        </ul>

        <Separator
          class="my-[15px] bg-dark-tone-ink data-[orientation=horizontal]:h-px data-[orientation=vertical]:h-full data-[orientation=horizontal]:w-full data-[orientation=vertical]:w-px"
        />

        <p class="flex justify-between text-sm font-semibold">
          Total: <strong>{{ total }}</strong>
        </p>
      </div>

      <div class="fixed bottom-0 left-0 z-50 w-full bg-cloud-break p-4">
        <button
          class="flex w-full justify-center gap-x-2 rounded py-4 font-medium uppercase tracking-wider text-white"
          type="button"
          :class="{
            'cursor-wait': isLoading,
            'cursor-not-allowed': error,
            'bg-gray-400': isLoading || error,
            'bg-spandex-green/95 hover:bg-spandex-green/90 active:bg-spandex-green':
              !isLoading && !error,
          }"
          :disabled="isLoading || error"
          @click="checkoutHandler()"
        >
          <IconLoading class="my-0" v-if="isLoading" />

          Checkout Order
        </button>

        <span class="mt-4 block text-xs text-red-500" v-if="error">
          Please fill out and check shipping form before you checkout!
        </span>
      </div>
    </div>
  </main>
</template>
