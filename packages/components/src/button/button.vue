<script lang="ts" setup>
import "./style/index.less";
import { computed } from "vue";

const buttonProps = defineProps<ButtonProps>();
interface ButtonProps {
  type?: string;
  size?: string;
}
const buttonStyle = computed(() => {
  return { [`ea-button--${buttonProps.type}`]: buttonProps.type };
});
</script>

<template>
  <button class="ea-button" :class="buttonStyle">
    <slot />
  </button>
</template>
