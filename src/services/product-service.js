import { computed } from "vue";
import validate from "../validation/validation";
import { axios, getAccessToken } from "../utils";
import {
  getBestRatedValidation,
  getProductValidation,
  infiniteValidation,
  likeValidation,
} from "../validation/product-validation";
import { allStore } from "../stores";

async function get(slug) {
  const { productDetailStore, reviewsStore } = allStore();
  slug = validate(getProductValidation, slug);

  await axios
    .get(`/products/${slug}`, {
      id: `product-${slug}`,
      cache: {
        ttl: 1000 * 60, // 1 minute.
      },
    })
    .then((response) => {
      productDetailStore.setData(response.data.data);
      reviewsStore.setReviews(response.data.data.reviews);

      return response;
    });
}

async function infinite({ category, name, tag, size, cursor }) {
  const { productsStore } = allStore();
  const result = validate(infiniteValidation, {
    category,
    name,
    tag,
    size,
    cursor,
  });

  return axios
    .get(
      `/products?name=${result.name}&category=${result.category}&tag=${
        result.tag
      }&size=${result.size}${result.cursor ? "&cursor=" + result.cursor : ""}`,
    )
    .then((response) => {
      productsStore.set(response.data);

      return response;
    });
}

async function getBestRated(category) {
  const { bestRatedProductsStore } = allStore();
  category = validate(getBestRatedValidation, category);

  return axios
    .get(`/products/best-rated?category=${category}`, {
      cache: false,
    })
    .then((response) => {
      if (category === "food") {
        bestRatedProductsStore.setFoods(response.data.data);
      }

      if (category === "drink") {
        bestRatedProductsStore.setDrinks(response.data.data);
      }

      return response;
    });
}

async function like(productSlug) {
  const { productDetailStore, productsStore } = allStore();
  const product = computed(() => productDetailStore.getProduct);
  const products = computed(() => productsStore.products);

  productSlug = validate(likeValidation, productSlug);

  return axios
    .post(
      `/products/${productSlug}/like`,
      {},
      {
        headers: { Authorization: "Bearer ".concat(getAccessToken()) },
        cache: {
          update: {
            [`product-${productSlug}`]: (productCache, likeResponse) => {
              if (productCache.state !== "cached") {
                get(productSlug);

                return "ignore";
              }

              product.value.likes.push(likeResponse.data.data);

              const newProducts = products.value.map((val) => {
                if (val.slug === product.value.slug) {
                  return product.value;
                } else {
                  return val;
                }
              });

              productsStore.$reset();

              productsStore.set({
                data: newProducts,
                paging: productsStore.paging,
              });

              return "ignore";
            },
          },
        },
      },
    )
    .then((response) => response);
}

async function neutralizeLikeProduct(productSlug) {
  const { productDetailStore, productsStore } = allStore();
  const product = computed(() => productDetailStore.getProduct);
  const products = computed(() => productsStore.products);

  productSlug = validate(likeValidation, productSlug);

  return axios
    .delete(`/products/${productSlug}/like`, {
      headers: { Authorization: "Bearer ".concat(getAccessToken()) },
      cache: {
        update: {
          [`product-${productSlug}`]: (productCache, likeResponse) => {
            if (productCache.state !== "cached") {
              get(productSlug);

              return "ignore";
            }

            product.value.likes = product.value.likes.filter(
              (val) => val.username !== likeResponse.data.data.username,
            );

            const newProducts = products.value.map((val) => {
              if (val.slug === product.value.slug) {
                return product.value;
              } else {
                return val;
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
    })
    .then((response) => response);
}

export default { get, infinite, getBestRated, like, neutralizeLikeProduct };
