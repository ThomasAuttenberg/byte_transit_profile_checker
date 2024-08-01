<script setup lang="ts">
import { onMounted, ref, type VNodeRef } from 'vue'

const props = defineProps({
  label: { type: String, required: false },
  text: { type: String, required: false },
  copyable: { type: Boolean, required: false },
  ico: { type: String, required: false }
})
const copyText = ref<string>('Скопировать')
const copyEvent = ref(false);
function onCopyEvent(event:any){
  if(navigator.clipboard) {
    navigator.clipboard.writeText(props.text as string);
  }else{
    const textarea = document.createElement('textarea');
    textarea.value = props.text as string;
    document.body.appendChild(textarea);
    textarea.select();
    copyEvent.value = true;
    document.execCommand('copy');
    document.body.removeChild(textarea);
  }
  copyText.value = 'Скопировано';
  copyEvent.value = true;
  setTimeout(() => {copyText.value="Скопировать"; copyEvent.value = false; }, 1000);
}

// Checks if clipboard available with clipboard api or using document.execCommand
let isClipboardAvailable = false;
if(navigator.clipboard) {
  isClipboardAvailable = true;
}else{
  const textarea = document.createElement('textarea');
  try {
    textarea.value = props.text as string;
    document.body.appendChild(textarea);
    textarea.select();
    copyEvent.value = true;
    document.execCommand('copy');
    isClipboardAvailable = true;
  }catch(e){
    isClipboardAvailable = false;
  }finally{
    document.body.removeChild(textarea);
  }
}
const copyAble = ref<boolean>(isClipboardAvailable ? props.copyable : false);
const textRef = ref<VNodeRef | undefined>();

</script>

<template>
  <div class="inf-field-wrapper">
    <div v-if="ico" class="inf-field-ico">
      <img :src="props.ico" alt="" />
    </div>
    <div class="inf-field-text">
      <span v-if="label" class="inf-field-label">{{ label }}&nbsp;</span><span :ref="textRef">{{ text }}</span>
    </div>
    <div v-if="copyAble" class="inf-field-copy-ico">
      <img src="@/assets/icons/copy-ico.svg" alt="Copy Icon" @click="onCopyEvent" />
      <div id="meow" class="tooltip" :class="{copyEvent:copyEvent}" @click="onCopyEvent">{{copyText}}</div>
    </div>
  </div>
</template>

<style scoped>
.inf-field-ico {
  width: 30px;
  height: 30px;
  display: inline;
  margin-right: 5px;
}
.inf-field-wrapper {
  min-height: 30px;
  position: relative;
  display: flex;
  align-items: center;
}

.inf-field-text {
  flex: 1;
}

.inf-field-copy-ico {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  margin-left: 10px;
}

.inf-field-copy-ico img {
  width: 30px;
  height: 30px;
  cursor: pointer;
}

.inf-field-copy-ico:hover .tooltip {
  visibility: visible;
}

.tooltip {
  cursor: pointer;
  width: 110px;
  height: 30px;
  align-content: center;
  visibility: hidden;
  position: absolute;
  right: -5px;
  background-color: #dbe5ee;
  font-weight: 500;
  font-size: 13px;
  line-height: 150%;
  color: #747c8c;
  text-align: center;
  padding: 0 10px;
  border-radius: 15px;
  white-space: nowrap;
}
@media(hover:none){
  .tooltip {
    display: none;
  }
}
@keyframes copyToolTipAnimation {
  0%{}
  50%{
    background-color: whitesmoke;
  }
  100%{}
}
.tooltip.copyEvent{
  animation: copyToolTipAnimation 1s ease;
}

.inf-field-label {
  font-weight: 600;
  font-size: 15px;
  line-height: 150%;
  color: #b2b2b2;
}
</style>
