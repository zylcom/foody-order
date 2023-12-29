<script setup>
import IconCheck from "@/components/icons/IconCheck.vue";
import IconCross from "@/components/icons/IconCross.vue";
import IconExclamation from "@/components/icons/IconExclamation.vue";
import IconGreaterThan from "@/components/icons/IconGreaterThan.vue";
import { formatDateToLocaleId, formatNumberToIDR } from "@/utils";

defineProps({
  payment: Object,
});
</script>

<template>
  <div class="relative rounded-xl bg-white p-6 shadow-md">
    <div class="relative py-8">
      <div
        class="m-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-mint-jelly/10"
      >
        <IconCheck class="stroke-mint-jelly" v-if="payment.status === 'paid'" />

        <IconCross
          class="stroke-torii-red"
          v-else-if="payment.status === 'unpaid'"
        />

        <IconExclamation class="stroke-chocobo-feather" v-else />
      </div>

      <h2 class="text-center text-xl font-semibold">Payment Success!</h2>
    </div>

    <span
      class="block h-0 border-b-2 border-dashed border-dark-tone-ink before:absolute before:-right-2 before:-ml-1 before:-mt-2 before:h-5 before:w-5 before:rounded-full before:bg-bleached-silk after:absolute after:-left-2.5 after:-mt-2 after:h-5 after:w-5 after:rounded-full after:bg-bleached-silk"
    />

    <div
      class="pt-8 font-rubik text-xs [&>span]:mb-4 [&>span]:flex [&>span]:items-center [&>span]:justify-between [&>span]:gap-x-8"
    >
      <div class="mb-4 flex w-full items-center justify-between gap-x-4">
        <span class="whitespace-nowrap">Order ID</span>

        <RouterLink
          class="text-right underline hover:underline lg:no-underline"
          :to="'/order/' + payment.order.id"
        >
          {{ payment.order.id }}
        </RouterLink>
      </div>

      <span>
        Status <span>{{ payment.status }}</span>
      </span>

      <section>
        <details
          class="overflow-hidden [&[open]+div]:max-h-56 [&[open]_span]:rotate-90"
        >
          <summary
            class="mb-4 flex cursor-pointer list-none items-center justify-between font-semibold"
          >
            Transaction detail

            <span class="transition-transform"><IconGreaterThan /></span>
          </summary>
        </details>

        <div
          class="max-h-0 overflow-scroll transition-all duration-300 [&>span]:mb-4 [&>span]:flex [&>span]:items-center [&>span]:justify-between [&>span]:gap-x-8"
        >
          <span>
            Name <span>{{ payment.name }}</span>
          </span>

          <span>
            Date & Time
            <span>
              {{
                formatDateToLocaleId({
                  date: payment.updatedAt,
                  showTime: true,
                })
              }}
            </span>
          </span>

          <span>
            Payment Method <span>{{ payment.method }}</span>
          </span>
        </div>
      </section>

      <section>
        <details
          class="mb-4 overflow-hidden [&[open]+div]:max-h-56 [&[open]_span]:rotate-90"
        >
          <summary
            class="flex cursor-pointer list-none items-center justify-between font-semibold"
          >
            Shipment detail

            <span class="transition-transform"><IconGreaterThan /></span>
          </summary>
        </details>

        <div
          class="max-h-0 overflow-scroll transition-all duration-300 [&>span]:mb-4 [&>span]:flex [&>span]:items-center [&>span]:justify-between [&>span]:gap-x-8"
        >
          <span>
            Name <span>{{ payment.order.shipment.name }}</span>
          </span>

          <span>
            Phone <span>{{ payment.order.phone }}</span>
          </span>

          <span>
            Address
            <span>{{
              `${payment.order.shipment.address}, ${payment.order.shipment.state}`
            }}</span>
          </span>

          <span>
            Detail <span>{{ payment.order.shipment.detail }}</span>
          </span>

          <span>
            Status <span>{{ payment.order.shipment.status }}</span>
          </span>
        </div>
      </section>

      <section>
        <details
          class="mb-4 overflow-hidden [&[open]+ul]:max-h-56 [&[open]_span]:rotate-90"
        >
          <summary
            class="flex cursor-pointer list-none items-center justify-between font-semibold"
          >
            Items detail

            <span class="transition-transform"><IconGreaterThan /></span>
          </summary>
        </details>

        <ul
          class="max-h-0 overflow-scroll transition-all duration-300 [&>span]:mb-4 [&>span]:flex [&>span]:items-center [&>span]:justify-between [&>span]:gap-x-8"
        >
          <li
            class="flex items-center justify-between border-b border-dashed py-1"
            v-for="item in payment.order.items"
            :key="item.id"
          >
            <div>
              <span>
                {{ item.productName }}
              </span>
              <span class="block">
                {{ formatNumberToIDR(item.price) }} * {{ item.quantity }}
              </span>
            </div>

            <span>{{ formatNumberToIDR(item.quantity * item.price) }}</span>
          </li>
        </ul>
      </section>

      <hr class="border-dashed border-dark-tone-ink" />

      <section>
        <details class="mt-4 overflow-hidden [&[open]+div]:max-h-56">
          <summary
            class="flex cursor-pointer list-none justify-between rounded-lg bg-mint-jelly/20 px-1 py-3 font-semibold hover:bg-mint-jelly/30"
          >
            Total <span>{{ formatNumberToIDR(payment.amount) }}</span>
          </summary>
        </details>

        <div
          class="mt-2 max-h-0 overflow-hidden pl-1 transition-all duration-300 [&>span]:flex [&>span]:items-center [&>span]:justify-between [&>span]:gap-x-8"
        >
          <span class="mb-1">
            Sub-total
            <span>{{ formatNumberToIDR(payment.order.subTotal) }}</span>
          </span>

          <span>
            Shipping Cost
            <span>{{ formatNumberToIDR(payment.order.shipment.cost) }}</span>
          </span>
        </div>
      </section>
    </div>
  </div>
</template>
