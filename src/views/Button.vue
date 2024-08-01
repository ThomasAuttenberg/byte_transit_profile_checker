<script setup lang="ts">

import Color from 'ts-color-class';
const props = defineProps({
  buttonText: {type: String},
  isLoading: {type: Boolean,default: false},
  isDisabled: {type: Boolean, default: false},
  // eslint-disable-next-line vue/valid-define-props
  mainColor: {type: Color},
  // eslint-disable-next-line vue/valid-define-props
  hoverColor: {type: Color},
});
const usingMainColor: Color = props.mainColor ? props.mainColor : new Color('rgb(24, 24, 24)');
const usingHoverColor = props.hoverColor ? props.hoverColor : new Color('rgb(0, 0, 0)');

function onClick(event: MouseEvent) {
  if(props.isLoading || props.isDisabled) event.stopImmediatePropagation();
}

</script>

<template>
  <button @click="onClick" :class="{ loading: isLoading, disabled: isDisabled }" class="btn">
    {{ buttonText }}
  </button>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap');
.btn {
  background-color: v-bind(usingMainColor);
  border-radius: 10px;
  font-family: 'Montserrat', sans-serif;
  font-size: 15px;
  font-weight: 600;
  color: white;
}
.btn:not(.disabled):hover {
  cursor: pointer;
  background-color: v-bind(usingHoverColor);
}
.btn.disabled {
  cursor: auto;
  opacity: 0.2;
}
.btn.loading {
  cursor: pointer;
  position: relative;
  color: rgba(0, 0, 0, 0);
}
.btn.loading:hover {
  background-color: v-bind(usingMainColor);
  cursor: auto;
}
.btn.loading::before {
  width: 30px;
  height: 30px;
  position: absolute;
  top: calc(50% - 15px);
  left: calc(50% - 15px);
  content: url('@/assets/icons/button-loading-ico.svg');
  animation: loading 1s infinite linear;
}
@keyframes loading {
  100% {
    transform: rotate(360deg);
  }
}
</style>