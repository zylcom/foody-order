<script setup>
import { onUnmounted, ref } from "vue";
import { useToast } from "vue-toast-notification";
import IconCross from "./icons/IconCross.vue";
import ReviewInputForm from "./ReviewInputForm.vue";
import ReviewItem from "./ReviewItem.vue";
import reviewService from "../services/review-service";
import { useReviewsStore } from "../stores/reviews";

const $toast = useToast();
const reviewsStore = useReviewsStore();
const myReview = reviewsStore.getMyReview;
const modalBoxElement = ref();
const isModalOpen = ref(false);

function toggleModalBox() {
  isModalOpen.value = !isModalOpen.value;
}

async function updateReviewHandler({ description, rating, productSlug }) {
  try {
    await reviewService.update({
      description,
      rating,
      productSlug,
    });

    $toast.success("Review updated", { position: "top" });
  } catch (error) {
    if (error.response.data.errors === "jwt expired") {
      $toast.error("Your session has ended. Please re-login.", {
        position: "top",
        dismissible: true,
        onDismiss: () => {
          window.location.reload();
        },
      });
    } else {
      $toast.error(
        "Something went wrong. Please try again or reload the page.",
        { position: "top" },
      );
    }
  } finally {
    toggleModalBox();
  }
}

onUnmounted(() => {
  isModalOpen.value = false;
});
</script>

<template>
  <h4 class="pb-3 font-bold text-dark-tone-ink">My Review</h4>

  <ReviewItem :review="myReview" />

  <button
    class="mb-7 pt-2 text-xs font-medium text-heirloom-hydrangea hover:underline"
    @click="toggleModalBox()"
  >
    Edit My review
  </button>

  <div
    class="absolute left-0 top-0 z-50 h-full w-full items-center md:fixed md:flex"
    v-show="isModalOpen"
    ref="modalBoxElement"
  >
    <div
      class="w-full overflow-hidden rounded-md bg-bleached-silk shadow-md md:ml-28 md:mr-auto md:w-2/5"
    >
      <div class="flex items-center justify-between border-b p-3">
        <span class="font-rubik font-semibold">Edit review</span>

        <button
          class="h-5 w-5 cursor-pointer transition duration-300 hover:scale-125"
          title="Cancel edit"
          @click="toggleModalBox()"
        >
          <IconCross />
        </button>
      </div>

      <ReviewInputForm :myReview="myReview" :sendReview="updateReviewHandler" />
    </div>
  </div>
</template>
