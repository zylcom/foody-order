import Axios from "axios";
import { setupCache } from "axios-cache-interceptor";

const baseApiUrl = import.meta.env.VITE_BASE_API_URL;

const axios = setupCache(
  Axios.create({
    baseURL: baseApiUrl,
    headers: {
      "Content-Type": "application/json",
    },
  }),
);

function clearKeyword(keyword) {
  return keyword ? keyword.trim().replace(/\s{2,}/g, " ") : undefined;
}

function formatNumberToIDR(number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(number);
}

function formatFloatNumber(number) {
  return number ? parseFloat(number.toFixed(1)) : "N/A";
}

function saveAccessToken(token) {
  localStorage.setItem("accessToken", token);
}

function getAccessToken() {
  return localStorage.getItem("accessToken");
}

function removeAccessToken() {
  localStorage.removeItem("accessToken");
}

function isNumberKey(event) {
  const charCode = event.which ? event.which : event.keyCode;

  return charCode > 31 && (charCode < 48 || charCode > 57) ? false : true;
}

function formatNumber(number) {
  if (number >= 1000) {
    return (number / 1000).toFixed(1) + "K";
  } else if (number >= 1000000) {
    return (number / 1000000).toFixed(1) + "M";
  } else if (number >= 1000000000) {
    return (number / 1000000000).toFixed(1) + "B";
  }

  return number;
}

function formatDateToLocaleId({ date, showTime, hour12 }) {
  let options = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  if (showTime) {
    options.hour = "numeric";
    options.minute = "numeric";
    options.hour12 = hour12;
  }

  return new Intl.DateTimeFormat("id-ID", options).format(new Date(date));
}

function calculateTotalItems(items) {
  return items.reduce((acc, val) => {
    return acc + val.quantity;
  }, 0);
}

function calculateTotalPrice(items) {
  return items.reduce((acc, item) => {
    return acc + item.quantity * item.product.price;
  }, 0);
}

function saveCartToLocalstorage(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function getCartFromLocalstorage() {
  const cart = localStorage.getItem("cart");

  return JSON.parse(cart);
}

function getGuestUserId() {
  return localStorage.getItem("guest_uid");
}

function saveGuestUserId(guestUserId) {
  localStorage.setItem("guest_uid", guestUserId);
}

export {
  axios,
  calculateTotalItems,
  calculateTotalPrice,
  clearKeyword,
  formatDateToLocaleId,
  formatFloatNumber,
  formatNumber,
  formatNumberToIDR,
  getAccessToken,
  getCartFromLocalstorage,
  getGuestUserId,
  isNumberKey,
  removeAccessToken,
  saveAccessToken,
  saveCartToLocalstorage,
  saveGuestUserId,
};
