import { computed } from "vue";
import validate from "../validation/validation";
import productService from "./product-service";
import { allStore } from "../stores";
import { axios, getAccessToken } from "../utils";
import {
  createReviewValidation,
  updateReviewValidation,
} from "../validation/review-validation";

async function create({ productSlug, description, rating }) {
  const { authUserStore, productDetailStore, productsStore } = allStore();
  const authUser = computed(() => authUserStore.authUser);
  const product = computed(() => productDetailStore.getProduct);

  const result = validate(createReviewValidation, {
    productSlug,
    description,
    rating,
  });

  return axios.post(
    "/products/reviews",
    {
      description: result.description,
      rating: result.rating,
      productSlug: result.productSlug,
    },
    {
      headers: { Authorization: "Bearer ".concat(getAccessToken()) },
      cache: {
        update: {
          [`product-${result.productSlug}`]: (
            productCache,
            createReviewResponse,
          ) => {
            if (productCache.state !== "cached") {
              productService.get(result.productSlug);

              return "ignore";
            }

            product.value.reviews.push({
              ...createReviewResponse.data.data,
              user: authUser.value,
            });

            const sumRating = product.value.reviews.reduce(
              (acc, review) => acc + review.rating,
              0,
            );

            product.value.averageRating =
              sumRating / productCache.data.data.data.reviews.length;

            const products = productsStore.products;

            const newProducts = products.map((val) => {
              if (val.slug === product.value.slug) {
                return product.value;
              } else {
                return val;
              }
            });

            productDetailStore.setData(product.value);

            productsStore.$reset();

            productsStore.set({
              data: newProducts,
              paging: productsStore.paging,
            });

            return productCache;
          },
        },
      },
    },
  );
}

async function update({ productSlug, description, rating }) {
  const { authUserStore, productDetailStore, productsStore } = allStore();
  const authUser = computed(() => authUserStore.authUser);
  const product = computed(() => productDetailStore.getProduct);

  const result = validate(updateReviewValidation, {
    productSlug,
    description,
    rating,
  });

  return axios.put(
    "/products/reviews",
    {
      description: result.description,
      rating: result.rating,
      productSlug: result.productSlug,
    },
    {
      headers: { Authorization: "Bearer ".concat(getAccessToken()) },
      cache: {
        update: {
          [`product-${result.productSlug}`]: (
            productCache,
            updateReviewResponse,
          ) => {
            if (productCache.state !== "cached") {
              productService.get(result.productSlug);

              return "ignore";
            }

            const newReviews = productCache.data.data.data.reviews.map(
              (review) => {
                if (
                  review.username === updateReviewResponse.data.data.username
                ) {
                  return {
                    ...updateReviewResponse.data.data,
                    user: authUser.value,
                  };
                }

                return review;
              },
            );

            product.value.reviews = newReviews;

            const sumRating = newReviews.reduce(
              (acc, review) => acc + review.rating,
              0,
            );

            product.value.averageRating =
              sumRating / productCache.data.data.data.reviews.length;

            productDetailStore.setData(productCache.data.data.data);

            const products = productsStore.products;

            const newProducts = products.map((product) => {
              if (product.slug === productCache.data.data.data.slug) {
                return productCache.data.data.data;
              } else {
                return product;
              }
            });

            productsStore.$reset();

            productsStore.set({
              data: newProducts,
              paging: productsStore.paging,
            });

            return productCache;
          },
        },
      },
    },
  );
}

export default { create, update };
