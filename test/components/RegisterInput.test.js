import { mount } from "@vue/test-utils";
import RegisterInput from "@/components/RegisterInput.vue";

describe("RegisterInput.vue Test", () => {
  const name = "Test Register";
  const username = "test_username";
  const password = "secret-password";
  const phonenumber = "083812345678";
  const wrapper = mount(RegisterInput, {
    global: {
      components: { "vue-tel-input": { template: "<div></div>" } },
    },
  });

  test("if name input filled, name ref will have same value", async () => {
    await wrapper.find("#name").setValue(name);

    wrapper.vm.$nextTick(() => {
      expect(wrapper.vm.name).toBe(name);
    });
  });

  test("if username input filled, username ref will have same value", async () => {
    await wrapper.find("#username").setValue(username);

    wrapper.vm.$nextTick(() => {
      expect(wrapper.vm.username).toBe(username);
    });
  });

  test("if password input filled, password ref will have same value", async () => {
    await wrapper.find("#password").setValue(password);

    wrapper.vm.$nextTick(() => {
      expect(wrapper.vm.password).toBe(password);
    });
  });

  test("if confirm password input filled, confirm password ref will have same value", async () => {
    await wrapper.find("#confirm-password").setValue(password);

    wrapper.vm.$nextTick(() => {
      expect(wrapper.vm.confirmPassword).toBe(password);
    });
  });

  it("should call 'onSubmitHandler' when form submitted", async () => {
    wrapper.vm.phonenumber = phonenumber;

    const onSubmitHandler = vi.spyOn(wrapper.vm, "onSubmitHandler");
    await wrapper.find("form").trigger("submit");

    wrapper.vm.$nextTick(() => {
      expect(onSubmitHandler).toHaveBeenCalled();
    });
  });
});
