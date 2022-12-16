<script setup lang="ts">
import { useRequest } from "vue-request";
import { merge } from "@wsvaio/utils";
import { MPopupCtx } from "../types";
import { onMounted, reactive, watchEffect } from "vue";
import { Form as VanForm, Popup as VanPopup } from "vant";
const {
  action,
  popup: popupProps = {},
  form: formProps = {},
} = defineProps<{
  action: (ctx: MPopupCtx) => Promise<any>;
  popup?: MPopupCtx["popup"];
  form?: MPopupCtx["form"];
}>();

const vanFormRef = $ref<MPopupCtx["vanFormRef"]>();
const form = reactive<MPopupCtx["form"]>({});
const popup = reactive<MPopupCtx["popup"]>({});
const payload = reactive<MPopupCtx["payload"]>({
  $show: false,
  $name: "",
  $slot: "",
});
Object.defineProperties(payload, {
  $show: { enumerable: false },
  $name: { enumerable: false },
  $slot: { enumerable: false },
});

const { loading, runAsync } = $(
  useRequest(
    async (options?: string | MPopupCtx["payload"]) => {
      if (typeof options == "object") merge(payload, options);
      else if (typeof options == "string") payload.$name = options;
      return await action(ctx);
    },
    {
      manual: true,
      onSuccess: data => data && (payload.$show ? (payload.$show = false) : close()),
    }
  )
);

watchEffect(() => (payload.$show = !!payload.$slot));

const close = () => {
  merge(form, {}, { del: true });
  merge(popup, {}, { del: true });
  merge(payload, { $show: false, $name: "", $slot: "" }, { del: true });
  vanFormRef?.resetValidation();
};

const ctx = reactive({ form, formProps, popup, vanFormRef, act: runAsync, payload });
onMounted(() => vanFormRef && (ctx.vanFormRef = vanFormRef));
defineExpose(ctx);
</script>

<template>
  <van-form ref="vanFormRef" :="{ ...formProps, ...form }">
    <slot :="ctx"></slot>
    <van-popup
      v-model:show="payload.$show"
      :="{ ...popupProps, ...popup }"
      close-on-click-overlay
      :before-close="() => !loading"
      @closed="close"
    >
      <slot :name="payload.$slot" :="ctx"></slot>
    </van-popup>
  </van-form>
</template>

<!-- <style lang="less" scoped></style> -->
