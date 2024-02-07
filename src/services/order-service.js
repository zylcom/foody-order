import validate from "../validation/validation";
import { axios, getAccessToken, getGuestUserId } from "@/utils";
import { useOrderStore } from "@/stores/order";
import { orderIdValidation } from "../validation/order-validation";
import { allStore } from "../stores";

const accessToken = getAccessToken();

async function create(payload) {
  const guestUserId = getGuestUserId();
  const { authUserStore } = allStore();

  return axios
    .post(`/orders${guestUserId ? "?guest_uid=" + guestUserId : ""}`, payload, {
      headers: {
        Authorization: accessToken ? `Bearer ${accessToken}` : undefined,
      },
    })
    .then(async (response) => {
      if (response.status === 201) {
        return await checkout(response.data.data);
      }

      return response;
    })
    .catch(() => {
      authUserStore.preload();
    });
}

async function checkout(order) {
  const orderId = validate(orderIdValidation, order.id);
  const guestUserId = getGuestUserId();
  const { authUserStore } = allStore();

  return axios
    .post(
      `/orders/checkout?id=${orderId}${
        guestUserId ? "&guest_uid=" + guestUserId : ""
      }`,
      {},
      {
        headers: {
          Authorization: accessToken ? `Bearer ${accessToken}` : undefined,
        },
      },
    )
    .then((response) => ({ transactionToken: response.data.data, order }))
    .catch(() => {
      authUserStore.preload();
    });
}

async function get(orderId) {
  const orderStore = useOrderStore();
  const guestUserId = getGuestUserId();

  orderId = validate(orderIdValidation, orderId);

  return axios
    .get(
      `/orders/${orderId}${guestUserId ? "?guest_uid=" + guestUserId : ""}`,
      {
        headers: {
          Authorization: accessToken ? `Bearer ${accessToken}` : undefined,
        },
      },
    )
    .then((response) => {
      orderStore.setOrderDetails(response.data.data);

      return response;
    });
}

async function cancel(orderId) {
  const orderStore = useOrderStore();

  orderId = validate(orderIdValidation, orderId);

  return axios
    .post(
      `/orders/${orderId}/cancel`,
      {},
      { headers: { Authorization: accessToken } },
    )
    .then((response) => {
      console.log(response.data);

      orderStore.set(response.data.data);

      return response;
    });
}

async function listOrder() {
  const guestUserId = getGuestUserId();

  return axios
    .get(`/orders${guestUserId ? "?guest_uid=" + guestUserId : ""}`, {
      headers: {
        Authorization: accessToken ? `Bearer ${accessToken}` : undefined,
      },
    })
    .then((response) => response.data.data);
}

export default { create, checkout, get, cancel, listOrder };
