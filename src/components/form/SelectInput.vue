<script setup>
import { ref, watch } from "vue";
import { Select } from "radix-vue/namespaced";
import IconCheck from "@/components/icons/IconCheck.vue";
import IconGreaterThan from "@/components/icons/IconGreaterThan.vue";
import IconChevronDown from "@/components/icons/IconChevronDown.vue";
import IconChevronUp from "@/components/icons/IconChevronUp.vue";

const props = defineProps({
  options: Array,
  placeholder: String,
  value: String,
});
const emit = defineEmits(["update:value"]);

const defaultValue = ref(props.value || undefined);

watch(defaultValue, (newValue) => {
  emit("update:value", newValue);
});
</script>

<template>
  <Select.Root v-model="defaultValue">
    <Select.Trigger
      class="inline-flex h-[35px] w-full min-w-[160px] items-center justify-between gap-[5px] rounded-[10px] border border-gray-400 bg-zhen-zhu-bai-pearl/70 px-1 py-7 text-sm text-dark-tone-ink outline-none focus-within:border focus-within:border-[#66afe9] focus-within:shadow-[inset_0_1px_1px_rgba(0,0,0,.2),0_0_8px_#66afe999] focus-within:outline-none focus-within:ring-0 data-[placeholder]:text-thamar-black/40"
      aria-label="City options"
    >
      <Select.Value :placeholder="placeholder" />
      <IconGreaterThan class="ml-auto h-4 w-4 shrink-0" />
    </Select.Trigger>

    <Select.Portal>
      <Select.Content
        class="z-[100] w-fit rounded bg-bleached-silk shadow-[0_0_10px_1px_rgba(0,0,0,0.3)] will-change-[opacity,transform]"
      >
        <Select.ScrollUpButton
          class="text-violet11 flex h-[25px] cursor-default items-center justify-center rounded-t bg-cloud-break"
        >
          <IconChevronUp class="h-3 w-3" />
        </Select.ScrollUpButton>

        <Select.Viewport class="p-1.5">
          <Select.Group>
            <Select.Item
              v-for="(option, index) in options"
              :key="index"
              class="relative flex h-[25px] select-none items-center rounded-[3px] pl-[25px] pr-[35px] text-[13px] uppercase leading-none text-mint-jelly data-[disabled]:pointer-events-none data-[highlighted]:bg-mint-jelly data-[disabled]:text-thamar-black/30 data-[highlighted]:text-zhen-zhu-bai-pearl data-[highlighted]:outline-none"
              :value="option"
            >
              <Select.ItemIndicator
                class="absolute left-0 inline-flex w-[25px] items-center justify-center"
              >
                <IconCheck class="h-3 w-3 stroke-current" />
              </Select.ItemIndicator>

              <Select.ItemText>
                {{ option }}
              </Select.ItemText>
            </Select.Item>
          </Select.Group>
        </Select.Viewport>

        <Select.ScrollDownButton
          class="flex h-[25px] cursor-default items-center justify-center rounded-b bg-cloud-break"
        >
          <IconChevronDown class="h-3 w-3" />
        </Select.ScrollDownButton>
      </Select.Content>
    </Select.Portal>
  </Select.Root>
</template>
