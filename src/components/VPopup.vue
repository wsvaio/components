<script setup lang="ts">
import { debounce, sleep } from "@wsvaio/utils";
import { CSSProperties, inject, nextTick, onBeforeMount, provide, reactive, watch } from "vue";
const {
  direction = "bottom",
  duration = 200,
  gap = 12,
  active = true,
} = defineProps<{
  direction?: "top" | "left" | "right" | "bottom";
  gap?: number;
  duration?: number;
  transitionName?: string;
  active?: boolean;
  popuperClass?: string | string[];
}>();

const popuperStyle = reactive<CSSProperties>({});
const triggerRef = $ref<HTMLDivElement>();
const popuperRef = $ref<HTMLDivElement>();

let isShow = $ref(false);
const setIsShow = debounce(async (show, delay = 0) => {
  await sleep(delay);
  isShow = show;
}, duration);
const syncIsShowInject = inject<typeof syncIsShow | null>("syncIsShow", null);
const syncIsShow = async (show, delay = 0) => {
  setIsShow(show, delay);
  syncIsShowInject && syncIsShowInject(show, duration / 2 + delay);
};
watch($$(active), val => {
  if (!val) syncIsShow(false);
});
provide("syncIsShow", syncIsShow);

const setPosition = (direction = "bottom") => {
  if (!triggerRef || !popuperRef) return;
  const { clientWidth, clientHeight } = triggerRef;
  const { clientWidth: width, clientHeight: height } = document.documentElement;
  let { offsetLeft, offsetTop } = deepPosition(triggerRef);
  if (direction == "bottom") {
    offsetLeft = offsetLeft + clientWidth / 2 - popuperRef.clientWidth / 2;
    offsetTop = offsetTop + clientHeight + gap;
    if (offsetTop + popuperRef.clientHeight > height) return setPosition("top");
  } else if (direction == "right") {
    offsetTop = offsetTop + clientHeight / 2 - popuperRef.clientHeight / 2;
    offsetLeft = offsetLeft + clientWidth + gap;
    if (offsetLeft + popuperRef.clientWidth > width) return setPosition("left");
  } else if (direction == "top") {
    offsetLeft = offsetLeft + clientWidth / 2 - popuperRef.clientWidth / 2;
    offsetTop = offsetTop - popuperRef.clientHeight - gap;
    if (offsetTop < 0) return setPosition("bottom");
  } else if (direction == "left") {
    offsetTop = offsetTop + clientHeight / 2 - popuperRef.clientHeight / 2;
    offsetLeft = offsetLeft - popuperRef.clientWidth - gap;
    if (offsetLeft < 0) return setPosition("right");
  }

  if (offsetTop < 0) offsetTop = 0;
  else if (offsetTop + popuperRef.clientHeight > height)
    offsetTop = height - popuperRef.clientHeight;

  if (offsetLeft < 0) offsetLeft = 0;
  else if (offsetLeft + popuperRef.clientWidth > width) offsetLeft = width - popuperRef.clientWidth;

  return { offsetLeft, offsetTop };
};

const handleMouseEvent = (ev: MouseEvent) => {
  if (!active) return;
  if (ev.type == "mouseleave") syncIsShow(false);
  else syncIsShow(true);
};

watch($$(isShow), val => {
  if (!val) return;
  popuperStyle.maxWidth = ["left", "right"].includes(direction)
    ? `calc(50vw - ${gap * 4}px)`
    : "100vw";
  popuperStyle.maxHeight = ["top", "bottom"].includes(direction)
    ? `calc(50vh - ${gap * 4}px)`
    : "100vh";
  nextTick(() => {
    const { offsetLeft, offsetTop } = setPosition(direction);
    popuperStyle.left = offsetLeft + "px";
    popuperStyle.top = offsetTop + "px";
  });
});

const deepPosition = (el: HTMLElement) => {
  let { offsetLeft, offsetTop, scrollTop, scrollLeft } = el;
  const offsetParent = el.offsetParent as HTMLElement;
  if (offsetParent) {
    const sub = deepPosition(offsetParent);
    offsetLeft += sub.offsetLeft;
    offsetTop += sub.offsetTop;
  }
  return {
    offsetLeft: offsetLeft - scrollLeft,
    offsetTop: offsetTop - scrollTop,
  };
};

onBeforeMount(() => {
  let el = document.querySelector("#vpopup-container");
  if (!el) {
    el = document.createElement("div");
    el.id = "vpopup-container";
    document.querySelector("body")!.appendChild(el);
  }
});
</script>

<template>
  <div
    ref="triggerRef"
    class="vpopup vpopup-trigger"
    :="$attrs"
    @mouseleave="handleMouseEvent"
    @mousemove="handleMouseEvent"
    @mouseenter="handleMouseEvent"
  >
    <slot></slot>
  </div>
  <teleport to="#vpopup-container">
    <transition :name="transitionName" :duration="duration">
      <div
        v-show="isShow"
        ref="popuperRef"
        class="vpopup-popuper"
        :class="popuperClass"
        :style="popuperStyle"
        @mouseleave="handleMouseEvent"
        @mousemove="handleMouseEvent"
        @mouseenter="handleMouseEvent"
      >
        <slot name="popup"></slot>
      </div>
    </transition>
  </teleport>
</template>

<style>
.vpopup-popuper {
  overflow: auto;
  position: absolute;
  z-index: 9999;
}
</style>
