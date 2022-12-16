<script setup lang="ts">
import { useRequest } from "vue-request";
import { ElForm, ElDrawer, ElButton, FormInstance } from "element-plus";
import { merge } from "@wsvaio/utils";
import { VDrawerCtx } from "../types";
import { reactive, watchEffect, onMounted } from "vue";
const {
  action,
  form: formProps = {},
  drawer: drawerProps = {},
} = defineProps<{
  action: (ctx: VDrawerCtx) => Promise<any>;
  drawer?: VDrawerCtx["drawer"];
  form?: VDrawerCtx["form"];
}>();

const elFormRef = $ref<FormInstance>();
const form = reactive<VDrawerCtx["form"]>({});
const drawer = reactive<VDrawerCtx["drawer"]>({});
const payload = reactive<VDrawerCtx["payload"]>({
  $show: false,
  $name: "",
  $slot: "",
});
Object.defineProperties(payload, {
  $show: { enumerable: false },
  $name: { enumerable: false },
  $slot: { enumerable: false },
});

const { runAsync, loading } = $(
  useRequest(
    async (options?: string | VDrawerCtx["payload"]) => {
      if (typeof options == "object") {
        merge(payload, options);
      } else if (typeof options == "string") {
        payload.$name = options;
      }
      return await action(ctx);
    },
    {
      manual: true,
    }
  )
);
watchEffect(() => (payload.$show = !!payload.$slot));

const close = () => {
  merge(form, {}, { del: true });
  merge(drawer, {}, { del: true });
  merge(payload, { $show: false, $name: "", $slot: "" }, { del: true });
  elFormRef?.clearValidate();
};

const ctx = reactive({ drawer, form, act: runAsync, payload, loading, close });
onMounted(() => elFormRef && (ctx.elFormRef = elFormRef));
defineExpose(ctx);
</script>

<template>
  <el-form
    ref="elFormRef"
    label-position="top"
    :model="form"
    :="{ ...formProps, ...form }"
    :disabled="loading"
  >
    <el-drawer
      v-model="payload.$show"
      :="{ ...drawerProps, ...drawer }"
      :before-close="done => loading || done()"
      @closed="close"
    >
      <div v-loading="loading" min="h-full">
        <slot :name="payload.$slot" :="ctx"></slot>
      </div>
      <template #footer>
        <slot :name="`${payload.$slot}-footer`" :="ctx">
          <el-button @click="payload.$show = false">取消</el-button>
          <el-button type="primary" @click="runAsync()">
            <slot :name="`${payload.$slot}-submit-text`" :="ctx">确定</slot>
          </el-button>
        </slot>
      </template>
    </el-drawer>
    <slot :="ctx"></slot>
  </el-form>
</template>
