import { useAuthUserStore } from "./authUser";
import { useCartStore } from "./cart";
import { useCategoryStore } from "./category";
import { useErrorStore } from "./error";
import { useLoadingStore } from "./loading";
import { useBestRatedProductsStore } from "./bestRatedProducts";
import { useOrderStore } from "./order";
import { useProductDetailStore } from "./productDetail";
import { useProductsStore } from "./products";
import { useReviewsStore } from "./reviews";
import { useTagStore } from "./tag";

export const allStore = () => {
  return {
    authUserStore: useAuthUserStore(),
    bestRatedProductsStore: useBestRatedProductsStore(),
    cartStore: useCartStore(),
    categoryStore: useCategoryStore(),
    errorStore: useErrorStore(),
    loadingStore: useLoadingStore(),
    orderStore: useOrderStore(),
    productsStore: useProductsStore(),
    productDetailStore: useProductDetailStore(),
    reviewsStore: useReviewsStore(),
    tagStore: useTagStore(),
  };
};
