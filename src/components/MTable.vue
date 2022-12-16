<script lang="ts" setup>
import { computed, reactive } from "vue";

const { labelWidth } = defineProps<{
  data: Record<any, any>[];
  idKey?: string;
  labelWidth?: string;
}>();
const column = reactive<Record<any, any>[]>([]);
const gridTemplateColumns = computed(() =>
  column.map(item => item.width ?? labelWidth ?? "auto").join(" ")
);
defineExpose({ column });
</script>

<template>
  <div class="mtable">
    <div
    v-for="(col, x) in column"
    :="col.attrs"
    :class="[`row-0`, `col-${x}`, `row-even`, x % 2 == 0 ? `col-even` : `col-odd`]"
  >
    <component :is="col.slots.label" v-if="col.slots.label" :="{ col, x, y: 0 }"></component>
    <template v-else>{{ col.label }}</template>
  </div>
  <template v-for="(row, y) in data">
    <div
      v-for="(col, x) in column"
      :key="col.label + row[idKey ?? 'id']"
      :="col.attrs"
      :class="[
        `row-${y + 1}`,
        `col-${x}`,
        (y + 1) % 2 == 0 ? `row-even` : `row-odd`,
        x % 2 == 0 ? `col-even` : `col-odd`,
      ]"
    >
      <component :is="col.slots.default" v-if="col.slots.default" :="{ row, col, x, y: y + 1 }">
      </component>
      <template v-else>{{ row[col.prop] }}</template>
    </div>
  </template>
  <slot></slot>
  </div>
</template>

<style>
.mtable {
  display: grid;
  max-width: 100vw;
  overflow: auto;
  gap: 1px;
  text-align: center;
  grid-template-columns: v-bind(gridTemplateColumns);
}
.mtable > div {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 8px;
  background-color: white;
}
.mtable > div[sticky] {
  position: sticky;
  left: 0;
  right: 0;
  z-index: 1;
  filter: invert(10%);
}
.mtable > div:active {
  filter: invert(5%);
}
.mtable::-webkit-scrollbar {
  width: 0;
  height: 0;
}
</style>
