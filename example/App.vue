<script setup lang="ts">
import { VTable, VTableCtx } from "../dist";
// import "../dist/index.css";
import { ElTableColumn } from "element-plus";
import "element-plus/es/components/table/style/css";
import "element-plus/es/components/pagination/style/css";

const action = async ({ payload }: VTableCtx) => {

  console.log(payload);
};
const data = async (params) => {
  console.log(params);
  return {
    count: 100,
    items: [
      {
        id: 1,
        name: "a1"
      },
      {
        id: 2,
        name: "a2"
      }
    ]
  }
}
</script>

<template>
  <h1>Hello</h1>

  <v-table :data="data" :action="action">
    <el-table-column label="ID" prop="id"></el-table-column>
    <el-table-column label="NAME" prop="name"></el-table-column>
  </v-table>
</template>
