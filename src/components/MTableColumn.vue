<script lang="ts" setup>
import { getCurrentInstance } from "vue";

const props = defineProps<{
  label?: string;
  prop?: string;
  width?: string;
}>();

const current = getCurrentInstance();
current?.parent?.exposed?.column?.push({
  ...props,
  attrs: current.attrs,
  slots: current.slots,
});
</script>

<template></template>
