import { defineStore } from "pinia";
import { ref } from "vue";

export const useOrderStore = defineStore("Order", () => {
  const orderDetails = ref();
  const customerDetails = ref();
  const shippingDetails = ref();
  const deliveryDetails = ref();

  function setCustomerDetails(data) {
    customerDetails.value = data;
    orderDetails.value = { ...orderDetails.value, customerDetails: data };
  }

  function setShippingDetails(data) {
    shippingDetails.value = data;
    orderDetails.value = { ...orderDetails.value, shippingDetails: data };
  }

  function setDeliveryDetails(data) {
    deliveryDetails.value = data;
    orderDetails.value = {
      ...orderDetails.value,
      deliveryDetails: { ...data },
    };
  }

  function setOrderDetails(data) {
    orderDetails.value = data;
  }

  return {
    customerDetails,
    deliveryDetails,
    orderDetails,
    shippingDetails,
    setCustomerDetails,
    setDeliveryDetails,
    setOrderDetails,
    setShippingDetails,
  };
});
