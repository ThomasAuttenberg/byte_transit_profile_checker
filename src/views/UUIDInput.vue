<script setup lang="ts">

import { type PropType, ref, watch } from 'vue'
type Validator = (val: string|undefined) => boolean;
const props = defineProps({
  placeholder: {type: String, required: false, default: ''},
  validator: {type: Function as PropType<Validator>},
  inputError: {type: Boolean, default: false},
  allowedPattern: {type:RegExp, required:false}
});

const isFocus = ref(false);
const inputVal = defineModel<string>('inputVal');
const isComplete  = ref(Boolean(inputVal.value?.length));
const isError = defineModel<boolean>('inputError');

watch(inputVal, (value)=>{
  if(props.validator) {
    isError.value = !props.validator(value);
  }
  isComplete.value = !!value?.length;
});

function onRemovalBtnClick(){
  inputVal.value = '';
}

</script>

<template>
  <div class = "input-wrapper" :class="{focus:isFocus, error:isError, complete:isComplete}">
    <span v-if="isFocus || isComplete" class = "additionalPlaceholder">{{placeholder}}</span>
  <input class="input" value='' v-model="inputVal" :placeholder="!isFocus ? placeholder : ''"
         @focusin="isFocus = true"
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
    padding: 0px 13.5px 0 45px;
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
    content: url("@/assets/icons/profileico.svg");
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