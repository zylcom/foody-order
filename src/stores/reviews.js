import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useMutation } from "@vue/apollo-composable";
import apolloClient from "../plugins/apollo";
import {
  CREATE_REVIEW_QUERY,
  GET_PRODUCT_QUERY,
  UPDATE_REVIEW_QUERY,
} from "../config";
import { useAuthUserStore } from "./authUser";
import { useLoadingStore } from "./loading";

export const useReviewsStore = defineStore("Reviews", () => {
  const authUserStore = useAuthUserStore();
  const loadingStore = useLoadingStore();
  const reviews = ref([]);
  const myReview = ref(null);
  const getReviews = computed(() => reviews);
  const getMyReview = computed(() => myReview);

  function setReviews(productReviews) {
    const authUser = authUserStore.getAuthUser;

    reviews.value = productReviews;
    myReview.value = null;

    if (!authUser.value) {
      return productReviews;
    }

    // Get current user review and remove from reviews list.
    reviews.value = productReviews.filter((reviewData) => {
      if (reviewData.user.id === authUser.value.id) {
        myReview.value = reviewData;
      }

      return reviewData.user.id !== authUser.value.id;
    });
  }

  function postReview({ productId, description, ratingStar, slug }) {
    loadingStore.showLoading();

    const { mutate, onDone, onError } = useMutation(CREATE_REVIEW_QUERY);

    mutate({ productId, description, rating: ratingStar });

    onDone((mutateResult) => {
      if (mutateResult.data.createReview.__typename === "Review") {
        myReview.value = mutateResult.data.createReview;

        apolloClient.cache.updateQuery(
          {
            query: GET_PRODUCT_QUERY,
            variables: { slug },
          },
          (data) => {
            const newData = {
              getProduct: {
                ...data.getProduct,
                reviews: [...data.getProduct.reviews, { ...myReview.value }],
              },
            };

            const newAverageRating =
              newData.getProduct.reviews.reduce(
                (accumulator, review) => accumulator + review.rating,
                0
              ) / newData.getProduct.reviews.length;

            newData.getProduct.averageRating = newAverageRating;

            return newData;
          }
        );
      } else {
        alert(mutateResult.data.createReview.message);
      }

      loadingStore.hideLoading();
    });

    onError(({ networkError }) => {
      if (networkError) {
        alert(networkError.message);
      }

      loadingStore.hideLoading();
    });
  }

  function updateReview({ productId, description, ratingStar, slug }) {
    loadingStore.showLoading();

    const { mutate, onDone, onError } = useMutation(UPDATE_REVIEW_QUERY);

    mutate({ productId, description, rating: ratingStar });

    onDone((mutateResult) => {
      if (mutateResult.data.updateReview.__typename === "Review") {
        myReview.value = mutateResult.data.updateReview;

        apolloClient.cache.updateQuery(
          {
            query: GET_PRODUCT_QUERY,
            variables: { slug },
          },
          (data) => {
            const newData = {
              getProduct: {
                ...data.getProduct,
                reviews: [...data.getProduct.reviews, { ...myReview.value }],
              },
            };

            const newAverageRating =
              newData.getProduct.reviews.reduce(
                (accumulator, review) => accumulator + review.rating,
                0
              ) / newData.getProduct.reviews.length;

            newData.getProduct.averageRating = newAverageRating;

            return newData;
          }
        );
      } else {
        alert(mutateResult.data.updateReview.message);
      }

      loadingStore.hideLoading();
    });

    onError(({ networkError }) => {
      if (networkError) {
        alert(networkError.message);
      }

      loadingStore.hideLoading();
    });
  }

  return {
    reviews,
    myReview,
    getMyReview,
    getReviews,
    setReviews,
    postReview,
    updateReview,
  };
});
