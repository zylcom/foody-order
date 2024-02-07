<script setup>
import { formatDateToLocaleId, formatNumberToIDR } from "../utils";

defineProps({
  order: Object,
});
</script>

<template>
  <div class="receipt-card border-b border-prunus-avium/50 px-5 py-4">
    <section class="receipt-header flex flex-col pb-5">
      <span class="text-[.6rem] text-torii-red">
        ID#:
        <RouterLink :to="`/order/${order.id}`">
          <span class="text-gray-500 underline">{{ order.id }}</span>
        </RouterLink>
      </span>

      <span class="text-[.6rem] text-dark-tone-ink">
        Date:
        {{
          formatDateToLocaleId({
            date: order.createdAt,
            showTime: true,
          })
        }}
      </span>
    </section>

    <section class="receipt-body">
      <table class="w-full table-auto">
        <thead>
          <tr>
            <th class="text-left text-lg font-normal text-dark-tone-ink">
              Ordered Items
            </th>
            <th class="text-sm font-normal text-dark-tone-ink">Qty</th>
            <th class="text-right text-sm font-normal text-dark-tone-ink">
              Price
            </th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="item in order.items">
            <td class="text-sm text-gray-500">{{ item.productName }}</td>

            <td class="text-center text-sm text-gray-500">
              {{ item.quantity }}
            </td>

            <td class="text-right text-sm text-gray-500">
              {{ formatNumberToIDR(item.price) }}
            </td>
          </tr>

          <tr>
            <td class="text-sm text-gray-500">Shipment cost</td>

            <td class="text-center text-sm text-gray-500">1</td>

            <td class="text-right text-sm text-gray-500">
              {{ formatNumberToIDR(order.shipment.cost) }}
            </td>
          </tr>

          <tr>
            <td
              class="border-t border-torii-red/50 text-sm font-medium text-dark-tone-ink"
              colspan="2"
            >
              Total Amount:
            </td>

            <td
              class="border-t border-torii-red/50 text-right text-sm text-dark-tone-ink"
            >
              {{ formatNumberToIDR(order.total) }}
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  </div>
</template>
