import { shallowMount } from "@vue/test-utils";
import ProductTagButtonList from "@/components/ProductTagButtonList.vue";

describe("ProductTagButtonList.vue Test", () => {
  const currentTag = "";
  const onClickHandlerMock = vi.fn();
  const wrapper = shallowMount(ProductTagButtonList, {
    props: { tag: currentTag, onClickHandler: onClickHandlerMock },
  });

  it("should render 'ProductTagButton' component", () => {
    expect(wrapper.findComponent("product-tag-button-stub").props().tag).toBe(
      "All",
    );
  });

  it("should render 'ProductTagButton' component with class 'text-red-500' if button active", () => {
    expect(
      wrapper.findComponent("product-tag-button-stub").classes(),
    ).toContain("text-red-500");
  });

  it("should call 'onClickHandler' props if button is clicked", async () => {
    await wrapper.findComponent("product-tag-button-stub").trigger("click");

    expect(onClickHandlerMock).toHaveBeenCalled();
  });
});
