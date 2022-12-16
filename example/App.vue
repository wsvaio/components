<script setup lang="ts">
import { MTable, MTableColumn } from "../dist";
import "../dist/index.css";
</script>

<template>
  <m-table
    :data="[
      { id: 1, name: 'ws', age: 198 },
      { id: 2, name: 'sw', age: 12 },
      { id: 3, name: 'sw', age: 12 },
      { id: 4, name: 'sw', age: 12 },
      { id: 5, name: 'sw', age: 12 },
    ]"
  >
    <m-table-column label="ID" prop="id" sticky></m-table-column>
    <m-table-column label="NAME" prop="name" :class="['wdf']" #="{ row }">
      {{ row.name }}
    </m-table-column>
    <m-table-column label="AGE" prop="age"></m-table-column>
    <m-table-column label="SETTING" #="{ row }">
      <van-button size="mini">修改</van-button>
    </m-table-column>
  </m-table>
</template>
