import { RouterLinkStub, shallowMount } from "@vue/test-utils";
import ProductCard from "@/components/ProductCard.vue";

describe("ProductCard.vue Test", () => {
  const product = {
    node: { id: 1, name: "Pizza", slug: "pizza", price: 10000 },
  };

  const wrapper = shallowMount(ProductCard, {
    global: { stubs: { RouterLink: RouterLinkStub } },
    props: { product },
  });

  it("should render 'RouterLink' component", () => {
    expect(wrapper.findComponent(RouterLinkStub).props().to).toBe(
      `/menu/${product.slug}`,
    );
  });

  it("should not render likes count", () => {
    expect(wrapper.findComponent("icon-love-stub").exists()).toBe(false);
  });

  it("should not render average rating", () => {
    expect(wrapper.findComponent("icon-star-stub").exists()).toBe(false);
  });
});
