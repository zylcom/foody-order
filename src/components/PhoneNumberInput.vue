<script setup>
import { ref } from "vue";

const props = defineProps({ phonenumberForm: Object, error: Object });
const emit = defineEmits(["update:phonenumberForm"]);

const phone = ref(props.phonenumberForm.number || "");

function onPhoneNumberInput(number, phoneObject) {
  emit("update:phonenumberForm", {
    number,
    countryCode: phoneObject.country?.iso2 || "ID",
  });
}
</script>

<template>
  <vue-tel-input
    class="rounded-[10px] text-sm placeholder:font-roboto [&>div]:rounded-l-[10px] [&_input]:rounded-r-[10px] [&_input]:bg-bleached-silk [&_input]:py-4 [&_ul]:w-[80vw] [&_ul]:max-w-[390px]"
    v-model="phone"
    mode="international"
    @on-input="onPhoneNumberInput"
    :class="{
      'border border-red-400': error && error?.phonenumberForm?.number,
    }"
    :inputOptions="{
      id: 'phone-number-input',
      required: true,
    }"
    :onlyCountries="['ID']"
    validCharactersOnly
  />

  <span
    v-if="error && error?.phonenumberForm?.number"
    class="block text-xs text-red-500"
  >
    {{ error.phonenumberForm.number._errors[0] }}
  </span>
</template>
