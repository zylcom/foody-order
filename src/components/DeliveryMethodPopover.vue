<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { Popover, RadioGroup } from "radix-vue/namespaced";
import IconCross from "@/components/icons/IconCross.vue";
import IconTruck from "@/components/icons/IconTruck.vue";
import { useOrderStore } from "@/stores/order";

const orderStore = useOrderStore();
const orderDetails = computed(() => orderStore.orderDetails);
const method = ref("");
const cost = { reguler: 0, express: 5000 };

watch(method, (newValue) => {
  orderStore.setDeliveryDetails({
    method: newValue,
    cost: cost[newValue],
  });

  localStorage.setItem("order_details", JSON.stringify(orderDetails.value));
});

onMounted(() => {
  try {
    const result = JSON.parse(localStorage.getItem("order_details"));

    if (
      result &&
      result.deliveryDetails.method &&
      cost[result.deliveryDetails.method]
    ) {
      method.value = result.deliveryDetails.method;
    } else {
      method.value = "reguler";
    }
  } catch {
    console.log("Data malformed");
  }
});
</script>

<template>
  <Popover.Root>
    <Popover.Trigger
      class="flex items-center gap-x-4 rounded-b-md py-2 hover:bg-explosive-grey/80"
    >
      <IconTruck class="h-6 w-6 pl-1" />

      <div class="flex flex-col overflow-hidden">
        <p
          class="text-sm font-medium after:ml-0.5 after:text-red-500 after:content-['*']"
        >
          Delivery method
        </p>
        <p class="truncate text-left text-xs" v-if="!!method" :title="method">
          {{ method }}
        </p>
      </div>
    </Popover.Trigger>

    <Popover.Portal>
      <Popover.Content
        side="top"
        :side-offset="5"
        class="w-[260px] rounded border bg-white p-5 shadow-md will-change-[transform,opacity]"
      >
        <p
          class="mb-2 text-base font-semibold leading-[19px] text-thamar-black"
        >
          Delivery Method
        </p>

        <RadioGroup.Root
          v-model="method"
          class="flex flex-col gap-2.5"
          default-value="default"
          aria-label="View density"
        >
          <div class="flex items-center">
            <RadioGroup.Item
              id="reguler"
              class="h-5 w-5 shrink-0 cursor-default rounded-full shadow-[0_2px_10px] shadow-dark-tone-ink/50 outline-none hover:bg-mint-jelly/40 focus:border-0 focus:ring-1"
              value="reguler"
            >
              <RadioGroup.Indicator
                class="relative flex h-full w-full items-center justify-center after:block after:h-[11px] after:w-[11px] after:rounded-[50%] after:bg-mint-jelly after:content-['']"
              />
            </RadioGroup.Item>
            <label
              class="pl-[15px] text-xs leading-none text-thamar-black"
              for="reguler"
            >
              Reguler (FREE)
              <span
                class="mt-1 block font-rubik text-[.6rem] text-thamar-black/70"
              >
                Estimated: + 35 minutes
              </span>
            </label>
          </div>
          <div class="flex items-center">
            <RadioGroup.Item
              id="express"
              class="h-5 w-5 shrink-0 cursor-default rounded-full shadow-[0_2px_10px] shadow-dark-tone-ink/50 outline-none hover:bg-mint-jelly/40 focus:border-0 focus:ring-1"
              value="express"
            >
              <RadioGroup.Indicator
                class="relative flex h-full w-full items-center justify-center after:block after:h-[11px] after:w-[11px] after:rounded-[50%] after:bg-mint-jelly after:content-['']"
              />
            </RadioGroup.Item>
            <label
              class="pl-[15px] text-xs leading-none text-thamar-black"
              title="Guarantee cost refunded if delivery time is more than estimated."
              for="express"
            >
              Express (+Rp 5.000)

              <span
                class="mt-1 block font-rubik text-[.6rem] text-thamar-black/70"
              >
                Estimated: 10 - 30 minutes
              </span>
            </label>
          </div>
        </RadioGroup.Root>

        <Popover.Close
          class="absolute right-[10px] top-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full text-mint-jelly hover:bg-mint-jelly/10 focus:outline-none focus:ring-1"
          aria-label="Close"
        >
          <IconCross />
        </Popover.Close>
        <Popover.Arrow class="fill-white" />
      </Popover.Content>
    </Popover.Portal>
  </Popover.Root>
</template>
