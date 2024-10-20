<script setup lang="ts">

import { type PropType, ref, type VNodeRef, watch } from 'vue'
import { IMask } from 'vue-imask'
type Validator = (val: string|undefined) => boolean;
const props = defineProps({
  ico: {type: URL},
  placeholder: {type: String, required: false, default: ''},
  validator: {type: Function as PropType<Validator>},
  inputError: {type: Boolean, default: false},
  mask: {type: Object as PropType<any>}
});

function getUnmaskedValue(){return unmaskedVal}

defineExpose({getUnmaskedValue});

const isFocus = ref(false);
const inputVal = defineModel<string>('inputVal');
let unmaskedVal : string = '';
const isComplete  = ref(Boolean(inputVal.value?.length));
const isError = defineModel<boolean>('inputError');
const inptRef = ref<VNodeRef | null>(null);
let iMaskObject = props.mask ? IMask.createMask(props.mask) : null;


const getMaskedValue = (input: string)=>{
  if(iMaskObject) {
    iMaskObject.resolve(input);
    return iMaskObject.value;
  }
  return null;
}

if(inputVal.value){
  if(iMaskObject){
    iMaskObject.resolve(inputVal.value);
    unmaskedVal = iMaskObject.unmaskedValue;
    inputVal.value = getMaskedValue(inputVal.value);
  }
}

watch(()=>props.mask, (value)=>{
  if(value){
    iMaskObject = IMask.createMask(value);
  }
})
watch(inputVal, (value)=>{
  isComplete.value = !!value?.length;
  if(isComplete.value) {
    if (iMaskObject && value) {
      inputVal.value = getMaskedValue(value);
      //console.log("input:" + inputVal.value)
      unmaskedVal = iMaskObject.unmaskedValue;
      //console.log("unmasked:" + iMaskObject.unmaskedValue);
      //console.log("При этом: "+ unmaskedVal);
    }else{
      if(value)
        unmaskedVal = value;
    }
    if (props.validator) {
      isError.value = !(props.validator(unmaskedVal));
      //console.log(unmaskedVal);
    }
  }else{
    isError.value = false;
  }
});

function onRemovalBtnClick(){
  inputVal.value = '';
  //console.log(inptRef.value);
  const inputEl = inptRef.value as HTMLInputElement;
  //console.log(inputEl);
  setTimeout(()=>inputEl.focus());
}

function setCursorToEnd(event: Event) {
  const target = event.target as HTMLInputElement;
  setTimeout(() => {
    target.setSelectionRange(target.value.length, target.value.length);
    target.scrollLeft = target.scrollWidth;
  });
}

</script>

<template>
  <div class = "input-wrapper" :class="{focus:isFocus, error:isError, complete:isComplete}"
       :style="{
          '--icon-url': `url(${ico})`
       }">
    <span v-if="isFocus || isComplete" class = "additionalPlaceholder">{{placeholder}}</span>
  <input ref = "inptRef" class="input" value='' v-model="inputVal" :placeholder="!isFocus ? placeholder : ''"
         @focusin="isFocus = true; setCursorToEnd($event)"
         @focusout="isFocus = false;" />

    <span v-if="isComplete" class = "valRemoval" @click="onRemovalBtnClick">×</span>
  </div>
</template>

<style scoped>

  @import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap');

  .input-wrapper.focus > .additionalPlaceholder, .input-wrapper.complete > .additionalPlaceholder {
    position: absolute;
    font-size: 13px;
    font-weight: 400;
    font-family: 'Montserrat', sans-serif;
    color: #949494;
    left: 45px;
    top: 3.5px;
  }

  .input-wrapper{
    position: relative;
  }
  .input{
    min-width:220px;
    width: 100%;
    padding: 0px 20px 0 45px;
    font-family:  "Montserrat", sans-serif;
    font-optical-sizing: auto;
    font-style: normal;
    font-weight: 400;
    font-size: 15px;
    letter-spacing: 0;
    text-align: left;
    border-radius: 10px;
    border: 0;
    height: 50px;
  }
  .input-wrapper.error > .input{
    background-color: rgba(248, 150, 15, 0.1);
    outline: 1px solid rgb(248, 150, 15);
    border-radius: 10px;
  }
  .input::placeholder{
    color: rgb(148,148,148);
  }
  .input:focus, .input-wrapper.complete > .input{
    text-overflow: ellipsis;
    padding-right: 35px;
    padding-top: 15px;
  }
  .input:focus{
    outline: none;
  }
  .input-wrapper:not(.error):hover{
    border-radius: 10px;
    outline: 1px solid #D4D8E2;
  }
  .input-wrapper::before{
    position: absolute;
    padding: 10px;
    left: 0;
    content: var(--icon-url);
  }
  .valRemoval{
    position: absolute;
    right: 10px;
    top: 10px;
    content:"×";
    color: #949494;
    font-size: 30px;
  }
  .valRemoval:hover{
    cursor: pointer;
    font-size:35px;
    top: 8px;
  }
</style>