<script setup>
import { computed, onMounted } from "vue";
import IconLove from "./icons/IconLove.vue";
import IconStar from "./icons/IconStar.vue";
import { formatFloatNumber, formatNumber, formatNumberToIDR } from "../utils";
import { useAuthUserStore } from "../stores/authUser";

const props = defineProps({
  product: Object,
  quantity: Number,
  overlayBg: Boolean,
  showLikesCountAndAverageRating: Boolean,
});

const authUserStore = useAuthUserStore();
const authUser = computed(() => authUserStore.authUser);
const formattedPrice = computed(() =>
  formatNumberToIDR(props.product.price * (props.quantity || 1)),
);
const formattedAverageRating = computed(() =>
  formatFloatNumber(props.product.averageRating),
);
const isLiked = computed(() =>
  props.product.likes.some((val) => val.username === authUser.value?.username),
);
const likesCount = computed(() => props.product.likes?.length || 0);

onMounted(() => {});
</script>

<template>
  <RouterLink
    :to="`/menu/${product.slug}`"
    class="product-card cursor-pointer shadow-md"
  >
    <div
      :class="{
        'relative after:absolute after:left-0 after:top-0 after:z-10 after:inline-block after:h-full after:w-full after:bg-gradient-to-b after:from-black/80 after:content-[\'\']':
          overlayBg,
      }"
    >
      <div class="relative h-0 w-full bg-explosive-grey pt-[100%] shadow-md">
        <img
          :src="product.image"
          :alt="product.name"
          class="absolute left-0 top-0 block max-h-[1280px] w-full object-cover object-center"
          loading="lazy"
        />
      </div>
    </div>

    <div class="grid grid-cols-3 items-center pt-2">
      <div class="col-span-2">
        <h4 class="text-xs">
          {{ product.name }}
          {{ quantity ? `*${quantity}` : "" }}
        </h4>

        <span class="text-xs">{{ formattedPrice }}</span>
      </div>

      <div
        class="grid cursor-default grid-cols-2 justify-items-center gap-x-2 text-center"
        v-if="showLikesCountAndAverageRating"
      >
        <div title="Rating Stars">
          <IconStar class="mx-auto h-5 fill-spandex-green" />

          <span class="font-rubik text-sm font-medium">
            {{ formattedAverageRating }}
          </span>
        </div>

        <div title="Likes">
          <IconLove
            class="mx-auto w-4"
            :class="isLiked ? 'fill-blood-moon' : ''"
          />

          <span class="font-rubik text-sm">
            {{ formatNumber(likesCount) }}
          </span>
        </div>
      </div>
    </div>
  </RouterLink>
</template>
