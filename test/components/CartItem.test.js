import { shallowMount } from "@vue/test-utils";
import CartItem from "@/components/CartItem.vue";
import { afterEach, beforeEach } from "vitest";

describe("CartItem.vue Test", () => {
  const product = { id: 1, name: "Pizza", slug: "pizza", price: 10000 };
  const quantity = 5;
  const cartItemId = 1;
  const jsdomConfirm = window.confirm;

  beforeEach(() => {
    window.confirm = () => true;
  });

  afterEach(() => {
    window.confirm = jsdomConfirm;
  });

  const wrapper = shallowMount(CartItem, {
    props: { product, quantity, cartItemId },
  });

  it("should render quantity input component", () => {
    expect(wrapper.findComponent("quantity-input-stub").exists()).toBe(true);
  });

  it("should call 'removeItemHandler' when button is clicked", async () => {
    const removeItemHandler = vi.spyOn(wrapper.vm, "removeItemHandler");

    await wrapper.get("button").trigger("click");

    expect(removeItemHandler).toHaveBeenCalled();
  });
});
