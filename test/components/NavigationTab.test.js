import { shallowMount } from "@vue/test-utils";
import NavigationTab from "@/components/NavigationTab.vue";

describe("NavigationTab.vue Test", () => {
  const wrapper = shallowMount(NavigationTab);

  it("should render 'NavigationButton' component", () => {
    expect(wrapper.findComponent("navigation-button-stub").isVisible()).toBe(
      true,
    );
  });
});
