<script setup lang="ts">
import { useRequest } from "vue-request";
import { ElForm, ElDialog, ElButton, FormInstance } from "element-plus";
import { merge } from "@wsvaio/utils";
import { reactive, watchEffect, onMounted } from "vue";
import { VDialogCtx } from "../types";

const {
  action,
  form: formProps = {},
  dialog: dialogProps = {},
} = defineProps<{
  action: (ctx: VDialogCtx) => Promise<any>;
  dialog?: VDialogCtx["dialog"];
  form?: VDialogCtx["form"];
}>();

const elFormRef = $ref<FormInstance>();
const form = reactive<VDialogCtx["form"]>({});
const dialog = reactive<VDialogCtx["dialog"]>({});
const payload = reactive<VDialogCtx["payload"]>({
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
    async (options?: string | VDialogCtx["payload"]) => {
      if (typeof options == "object") {
        merge(payload, options);
      } else if (typeof options == "string") {
        payload.$name = options;
      }
      return await action(ctx as any);
    },
    {
      manual: true,
    }
  )
);
watchEffect(() => (payload.$show = !!payload.$slot));

const close = () => {
  merge(form, {}, { del: true });
  merge(dialog, {}, { del: true });
  merge(payload, { $show: false, $name: "", $slot: "" }, { del: true });
  elFormRef?.clearValidate();
};
const ctx: Record<any, any> = reactive({ dialog, form, act: runAsync, payload, loading, close });
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
    <el-dialog
      v-model="payload.$show"
      :="{ ...dialogProps, ...dialog }"
      :before-close="done => loading || done()"
      @closed="close"
    >
      <div v-loading="loading">
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
    </el-dialog>
    <slot :="ctx"></slot>
  </el-form>
</template>
