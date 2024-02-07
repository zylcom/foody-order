import { createRouter, createWebHistory } from "vue-router";
import { useAuthUserStore } from "@/stores/authUser";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      meta: { requiresAuth: false, transition: "slide-right" },
      components: {
        default: () => import("@/views/HomeView.vue"),
        NavigationTab: () => import("@/components/NavigationTab.vue"),
      },
    },
    {
      path: "/menu",
      name: "menu",
      meta: { requiresAuth: false },
      components: {
        default: () => import("@/views/MenuView.vue"),
        NavigationTab: () => import("@/components/NavigationTab.vue"),
      },
    },
    {
      path: "/menu/:slug",
      meta: { requiresAuth: false },
      name: "detail product",
      component: () => import("@/views/DetailProductView.vue"),
    },
    {
      path: "/history",
      name: "history",
      meta: { requiresAuth: true },
      components: {
        default: () => import("@/views/HistoryView.vue"),
        NavigationTab: () => import("@/components/NavigationTab.vue"),
      },
    },
    {
      path: "/settings",
      name: "settings",
      meta: { requiresAuth: false, transition: "slide-left" },
      components: {
        default: () => import("@/views/SettingView.vue"),
        NavigationTab: () => import("@/components/NavigationTab.vue"),
      },
    },
    {
      path: "/cart",
      name: "cart",
      meta: { requiresAuth: false },
      component: () => import("@/views/CartView.vue"),
    },
    {
      path: "/result",
      name: "search",
      meta: { requiresAuth: false },
      component: () => import("@/views/SearchPage.vue"),
    },
    {
      path: "/login",
      name: "login",
      meta: { requiresAuth: false, transition: "slide-right" },
      component: () => import("@/views/AuthenticationView.vue"),
    },
    {
      path: "/register",
      name: "register",
      meta: { requiresAuth: false, transition: "slide-left" },
      component: () => import("@/views/AuthenticationView.vue"),
    },
    {
      path: "/payment/:transactionId",
      name: "payment",
      meta: { requiresAuth: false },
      component: () => import("@/views/PaymentView.vue"),
    },
    {
      path: "/order/:id",
      name: "order",
      meta: { requiresAuth: false },
      component: () => import("@/views/OrderDetailView.vue"),
    },
    {
      path: "/feedback",
      name: "feedback",
      meta: { requiresAuth: false },
      component: () => import("@/views/FeedbackView.vue"),
    },
  ],
});

router.beforeEach(async (to) => {
  const authUserStore = useAuthUserStore();

  const result = await authUserStore.preload();

  if (to.meta.requiresAuth && !result.isLoggedIn) {
    return { path: "/login", query: { redirect: to.fullPath } };
  }

  if (
    (to.fullPath === "/login" || to.fullPath === "/register") &&
    result.isLoggedIn
  ) {
    return { path: "/" };
  }
});

export default router;
