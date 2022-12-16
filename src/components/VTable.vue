<script setup lang="ts">
import { usePagination, PaginationOptions } from "vue-request";
import { PaginationProps, TableProps, ElPagination, ElTable } from "element-plus";
import { debounce } from "@wsvaio/utils";
import { onMounted, reactive, watch } from "vue";
import { VTableCtx, VDrawerCtx } from "../types";
import VDrawer from "./VDrawer.vue";

const {
  data: tableData,
  action,
  form: form = {},
  drawer: drawer = {},
  paginationKey = {
    currentKey: "page",
    listKey: "items",
    pageSizeKey: "pageSize",
    totalKey: "count",
  },
} = defineProps<{
  data: (
    params: Record<any, any>
  ) => Promise<{ count: number; items: Record<any, any>[] } & Record<any, any>>;
  action: (ctx: VTableCtx) => Promise<any>;

  paginationKey?: PaginationOptions<any, any>["pagination"] & { listKey?: string };
  pagination?: Partial<PaginationProps>;
  drawer?: VTableCtx["drawer"];
  form?: VTableCtx["form"];
  table?: Partial<TableProps<Record<any, any>>>;
}>();

const checkList = reactive<Record<any, any>[]>([]);
const params = reactive<Record<any, any>>({});
watch(
  params,
  debounce(() => refresh(), 500)
);
const { refresh, data, loading, pageSize, total, current } = $(
  usePagination(data => tableData({ ...data, ...params }), {
    pagination: paginationKey,
  })
);

const vdrawerRef = $ref<VDrawerCtx>();
const ctx = reactive(<VTableCtx>{ checkList, params, refresh });
onMounted(() => vdrawerRef && Object.assign(ctx, vdrawerRef));
defineExpose(ctx);
</script>

<template>
  <v-drawer
    ref="vdrawerRef"
    :drawer="drawer"
    :action="() => action(ctx)"
    class="vtable"
    :form="form"
    @submited="refresh"
  >
    <template
      v-for="name in Object.keys($slots).filter(
        item => !['default', 'top', 'bottom'].includes(item)
      )"
      #[name]
    >
      <slot :name="name" :="ctx"></slot>
    </template>

    <template #default>
      <div v-if="$slots.top" class="vtable-top">
        <slot name="top" :="ctx"></slot>
      </div>

      <el-table
        v-loading="loading"
        :data="(data && data[paginationKey.listKey || 'items']) || []"
        :border="true"
        table-layout="auto"
        :="{ ...$attrs, ...$props.table }"
        @selection-change="
          list => {
            checkList.length = 0;
            checkList.push(...list);
          }
        "
      >
        <slot :="ctx"></slot>
        <template #append>
          <slot name="bottom" :="ctx"></slot>
        </template>
      </el-table>

      <el-pagination
        v-model:currentPage="current"
        v-model:page-size="pageSize"
        :total="total"
        :page-sizes="[10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 200, 300, 400, 500, 1000]"
        layout="sizes, total, ->, prev, pager, next, jumper, slot"
        :="$props.pagination"
      >
      </el-pagination>
    </template>
  </v-drawer>
</template>

<style>
.vtable .vtable-top {
  display: flex;
  margin: -3px -6px;
  flex-wrap: wrap;
}

.vtable .vtable-top > * {
  margin: 3px 6px;
}

.vtable .vtable-top .el-button + .el-button {
  margin-left: 6px;
}

.vtable .el-table .el-link + .el-link {
  margin-left: 8px;
}

.vtable .vtable-top ~ .el-table {
  margin-top: 15px;
}
.vtable .el-pagination {
  margin-top: 25px;
  overflow: auto;
}
</style>
