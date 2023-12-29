<script setup>
import { ref, watch } from "vue";
import { Combobox } from "radix-vue/namespaced";
import IconCheck from "@/components/icons/IconCheck.vue";
import IconChevronDown from "@/components/icons/IconChevronDown.vue";

defineProps({
  options: Array,
  placeholder: String,
  value: String,
});
const emit = defineEmits(["update:value"]);

const defaultValue = ref("");

watch(defaultValue, (newValue) => {
  emit("update:value", newValue);
});
</script>

<template>
  <Combobox.Root v-model="defaultValue" class="relative">
    <Combobox.Anchor
      class="inline-flex w-full min-w-[160px] items-center justify-between gap-[5px] rounded-[10px] border border-gray-400 bg-zhen-zhu-bai-pearl/70 text-sm leading-none text-dark-tone-ink"
    >
      <Combobox.Input
        class="h-full !bg-transparent px-1 py-5 outline-none data-[placeholder]:text-black"
        :placeholder="placeholder"
      />
      <Combobox.Trigger>
        <IconChevronDown class="h-4 w-4" />
      </Combobox.Trigger>
    </Combobox.Anchor>

    <Combobox.Content
      class="rounded bg-bleached-silk shadow-[0_0_10px_1px_rgba(0,0,0,0.3)] will-change-[opacity,transform]"
      hideWhenDetached
    >
      <Combobox.Viewport class="p-[5px]">
        <Combobox.Empty
          class="text-mauve8 py-2 text-center text-xs font-medium"
        />

        <Combobox.Group>
          <Combobox.Item
            v-for="(option, index) in options"
            :key="index"
            class="relative flex h-[25px] select-none items-center rounded-[3px] pl-[25px] pr-[35px] text-[13px] uppercase leading-none text-mint-jelly data-[disabled]:pointer-events-none data-[highlighted]:bg-mint-jelly data-[disabled]:text-thamar-black/30 data-[highlighted]:text-zhen-zhu-bai-pearl data-[highlighted]:outline-none"
            :value="option"
          >
            <Combobox.ItemIndicator
              class="absolute left-0 inline-flex w-[25px] items-center justify-center"
            >
              <IconCheck class="h-3 w-3 stroke-current" />
            </Combobox.ItemIndicator>
            <span>
              {{ option }}
            </span>
          </Combobox.Item>
          <Combobox.Separator class="bg-grass6 m-[5px] h-[1px]" />
        </Combobox.Group>
      </Combobox.Viewport>
    </Combobox.Content>
  </Combobox.Root>
</template>
