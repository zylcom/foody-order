import { mount } from "@vue/test-utils";
import AddToCartButton from "@/components/AddToCartButton.vue";
import { nextTick } from "vue";

describe("AddToCartButton.vue Test", () => {
  const wrapper = mount(AddToCartButton, {
    props: { cartItem: {} },
  });

  test("if quantity props greater than 0, button must not disabled", async () => {
    await wrapper.setProps({ quantity: 1 });
    const button = wrapper.find("button");

    expect(button.attributes().disabled).toBeUndefined();
  });

  test("if quantity props less than 1, button must be disabled", async () => {
    await wrapper.setProps({ quantity: 0 });
    const button = wrapper.find("button");

    expect(button.attributes().disabled).toBeDefined();
  });

  test("if quantity props undefined, button must be disabled", () => {
    const button = wrapper.find("button");

    expect(button.attributes().disabled).toBeDefined();
  });

  it("should display 'Add to cart' text when cartItem empty", () => {
    const button = wrapper.find("button");

    expect(button.text()).toBe("Add to cart");
  });

  it("should display 'Update' text when cartItem not empty", async () => {
    await wrapper.setProps({ cartItem: { product: { id: 1 } } });
    const button = wrapper.find("button");

    expect(button.text()).toBe("Update");
  });

  it("should fire event 'addToCartHandler' when clicked and quantity props greater than 0", async () => {
    const quantity = 1;
    const product = { name: "Pizza", slug: "pizza" };
    const addToCartHandler = vi.spyOn(wrapper.vm, "addToCartHandler");

    await wrapper.setProps({ quantity, product });

    await nextTick();

    await wrapper.get("button").trigger("click");

    expect(addToCartHandler).toHaveBeenCalled();
  });

  it("should call 'cartStore.upsertItem' action as guest user", async () => {
    const quantity = 5;
    const product = { name: "Pizza", slug: "pizza" };
    const productSlug = product.slug;
    const upsertItem = vi.spyOn(wrapper.vm.cartStore, "upsertItem");

    await wrapper.setProps({ quantity, product });

    await nextTick();

    await wrapper.get("button").trigger("click");

    expect(upsertItem).toHaveBeenCalledWith({
      productSlug,
      quantity,
      product,
    });
  });

  it("should call 'cartService.upsert' action as authenticated user", async () => {
    const quantity = 5;
    const product = { name: "Pizza", slug: "pizza" };
    const upsert = vi.spyOn(wrapper.vm.cartService, "upsert");

    await wrapper.setProps({ quantity, product });

    wrapper.vm.authUserStore.authUser = { id: 1 };

    await nextTick();

    await wrapper.get("button").trigger("click");

    expect(upsert).toHaveBeenCalled();
  });
});
